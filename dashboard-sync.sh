#!/bin/bash
# DASH-P2 - dashboard-sync.sh
# Chạy trên cselab bằng cron mỗi 60 giây:
#   * * * * * /bin/bash "$HOME/tbk/dashboard-sync.sh"
# Công việc:
#   (1) Thu thập sức khỏe stack: bash ~/tbk/run_school.sh health,
#       parse dòng "X UP" thành JSON; kiểm tra 6 cổng bằng /dev/tcp.
#   (1b) Thu thập Pipeline + AI: đọc bảng tasks/gate_runs/bugs qua
#       Supabase REST (service key, chỉ đọc) để đếm việc theo trạng
#       thái, lấy việc gần nhất + gate runs gần nhất; trạng thái từng
#       AI suy từ bảng tasks (việc đang làm / đã xong) + bot Telegram
#       có đang chạy không. Số token chỉ ghi số kho đã biết chắc
#       (Tiểu Khôi ~6,3 tỷ, Tiểu Tiểu Khôi 30 tỷ) — KHÔNG bịa số còn
#       lại. Nếu đọc bảng thất bại: giữ dữ liệu cũ, không bịa số mới.
#   (2) Ghi vào Supabase bảng dashboard_status (upsert 1 hàng id=1,
#       payload JSON) bằng curl.
#   (3) Đọc bảng dashboard_commands lấy lệnh status=pending, với mỗi
#       lệnh: ghi ra ~/tbk/dashboard-inbox/<id>.txt rồi update
#       status=processing. KHÔNG tự chạy lệnh, chỉ chuyển tiếp.
#   (4) Đọc ~/tbk/dashboard-outbox/<id>.txt (nếu Tiểu Khôi đã trả lời)
#       rồi update bảng dashboard_commands status=done + cột reply,
#       rồi xóa file outbox VÀ file inbox tương ứng. Xóa inbox là
#       chốt chống trả lời trùng: trước đây inbox không bao giờ bị xóa
#       nên cron inbox-check thấy lại lệnh cũ ở mọi lần chạy và trả
#       lời lại (ping id=1 bị trả Pong 5 lần).
# Yêu cầu: set -u, log ra ~/tbk/logs/dashboard-sync.log, không in key
# ra log, chạy được khi Supabase chưa có bảng (báo lỗi rõ, không crash loop).
set -u
TBK_DIR="${TBK_DIR:-$HOME/tbk}"
LOG_DIR="$TBK_DIR/logs"
INBOX_DIR="$TBK_DIR/dashboard-inbox"
OUTBOX_DIR="$TBK_DIR/dashboard-outbox"
SECRETS_DIR="$TBK_DIR/.secrets"
KEY_FILE="$SECRETS_DIR/supabase_dashboard.key"
URL_FILE="$SECRETS_DIR/supabase_url"
LOG_FILE="$LOG_DIR/dashboard-sync.log"


mkdir -p "$LOG_DIR" "$INBOX_DIR" "$OUTBOX_DIR" "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR" 2>/dev/null || true


log_msg() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"; }


# Chống chạy chồng khi cron 60s mà lần trước chưa xong.
exec 9>"$TBK_DIR/dashboard-sync.lock"
if ! flock -n 9; then
  log_msg "WARN dashboard-sync already running, exit"
  exit 0
fi


# --- Đọc SUPABASE_URL: env trước, rồi file supabase_url, rồi stack.env ---
SUPABASE_URL="${SUPABASE_URL:-}"
if [ -z "$SUPABASE_URL" ] && [ -s "$URL_FILE" ]; then
  SUPABASE_URL="$(cat "$URL_FILE")"
fi
if [ -z "$SUPABASE_URL" ] && [ -f "$TBK_DIR/stack.env" ]; then
  # shellcheck disable=SC1090
  SUPABASE_URL="$(grep -E '^SUPABASE_URL=' "$TBK_DIR/stack.env" 2>/dev/null | cut -d= -f2- || true)"
fi


# --- Đọc service key: file ~/tbk/.secrets/supabase_dashboard.key, chmod 600 ---
# Nếu chưa có file: tự tạo file rỗng, báo lỗi rõ, thoát (cron sẽ thử lại sau 60s).
if [ ! -f "$KEY_FILE" ]; then
  touch "$KEY_FILE"
  chmod 600 "$KEY_FILE"
  log_msg "ERROR missing service key: $KEY_FILE was empty/missing, created empty file (chmod 600). Fill it with the Supabase service_role key, then wait for next cron run."
  exit 1
fi
chmod 600 "$KEY_FILE"
SERVICE_KEY="$(cat "$KEY_FILE")"
if [ -z "$SERVICE_KEY" ]; then
  log_msg "ERROR missing service key: $KEY_FILE is empty. Fill it with the Supabase service_role key."
  exit 1
fi
if [ -z "$SUPABASE_URL" ]; then
  log_msg "ERROR missing SUPABASE_URL: set env SUPABASE_URL, or write it to $URL_FILE, or add SUPABASE_URL=... to $TBK_DIR/stack.env"
  exit 1
fi
# Không bao giờ log SERVICE_KEY hay SUPABASE_URL có key. Chỉ log host đã che.
log_msg "start sync"


# --- (1) Thu thập sức khỏe stack ---
HEALTH_OUT=""
if [ -x "$TBK_DIR/run_school.sh" ]; then
  HEALTH_OUT="$(timeout 15 bash "$TBK_DIR/run_school.sh" health 2>&1 || true)"
else
  log_msg "WARN $TBK_DIR/run_school.sh not found/executable, using port checks only"
fi


check_port() {
  local port="$1"
  (exec 3<>"/dev/tcp/127.0.0.1/$port") 2>/dev/null
}


# Trạng thái cuối: UP chỉ khi health nói UP (nếu có) VÀ cổng mở.
# Nếu không có health output thì dùng cổng làm chuẩn.
service_status() {
  local name="$1" port="$2"
  local port_ok=0
  if check_port "$port"; then port_ok=1; fi
  if [ -n "$HEALTH_OUT" ]; then
    if echo "$HEALTH_OUT" | grep -Eiq "(^|[^a-z])${name}[[:space:]]+UP([^a-z]|$)"; then
      if [ "$port_ok" -eq 1 ]; then echo "UP"; else echo "DOWN"; fi
    else
      echo "DOWN"
    fi
  else
    if [ "$port_ok" -eq 1 ]; then echo "UP"; else echo "DOWN"; fi
  fi
}


POSTGRES_S="$(service_status postgres 5432)"
REDIS_S="$(service_status redis 6379)"
MOCK_S="$(service_status mock 8765)"
BROKER_S="$(service_status broker 8899)"
DASHBOARD_S="$(service_status dashboard 8898)"
LITELLM_S="$(service_status litellm 4000)"
UPDATED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
log_msg "health postgres=$POSTGRES_S redis=$REDIS_S mock=$MOCK_S broker=$BROKER_S dashboard=$DASHBOARD_S litellm=$LITELLM_S"


# --- (1b) Pipeline + AI: đọc bảng tasks/gate_runs/bugs (chỉ đọc) ---
# Nếu đọc thất bại (mã != 200): Python bên dưới giữ dữ liệu cũ trong
# old payload, không bịa số mới. Không log nội dung bảng, chỉ log mã HTTP.
TASKS_BODY="$(mktemp)"
TASKS_CODE="000"
TASKS_CODE="$(curl -s -m 15 -o "$TASKS_BODY" -w "%{http_code}" \
  "$SUPABASE_URL/rest/v1/tasks?select=id,tieu_de,cap,trang_thai,buoc,nguoi_lam,nguoi_kiem,token_da_dung,tao_luc,cap_nhat_luc&order=cap_nhat_luc.desc&limit=100" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" || echo "000")"
GATES_BODY="$(mktemp)"
GATES_CODE="000"
GATES_CODE="$(curl -s -m 15 -o "$GATES_BODY" -w "%{http_code}" \
  "$SUPABASE_URL/rest/v1/gate_runs?select=id,task_id,cong,ket_qua,luc&order=luc.desc&limit=10" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" || echo "000")"
BUGS_BODY="$(mktemp)"
BUGS_CODE="000"
BUGS_CODE="$(curl -s -m 15 -o "$BUGS_BODY" -w "%{http_code}" \
  "$SUPABASE_URL/rest/v1/bugs?select=id,trang_thai&trang_thai=eq.mo&limit=100" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" || echo "000")"
# Bot Telegram có đang chạy không (ps, không đụng process).
BOT_RUNNING=0
if ps aux 2>/dev/null | grep -q "[p]ython3 bot.py"; then BOT_RUNNING=1; fi
[ "$TASKS_CODE" = "200" ] || log_msg "WARN tasks fetch failed HTTP $TASKS_CODE, keeping old ai/pipeline"
[ "$GATES_CODE" = "200" ] || log_msg "WARN gate_runs fetch failed HTTP $GATES_CODE, keeping old gate_runs"
[ "$BUGS_CODE" = "200" ] || log_msg "WARN bugs fetch failed HTTP $BUGS_CODE, keeping old bugs_open"


# --- Đọc payload cũ để giữ tasks/tokens, không ghi đè thành rỗng ---
OLD_PAYLOAD_JSON="{}"
OLD_BODY="$(mktemp)"
OLD_CODE="000"
OLD_CODE="$(curl -s -m 15 -o "$OLD_BODY" -w "%{http_code}" \
  "$SUPABASE_URL/rest/v1/dashboard_status?id=eq.1&select=payload" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" || echo "000")"
if [ "$OLD_CODE" = "200" ] && [ -s "$OLD_BODY" ]; then
  OLD_PAYLOAD_JSON="$(python3 -c "import json,sys; rows=json.load(open(sys.argv[1])); print(json.dumps(rows[0].get('payload') or {}))" "$OLD_BODY" 2>/dev/null || echo "{}")"
elif echo "$OLD_BODY" | grep -qi "does not exist\|PGRST205\|relation.*does not exist"; then
  log_msg "ERROR Supabase table dashboard_status does not exist yet. Create it first (id int primary key, payload jsonb), then next cron run will work. Not crash-looping."
  rm -f "$OLD_BODY"
  # Vẫn tiếp tục bước lệnh? Không: không có bảng status thì bảng commands
  # cũng có thể chưa có. Thoát nhẹ để cron thử lại sau 60s.
  exit 0
fi
rm -f "$OLD_BODY"


# --- (2) Upsert dashboard_status id=1 ---
PAYLOAD_FILE="$(mktemp)"
python3 - "$PAYLOAD_FILE" "$UPDATED_AT" "$POSTGRES_S" "$REDIS_S" "$MOCK_S" "$BROKER_S" "$DASHBOARD_S" "$LITELLM_S" "$OLD_PAYLOAD_JSON" "$TASKS_BODY" "$TASKS_CODE" "$GATES_BODY" "$GATES_CODE" "$BUGS_BODY" "$BUGS_CODE" "$BOT_RUNNING" <<'PYEOF'
import json, sys
(out, updated_at, pg, redis, mock, broker, dash, litellm, old_json,
 tasks_body, tasks_code, gates_body, gates_code,
 bugs_body, bugs_code, bot_running) = sys.argv[1:17]
try:
    old = json.loads(old_json) if old_json else {}
except Exception:
    old = {}
if not isinstance(old, dict):
    old = {}

def load_rows(path, code):
    if code != "200":
        return None
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else None
    except Exception:
        return None

tasks = load_rows(tasks_body, tasks_code)
gates = load_rows(gates_body, gates_code)
bugs = load_rows(bugs_body, bugs_code)

STATES = ["moi", "dang_lam", "cho_duyet", "xong", "that_bai", "dung"]

def pct(buoc):
    try:
        return max(0, min(100, round(int(buoc or 0) * 100 / 8)))
    except Exception:
        return 0

def is_worker(name):
    n = (name or "").lower()
    return ("tiểu tiểu khôi" in n or n in ("worker", "ttk", "tieu-tieu-khoi"))

def is_coord(name):
    n = (name or "").lower()
    return (not is_worker(name)) and ("tiểu khôi" in n or n in ("tieukhoi", "coordinator"))

def active_task(rows, who=None):
    for t in (rows or []):
        if t.get("trang_thai") in ("dang_lam", "cho_duyet"):
            if who is None or who(t.get("nguoi_lam")):
                return t
    return None

def done_titles(rows, who=None, n=3):
    out = []
    for t in (rows or []):
        if t.get("trang_thai") == "xong" and (who is None or who(t.get("nguoi_lam"))):
            out.append(t.get("tieu_de") or ("TBK-%04d" % (t.get("id") or 0)))
            if len(out) >= n:
                break
    return out

def task_label(t):
    if not t:
        return "Chờ giao việc mới"
    return t.get("tieu_de") or ("TBK-%04d" % (t.get("id") or 0))

old_pipe = old.get("pipeline") if isinstance(old.get("pipeline"), dict) else {}
old_ai = old.get("ai") if isinstance(old.get("ai"), list) else []

# --- pipeline: dem viec theo trang_thai + gate runs + bugs mo ---
if tasks is None:
    pipeline = old_pipe or None
else:
    counts = {s: 0 for s in STATES}
    for t in tasks:
        if t.get("trang_thai") in counts:
            counts[t["trang_thai"]] += 1
    counts["total"] = len(tasks)
    if gates is None:
        gr = old_pipe.get("gate_runs") if isinstance(old_pipe.get("gate_runs"), dict) else {}
        g_total, g_dat, g_truot = gr.get("total", 0), gr.get("dat", 0), gr.get("truot", 0)
        g_recent = gr.get("recent", [])
    else:
        g_total = len(gates)
        g_dat = sum(1 for g in gates if g.get("ket_qua") == "dat")
        g_truot = sum(1 for g in gates if g.get("ket_qua") == "truot")
        g_recent = [{"id": g.get("id"), "task_id": g.get("task_id"), "cong": g.get("cong"),
                     "ket_qua": g.get("ket_qua"), "luc": g.get("luc")} for g in gates[:5]]
    bugs_open = len(bugs) if bugs is not None else old_pipe.get("bugs_open", 0)
    up_count = sum(1 for s in (pg, redis, mock, broker, dash, litellm) if str(s).upper() == "UP")
    pipeline = {
        "counts": counts,
        "recent_tasks": [
            {"id": t.get("id"), "tieu_de": t.get("tieu_de"), "cap": t.get("cap"),
             "trang_thai": t.get("trang_thai"), "buoc": t.get("buoc"),
             "nguoi_lam": t.get("nguoi_lam"), "nguoi_kiem": t.get("nguoi_kiem"),
             "token_da_dung": t.get("token_da_dung"), "cap_nhat_luc": t.get("cap_nhat_luc")}
            for t in (tasks or [])[:8]
        ],
        "gate_runs": {"total": g_total, "dat": g_dat, "truot": g_truot, "recent": g_recent},
        "bugs_open": bugs_open,
        "stack_up": "%d/6" % up_count,
        "bot": "UP" if bot_running == "1" else "DOWN",
    }
if pipeline is None:
    pipeline = {"counts": dict({s: 0 for s in STATES}, total=0), "recent_tasks": [],
                "gate_runs": {"total": 0, "dat": 0, "truot": 0, "recent": []},
                "bugs_open": 0, "stack_up": "—", "bot": "—", "error": "fetch failed"}

# --- ai: trang thai that tu bang tasks (+ bot chay hay khong) ---
# Token chi ghi SO KHO da biet chac, gan nhan "kho token" o trang web.
# Khong co API do token con lai thoi gian thuc — khong bia so do.
if tasks is None and old_ai:
    ai = old_ai
else:
    tk_task = active_task(tasks)  # dieu phoi: bat ky viec dang lam nao
    wk_task = active_task(tasks, is_worker)
    tk_done = done_titles(tasks)
    wk_done = done_titles(tasks, is_worker)
    ai = [
        {"id": "tieukhoi", "status": "on", "statusText": "Đang hoạt động",
         "task": task_label(tk_task), "progress": pct(tk_task.get("buoc")) if tk_task else 0,
         "tokens": "~6,3 tỷ", "tokensNum": 6.3, "unit": "tỷ",
         "done": "; ".join(tk_done) if tk_done else "—"},
        {"id": "worker", "status": "on" if wk_task else "idle",
         "statusText": "Đang hoạt động" if wk_task else "Chờ việc",
         "task": task_label(wk_task), "progress": pct(wk_task.get("buoc")) if wk_task else 0,
         "tokens": "30 tỷ", "tokensNum": 30, "unit": "tỷ",
         "done": "; ".join(wk_done) if wk_done else "—"},
        {"id": "claude", "status": "idle", "statusText": "Tạm nghỉ",
         "task": "Đang nghỉ theo lệnh sếp lớn, Tiểu Khôi tự review thay.",
         "progress": 0, "tokens": "Pro — không tính token", "tokensNum": None, "unit": "",
         "done": "—"},
        {"id": "codex", "status": "idle", "statusText": "Sẵn sàng",
         "task": "Chưa có việc.", "progress": 0,
         "tokens": "ChatGPT Plus — không tính token", "tokensNum": None, "unit": "",
         "done": "—"},
        {"id": "antigravity", "status": "idle", "statusText": "Sẵn sàng",
         "task": "Chưa có việc.", "progress": 0,
         "tokens": "Google AI Pro — không tính token", "tokensNum": None, "unit": "",
         "done": "—"},
    ]

payload = {
    "updated_at": updated_at,
    "services": {"postgres": pg, "redis": redis, "mock": mock, "broker": broker, "dashboard": dash, "litellm": litellm},
    "tasks": old.get("tasks", []) if isinstance(old, dict) else [],
    "tokens": old.get("tokens", {}) if isinstance(old, dict) else {},
    "ai": ai,
    "pipeline": pipeline,
}
body = {"id": 1, "payload": payload}
with open(out, "w") as f:
    json.dump(body, f)
PYEOF
rm -f "$TASKS_BODY" "$GATES_BODY" "$BUGS_BODY"


RESP_BODY="$(mktemp)"
HTTP_CODE="$(curl -s -m 15 -o "$RESP_BODY" -w "%{http_code}" -X POST \
  "$SUPABASE_URL/rest/v1/dashboard_status" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" -H "Prefer: resolution=merge-duplicates" \
  --data-binary "@$PAYLOAD_FILE" || echo "000")"
rm -f "$PAYLOAD_FILE"
if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "201" ]; then
  if grep -qi "does not exist\|PGRST205\|relation.*does not exist" "$RESP_BODY" 2>/dev/null; then
    log_msg "ERROR Supabase table dashboard_status does not exist yet (HTTP $HTTP_CODE). Create it first. Not crash-looping."
  else
    log_msg "ERROR upsert dashboard_status failed HTTP $HTTP_CODE: $(head -c 300 "$RESP_BODY")"
  fi
  rm -f "$RESP_BODY"
  exit 0
fi
rm -f "$RESP_BODY"
log_msg "upsert dashboard_status ok"


# --- (3) Đọc lệnh pending, chuyển tiếp vào inbox, KHÔNG tự chạy ---
CMD_BODY="$(mktemp)"
CMD_CODE="$(curl -s -m 15 -o "$CMD_BODY" -w "%{http_code}" \
  "$SUPABASE_URL/rest/v1/dashboard_commands?status=eq.pending&select=id,command,created_at&order=created_at.asc" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" || echo "000")"
if [ "$CMD_CODE" != "200" ]; then
  if grep -qi "does not exist\|PGRST205\|relation.*does not exist" "$CMD_BODY" 2>/dev/null; then
    log_msg "ERROR Supabase table dashboard_commands does not exist yet (HTTP $CMD_CODE). Create it first. Not crash-looping."
  else
    log_msg "ERROR fetch pending commands failed HTTP $CMD_CODE: $(head -c 300 "$CMD_BODY")"
  fi
  rm -f "$CMD_BODY"
  exit 0
fi


# Lấy danh sách id bằng python3, mỗi dòng "id<TAB>command" đã escape base64 để không vỡ dòng.
PENDING_LIST="$(mktemp)"
python3 - "$CMD_BODY" "$PENDING_LIST" <<'PYEOF'
import json, sys, base64
rows = json.load(open(sys.argv[1]))
with open(sys.argv[2], "w") as out:
    for r in rows:
        cid = str(r.get("id", ""))
        if not cid.isdigit():
            continue
        cmd = r.get("command") or ""
        b64 = base64.b64encode(cmd.encode()).decode()
        out.write(cid + "\t" + b64 + "\n")
PYEOF
rm -f "$CMD_BODY"


while IFS="$(printf '\t')" read -r cid b64; do
  [ -z "$cid" ] && continue
  case "$cid" in *[!0-9]*) continue ;; esac
  echo "$b64" | base64 -d > "$INBOX_DIR/$cid.txt" 2>/dev/null || printf '%s' "" > "$INBOX_DIR/$cid.txt"
  # Update status=processing. Chỉ ghi id ra log, không ghi nội dung lệnh dài.
  PATCH_CODE="$(curl -s -m 15 -o /dev/null -w "%{http_code}" -X PATCH \
    "$SUPABASE_URL/rest/v1/dashboard_commands?id=eq.$cid" \
    -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d '{"status":"processing"}' || echo "000")"
  if [ "$PATCH_CODE" = "200" ] || [ "$PATCH_CODE" = "204" ]; then
    log_msg "forwarded command id=$cid to inbox, status=processing"
  else
    log_msg "ERROR update command id=$cid to processing failed HTTP $PATCH_CODE"
  fi
done < "$PENDING_LIST"
rm -f "$PENDING_LIST"


# --- (4) Đọc outbox, update done + reply, rồi xóa file outbox + inbox ---
for f in "$OUTBOX_DIR"/*.txt; do
  [ -e "$f" ] || continue
  base="$(basename "$f" .txt)"
  case "$base" in *[!0-9]*) log_msg "WARN skip outbox non-numeric file: $f"; continue ;; esac
  cid="$base"
  REPLY_BODY="$(mktemp)"
  python3 - "$f" "$REPLY_BODY" <<'PYEOF'
import json, sys
reply = open(sys.argv[1], encoding="utf-8", errors="replace").read()
with open(sys.argv[2], "w") as out:
    json.dump({"status": "done", "reply": reply}, out)
PYEOF
  PATCH_CODE="$(curl -s -m 15 -o /dev/null -w "%{http_code}" -X PATCH \
    "$SUPABASE_URL/rest/v1/dashboard_commands?id=eq.$cid" \
    -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    --data-binary "@$REPLY_BODY" || echo "000")"
  rm -f "$REPLY_BODY"
  if [ "$PATCH_CODE" = "200" ] || [ "$PATCH_CODE" = "204" ]; then
    rm -f "$f"
    # Lệnh đã xong trên Supabase: xóa luôn file inbox để cron
    # inbox-check không bao giờ thấy lại lệnh này (chống trả lời trùng).
    # Chỉ xóa khi PATCH done đã thành công; PATCH lỗi thì giữ cả
    # outbox lẫn inbox để lần sau thử lại.
    rm -f "$INBOX_DIR/$cid.txt"
    log_msg "completed command id=$cid from outbox, status=done"
  else
    log_msg "ERROR update command id=$cid to done failed HTTP $PATCH_CODE, keeping outbox file"
  fi
done


# --- (4b) Dọn inbox của các lệnh đã done trên Supabase ---
# Dọn file sót từ trước khi có cơ chế xóa inbox ở bước (4) (ví dụ
# id=1/id=2 vẫn còn inbox dù đã done), và phòng trường hợp file inbox
# còn sót vì lý do khác. Chỉ xóa khi Supabase xác nhận lệnh đã done
# nên không mất lệnh chưa xong; nếu đọc danh sách done thất bại thì
# bỏ qua, không chặn sync.
DONE_BODY="$(mktemp)"
DONE_CODE="$(curl -s -m 15 -o "$DONE_BODY" -w "%{http_code}" \
  "$SUPABASE_URL/rest/v1/dashboard_commands?status=eq.done&select=id&order=id.desc&limit=100" \
  -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" || echo "000")"
if [ "$DONE_CODE" = "200" ]; then
  DONE_IDS="$(mktemp)"
  python3 - "$DONE_BODY" "$DONE_IDS" <<'PYEOF'
import json, sys
try:
    rows = json.load(open(sys.argv[1]))
except Exception:
    rows = []
with open(sys.argv[2], "w") as out:
    for r in rows:
        cid = str(r.get("id", ""))
        if cid.isdigit():
            out.write(cid + "\n")
PYEOF
  while read -r did; do
    [ -n "$did" ] && rm -f "$INBOX_DIR/$did.txt"
  done < "$DONE_IDS"
  rm -f "$DONE_IDS"
  log_msg "cleaned inbox files for done commands"
else
  log_msg "WARN fetch done commands failed HTTP $DONE_CODE, skipping inbox cleanup"
fi
rm -f "$DONE_BODY"


log_msg "sync done"
exit 0

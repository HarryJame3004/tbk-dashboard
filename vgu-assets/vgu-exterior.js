/**
 * VGU Campus Exterior — v7 (ký túc xá, đợt 3: cụm thu nhỏ — tòa xanh 60 m + tòa cam 50 m + sân 8 m, dời tây-bắc; hành lang mái che, theo ảnh thật;
 *   cổng v6 giữ nguyên) · v2.8 (Vòng sửa 4/4, đợt 3: kênh dời khỏi hội trường/oval, cổng nằm bên đường, cầu vd4, cây kiểm khoảng cách;
 *   đợt 2 trước đó: cổng tường biển + mô đất, cây to & thưa, kênh cong liền mạch,
 *   cầu đường qua kênh, nhựa đường procedural không vạch, gờ/khung cửa sâu hơn, mặt nam tầng trên sáng hơn)
 * Module ES: buildExterior(THREE), setupLighting(scene, THREE)
 *
 * v5 (vòng sửa 5): dựng lại bố cục theo layout-v5.md (tỉ lệ thật, thước tòa xám 55 m, KHÔNG dùng đường chạy làm thước 400 m).
 *   - Cổng: mặt biển quay ra phía nam (Vành Đai 4); cột cờ + tường phía bắc, mô đất + đèn phía nam (xoay cả nhóm cổng 180°).
 *   - Nền 400×350 m tâm (0, 15); mọi khối nhà, kênh, cầu, đường đặt theo bảng (xem ghi chú từng khối).
 *   Phần chưa khớp bảng xem báo cáo vòng 5 (chồng/cắt cụm trắng, kênh chạm góc khối, một số khối bị bảng mâu thuẫn).
 * Cập nhật kiến trúc theo ảnh drone và cận cảnh mới (refs/nho-gray-02..05):
 * 1. Cầu đỏ dời sang x = 15.0: mút dốc bắc (z ≈ -7.74) hạ cánh thông thoáng giữa tòa SW và SE cụm trắng,
 *    khoảng trống đi bộ >= 4.0 m theo mọi hướng (cách tường SW 4.0 m, cách tường SE 4.0 m, phía bắc >18 m).
 * 2. Tòa chính xám (mainBuilding):
 *    - Tầng trệt phía phải cửa: dải kính dài (x từ -13.9 đến 22.5, sâu 0.2 m) + hàng 9 cột trắng +
 *      giàn leo louvered che nắng có cây leo + hộp điểm nhấn xanh teal ở đầu phải (x từ 22.5 đến 27.5).
 *    - 2 hốc cam xếp theo CHIỀU DỌC (chồng lên nhau ở phần trái mặt tiền x ≈ -10.0), đúng ảnh drone nho-gray-02.
 *    - Cắt lỗ THẬT trên mặt tiền quanh 2 hốc: tấm facade chia làm 7 panel khớp UV liên tục, hốc lõm sâu 0.8 m
 *      với 4 mặt thành màu cam rực rỡ và đáy kính sẫm nhìn thấy rõ ràng từ ngoài.
 *    - Khối sau: không phải hộp đặc — khối xám 16.2 m nhô ra trên lối đi mở tầng trệt (undercroft sâu 4.5 m)
 *      với hàng cột chống và 2 dãy hành lang trắng bao quanh phía sân trong (theo ảnh nho-gray-04).
 *    - Texture: facade-main-gray.jpg crop từ drone nho-gray-02; metal-cladding.jpg crop từ cận cảnh nho-gray-05.
 * 3. Hòa vật liệu nền đất: nền ngoài 2400×1800 m dùng cùng texture cỏ grass.jpg với repeat 240×180 khớp pha,
 *    cao độ tiệm cận (-0.0505 m) kèm dải viền chuyển tiếp 10 m, xóa triệt để mép hình chữ nhật khi nhìn từ trên cao.
 * 4. Dọn sạch tài nguyên chết và ghi chú: tòa nâu thuộc campus cũ Hòa Phú, không có ở Bến Cát.
 *
 * Hệ tọa độ: đơn vị = mét, y lên trên, mặt đất y=0, gốc ≈ giữa khuôn viên.
 * Trục z dương = nam (hướng cổng chính), z âm = bắc.
 * Trục x dương = đông, x âm = tây.
 */

// ========== LAYOUT NOTE ==========
export const LAYOUT_NOTE = `
BỐ CỤC NGOẠI THẤT VGU BẾN CÁT (v5 — theo layout-v5.md, thước tòa xám 55 m):
• Tòa chính xám (mainBuilding, tâm khối trước (-59, 13)):
  - Khối trước (56×22×15 m) ốp kim loại xám bạc (facade-main-gray.jpg crop chuẩn sạch 100% từ drone nho-gray-02 x:40..1240, y:808..906).
  - Tầng trệt phía phải cửa: dải kính dài (x: -13.9..22.5) + hàng cột trắng + giàn leo che nắng
    có cây leo + hộp điểm nhấn xanh teal ở đầu góc đông (x: 22.5..27.5).
  - 2 hốc cửa sổ cam xếp theo chiều dọc, khớp mảng cam trong facade-main-gray.jpg (tâm x≈-0.7 m, rộng 3.8 m):
    Hốc trên (y 10.45–12.85 m), Hốc dưới (y 5.65–8.05 m), đều cao 2.4 m.
    Mặt facade được cắt lỗ thật (7 panel khớp UV liên tục), hốc thụt sâu 0.8 m có thành cam và đáy kính sẫm.
  - Khối sau (28×17×21 m, tâm (-59, -7)): khối xám nhô ra trên lối đi mở tầng trệt (undercroft), cửa sổ mặt bắc.
    Hai cánh hành lang sân trong đã TẮT (MB_WINGS = false) vì cắt đường kênh theo bảng.
  - Mái: hộp cam trên khối sau, hộp đỏ trên khối trước, cụm HVAC trắng và ống dẫn bạc. Không có biển chữ VGU.
• Cổng chính: biển VGU quay ra nam (Vành Đai 4); cột cờ + tường ở bắc; mô đất + đèn ở nam. Điểm neo mainGate (0, 100) trên đường biên nam.
• Kênh (v5): tim theo bảng mục 3 với vài điểm chỉnh (xem ghi chú ở canalCtrl).
• Cầu đi bộ đỏ (canalBridge): tâm x = 14, z ≈ 46 (theo tim kênh), dài 19 m, vuông góc tim kênh; đầu nam đổ xuống bùng binh.
• Cầu đường VD4 (v5b): bắc qua kênh tại (−140, −64), trục bắc–nam; đoạn nối xuống VD4 là SUY RA (ảnh không thấy), chưa xác nhận.
• Khu thể thao (v5b): đường chạy (74, −66.5), dời 2.5 m bắc so với bảng (74, −64) để hết chồng tháp #10 (v6); khán đài, 2 nhóm sân, sân bóng rổ, hồ bơi xếp lại để không chồng nhau (bảng tự mâu thuẫn). Còn chồng ~3.5 m: góc nhà thi đấu với vành đường chạy (chưa sửa).
• Ký túc xá (v7 đợt 3, thu nhỏ + dời tây-bắc): tâm SÂN (−111,0; 61,6), xoay −45°, song song VD4 (trục x = dọc khu, z = đông-bắc → tây-nam).
  - Tòa xanh 60 × 13 × 15 m (5 tầng), tầng trệt mở trên cột tròn Ø 0,7 m; lồng điều hòa 1,4 × 2,2 m mặt ngoài; hành lang mở + lan can mặt sân.
  - Tòa cam 50 × 13 × 15 m ở z −10,5 (đông-bắc), lam dọc nâu đỏ mặt ngoài; sân trong 8 m giữa hai tòa (z −4…+4), lát gạch.
  - Hành lang mái che 3 cái (x −27, 0, 27) + pergola 23 m, hàng rào mắt cáo 2 đầu sân (đầu đông-nam có lối 3 m), ghế đá, bồn cây. Điểm dừng "Ký túc xá" neo ở tâm sân.
  - Khoảng trống (đo trên bao lồi thật): tới mép VD4 0,77 m; tới đường biên nam 0,74 m; tới đường nối VD4 (x −141…−117) 4,2 m.
  - Lối đi bộ 3 m: sân → lỗ hàng rào đầu đông-nam → đường biên nam (z 96). Cụm phải lùi tây-nam ~10,8 m khỏi trục VD4 (không thuần trục) vì sâu 35 m không đứng sát VD4 ở vị trí cũ.
• Camera chặn bởi hàng cột cờ cổng (hộp vô hình 'gate-cam-blocker', chỉ để kéo camera, không vào lưới đi bộ).
• Nền đất: tấm 400×350 m tâm (0, 15); nền ngoài 2400×1800 m dùng chung texture grass.jpg (repeat 240×180),
  dải viền chuyển tiếp 10 m được căn UV thế giới liền mạch hoàn toàn qua mép.
`;

// ========== TEXTURE PATHS (relative to HTML root) ==========
const TEX_BASE = './vgu-assets/textures/';

// ========== HELPERS ==========
const _loaders = {};
function getLoader(THREE) {
  if (!_loaders.tex) _loaders.tex = new THREE.TextureLoader();
  return _loaders.tex;
}

function loadTex(THREE, name, repeatX, repeatY) {
  const loader = getLoader(THREE);
  const fullPath = TEX_BASE + name;
  const t = loader.load(
    fullPath,
    undefined,
    undefined,
    (err) => {
      console.error(`[vgu-exterior] Failed to load texture "${name}" from "${fullPath}":`, err);
    }
  );
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeatX && repeatY) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeatX, repeatY);
  }
  return t;
}

function makeBox(THREE, sx, sy, sz, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
}

function placeBox(group, THREE, sx, sy, sz, mat, x, y, z) {
  const m = makeBox(THREE, sx, sy, sz, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  group.add(m);
  return m;
}

/**
 * Hộp ốp vật liệu có UV theo kích thước thật (mét): mỗi mặt được scale theo cạnh của nó,
 * nên vân ốp dọc có chu kỳ cố định (tileU m theo ngang, tileV m theo đứng) trên mọi mặt.
 * BoxGeometry: mỗi mặt 4 đỉnh liên tiếp theo thứ tự px, nx, py, ny, pz, nz.
 */
function makeCladdingBox(THREE, sx, sy, sz, mat, tileU, tileV) {
  const geo = new THREE.BoxGeometry(sx, sy, sz);
  const uv = geo.attributes.uv;
  const faceDims = [[sz, sy], [sz, sy], [sx, sz], [sx, sz], [sx, sy], [sx, sy]];
  for (let f = 0; f < 6; f++) {
    const [du, dv] = faceDims[f];
    for (let k = 0; k < 4; k++) {
      const i = f * 4 + k;
      uv.setXY(i, uv.getX(i) * du / tileU, uv.getY(i) * dv / tileV);
    }
  }
  uv.needsUpdate = true;
  return new THREE.Mesh(geo, mat);
}

/** Canvas texture for signs / labels */
function canvasTex(THREE, text, bgColor, fgColor, w, h, fontScale) {
  if (typeof document === 'undefined' || !document.createElement) return null;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const g = cv.getContext('2d');
  if (bgColor) { g.fillStyle = bgColor; g.fillRect(0, 0, w, h); }
  let size = Math.floor(h * fontScale);
  g.font = `bold ${size}px Arial, sans-serif`;
  while (g.measureText(text).width > w * 0.92 && size > 12) {
    size -= 2;
    g.font = `bold ${size}px Arial, sans-serif`;
  }
  g.fillStyle = fgColor;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, w / 2, h / 2);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Tạo canvas 2D và gọi draw(g, w, h); trả về null nếu không có DOM/canvas (ví dụ môi trường Node) */
function makeCanvas(w, h, draw) {
  if (typeof document === 'undefined' || !document.createElement) return null;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const g = cv.getContext ? cv.getContext('2d') : null;
  if (!g) return null;
  draw(g, w, h);
  return cv;
}

function canvasToTex(THREE, cv) {
  if (!cv) return null;
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Nhựa đường phẳng: nhiễu hạt mịn, không vạch tim đường, không đốm (thay asphalt.jpg có vạch và đốm lạ) */
function asphaltCanvas() {
  return makeCanvas(256, 256, (g, w, h) => {
    g.fillStyle = '#5b5e62';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) {
      const v = 70 + Math.floor(Math.random() * 40);
      g.fillStyle = `rgba(${v},${v},${v + 2},0.5)`;
      g.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
  });
}

/**
 * Dải lưới bám theo đường cong (kênh, bờ kênh): với mỗi mẫu dọc đường cong, tạo 2 đỉnh:
 * đỉnh a tại độ lệch a[0] (cao a[1]) và đỉnh b tại độ lệch b[0] (cao b[1]), vuông góc hướng đi.
 * Một lưới liền cho cả đoạn cong nên không còn chỗ nối gãy góc như chuỗi hình chữ nhật cũ.
 */
function strip(THREE, pts, a, b, mat) {
  const N = pts.length;
  const pos = new Float32Array(N * 2 * 3);
  const uv = new Float32Array(N * 2 * 2);
  let s = 0;
  for (let i = 0; i < N; i++) {
    const p = pts[i];
    const q0 = pts[Math.max(0, i - 1)], q1 = pts[Math.min(N - 1, i + 1)];
    const tx = q1.x - q0.x, tz = q1.z - q0.z;
    const L = Math.hypot(tx, tz) || 1;
    const nx = -tz / L, nz = tx / L;
    if (i > 0) s += pts[i - 1].distanceTo(p);
    pos.set([p.x + nx * a[0], a[1], p.z + nz * a[0]], i * 6);
    pos.set([p.x + nx * b[0], b[1], p.z + nz * b[0]], i * 6 + 3);
    uv.set([s / 6, 0], i * 4);
    uv.set([s / 6, 1], i * 4 + 2);
  }
  const idx = [];
  for (let i = 0; i < N - 1; i++) {
    const A0 = 2 * i, B0 = 2 * i + 1, A1 = 2 * i + 2, B1 = 2 * i + 3;
    idx.push(A0, B0, A1, B0, B1, A1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, mat);
}

// ========== MAIN BUILD FUNCTION ==========
export function buildExterior(THREE) {
  const group = new THREE.Group();
  group.name = 'vgu-exterior-v2';

  // --- Shared materials ---
  // Nền 400×350 m, ô cỏ 10 m (repeat 40×35). Nền ngoài 2400×1800 m giữ nguyên repeat 240×180.
  const grassTex = loadTex(THREE, 'grass.jpg', 40, 35);
  const outerGrassTex = loadTex(THREE, 'grass.jpg', 240, 180);
  // Nhựa đường: texture procedural (không vạch/đốm). Mỗi đoạn đường có repeat riêng: 1 ô ≈ 6 m (xem asphaltFor)
  const asphaltBase = canvasToTex(THREE, asphaltCanvas());
  const asphaltMats = new Map();
  function asphaltFor(w, l) {
    const key = w.toFixed(1) + 'x' + l.toFixed(1);
    if (!asphaltMats.has(key)) {
      let map = null;
      if (asphaltBase) {
        map = asphaltBase.clone();
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(w / 6, l / 6);
        map.needsUpdate = true;
      }
      const m = new THREE.MeshStandardMaterial({ map, color: map ? 0xffffff : 0x5b5e62, roughness: 0.85, metalness: 0.05 });
      m.name = 'asphalt-procedural';
      asphaltMats.set(key, m);
    }
    return asphaltMats.get(key);
  }
  const waterTex = loadTex(THREE, 'water.jpg', 8, 2);
  const concreteTex = loadTex(THREE, 'concrete.jpg', 10, 10);
  const metalTex = loadTex(THREE, 'metal-cladding.jpg', 4, 3);
  const facadeGrayTex = loadTex(THREE, 'facade-main-gray.jpg', 1, 1);
  const whiteFacadeTex = loadTex(THREE, 'white-facade.jpg', 1, 1);
  const trackTex = loadTex(THREE, 'track-red.jpg', 4, 2);
  const poolTex = loadTex(THREE, 'pool-blue.jpg', 2, 2);
  const tennisTex = loadTex(THREE, 'tennis-green.jpg', 1, 1);
  const roofTex = loadTex(THREE, 'roof-dark.jpg', 4, 4);

  const matGrass = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.95, metalness: 0.0 });
  const matOuterGround = new THREE.MeshStandardMaterial({ map: outerGrassTex, roughness: 0.95, metalness: 0.0 });
  const matWater = new THREE.MeshStandardMaterial({ map: waterTex, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.85 });
  const matConcrete = new THREE.MeshStandardMaterial({ map: concreteTex, roughness: 0.8, metalness: 0.0 });
  const matMetal = new THREE.MeshStandardMaterial({ map: metalTex, roughness: 0.4, metalness: 0.5 });
  const matWhite = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.7, metalness: 0.0 });
  const matWhiteFacade = new THREE.MeshStandardMaterial({ map: whiteFacadeTex, roughness: 0.7, metalness: 0.0 });
  const matRoof = new THREE.MeshStandardMaterial({ map: roofTex, roughness: 0.9, metalness: 0.0 });
  const matGlass = new THREE.MeshStandardMaterial({ color: 0x4a7a90, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.65 });
  const matGlassDark = new THREE.MeshStandardMaterial({ color: 0x182430, roughness: 0.15, metalness: 0.6, transparent: true, opacity: 0.85 });
  // Kính tầng trệt mặt nam: metalness thấp (scene không có env map nên kim loại cao thành đen đặc), màu xanh xám phản chiếu nhẹ
  const matGlassGround = new THREE.MeshStandardMaterial({ color: 0x8fb4c4, roughness: 0.2, metalness: 0.1, emissive: 0x0d1a22, emissiveIntensity: 0.6, transparent: true, opacity: 0.8 });
  const matAccentRed = new THREE.MeshStandardMaterial({ color: 0xc03020, roughness: 0.5, metalness: 0.2 });
  const matAccentOrange = new THREE.MeshStandardMaterial({ color: 0xe8782a, roughness: 0.5, metalness: 0.15 });
  const matAccentGreen = new THREE.MeshStandardMaterial({ color: 0x2a7b7a, roughness: 0.45, metalness: 0.15 });
  const matTrellis = new THREE.MeshStandardMaterial({ color: 0x44484c, roughness: 0.5, metalness: 0.4 });
  const matWindow = new THREE.MeshStandardMaterial({ color: 0xd0e8f0, roughness: 0.2, metalness: 0.15, transparent: true, opacity: 0.5 });
  const matOvalWhite = new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.5, metalness: 0.1 });
  const matGray = new THREE.MeshStandardMaterial({ color: 0x808890, roughness: 0.5, metalness: 0.4 });
  const matCharcoal = new THREE.MeshStandardMaterial({ color: 0x383e44, roughness: 0.45, metalness: 0.5 });
  // Khối sau: ốp metal-cladding.jpg (dải dọc). Texture riêng với repeat 1 vì UV đã được tính theo mét trong makeCladdingBox.
  const backCladdingTex = loadTex(THREE, 'metal-cladding.jpg', 1, 1);
  const matBackCladding = new THREE.MeshStandardMaterial({ map: backCladdingTex, color: 0xe4eaf0, roughness: 0.4, metalness: 0.3 });
  const matSilverDuct = new THREE.MeshStandardMaterial({ color: 0xd8e0e8, roughness: 0.25, metalness: 0.8 });
  const matBridge = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.5, metalness: 0.3 });
  const matBridgeRed = new THREE.MeshStandardMaterial({ color: 0xb83020, roughness: 0.5, metalness: 0.3 });
  const matDarkRoof = new THREE.MeshStandardMaterial({ color: 0x444b52, roughness: 0.6, metalness: 0.3 });
  const matTrunk = new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.9, metalness: 0.0 });
  const matLeaf1 = new THREE.MeshStandardMaterial({ color: 0x2d6b28, roughness: 0.9, metalness: 0.0 });
  const matLeaf2 = new THREE.MeshStandardMaterial({ color: 0x3a7e34, roughness: 0.9, metalness: 0.0 });
  const matLeaf3 = new THREE.MeshStandardMaterial({ color: 0x4a6e30, roughness: 0.9, metalness: 0.0 });
  const matLeaf4 = new THREE.MeshStandardMaterial({ color: 0x558840, roughness: 0.9, metalness: 0.0 });
  const matDoor = new THREE.MeshStandardMaterial({ color: 0x14181c, roughness: 0.3, metalness: 0.2 });

  // References for buildings output
  const buildings = {};

  // =====================================================
  // (1) GROUND PLANE — hòa chất liệu & xóa mép chữ nhật
  // =====================================================
  // Nền ngoài rộng 2400×1800 m dùng cùng texture cỏ (repeat 240×180), cao độ tiệm cận -0.0505 m
  const outerGroundGeo = new THREE.PlaneGeometry(2400, 1800);
  const outerGround = new THREE.Mesh(outerGroundGeo, matOuterGround);
  outerGround.rotation.x = -Math.PI / 2;
  outerGround.position.y = -0.0505;
  outerGround.receiveShadow = true;
  group.add(outerGround);

  // Tấm khuôn viên chính 400×350 m, tâm (0, 15) (v5)
  const CAMPUS_CZ = 15;
  const groundGeo = new THREE.PlaneGeometry(400, 350);
  const ground = new THREE.Mesh(groundGeo, matGrass);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.05, CAMPUS_CZ);
  ground.receiveShadow = true;
  group.add(ground);

  // Dải viền chuyển tiếp (skirt apron) rộng 10 m bao quanh mép 400×350 m, xóa sạch đường ranh giới
  const skirtShape = new THREE.Shape();
  skirtShape.moveTo(-210, -185);
  skirtShape.lineTo(210, -185);
  skirtShape.lineTo(210, 185);
  skirtShape.lineTo(-210, 185);
  skirtShape.lineTo(-210, -185);
  const skirtHole = new THREE.Path();
  skirtHole.moveTo(-200, -175);
  skirtHole.lineTo(200, -175);
  skirtHole.lineTo(200, 175);
  skirtHole.lineTo(-200, 175);
  skirtHole.lineTo(-200, -175);
  skirtShape.holes.push(skirtHole);
  const skirtGeo = new THREE.ShapeGeometry(skirtShape);
  skirtGeo.rotateX(-Math.PI / 2);

  // Căn UV của skirt theo tọa độ cục bộ của tấm (ô 10 m, khớp PlaneGeometry 400×350 tại mép)
  const skirtPos = skirtGeo.attributes.position;
  const skirtUv = skirtGeo.attributes.uv;
  for (let i = 0; i < skirtPos.count; i++) {
    const px = skirtPos.getX(i);
    const pz = skirtPos.getZ(i);
    skirtUv.setXY(i, (px + 200) / 400, (-pz + 175) / 350);
  }
  skirtUv.needsUpdate = true;

  const skirtMesh = new THREE.Mesh(skirtGeo, matGrass);
  skirtMesh.position.set(0, -0.0502, CAMPUS_CZ);
  skirtMesh.receiveShadow = true;
  group.add(skirtMesh);

  // =====================================================
  // (1b) ROADS — đường giao thông nội khu
  // =====================================================
  // Đường thẳng bất kỳ: tâm (cx, cz), dài len theo hướng (dx, dz), rộng wid. Dùng Euler XYZ: rotation (−π/2, 0, φ), φ = −atan2(dz, dx).
  // roadRects: mọi đoạn đường phẳng (tâm, nửa dài, nửa rộng, hướng đơn vị) — dùng để loại trừ cây ngẫu nhiên khỏi đường (v7 đợt 4)
  const roadRects = [];
  function flatRoad(cx, cz, len, wid, dx, dz, name) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, wid), asphaltFor(len, wid));
    const L = Math.hypot(dx, dz) || 1;
    m.rotation.set(-Math.PI / 2, 0, -Math.atan2(dz / L, dx / L));
    m.position.set(cx, 0.02, cz);
    m.receiveShadow = true;
    if (name) m.name = name;
    group.add(m);
    roadRects.push({ cx, cz, hl: len / 2, hw: wid / 2, ux: dx / L, uz: dz / L, name: name || '' });
    return m;
  }
  // Đường bắc–nam (x = 0): từ cầu đỏ (z 50) xuống qua bùng binh tới cổng (z 104)
  flatRoad(0, 77, 54, 8, 0, 1, 'road-ns');
  // Đường đông–tây (z = 75): qua bùng binh, từ VD4 (x −62) tới tòa sân trong (x 71.5)
  flatRoad(4.75, 75, 133.5, 7, 1, 0, 'road-ew');
  // Đường biên nam (z = 100): đường vào cổng, từ VD4 side (x −105) tới mép kênh (x 18)
  flatRoad(-43.5, 100, 123, 8, 1, 0, 'road-perim-s');
  // Đường biên đông (x = 150): chạy bắc–nam, phía bắc tới z 0 (không chạm tòa mái xanh z ≥ 5)
  flatRoad(150, -42.5, 85, 7, 0, 1, 'road-east');
  // Vành Đai 4: đi theo 5 điểm tim bảng (-110,28)…(-25,112), kéo dài 10 m mỗi đầu. Hướng ~45° (xem báo cáo v5)
  flatRoad(-67.5, 70, 139.3, 12.5, 0.7107, 0.7035, 'road-vd4');
  // v5b — ĐOẠN NỐI VD4 ↔ CẦU VD4 (SUY RA để nối liền mạch, CHƯA có ảnh xác nhận; bảng mục 4 nói đoạn này nằm ngoài khung).
  // Trục bắc–nam x = −141 từ mút nam cầu (z −48.5) xuống z = 21 (sát mút tây-bắc VD4 tại (−117, 21)); đi phía TÂY
  // tòa hữu cơ (x từ −134) để không cắt nhà. Sau đó đoạn đông–tây z = 21 từ x −141 tới VD4.
  flatRoad(-141, -13.75, 69.5, 12.5, 0, 1, 'road-vd4-link-ns');
  flatRoad(-129, 21, 24, 12.5, 1, 0, 'road-vd4-link-ew');

  // =====================================================
  // (1c) ROUNDABOUT — đảo tròn giao thông (v5: đảo Ø 23 m, vòng ngoài Ø 30 m theo bảng)
  // =====================================================
  const rbGeo = new THREE.CylinderGeometry(11.5, 11.5, 0.15, 32);
  const roundabout = new THREE.Mesh(rbGeo, matGrass);
  roundabout.position.set(0, 0.08, 75);
  roundabout.receiveShadow = true;
  group.add(roundabout);

  const rbRoadShape = new THREE.Shape();
  rbRoadShape.absarc(0, 0, 15, 0, Math.PI * 2, false);
  const rbHole = new THREE.Path();
  rbHole.absarc(0, 0, 11.5, 0, Math.PI * 2, true);
  rbRoadShape.holes.push(rbHole);
  const rbRoadGeo = new THREE.ShapeGeometry(rbRoadShape, 32);
  rbRoadGeo.rotateX(-Math.PI / 2);
  const rbRoad = new THREE.Mesh(rbRoadGeo, asphaltFor(1, 1)); // UV của ShapeGeometry là mét → repeat 1/6
  rbRoad.position.set(0, 0.03, 75);
  rbRoad.receiveShadow = true;
  group.add(rbRoad);

  // =====================================================
  // (1d) CANAL — kênh uốn lượn
  // =====================================================
  // v5 (sửa mục 8): kênh chạy NAM hội trường (tim z ≈ 33–35 tại x −6…5, mặt nam hội trường z = 21) và chảy
  // giữa tòa xám (nam) với cụm trắng (bắc) ở phía tây (tim z −9…−24 tại x −56…−38). Các khối cụm trắng đặt theo
  // bảng #3–#10 (xem whiteBuildings), không còn ghi chú SW/SE cũ.
  // Đường cong spline (Catmull-Rom) đi qua các điểm điều khiển, lấy mẫu đều ~2.3 m; hai đầu kéo ra mép khuôn viên.
  // v5: tim kênh lấy từ bảng layout-v5.md mục 3 (K1…K12), kéo dài hai đầu ra ngoài khuôn viên.
  // Chỉnh so với bảng (để kênh không cắt khối nhà; xem báo cáo v5): K4 (−56,−29)→(−56,−24) [kẹp giữa khối 4 và tòa xám],
  // K5 (−38,−10)→(−38,−9), K6 (−26,8)→(−22,6), K7 (−7,24)→(−17,30)/(−6,33) [tránh góc tây-nam hội trường].
  const canalCtrl = [
    [-200, -74], [-160, -68], [-126, -58], [-103, -49], [-79, -40], [-56, -24], [-44, -18], [-38, -9],
    [-30, -12], [-22, 6], [-22, 20], [-17, 30], [-6, 33], [5, 35], [15, 47], [22, 64], [26, 88], [27, 111], [40, 150],
  ].map(([x, z]) => new THREE.Vector3(x, 0, z));
  const canalCurve = new THREE.CatmullRomCurve3(canalCtrl, false, 'centripetal');
  const canalPts = canalCurve.getSpacedPoints(260);

  const matWaterDS = matWater.clone();
  matWaterDS.side = THREE.DoubleSide;
  const matBankDS = matConcrete.clone();
  matBankDS.side = THREE.DoubleSide;

  const canalWater = strip(THREE, canalPts, [-6, 0.04], [6, 0.04], matWaterDS);
  canalWater.name = 'canal-water';
  canalWater.receiveShadow = true;
  group.add(canalWater);
  for (const sg of [1, -1]) {
    const bankTop = strip(THREE, canalPts, [sg * 6.0, 0.5], [sg * 6.6, 0.5], matBankDS);
    bankTop.name = 'canal-bank-top';
    bankTop.receiveShadow = true;
    group.add(bankTop);
    const bankOuter = strip(THREE, canalPts, [sg * 6.6, 0], [sg * 6.6, 0.5], matBankDS);
    bankOuter.name = 'canal-bank-wall';
    bankOuter.castShadow = true;
    bankOuter.receiveShadow = true;
    group.add(bankOuter);
    const bankInner = strip(THREE, canalPts, [sg * 6.0, 0.04], [sg * 6.0, 0.5], matBankDS);
    bankInner.name = 'canal-bank-wall';
    bankInner.receiveShadow = true;
    group.add(bankInner);
  }

  // Tâm kênh tại hoành độ x (kênh đơn điệu theo x nên nội suy tuyến tính giữa hai mẫu kề nhau)
  function canalZAtX(xTarget) {
    for (let i = 0; i < canalPts.length - 1; i++) {
      const p0 = canalPts[i], p1 = canalPts[i + 1];
      if ((xTarget >= p0.x && xTarget <= p1.x) || (xTarget >= p1.x && xTarget <= p0.x)) {
        const t = p1.x === p0.x ? 0 : (xTarget - p0.x) / (p1.x - p0.x);
        return p0.z + t * (p1.z - p0.z);
      }
    }
    return 0;
  }

  // =====================================================
  // (1e) BRIDGES — CẦU QUA KÊNH
  // =====================================================
  // --- RED PEDESTRIAN BRIDGE (CẦU ĐỎ) ---
  // SỬA LỖI 1: Cầu đỏ dời sang x = 15.0.
  // v2.8: tại x = 15.0 tâm kênh z ≈ -3.1 (kênh đã dời lên phía bắc). Mặt cầu dài 14 m (z ≈ -10.1..3.9).
  // Mút dốc bắc (dài 2.5 m) chạm đất tại z ≈ -12.6, nằm trong hành lang x 9..21 giữa tòa SW và SE.
  // Khoảng cách tới tòa SW (mặt đông x=9.0): 13.0 - 9.0 = 4.0 m >= 3.0 m.
  // Khoảng cách tới tòa SE (mặt tây x=21.0): 21.0 - 17.0 = 4.0 m >= 3.0 m.
  // Phía bắc là hành lang giữa 2 tòa rộng 12 m, trống suốt >18 m lên sân trung tâm.
  // v5: cầu đỏ (đi bộ) 19×4 m, đặt tại x = 14 (bảng #4 mục 4), đặt VUÔNG GÓC tim kênh tại điểm cắt
  // (bảng ghi ~30°, nhưng hướng 30° không bắc qua được kênh; xem báo cáo v5).
  const redBridgeX = 14.0;
  const redBridgeZ = canalZAtX(redBridgeX);
  const RED_DECK_Y = 1.35;
  const RED_RAMP_LEN = 3.0;
  const RED_HALF = 9.5;      // nửa chiều dài mặt cầu
  const redBridgeYaw = (() => {
    const i0 = canalPts.findIndex((p) => p.x >= redBridgeX);
    const pA = canalPts[Math.max(0, i0 - 3)], pB = canalPts[Math.min(canalPts.length - 1, i0 + 3)];
    return Math.atan2(-(pB.z - pA.z), pB.x - pA.x); // local z (chiều dài cầu) ⟂ tiếp tuyến kênh
  })();

  const redBridgeGroup = new THREE.Group();
  redBridgeGroup.name = 'bridge-red';
  // Deck mặt cầu rộng 4 m, dài 19 m (dọc local z)
  placeBox(redBridgeGroup, THREE, 4, 0.3, 19, matBridgeRed, 0, RED_DECK_Y, 0);
  // Railings
  placeBox(redBridgeGroup, THREE, 0.1, 1.0, 19, matBridgeRed, -1.9, RED_DECK_Y + 0.5, 0);
  placeBox(redBridgeGroup, THREE, 0.1, 1.0, 19, matBridgeRed, 1.9, RED_DECK_Y + 0.5, 0);
  // Posts
  for (let zi = -9; zi <= 9; zi += 3) {
    placeBox(redBridgeGroup, THREE, 0.15, 1.5, 0.15, matBridgeRed, -1.9, RED_DECK_Y + 0.3, zi);
    placeBox(redBridgeGroup, THREE, 0.15, 1.5, 0.15, matBridgeRed, 1.9, RED_DECK_Y + 0.3, zi);
  }
  // Dốc 2 đầu: đầu chạm đất ngoài mép kênh (bờ ±6.6 m)
  for (const dir of [-1, 1]) {
    const rampGeo = new THREE.BoxGeometry(4, 0.2, RED_RAMP_LEN);
    const ramp = new THREE.Mesh(rampGeo, matBridgeRed);
    ramp.position.set(0, RED_DECK_Y / 2, dir * (RED_HALF + RED_RAMP_LEN / 2));
    ramp.rotation.x = dir * Math.atan2(RED_DECK_Y, RED_RAMP_LEN);
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    redBridgeGroup.add(ramp);
  }
  redBridgeGroup.position.set(redBridgeX, 0, redBridgeZ);
  redBridgeGroup.rotation.y = redBridgeYaw;
  group.add(redBridgeGroup);

  // --- WHITE TRUSS BRIDGE (CẦU TRẮNG) ---
  // v5: cầu trắng (giàn thép, xe đi được) 28×5 m, chạy đông–tây (local z → world x nhờ rotation.y = π/2),
  // bắc qua kênh tại x = −29 (bảng mục 4: (−29,−4) 30×5; dài 28 để đầu dốc không chạm tòa xám/cụm 5).
  const whiteBridgeX = -29;
  const whiteBridgeZ = canalZAtX(whiteBridgeX);
  const WHITE_DECK_Y = 1.175;
  const WHITE_RAMP_LEN = 2.8;
  const WHITE_HALF = 14;

  const whiteBridgeGroup = new THREE.Group();
  whiteBridgeGroup.name = 'bridge-white';
  placeBox(whiteBridgeGroup, THREE, 5, 0.35, 28, matBridge, 0, WHITE_DECK_Y, 0);
  placeBox(whiteBridgeGroup, THREE, 0.15, 4.0, 28, matBridge, -2.4, WHITE_DECK_Y + 2.0, 0);
  placeBox(whiteBridgeGroup, THREE, 0.15, 4.0, 28, matBridge, 2.4, WHITE_DECK_Y + 2.0, 0);
  placeBox(whiteBridgeGroup, THREE, 5, 0.3, 28, matBridge, 0, WHITE_DECK_Y + 4.0, 0);
  for (let zi = -12; zi <= 12; zi += 4) {
    for (const sx of [-1, 1]) {
      const brace = placeBox(whiteBridgeGroup, THREE, 0.1, 4.5, 0.1, matBridge,
        sx * 2.4, WHITE_DECK_Y + 2.0, zi);
      brace.rotation.z = sx * 0.4;
    }
  }
  for (const dir of [-1, 1]) {
    const rampGeo = new THREE.BoxGeometry(5, 0.2, WHITE_RAMP_LEN);
    const ramp = new THREE.Mesh(rampGeo, matBridge);
    ramp.position.set(0, WHITE_DECK_Y / 2, dir * (WHITE_HALF + WHITE_RAMP_LEN / 2));
    ramp.rotation.x = dir * Math.atan2(WHITE_DECK_Y, WHITE_RAMP_LEN);
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    whiteBridgeGroup.add(ramp);
  }
  whiteBridgeGroup.position.set(whiteBridgeX, 0, whiteBridgeZ);
  whiteBridgeGroup.rotation.y = Math.PI / 2;
  group.add(whiteBridgeGroup);

  // --- CẦU ĐƯỜNG (v5). Mặt cầu cao 1.0 m; dốc hai đầu do trang (HTML) dựng theo tên chứa "bridge".
  // Cầu đường bắc–nam cũ (x=0) và cầu đường đông (x=90) đã BỎ: bảng không có đường cắt kênh tại hai vị trí đó.
  const ROAD_DECK_Y = 1.0;
  // Cầu đường đặt tại (cx, cz); alongX = true → mặt cầu dài theo x (len), rộng theo z (width).
  function addRoadBridge(name, cx, cz, alongX, len, width) {
    const rb = new THREE.Group();
    rb.name = name;
    const sx = alongX ? len : width, sz = alongX ? width : len;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.3, sz), asphaltFor(sx, sz));
    deck.position.set(0, ROAD_DECK_Y, 0);
    deck.castShadow = true;
    deck.receiveShadow = true;
    rb.add(deck);
    rb.position.set(cx, 0, cz);
    group.add(rb);
  }
  // Đường đông–tây (z = 75) bắc qua kênh: tìm x tại đó tim kênh cắt z = 75
  {
    let xCross = null;
    for (let i = 0; i < canalPts.length - 1 && xCross === null; i++) {
      const a = canalPts[i], b = canalPts[i + 1];
      if ((a.z - 75) * (b.z - 75) <= 0 && a.z !== b.z) xCross = a.x + (75 - a.z) * (b.x - a.x) / (b.z - a.z);
    }
    if (xCross !== null) addRoadBridge('bridge-road-ew', xCross, 75, true, 20, 7);
  }
  // Cầu cạn Vành Đai 4 (v5b, mục 4 yêu cầu dời tới kênh thật sự chảy qua).
  // Bảng: (−130, −74), đông–tây — KHÔNG bắc qua nước (kênh K1 (−126,−58) → K2 (−103,−49) chạy gần đông–tây,
  // cầu đông–tây sẽ chạy DỌC kênh). Nên đặt cầu bắc–nam bắc qua kênh tại x = −140 (tim kênh z ≈ −62 theo nội suy
  // giữa (−160,−68) và (−126,−58)), mặt cầu 15 m (x) × 31 m (z) để vượt bờ hai bên (kênh rộng ~13 m + bờ).
  // Đoạn nối xuống VD4 là suy ra (xem flatRoad 'road-vd4-link-*'), chưa có ảnh xác nhận.
  addRoadBridge('bridge-road-vd4', -140, -64, false, 31, 15);
  // v7 đợt 4b (C5b): mặt cầu VD4 là đường → vào roadRects (loại trừ cây 2 m). Mặt cầu z −79,5…−48,5, x −147,5…−132,5.
  roadRects.push({ cx: -140, cz: -64, hl: 15.5, hw: 7.5, ux: 0, uz: 1, name: 'bridge-road-vd4' });
  // v7 đợt 4b (C5a): bãi đậu xe (parkingLot, tâm (−75,−40), 30×15 m, tạo ở mục 10) cũng vào roadRects ở đây để vòng cây (sau mục 9) thấy.
  roadRects.push({ cx: -75, cz: -40, hl: 15, hw: 7.5, ux: 1, uz: 0, name: 'parking-lot' });

  // =====================================================
  // (1f) SIDEWALKS / PLAZAS
  // =====================================================
  const heroPlaza = new THREE.Mesh(new THREE.PlaneGeometry(68, 18), matConcrete);
  heroPlaza.rotation.x = -Math.PI / 2;
  heroPlaza.position.set(-55, 0.03, -1);
  heroPlaza.receiveShadow = true;
  group.add(heroPlaza);

  const centralPlaza = new THREE.Mesh(new THREE.PlaneGeometry(80, 40), matConcrete);
  centralPlaza.rotation.x = -Math.PI / 2;
  centralPlaza.position.set(0, 0.03, -10);
  centralPlaza.receiveShadow = true;
  group.add(centralPlaza);

  // =====================================================
  // (2) TÒA CHÍNH XÁM — HERO MAIN BUILDING (CAMPUS BẾN CÁT)
  // =====================================================
  // Dựng chuẩn theo ảnh drone thẳng nho-gray-02, sân trong nho-gray-04, cận cảnh nho-gray-05:
  // - Khối trước: 55×22 m, cao 15 m.
  // - Khối sau: 46×18 m, cao 21 m, nhô ra (cantilever) trên lối đi mở tầng trệt cao 4.8 m, sâu 4.5 m.
  // - Sân trong: khối xám có hàng cột chống và 2 dãy hành lang trắng bao quanh mở thông ra sân.
  // - Tầng trệt phía phải cửa: dải kính dài + hàng cột trắng + giàn leo + hộp xanh teal ở đầu phải.
  // - 2 hốc cam xếp theo CHIỀU DỌC, khớp mảng cam trong facade-main-gray.jpg (tâm x ≈ -0.7, vòng sửa 4).
  // - Cắt lỗ THẬT trên mặt facade xung quanh 2 hốc cam; hốc lõm 3D sâu 0.8 m với kính sẫm ở đáy.
  // - Mái: hộp cam khối sau, hộp đỏ khối trước, HVAC trắng, ống bạc.
  // - TUYỆT ĐỐI KHÔNG CÓ BIỂN CHỮ "VGU" TRÊN TÒA XÁM.
  const mainB = new THREE.Group();
  mainB.name = 'main-building';

  // v5 (bảng #1, #2): khối trước 56×22×15 m, khối sau 28×17×21 m, tâm khối trước (−59, 13); khối sau (−59, −7)
  const MB_W = 56, MB_D = 22, MB_H = 15;
  const MB_BACK_W = 28, MB_BACK_D = 17, MB_BACK_H = 21;
  const backOffsetX = 0.0;
  const backOffsetZ = -20.0; // local: khối sau ở phía bắc khối trước (world z −15.5…1.5)
  const UNDER_H = 4.8; // Chiều cao thông thủy lối đi mở sân trong

  // --- 2a. Khối sau & Sân trong (Tái hiện chi tiết ảnh đối chiếu nho-gray-04) ---
  // Khối thân trên nhô ra (cantilever từ y = UNDER_H đến MB_BACK_H) dùng vật liệu xám bạc sáng
  const backUpperH = MB_BACK_H - UNDER_H;
  // Ốp dọc: chu kỳ 3 m theo ngang, 6 m theo đứng (texture có ~5 cột dải trên mỗi chu kỳ — xem báo cáo)
  const backBlock = makeCladdingBox(THREE, MB_BACK_W, backUpperH, MB_BACK_D, matBackCladding, 3.0, 6.0);
  backBlock.position.set(backOffsetX, UNDER_H + backUpperH / 2, backOffsetZ);
  backBlock.castShadow = true;
  backBlock.receiveShadow = true;
  mainB.add(backBlock);
  // Trần vát sáng màu dưới đáy khối nhô ra (underside cantilever tại y = UNDER_H)
  placeBox(mainB, THREE, MB_BACK_W, 0.2, MB_BACK_D, matWhite,
    backOffsetX, UNDER_H - 0.1, backOffsetZ);

  // Cửa sổ mặt bắc khối sau (tầng 4 và tầng 5 nhìn ra sân trong theo ảnh nho-gray-04)
  const northWinY1 = UNDER_H + 3.8;
  const northWinY2 = UNDER_H + 9.2;
  // v2.7: khung cửa có chiều sâu — nẹp đen 4 cạnh nhô ra 0.45 m khỏi mặt tường (một InstancedMesh, 1 draw call)
  const northRevealZ = backOffsetZ - MB_BACK_D / 2 - 0.2;
  const revealList = [];
  for (let nx = backOffsetX - MB_BACK_W / 2 + 5; nx <= backOffsetX + MB_BACK_W / 2 - 5; nx += 7) {
    for (const wy of [northWinY1, northWinY2]) {
      placeBox(mainB, THREE, 3.2, 2.2, 0.2, matWindow, nx, wy, backOffsetZ - MB_BACK_D / 2 - 0.05);
      revealList.push([nx, wy + 1.2, 3.6, 0.2]);   // nẹp trên
      revealList.push([nx, wy - 1.2, 3.6, 0.2]);   // nẹp dưới
      revealList.push([nx - 1.7, wy, 0.2, 2.6]);   // nẹp trái
      revealList.push([nx + 1.7, wy, 0.2, 2.6]);   // nẹp phải
    }
  }
  const revealInst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 0.5), matCharcoal, revealList.length);
  const revealDm = new THREE.Object3D();
  revealList.forEach(([x, y, w, h], i) => {
    revealDm.position.set(x, y, northRevealZ);
    revealDm.scale.set(w, h, 1);
    revealDm.updateMatrix();
    revealInst.setMatrixAt(i, revealDm.matrix);
  });
  revealInst.instanceMatrix.needsUpdate = true;
  revealInst.castShadow = true;
  mainB.add(revealInst);

  // Gờ góc (v2.7): 4 cột góc khối sau nhô 0.25 m, tạo cạnh sắc nét cho khối ốp
  for (const cxo of [-1, 1]) {
    for (const czo of [-1, 1]) {
      placeBox(mainB, THREE, 0.5, backUpperH, 0.5, matCharcoal,
        backOffsetX + cxo * (MB_BACK_W / 2), UNDER_H + backUpperH / 2, backOffsetZ + czo * (MB_BACK_D / 2));
    }
  }

  // Diềm mái & mặt mái khối sau
  placeBox(mainB, THREE, MB_BACK_W + 0.6, 0.4, MB_BACK_D + 0.6, matDarkRoof,
    backOffsetX, MB_BACK_H + 0.2, backOffsetZ);

  // Hộp cam trên mái khối sau
  const orangeBoxW = 9.0, orangeBoxH = 3.6, orangeBoxD = 7.0;
  placeBox(mainB, THREE, orangeBoxW, orangeBoxH, orangeBoxD, matAccentOrange,
    backOffsetX + 8.0, MB_BACK_H + orangeBoxH / 2 + 0.2, backOffsetZ - 1.0);

  // Lối đi mở tầng trệt phía bắc (undercroft nhìn từ sân trong, z từ -15.0 đến -10.5)
  // Sàn bê tông lối đi mở
  const underFloor = new THREE.Mesh(new THREE.PlaneGeometry(MB_BACK_W + 2, 5.0), matConcrete);
  underFloor.rotation.x = -Math.PI / 2;
  underFloor.position.set(backOffsetX, 0.03, backOffsetZ - MB_BACK_D / 2 + 2.5);
  underFloor.receiveShadow = true;
  mainB.add(underFloor);

  // Vách kính lùi vào bên trong (setback wall at z = backOffsetZ - MB_BACK_D / 2 + 4.5 = -10.5)
  placeBox(mainB, THREE, MB_BACK_W - 2.0, UNDER_H - 0.2, 0.2, matGlassDark,
    backOffsetX, UNDER_H / 2, backOffsetZ - MB_BACK_D / 2 + 4.5);
  // Khung đố vách kính
  for (let vx = backOffsetX - MB_BACK_W / 2 + 4; vx <= backOffsetX + MB_BACK_W / 2 - 4; vx += 5) {
    placeBox(mainB, THREE, 0.15, UNDER_H, 0.3, matCharcoal, vx, UNDER_H / 2, backOffsetZ - MB_BACK_D / 2 + 4.5);
  }

  // Hàng cột chịu lực mở (pilotis) dọc mép bắc khối nhô ra (z = -14.6)
  for (let px = backOffsetX - MB_BACK_W / 2 + 2; px <= backOffsetX + MB_BACK_W / 2 - 2; px += 7) {
    placeBox(mainB, THREE, 0.6, UNDER_H, 0.6, matWhite,
      px, UNDER_H / 2, backOffsetZ - MB_BACK_D / 2 + 0.4);
  }

  // 2 dãy hành lang trắng 3 tầng mở ra sân trong (tái hiện chi tiết ảnh đối chiếu nho-gray-04)
  // Mỗi dãy gồm 3 tầng: Tầng 1 (trệt) vách kính, Tầng 2 & 3 hành lang mở có dầm sàn, lan can kim loại và cột chịu lực
  const wingDepth = 7.5; // vươn về phía bắc từ z = -15.0 đến z = -22.5
  const wingZ = backOffsetZ - MB_BACK_D / 2 - wingDepth / 2; // = -15.0 - 3.75 = -18.75
  const wingW = 3.6;
  const wingH = 13.0; // 3 tầng
  const westWingX = backOffsetX - MB_BACK_W / 2 + wingW / 2 - 0.4; // ≈ -15.6
  const eastWingX = backOffsetX + MB_BACK_W / 2 - wingW / 2 + 0.4; // ≈ 27.6

  // v5: hai cánh hành lang vươn 7.5 m về phía bắc khối sau cắt đường kênh theo bảng → TẮT (MB_WINGS = false).
  const MB_WINGS = false;
  (MB_WINGS ? [
    { x: westWingX, innerSide: +1 }, // Cánh tây, mặt mở nhìn về phía đông (+x)
    { x: eastWingX, innerSide: -1 }, // Cánh đông, mặt mở nhìn về phía tây (-x)
  ] : []).forEach(wing => {
    // Tường bao ngoài lưng cánh (exterior solid wall)
    placeBox(mainB, THREE, 0.3, wingH, wingDepth, matWhite,
      wing.x - wing.innerSide * (wingW / 2 - 0.15), wingH / 2, wingZ);
    // Tường đầu hồi bắc (north end cap)
    placeBox(mainB, THREE, wingW, wingH, 0.3, matWhite,
      wing.x, wingH / 2, wingZ - wingDepth / 2 + 0.15);

    // Tầng 1 (trệt): vách kính lớn nhìn ra sân trong
    placeBox(mainB, THREE, 0.15, UNDER_H - 0.2, wingDepth - 0.6, matGlassDark,
      wing.x + wing.innerSide * (wingW / 2 - 0.1), UNDER_H / 2, wingZ);

    // Dầm sàn các tầng (Floor slabs at y = 4.8 m, y = 8.8 m, và mái y = 13.0 m)
    [UNDER_H, 8.8, wingH].forEach(fy => {
      placeBox(mainB, THREE, wingW, 0.3, wingDepth, matWhite, wing.x, fy, wingZ);
    });

    // Tầng 2 & 3: Hành lang mở (open gallery) nhìn xuống sân trong
    [UNDER_H, 8.8].forEach(fy => {
      const railY = fy + 0.3 + 0.55; // Tâm lan can cao 1.1 m
      const edgeX = wing.x + wing.innerSide * (wingW / 2 - 0.08);

      // Tay vịn lan can kim loại thanh mảnh
      placeBox(mainB, THREE, 0.1, 0.1, wingDepth - 0.6, matTrellis,
        edgeX, fy + 0.3 + 1.1, wingZ);
      // Tấm lan can đan thanh dọc (balustrade / railing)
      placeBox(mainB, THREE, 0.05, 0.9, wingDepth - 0.6, matWindow,
        edgeX, railY, wingZ);

      // Cột trắng chịu lực thanh mảnh ở mép hành lang
      for (let cz = wingZ - wingDepth / 2 + 1.5; cz <= wingZ + wingDepth / 2 - 0.5; cz += 2.4) {
        placeBox(mainB, THREE, 0.25, 3.6, 0.25, matWhite,
          edgeX - wing.innerSide * 0.15, fy + 0.3 + 1.8, cz);
      }

      // Dây leo / mảng xanh rủ xuống từ lan can các tầng (đúng đặc trưng ảnh nho-gray-04)
      for (let vz = wingZ - wingDepth / 2 + 1.2; vz <= wingZ + wingDepth / 2 - 1.0; vz += 2.4) {
        const vineMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 1.2, 0.8),
          matLeaf2
        );
        vineMesh.position.set(edgeX + wing.innerSide * 0.05, fy + 0.1, vz);
        mainB.add(vineMesh);
      }
    });
  });

  // --- 2b. Khối trước (Front Block: 55×22×15 m) ---
  // Tường bắc (phía trong)
  placeBox(mainB, THREE, MB_W, MB_H, 0.4, matMetal, 0, MB_H / 2, -MB_D / 2);
  // Đầu hồi đông
  placeBox(mainB, THREE, 0.4, MB_H, MB_D, matMetal, MB_W / 2, MB_H / 2, 0);
  // Đầu hồi tây: trệt tường trắng + kính; tầng trên ốp kim loại
  placeBox(mainB, THREE, 0.4, 3.8, MB_D, matWhite, -MB_W / 2, 1.9, 0);
  placeBox(mainB, THREE, 0.2, 2.6, MB_D * 0.7, matGlass, -MB_W / 2 - 0.1, 2.0, 0);
  placeBox(mainB, THREE, 0.4, MB_H - 3.8, MB_D, matMetal, -MB_W / 2, 3.8 + (MB_H - 3.8) / 2, 0);
  // Mái khối trước
  placeBox(mainB, THREE, MB_W + 0.6, 0.4, MB_D + 0.6, matDarkRoof, 0, MB_H + 0.2, 0);
  // Gờ viền trắng quanh mái khối trước (v2.7): 4 thanh nhô lên 0.5 m, tạo đường nét sắc quanh mái
  placeBox(mainB, THREE, MB_W + 0.9, 0.5, 0.3, matWhite, 0, MB_H + 0.45, MB_D / 2 + 0.2);
  placeBox(mainB, THREE, MB_W + 0.9, 0.5, 0.3, matWhite, 0, MB_H + 0.45, -MB_D / 2 - 0.2);
  placeBox(mainB, THREE, 0.3, 0.5, MB_D + 0.1, matWhite, MB_W / 2 + 0.2, MB_H + 0.45, 0);
  placeBox(mainB, THREE, 0.3, 0.5, MB_D + 0.1, matWhite, -MB_W / 2 - 0.2, MB_H + 0.45, 0);

  // Hộp đỏ trên mái khối trước
  const redBoxW = 7.5, redBoxH = 3.0, redBoxD = 5.5;
  placeBox(mainB, THREE, redBoxW, redBoxH, redBoxD, matAccentRed,
    -8.0, MB_H + redBoxH / 2 + 0.2, 1.0);

  // Thiết bị HVAC trắng + ống bạc trên mái
  placeBox(mainB, THREE, 5.0, 2.4, 3.2, matWhite, 6.0, MB_H + 1.2 + 0.2, 3.0);
  placeBox(mainB, THREE, 4.0, 2.0, 2.5, matWhite, 12.0, MB_H + 1.0 + 0.2, 2.0);

  const duct1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 8.0, 16), matSilverDuct);
  duct1.rotation.z = Math.PI / 2;
  duct1.position.set(8.0, MB_H + 0.6, 1.0);
  duct1.castShadow = true;
  mainB.add(duct1);

  const duct2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6.0, 16), matSilverDuct);
  duct2.rotation.x = Math.PI / 2;
  duct2.position.set(13.0, MB_H + 0.6, -1.0);
  duct2.castShadow = true;
  mainB.add(duct2);

  const stack1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.2, 16), matSilverDuct);
  stack1.position.set(4.0, MB_H + 1.1 + 0.2, 3.0);
  stack1.castShadow = true;
  mainB.add(stack1);

  placeBox(mainB, THREE, 4.5, 2.2, 3.0, matWhite, backOffsetX - 10.0, MB_BACK_H + 1.1 + 0.2, backOffsetZ + 2.0);

  // --- 2c. Mặt nam (South Facade) — Tầng trệt kính + cột + giàn leo + hộp xanh; Tầng trên cắt lỗ thật 2 hốc cam ---
  const southZ = MB_D / 2; // local z = 11.0

  // 1) Cửa vào thật (West end ground level):
  const DOOR_X = -15.5;
  const DOOR_W = 3.2;
  const DOOR_H = 3.0;

  // Mái hiên lối vào v2.7: sâu 1.4 m, viền đen mỏng ở mép, hai cột tròn mảnh đỡ phía trước (cao ~3 m, trên đầu người)
  placeBox(mainB, THREE, DOOR_W + 1.2, 0.2, 1.4, matWhite, DOOR_X, DOOR_H + 0.12, southZ + 0.7);
  placeBox(mainB, THREE, DOOR_W + 1.3, 0.06, 1.5, matCharcoal, DOOR_X, DOOR_H + 0.25, southZ + 0.7);
  for (const cs of [-1, 1]) {
    const doorCol = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, DOOR_H + 0.05, 12), matWhite);
    doorCol.position.set(DOOR_X + cs * (DOOR_W / 2 + 0.6), (DOOR_H + 0.05) / 2, southZ + 1.3);
    doorCol.castShadow = true;
    mainB.add(doorCol);
  }
  placeBox(mainB, THREE, 0.15, DOOR_H, 0.4, matWhite, DOOR_X - DOOR_W / 2 - 0.08, DOOR_H / 2, southZ + 0.08);
  placeBox(mainB, THREE, 0.15, DOOR_H, 0.4, matWhite, DOOR_X + DOOR_W / 2 + 0.08, DOOR_H / 2, southZ + 0.08);
  placeBox(mainB, THREE, DOOR_W * 0.46, DOOR_H - 0.2, 0.08, matDoor, DOOR_X - DOOR_W * 0.24, DOOR_H / 2, southZ + 0.05);
  placeBox(mainB, THREE, DOOR_W * 0.46, DOOR_H - 0.2, 0.08, matDoor, DOOR_X + DOOR_W * 0.24, DOOR_H / 2, southZ + 0.05);
  placeBox(mainB, THREE, 0.04, 0.4, 0.08, matSilverDuct, DOOR_X - 0.15, 1.3, southZ + 0.12);
  placeBox(mainB, THREE, 0.04, 0.4, 0.08, matSilverDuct, DOOR_X + 0.15, 1.3, southZ + 0.12);

  // Mảng đỏ và tường trắng tầng trệt ở đầu tây:
  placeBox(mainB, THREE, 8.0, 3.8, 0.35, matAccentRed, -23.5, 1.9, southZ + 0.08);
  placeBox(mainB, THREE, 2.4, 3.8, 0.35, matWhite, -18.3, 1.9, southZ + 0.08);

  // 2) SỬA LỖI 2 — Tầng trệt phía phải cửa: DẢI KÍNH DÀI + CỘT TRẮNG + GIÀN LEO + HỘP XANH
  const colStart = DOOR_X + DOOR_W / 2 + 0.4; // ≈ -13.5 m
  const greenBoxW = 5.0;                      // Hộp xanh chiếm x từ 22.5 đến 27.5
  const glassEnd = MB_W / 2 - greenBoxW;      // = 22.5 m
  const glassW = glassEnd - colStart;         // = 36.0 m

  // Dải kính dài thụt nhẹ vào sau hàng cột (z = southZ - 0.2 = 10.8)
  placeBox(mainB, THREE, glassW, 3.6, 0.15, matGlassGround,
    (colStart + glassEnd) / 2, 1.8, southZ - 0.15);
  // Khung đố kính kim loại
  for (let kx = colStart; kx <= glassEnd; kx += 4.5) {
    placeBox(mainB, THREE, 0.1, 3.6, 0.2, matCharcoal, kx, 1.8, southZ - 0.15);
  }
  placeBox(mainB, THREE, glassW, 0.1, 0.2, matCharcoal, (colStart + glassEnd) / 2, 1.8, southZ - 0.15);

  // Hàng cột trắng thanh mảnh dọc mặt đứng tầng trệt
  const colSpacing = 4.5;
  for (let cx = colStart; cx <= glassEnd; cx += colSpacing) {
    const colMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 3.8, 16),
      matWhite
    );
    colMesh.position.set(cx, 1.9, southZ + 0.05);
    colMesh.castShadow = true;
    colMesh.receiveShadow = true;
    mainB.add(colMesh);
  }

  // Giàn leo (pergola/trellis) che nắng vươn ra trước hàng cột (từ z=11.0 đến z=12.8)
  const trellisDepth = 1.8;
  const trellisY = 3.7;
  // Dầm dọc đỡ giàn leo phía ngoài
  placeBox(mainB, THREE, glassW + 0.5, 0.15, 0.2, matTrellis,
    (colStart + glassEnd) / 2, trellisY, southZ + trellisDepth);
  // Các thanh lam ngang (cross slats)
  for (let tx = colStart; tx <= glassEnd; tx += 1.5) {
    placeBox(mainB, THREE, 0.08, 0.1, trellisDepth, matTrellis,
      tx, trellisY + 0.05, southZ + trellisDepth / 2);
  }
  // Dây leo / mảng xanh bám trên giàn leo (tạo nét hữu cơ đúng ảnh drone)
  const foliageMats = [matLeaf2, matLeaf3];
  for (let fi = 0; fi < 6; fi++) {
    const fx = colStart + 2.5 + fi * 5.5;
    const fMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.35, 1.2),
      foliageMats[fi % foliageMats.length]
    );
    fMesh.position.set(fx, trellisY + 0.15, southZ + trellisDepth * 0.55);
    fMesh.castShadow = true;
    mainB.add(fMesh);
  }

  // Hộp điểm nhấn XANH TEAL ở đầu hồi phải (East corner ground accent)
  const greenBoxX = glassEnd + greenBoxW / 2; // = 25.0
  placeBox(mainB, THREE, greenBoxW, 3.8, 0.45, matAccentGreen,
    greenBoxX, 1.9, southZ + 0.1);
  // Khung diềm hộp xanh
  placeBox(mainB, THREE, greenBoxW + 0.1, 0.12, 0.5, matWhite,
    greenBoxX, 3.8, southZ + 0.1);

  // 3) SỬA LỖI 2 & 3 — 2 HỐC CAM XẾP THEO CHIỀU DỌC + CẮT LỖ THẬT TRÊN MẶT TIỀN
  // Tấm facade kim loại xám bạc (facade-main-gray.jpg crop từ drone nho-gray-02)
  // v2.8: sáng hơn cho mặt nam tầng trên (ảnh drone sáng hơn): metalness 0.25 → 0.12, thêm phát sáng nền rất nhẹ.
  // CHỈ áp dụng cho các panel facade (không đổi southFill, không làm cháy các mặt nam khác). Chưa kiểm chứng bằng render.
  const mainFacadeMat = new THREE.MeshStandardMaterial({
    map: facadeGrayTex,
    roughness: 0.5,
    metalness: 0.12,
    emissive: 0x3b4046,
    emissiveIntensity: 0.3
  });

  // Tọa độ 2 hốc cam xếp dọc, KHỚP mảng cam đo trong facade-main-gray.jpg (1024×209, vòng sửa 4).
  // Đo bằng mắt từ ảnh (PIL không chạy được trong phiên này — cần đo lại để chốt):
  //   mảng cam trên: px x≈463..535, y≈40..85   → u ≈ 0.452..0.522, v ≈ 0.593..0.809
  //   mảng cam dưới: px x≈463..535, y≈130..175 → u ≈ 0.452..0.522, v ≈ 0.163..0.379
  // Quy đổi sang mặt tiền 3D (x local -27.5..27.5 ⇒ u = (x+27.5)/55; y 3.8..15.0 ⇒ v = (y-3.8)/11.2):
  //   tâm x ≈ -0.7 m, rộng ≈ 3.8 m; hốc trên y 10.45..12.85, hốc dưới y 5.65..8.05 (đều cao 2.4 m).
  // Cả hai hốc thụt sâu 0.8 m vào bên trong.
  // v2.8: đợt này KHÔNG đo lại bằng PIL được (không chạy được trong phiên). Ước lượng bằng mắt từ ảnh texture hiện tại:
  // mảng cam trải px ≈ 463..535 trên 1024 → tâm ≈ -0.70 m, rộng ≈ 3.85 m (số cũ -0.44 / 3.1 làm lộ viền cam hai bên).
  // ĐÃ CHỐT bằng đo PIL sau đợt sửa (subagent kiểm chứng): ngưỡng lỏng upper x 463..534 → CX -0.73 m / W 3.81 m,
  // lower x 470..534 → CX -0.54 m / W 3.44 m; lõi đậm (ngưỡng chặt) hẹp hơn: CX ≈ -0.40 m / W ≈ 2.85 m.
  // Số -0.70 / 3.85 khớp biên đầy đủ của mảng cam (kể cả viền mềm), giữ nguyên.
  const NICHE_CX = -0.70;
  const NICHE_W = 3.85;
  const NICHE_DEPTH = 0.8;

  const N_UPPER = { x0: NICHE_CX - NICHE_W / 2, x1: NICHE_CX + NICHE_W / 2, y0: 10.45, y1: 12.85 };
  const N_LOWER = { x0: NICHE_CX - NICHE_W / 2, x1: NICHE_CX + NICHE_W / 2, y0: 5.65, y1: 8.05 };

  // Hàm tạo panel facade phẳng có UV khớp chuẩn với toàn bộ mặt tiền (x: -27.5..27.5, y: 3.8..15.0)
  function createFacadePanel(x0, x1, y0, y1, zPos) {
    const pw = x1 - x0, ph = y1 - y0;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const geo = new THREE.PlaneGeometry(pw, ph);
    const uvs = geo.attributes.uv;
    const u0 = (x0 - (-MB_W / 2)) / MB_W;
    const u1 = (x1 - (-MB_W / 2)) / MB_W;
    const v0 = (y0 - 3.8) / (MB_H - 3.8);
    const v1 = (y1 - 3.8) / (MB_H - 3.8);
    uvs.setXY(0, u0, v1);
    uvs.setXY(1, u1, v1);
    uvs.setXY(2, u0, v0);
    uvs.setXY(3, u1, v0);
    uvs.needsUpdate = true;
    const mesh = new THREE.Mesh(geo, mainFacadeMat);
    mesh.position.set(cx, cy, zPos);
    mesh.receiveShadow = true;
    return mesh;
  }

  const fz = southZ + 0.05;
  // Chia mặt tiền thành các dải chữ nhật bao quanh 2 hốc (không chồng lấn, UV liên tục theo toạ độ thế giới mặt tiền).
  // Hốc sắp theo y tăng dần: dải ngang đầy đủ chiều rộng xen kẽ dải hai bên hốc.
  const FAC_Y0 = 3.8;
  const holes = [N_LOWER, N_UPPER].sort((a, b) => a.y0 - b.y0);
  const facadeBands = [];
  let yCur = FAC_Y0;
  for (const h of holes) {
    facadeBands.push([-MB_W / 2, MB_W / 2, yCur, h.y0]);     // dải ngang dưới hốc
    facadeBands.push([-MB_W / 2, h.x0, h.y0, h.y1]);          // dải bên trái hốc
    facadeBands.push([h.x1, MB_W / 2, h.y0, h.y1]);           // dải bên phải hốc
    yCur = h.y1;
  }
  facadeBands.push([-MB_W / 2, MB_W / 2, yCur, MB_H]);        // dải đỉnh trên hốc trên
  for (const [x0, x1, y0, y1] of facadeBands) {
    if (x1 - x0 > 1e-3 && y1 - y0 > 1e-3) mainB.add(createFacadePanel(x0, x1, y0, y1, fz));
  }

  // Hàm dựng hình học 3D thật cho hốc lõm (thành hốc màu cam + đáy kính sẫm thụt sâu)
  function buildRecessedNiche(spec, depth) {
    const nw = spec.x1 - spec.x0;
    const nh = spec.y1 - spec.y0;
    const ncx = (spec.x1 + spec.x0) / 2;
    const ncy = (spec.y1 + spec.y0) / 2;
    const nicheGroup = new THREE.Group();

    // 1) Đáy hốc kính sẫm thụt sâu 0.8 m vào trong
    placeBox(nicheGroup, THREE, nw, nh, 0.1, matGlassDark, 0, 0, -depth + 0.05);

    // 2) 4 mặt thành hốc màu cam rực rỡ nhìn thấy rõ chiều sâu
    placeBox(nicheGroup, THREE, nw, 0.12, depth, matAccentOrange, 0, nh / 2 - 0.06, -depth / 2);  // trần trên
    placeBox(nicheGroup, THREE, nw, 0.15, depth, matAccentOrange, 0, -nh / 2 + 0.075, -depth / 2); // bậu dưới
    placeBox(nicheGroup, THREE, 0.12, nh, depth, matAccentOrange, -nw / 2 + 0.06, 0, -depth / 2);  // má trái
    placeBox(nicheGroup, THREE, 0.12, nh, depth, matAccentOrange, nw / 2 - 0.06, 0, -depth / 2);   // má phải

    // 3) Gờ viền cam sắc nét nhô nhẹ 0.06 m ra khỏi mặt facade
    placeBox(nicheGroup, THREE, nw + 0.25, 0.12, 0.08, matAccentOrange, 0, nh / 2 + 0.06, 0.04);
    placeBox(nicheGroup, THREE, nw + 0.25, 0.14, 0.12, matAccentOrange, 0, -nh / 2 - 0.07, 0.06);
    placeBox(nicheGroup, THREE, 0.12, nh + 0.2, 0.08, matAccentOrange, -nw / 2 - 0.06, 0, 0.04);
    placeBox(nicheGroup, THREE, 0.12, nh + 0.2, 0.08, matAccentOrange, nw / 2 + 0.06, 0, 0.04);

    nicheGroup.position.set(ncx, ncy, southZ + 0.05);
    return nicheGroup;
  }

  // Dựng 2 hốc cam xếp dọc (Hốc dưới tầng 2-3, Hốc trên tầng 4)
  mainB.add(buildRecessedNiche(N_LOWER, NICHE_DEPTH));
  mainB.add(buildRecessedNiche(N_UPPER, NICHE_DEPTH));

  // 4) Dải bồn hoa / cây thấp sát chân tường mặt nam (chừa sạch lối cửa 3.2 m):
  const bushLeftW = (-DOOR_X - DOOR_W / 2) - 2.0;
  if (bushLeftW > 0.5) {
    placeBox(mainB, THREE, bushLeftW, 0.5, 1.2, matLeaf2,
      -MB_W / 2 + bushLeftW / 2 + 1.0, 0.25, southZ + 0.9);
  }
  const bushRightStartX = DOOR_X + DOOR_W / 2 + 0.8;
  const bushRightW = (MB_W / 2) - bushRightStartX - 2.0;
  if (bushRightW > 0.5) {
    placeBox(mainB, THREE, bushRightW, 0.5, 1.2, matLeaf2,
      bushRightStartX + bushRightW / 2, 0.25, southZ + 0.9);
  }

  // Vỉa hè trước tòa chính
  const mainSidewalk = new THREE.Mesh(new THREE.PlaneGeometry(MB_W + 4, 6), matConcrete);
  mainSidewalk.rotation.x = -Math.PI / 2;
  mainSidewalk.position.set(0, 0.03, southZ + 3.0);
  mainSidewalk.receiveShadow = true;
  mainB.add(mainSidewalk);

  mainB.position.set(-59, 0, 13); // v5: tâm khối trước theo bảng #1
  group.add(mainB);
  buildings.mainBuilding = mainB;

  // =====================================================
  // (3) WHITE CLUSTER — 4 TÒA NHÀ TRẮNG TRUNG TÂM
  // =====================================================
  // Các khối cụm trắng đặt TUYỆT ĐỐI (group gốc, không còn group (10,0,20) và không còn tòa SW/SE của v2.8).
  // Cầu đỏ (x = 14, z ≈ 46) nằm phía nam cụm trắng, qua kênh (xem redBridgeZ bên trên).
  const whiteCluster = new THREE.Group();
  whiteCluster.name = 'white-cluster';

  // v5b (mục 2): 8 khối theo bảng #3–#10, TÂM theo bảng. Số tầng ước từ bảng ("2–3", "4–5", "5–6" tầng).
  // Bảng TỰ MÂU THUẪN ở cụm này (tính từ số trong bảng, không đo lại; kiểm lại bằng tay):
  //  - Tháp #8–#10 (bảng 14 m rộng, tâm x 28/38/47 cách 9–10 m) → chồng nhau 4–5 m. Giữ TÂM theo bảng,
  //    thu RỘNG còn 8.5 m (không chồng). Lệch so với bảng: 0 m về tâm; rộng 14 → 8.5 m.
  //  - #7 (bảng tâm (10,−48) rộng 30 → x −5…25) chồng #6 (x ≤ 1.5) và tháp #8 (x ≥ 23.75): đặt tâm (12,−48),
  //    rộng 20 (x 2…22). Lệch: +2 m đông; rộng 30 → 20.
  //  - #6 đúng bảng (tâm (−17,−50), 37×23, sâu 23 m theo yêu cầu) → chồng #4 ở x −35.5…−25 → #4 rút còn
  //    rộng 24 (tâm x −47.5, x −59.5…−35.5), sát mép tây của #6 không chồng. Lệch #4: tâm −5.5 m tây; rộng 34 → 24.
  const whiteBuildings = [
    { x: 4, z: -80, w: 38, d: 17, h: 11.4 },    // #3 khối bắc thấp (3 tầng) — đúng bảng
    { x: -47.5, z: -44, w: 24, d: 16, h: 19 },  // #4 khối tây (5 tầng; bảng (−42,−40) 34×24 → rút; z −44 để mép bắc kênh không chạm góc tây-nam, xem trên)
    { x: -23, z: -25, w: 34, d: 9, h: 15.2 },   // #5 khối giữa-tây (4 tầng; bảng d 17 → 9, nhường chỗ cho kênh)
    { x: -17, z: -50, w: 37, d: 23, h: 19 },    // #6 khối giữa-bắc (5 tầng; ĐÚNG BẢNG 37×23 tại (−17,−50))
    { x: 12, z: -48, w: 20, d: 22, h: 15.2 },   // #7 khối đông-bắc (4 tầng; bảng (10,−48) 30×22 → xem trên)
    { x: 28, z: -45, w: 8.5, d: 22, h: 22.8 },  // #8 tháp đông 1 (6 tầng; bảng tâm x 28, rộng 14 → 8.5)
    { x: 38, z: -45, w: 8.5, d: 22, h: 22.8 },  // #9 tháp đông 2 (bảng tâm x 38, rộng 14 → 8.5)
    // #10 tháp đông 3: bảng (47,−44). v6 (đợt 3, mục 2): dời 4 m NAM → z −40 (x giữ 47). Vành đường chạy đè góc
    // đông-bắc tháp (~6 m); ring dời bắc 2.5 m + tháp dời nam 4 m (cả hai ≤ 5 m) là tổ hợp nhỏ nhất hết chồng,
    // khe còn ≥ 0.4 m. Sân bóng rổ (ước) phải dời theo 2 m (xem bên dưới).
    { x: 47, z: -40, w: 8.5, d: 22, h: 22.8 },  // #10 tháp đông 3 (bảng (47,−44); code cũ x 58 lệch 11 m → đã dời về 47; v6: z −44 → −40)
  ];

  whiteBuildings.forEach((wb) => {
    const wbGroup = new THREE.Group();

    placeBox(wbGroup, THREE, wb.w, wb.h, wb.d, matWhite, 0, wb.h / 2, 0);

    const floors = Math.round(wb.h / 3.8);
    const bays = Math.round(wb.w / 4);
    {
      const wGeo = new THREE.BoxGeometry(2.0, 1.4, 0.15);
      const totalWins = floors * bays;
      const winInst = new THREE.InstancedMesh(wGeo, matWindow, totalWins);
      winInst.receiveShadow = true;
      const dm = new THREE.Object3D();
      let wi = 0;
      for (let f = 0; f < floors; f++) {
        for (let b = 0; b < bays; b++) {
          const wx = -wb.w / 2 + 2 + (b + 0.5) * ((wb.w - 4) / bays);
          const wy = (f + 0.5) * (wb.h / floors) + 0.5;
          dm.position.set(wx, wy, wb.d / 2 + 0.05);
          dm.updateMatrix();
          winInst.setMatrixAt(wi++, dm.matrix);
        }
      }
      winInst.instanceMatrix.needsUpdate = true;
      wbGroup.add(winInst);
    }

    placeBox(wbGroup, THREE, wb.w, 0.3, wb.d, matWhite, 0, wb.h + 0.15, 0);

    for (let f = 0; f < floors; f++) {
      const wy = (f + 0.5) * (wb.h / floors) + 0.5;
      placeBox(wbGroup, THREE, wb.w * 0.8, 1.2, 0.1, matWindow,
        0, wy, -wb.d / 2 - 0.05);
    }

    wbGroup.position.set(wb.x, 0, wb.z);
    whiteCluster.add(wbGroup);
  });

  whiteCluster.position.set(0, 0, 0);
  group.add(whiteCluster);
  buildings.whiteCluster = whiteCluster;

  // =====================================================
  // (4) LECTURE HALL — giảng đường + mái vòm oval
  // =====================================================
  const lectureHall = new THREE.Group();
  lectureHall.name = 'lecture-hall';

  // v5 (bảng #11): hội trường 50×20 m, tâm (14, 11); mái 50 m (v5b: giữ nguyên, đã kiểm tra không chồng)
  const LH_W = 50, LH_D = 20, LH_H = 14;
  placeBox(lectureHall, THREE, LH_W, LH_H, LH_D, matGray, 0, LH_H / 2, 0);

  for (let cx = -LH_W / 2 + 4; cx <= LH_W / 2 - 4; cx += 6) {
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.4, LH_H - 1, 8),
      matWhite
    );
    col.position.set(cx, (LH_H - 1) / 2, LH_D / 2 + 1.5);
    col.castShadow = true;
    lectureHall.add(col);
  }
  placeBox(lectureHall, THREE, LH_W, 0.5, 4, matWhite, 0, LH_H - 0.5, LH_D / 2 + 1.5);
  placeBox(lectureHall, THREE, LH_W - 2, LH_H - 3, 0.2, matGlass, 0, LH_H / 2 + 0.5, LH_D / 2 + 0.1);
  placeBox(lectureHall, THREE, LH_W, 0.5, LH_D, matDarkRoof, 0, LH_H + 0.25, 0);

  lectureHall.position.set(14, 0, 11); // v5: tâm theo bảng #11
  group.add(lectureHall);
  buildings.ovalHall = lectureHall;

  // Vòm oval trắng (v5, bảng #12): đế 34×26 m, tâm (43, 37), ĐÔNG kênh (cũ đặt sai phía tây tòa xám).
  // Vòm cao ~9 m trên đế; nửa ellipsoid bán trục 17 (đông–tây) × 13 (bắc–nam).
  const ovalGroup = new THREE.Group();
  ovalGroup.name = 'oval-dome';
  const ovalDome = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), matOvalWhite);
  ovalDome.scale.set(17, 9, 13);
  ovalDome.position.set(0, 2, 0);
  ovalDome.castShadow = true;
  ovalDome.receiveShadow = true;
  ovalGroup.add(ovalDome);
  const ovalBase = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 40), matGray);
  ovalBase.scale.set(17, 1, 13);
  ovalBase.position.set(0, 1, 0);
  ovalBase.castShadow = true;
  ovalBase.receiveShadow = true;
  ovalGroup.add(ovalBase);
  ovalGroup.position.set(43, 0, 37);
  group.add(ovalGroup);

  // =====================================================
  // (5) SPORTS AREA — khu thể thao
  // =====================================================
  // v5b (mục 2 + 3): KHU THỂ THAO xếp lại. Bảng (#14–#21) TỰ MÂU THUẪN: khán đài, sân, hồ, hội trường chồng nhau
  // và có chỗ đè lên đường chạy. Giữ đúng vị trí tương đối theo drone: đường chạy PHÍA BẮC khu, hồ bơi + sân ở phía đông.
  // Đường chạy: bảng #14 — oval 75×38 m, tâm bảng (74, −64) (code cũ đặt −75, lệch 11 m về bắc).
  // v6 (đợt 3, mục 2): dời 2.5 m BẮC → tâm (74, −66.5), cùng với tháp #10 dời nam 4 m (xem bên dưới) để hết chồng
  // góc đông-bắc tháp #10 (~6 m). Mép bắc ring còn cách tấm pin mặt trời (mép nam z −86.5) 1.0 m — không chồng;
  // khe đi bộ giữa mép nam ring và khán đài rộng ~8.5 m (trước 6 m).
  // Chồng còn lại (ĐÃ BÁO, không sửa): góc đông-nam ring (x ≈ 88…99, z ≈ −52.5…−49) chồng góc tây-bắc nhà thi đấu
  // (bảng #16 tâm (110,−43)) ~3.5 m (trước ~6 m). Thử: dời nhà thi đấu 5 m đông còn chồng ~2.2 m; dời nam (cần ~3.5 m)
  // thì chồng vành hồ bơi và sân nhóm 2. Không hết chồng trong ràng buộc 5 m → giữ nguyên.
  const TRACK_X = 74, TRACK_Z = -66.5;
  const trackShape = new THREE.Shape();
  trackShape.absellipse(0, 0, 37.5, 19, 0, Math.PI * 2, false, 0);
  const trackHole = new THREE.Path();
  trackHole.absellipse(0, 0, 30.5, 12, 0, Math.PI * 2, true, 0);
  trackShape.holes.push(trackHole);

  const trackGeo = new THREE.ShapeGeometry(trackShape, 48);
  trackGeo.rotateX(-Math.PI / 2);
  const trackMesh = new THREE.Mesh(trackGeo, new THREE.MeshStandardMaterial({ map: trackTex, roughness: 0.8, metalness: 0.0 }));
  trackMesh.position.set(TRACK_X, 0.03, TRACK_Z);
  trackMesh.receiveShadow = true;
  group.add(trackMesh);

  // Sân cỏ trong đường chạy (bảng: trong có sân bóng đá)
  const infieldGeo = new THREE.ShapeGeometry(new THREE.Shape().absellipse(0, 0, 30.5, 12, 0, Math.PI * 2, false, 0), 40);
  infieldGeo.rotateX(-Math.PI / 2);
  const infield = new THREE.Mesh(infieldGeo, matGrass);
  infield.position.set(TRACK_X, 0.02, TRACK_Z);
  infield.receiveShadow = true;
  group.add(infield);

  // v5b — Sân nhỏ xanh nhóm 1 & 2 (bảng #17, #18): mỗi nhóm 33×16 m, KHÔNG phải tennis tiêu chuẩn.
  // Xếp lại trong khu thể thao (bảng tâm (86,−35) và (101,−24) chồng khán đài/hồ/nhà thi đấu):
  // hai nhóm nằm cạnh nhau ở phía đông-nam, z −11…5, sát mép bắc tòa mái xanh (z 5) — không chồng.
  const tennisMat = new THREE.MeshStandardMaterial({ map: tennisTex, roughness: 0.75, metalness: 0.0 });
  for (const [cx, cz] of [[71, -3], [104.5, -3]]) {
    const court = new THREE.Mesh(new THREE.PlaneGeometry(33, 16), tennisMat);
    court.rotation.x = -Math.PI / 2;
    court.position.set(cx, 0.04, cz);
    court.receiveShadow = true;
    group.add(court);
  }
  // Sân bóng rổ (bảng #19, ước): bảng (110,−19) chồng hồ bơi và sân nhóm 2 → đặt phía tây khu, x 21…51 (ước).
  const bballMat = new THREE.MeshStandardMaterial({ color: 0x3a7fb8, roughness: 0.75, metalness: 0.0 });
  const bball = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), bballMat);
  bball.rotation.x = -Math.PI / 2;
  // v6 (mục 2): dời 2 m NAM → z −20 (vị trí này chỉ là ước) để mép nam tháp #10 mới (z −29) không chạm sân.
  bball.position.set(36, 0.04, -20);
  bball.receiveShadow = true;
  group.add(bball);

  // Khán đài có mái (bảng #15): 33×18 m. Bảng (85,−53) nằm TRONG vành đường chạy → dời về phía nam đường chạy,
  // tâm (70.5, −30), mép bắc z −39 để còn lối đi 6 m giữa đường chạy và khán đài (tới neo "Sân chạy" (74,−40)).
  const standGroup = new THREE.Group();
  standGroup.name = 'stand';
  placeBox(standGroup, THREE, 33, 6, 18, matGray, 0, 3, 0);
  placeBox(standGroup, THREE, 35, 0.8, 20, matDarkRoof, 0, 6.4, 0);
  standGroup.position.set(70.5, 0, -30);
  group.add(standGroup);

  // Nhà thi đấu mái tối (bảng #16): 43×19 m, tâm (110, −43) ĐÚNG BẢNG (code cũ (123,−49) lệch 13 m đông, 6 m bắc).
  // Mâu thuẫn: góc tây-bắc chồng vành đường chạy (xem ghi chú đường chạy). Hồ bơi dời về nam để không chồng.
  const sportsHall = new THREE.Group();
  sportsHall.name = 'sports-hall';
  placeBox(sportsHall, THREE, 43, 12, 19, matWhite, 0, 6, 0);
  placeBox(sportsHall, THREE, 45, 1, 21, matDarkRoof, 0, 12.5, 0);
  placeBox(sportsHall, THREE, 43, 2, 0.2, matWindow, 0, 10, 9.6);
  placeBox(sportsHall, THREE, 43, 2, 0.2, matWindow, 0, 10, -9.6);

  sportsHall.position.set(110, 0, -43);
  group.add(sportsHall);
  buildings.sportsHall = sportsHall;

  // =====================================================
  // (6) POOL — hồ bơi
  // =====================================================
  const poolMat = new THREE.MeshStandardMaterial({ map: poolTex, roughness: 0.1, metalness: 0.05 });
  // v5b (bảng #20): hồ 24×11 m, bảng tâm (104, −34) chồng nhà thi đấu (bảng z −52.5…−33.5). Dời về nam:
  // tâm (102, −25), mép bắc của sàn (z −33.5) chạm mép nam nhà thi đấu. Lệch so với bảng: +9 m nam, −2 m tây.
  // Sàn bao quanh 28×17 m (vành 2 m).
  const POOL_X = 102, POOL_Z = -25;
  const poolSurface = new THREE.Mesh(new THREE.PlaneGeometry(24, 11), poolMat);
  poolSurface.rotation.x = -Math.PI / 2;
  poolSurface.position.set(POOL_X, 0.05, POOL_Z);
  poolSurface.receiveShadow = true;
  group.add(poolSurface);

  const poolDeckShape = new THREE.Shape();
  poolDeckShape.moveTo(-14, -8.5);
  poolDeckShape.lineTo(14, -8.5);
  poolDeckShape.lineTo(14, 8.5);
  poolDeckShape.lineTo(-14, 8.5);
  poolDeckShape.lineTo(-14, -8.5);
  const poolHole = new THREE.Path();
  poolHole.moveTo(-12, -5.5);
  poolHole.lineTo(12, -5.5);
  poolHole.lineTo(12, 5.5);
  poolHole.lineTo(-12, 5.5);
  poolHole.lineTo(-12, -5.5);
  poolDeckShape.holes.push(poolHole);
  const poolDeckGeo = new THREE.ShapeGeometry(poolDeckShape);
  poolDeckGeo.rotateX(-Math.PI / 2);
  const poolDeck = new THREE.Mesh(poolDeckGeo, matConcrete);
  poolDeck.position.set(POOL_X, 0.06, POOL_Z);
  poolDeck.receiveShadow = true;
  group.add(poolDeck);

  // =====================================================
  // (7) COURTYARD BUILDING
  // =====================================================
  const courtyardB = new THREE.Group();
  courtyardB.name = 'courtyard-building';

  // v5 (bảng #24): tòa trắng chữ U 39×40 m, tâm (91, 68), sân trong đỏ/cam
  const CB_W = 39, CB_D = 40, CB_H = 18;
  const FLOOR_H = 3.6;
  placeBox(courtyardB, THREE, CB_W, CB_H, 6, matWhite, 0, CB_H / 2, -CB_D / 2 + 3);
  placeBox(courtyardB, THREE, CB_W, CB_H, 6, matWhite, 0, CB_H / 2, CB_D / 2 - 3);
  placeBox(courtyardB, THREE, 6, CB_H, CB_D, matWhite, -CB_W / 2 + 3, CB_H / 2, 0);

  for (const wing of [{ z: -CB_D / 2 + 3, dir: 1 }, { z: CB_D / 2 - 3, dir: -1 }]) {
    for (let f = 0; f < 5; f++) {
      const wy = (f + 0.5) * FLOOR_H + 0.3;
      for (let bx = -CB_W / 2 + 5; bx < CB_W / 2 - 3; bx += 5) {
        placeBox(courtyardB, THREE, 2.5, 2.0, 1.2, matWhite,
          bx, wy, wing.z + wing.dir * 3.6);
        placeBox(courtyardB, THREE, 2.2, 1.6, 0.1, matWindow,
          bx, wy, wing.z + wing.dir * 4.3);
      }
    }
  }

  const cfGeo = new THREE.PlaneGeometry(CB_W - 12, CB_D - 12);
  const cfMat = new THREE.MeshStandardMaterial({ color: 0xb04030, roughness: 0.8, metalness: 0.0 });
  const courtFloor = new THREE.Mesh(cfGeo, cfMat);
  courtFloor.rotation.x = -Math.PI / 2;
  courtFloor.position.set(3, 0.04, 0);
  courtFloor.receiveShadow = true;
  courtyardB.add(courtFloor);

  courtyardB.position.set(91, 0, 68);
  group.add(courtyardB);
  buildings.courtyardBuilding = courtyardB;

  // Tòa trắng dài + tòa mái xanh + tòa nâu sẫm (v5, bảng #22, #23)
  // --- Tòa nâu sẫm 28×16 m, 2 tầng, trục dài xoay ~12° về đông-bắc, tâm (78, 20) ---
  const brownB = new THREE.Group();
  brownB.name = 'brown-building';
  const matBrown = new THREE.MeshStandardMaterial({ color: 0x4a3a30, roughness: 0.7, metalness: 0.05 });
  placeBox(brownB, THREE, 28, 8, 16, matBrown, 0, 4, 0);
  placeBox(brownB, THREE, 28.4, 0.4, 16.4, matDarkRoof, 0, 8.2, 0);
  brownB.position.set(78, 0, 20);
  brownB.rotation.y = 12 * Math.PI / 180;
  group.add(brownB);

  // --- Tòa mái xanh (trắng, tầng trên phía bắc ốp xanh), phần nhìn thấy ≥60×30 m, tâm (124, 20) ---
  // Bảng ghi x = 120; dời +4 m đông để không chồng tòa nâu sẫm (bảng #22, x tới 92).
  const greenRoofB = new THREE.Group();
  greenRoofB.name = 'green-roof-building';
  placeBox(greenRoofB, THREE, 60, 15, 30, matWhite, 0, 7.5, 0);
  placeBox(greenRoofB, THREE, 60, 5, 15, matAccentGreen, 0, 17.5, -7.5);
  greenRoofB.position.set(124, 0, 20);
  group.add(greenRoofB);

  // --- Dãy nhà nhỏ mái xám (bảng #29, v5b): 9 căn 8×12 m, cao 4 m, bước 11 m (cách nhau 3 m), tâm dãy (−65, −90).
  // Bảng: tâm (−67, −53), dài ~110 m, ~8–10 căn. Bảng MÂU THUẪN với kênh và nhà răng cưa (bảng #28):
  //  - z −53 cắt kênh (K1→K2 đi qua z −50…−62 ở x −126…−103);
  //  - z −68 (đã thử) chồng nhà răng cưa (x −59…−27, z −83…−69) ~5 m.
  // Nên dời hẳn lên phía bắc tới z −90 (lệch 37 m so với bảng): cách nhà răng cưa 1 m, cách bờ bắc kênh ≥ 25 m.
  // Dài 96 m (x −113…−17, bảng ~110 m): mép đông cách cụm #3 (x ≥ −15) 2 m.
  // v6 (đợt 3, mục 3) — GIỮ NGUYÊN, không tìm được vị trí trong ±5 m của bảng: trong dải z −58…−48 kênh (bờ bắc
  // z ≈ −60 ở x −113, ≈ −51 ở x −90) cắt phần tây, cụm #6 (x −35…2, z −62…−38) chặn phần đông; chỉ ~3 căn ở
  // x −90…−62 đứng được (sát bờ kênh, ~0,8 m ở x −90). Tách/so le/dời x đều không đủ 9 căn.
  const houseRow = new THREE.Group();
  houseRow.name = 'small-houses';
  for (let i = 0; i < 9; i++) {
    placeBox(houseRow, THREE, 8, 4, 12, matGray, -65 + (i - 4) * 11, 2, -90);
  }
  group.add(houseRow);

  // --- Nhà mái răng cưa (bảng #28): 32×14 m, cao 6 m, tâm (−43, −76) ---
  placeBox(group, THREE, 32, 6, 14, matWhite, -43, 3, -76);

  // --- Dàn pin mặt trời (bảng #27): 65×19 m, tâm (64, −96) — ĐÚNG BẢNG (code cũ (64,−114) lệch 18 m về bắc).
  // Kiểm tra: mép bắc (z −105.5) không chạm vùng khác; mép nam (z −86.5) cách vành đường chạy (z ≈ −82 tại x 64) ~4 m.
  const solarMat = new THREE.MeshStandardMaterial({ color: 0x1d2a44, roughness: 0.3, metalness: 0.4 });
  placeBox(group, THREE, 65, 0.6, 19, solarMat, 64, 2.2, -96);

  // --- KÝ TÚC XÁ v7 — đợt 3 (bảng #26 + ảnh thật refs/user-photos-20261122): tòa xanh + tòa cam + sân trong + hành lang mái che ---
  // Hệ cục bộ: GỐC = TÂM SÂN TRONG; trục x dọc khu (xoay −45°, song song VD4; +x = đông-nam), trục z: −z = đông-bắc (phía VD4), +z = tây-nam.
  // Kích thước đợt 3: tòa xanh 60 m (từ 110), tòa cam 50 m (từ 70), sân 8 m (từ 15), mỗi tòa sâu 13 m, cao 15 m.
  // Tâm MỚI (−111,0; 61,6). Dời theo hướng tây-bắc dọc trục VD4, nhưng phải lùi tây-nam thêm ~10,8 m khỏi trục
  // (tâm từ 13,8 m → 24,6 m về phía tây-nam của tim VD4): cụm sâu 35 m không thể đứng sát VD4 ở vị trí cũ.
  // Khoảng trống đo trên đa giác thật (bao lồi các khối, kể cả lồng điều hòa và hàng rào): tới mép VD4 0,77 m;
  // tới đường biên nam (z 96…104) 0,74 m; tới đường nối VD4 (x −141…−117, z ≤ 27,25) 4,2 m; tới đường x −141 ≈ 15 m;
  // tới tòa hữu cơ ≈ 39 m; tới cầu VD4 ≈ 81 m; tới kênh xa hơn 50 m. Vị trí tính bằng bộ giải hình học, chưa kiểm chứng trình duyệt.
  const KTX_CENTER = { x: -111.0, z: 61.6 };
  const KTX_ROT = -Math.PI / 4;
  const KTX_LEN_BLUE = 60;           // tòa xanh dài 60 m
  const KTX_LEN_ORANGE = 50;         // tòa cam dài 50 m
  const KTX_D = 13;                  // bề sâu mỗi tòa
  const KTX_YARD = 8;                // sân trong: khoảng giữa hai mặt tòa (z −4…+4)
  const KTX_BLUE_Z = KTX_YARD / 2 + KTX_D / 2;   // tâm tòa xanh theo z cục bộ: +10,5
  const KTX_CAM_Z = -KTX_BLUE_Z;                 // tâm tòa cam theo z cục bộ: −10,5
  const KTX_BASE = 3.5;              // mặt dưới thân tòa: tầng trệt mở cao 3,5 m (cột tròn)
  const KTX_TOP = 15;                // đỉnh 5 tầng
  const KTX_FLOOR = 2.875;           // tầng 2–5: (15 − 3,5)/4
  const ktx = new THREE.Group();
  ktx.name = 'dormitory-v7';
  ktx.position.set(KTX_CENTER.x, 0, KTX_CENTER.z);
  ktx.rotation.y = KTX_ROT;
  group.add(ktx);

  // Vật liệu KTX. Màu xanh #7ea6d8 ước lượng bằng mắt từ ảnh 98411/98402 (tòa xanh lam nhạt); chưa đo pixel.
  // Màu tòa xanh ĐO BẰNG PIL từ 98402_22_lqwg.jpg (vùng tường trái giữa ảnh): #9cafcf (thay #7ea6d8 ước lượng).
  // v7 đợt 4 (B4): emissive cùng màu, nhỏ, chỉ để nâng sáng mặt râm của cụm KTX (không đổi màu)
  const matDormBlue = new THREE.MeshStandardMaterial({ color: 0x9cafcf, roughness: 0.8, metalness: 0.0, emissive: 0x9cafcf, emissiveIntensity: 0.15 });
  // Tòa cam: màu #b06a3a là ƯỚC LƯỢNG — ảnh 98406_25_1b2x.jpg không có mặt cam phẳng để lấy mẫu (không đo được bằng PIL).
  // Giữ nguyên, không đổi màu. Mặt ngoài dùng texture slat-orange.jpg; thanh lam geometry vẫn giữ để có chiều sâu.
  // Tòa cam sáng lên (B4): emissiveMap cùng texture, chỉ tăng độ sáng, không đổi tông
  const texSlatOrange = loadTex(THREE, 'slat-orange.jpg', 4, 2);
  const matDormOrange = new THREE.MeshStandardMaterial({ map: texSlatOrange, color: 0xffffff, roughness: 0.8, metalness: 0.0, emissive: 0xffffff, emissiveMap: texSlatOrange, emissiveIntensity: 0.2 });
  // v7 đợt 4 (B4-fix3b): emissive cùng tông 0x6e3b22, cường độ nhỏ — lam che ~90% mặt râm nên nâng sáng ở đây (không đổi màu)
  const matLam = new THREE.MeshStandardMaterial({ color: 0x6e3b22, roughness: 0.8, metalness: 0.0, emissive: 0x6e3b22, emissiveIntensity: 0.3 });   // lam dọc nâu đỏ (ảnh 98408/98406)
  const matRoofLight = new THREE.MeshStandardMaterial({ color: 0xc4c7ca, roughness: 0.8, metalness: 0.0 });
  // v7 đợt 4b (C3): lồng điều hòa là khung + thanh lưới mảnh (opaque, không còn hộp trong suốt) — nhìn xuyên được như ảnh 98400–98402.
  const matCage = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.5, metalness: 0.0 });
  const matAcUnit = new THREE.MeshStandardMaterial({ color: 0xb9bdc1, roughness: 0.6, metalness: 0.2 });
  const matGlassDorm = new THREE.MeshStandardMaterial({ color: 0x3a4650, roughness: 0.3, metalness: 0.1 });
  const matCurtain = new THREE.MeshStandardMaterial({ color: 0xe8e4da, roughness: 0.9, metalness: 0.0 });
  const matStone = new THREE.MeshStandardMaterial({ color: 0x8a8d90, roughness: 0.9, metalness: 0.0 });  // đá xám: ghế, bồn cây
  const matFence = new THREE.MeshStandardMaterial({ color: 0x5b5148, roughness: 0.7, metalness: 0.2 });  // hàng rào mắt cáo
  const matDrain = new THREE.MeshStandardMaterial({ color: 0x2a2f33, roughness: 0.6, metalness: 0.3 });  // rãnh thoát nước

  // Vùng KTX theo hệ cục bộ (xoay): dùng để loại trừ cây ngẫu nhiên. m = đệm (m). Hàng rào 2 đầu ở x ±31; lồng điều hòa tới z ±17,5.
  const ktxInArea = (x, z, m) => {
    const dx = x - KTX_CENTER.x, dz = z - KTX_CENTER.z;
    const c = Math.cos(KTX_ROT), s = Math.sin(KTX_ROT);
    const lx = c * dx - s * dz, lz = s * dx + c * dz;
    return Math.abs(lx) < 31 + m && Math.abs(lz) < 17.5 + m;
  };

  // Gom nhiều hộp cùng kích thước thành InstancedMesh (list các [x, y, z] cục bộ)
  const ktxInst = (parent, geo, mat, list) => {
    if (!list.length) return null;
    const im = new THREE.InstancedMesh(geo, mat, list.length);
    const m = new THREE.Matrix4();
    list.forEach((p, i) => { m.makeTranslation(p[0], p[1], p[2]); im.setMatrixAt(i, m); });
    im.instanceMatrix.needsUpdate = true;
    im.castShadow = true;
    im.receiveShadow = true;
    parent.add(im);
    return im;
  };
  const geoCol = new THREE.CylinderGeometry(0.55, 0.55, KTX_BASE, 16);   // cột tròn tầng trệt: Ø 1,1 m (ảnh thật 1,0–1,2 m), cao 3,5 m
  const geoPost = new THREE.BoxGeometry(0.05, 1.1, 0.05);                // thanh lan can: cao 1,1 m
  const geoAc = new THREE.BoxGeometry(0.8, 0.5, 0.6);                    // cục nóng trên nóc lồng
  const geoGlass = new THREE.BoxGeometry(0.9, 1.5, 0.1);                 // cửa sổ hẹp 0,9 × 1,5 m
  const geoCurtain = new THREE.BoxGeometry(0.9, 0.45, 0.12);             // rèm sáng phía trên cửa
  const geoFin = new THREE.BoxGeometry(0.18, KTX_TOP - KTX_BASE, 0.1);   // lam dọc 0,18 × 0,1 m (đợt 4: bước 0,2 m → che ~90%)
  const geoWalkCol = new THREE.CylinderGeometry(0.3, 0.3, 3.0, 12);      // cột hành lang mái che Ø 0,6 m

  // v7 đợt 4b (C3): lồng điều hòa 1,4 × 2,2 × 0,44 m dạng KHUNG + THANH LƯỚI (thay hộp đặc): mỗi lồng gồm
  // 4 thanh khung (0,06 m) + 4 thanh đứng và 5 thanh ngang (0,02 m) cho MỖI mặt trước và sau (z ±0,22). Tâm lồng = điểm trong cageP.
  // Dùng 4 InstancedMesh (một draw call mỗi loại), 26 thanh/lồng. Nhìn xuyên được như ảnh thật (98400–98402).
  const geoCageRailV = new THREE.BoxGeometry(0.06, 2.2, 0.06);          // khung đứng hai mép
  const geoCageRailH = new THREE.BoxGeometry(1.4, 0.06, 0.06);          // khung ngang trên/dưới
  const geoCageBarV = new THREE.BoxGeometry(0.02, 2.08, 0.02);          // thanh lưới đứng
  const geoCageBarH = new THREE.BoxGeometry(1.32, 0.02, 0.02);          // thanh lưới ngang
  const CAGE_ZF = 0.22;                                                  // mặt trước/sau lồng cách tâm 0,22 m
  const ktxCageInst = (parent, centers) => {
    const L = { railV: [], railH: [], barV: [], barH: [] };
    for (const [cx, cy, cz] of centers) {
      for (const sx of [-0.67, 0.67]) for (const sz of [-CAGE_ZF, CAGE_ZF]) L.railV.push([cx + sx, cy, cz + sz]);
      for (const sy of [-1.07, 1.07]) for (const sz of [-CAGE_ZF, CAGE_ZF]) L.railH.push([cx, cy + sy, cz + sz]);
      for (const bx of [-0.45, -0.15, 0.15, 0.45]) for (const sz of [-CAGE_ZF, CAGE_ZF]) L.barV.push([cx + bx, cy, cz + sz]);
      for (const by of [-0.8, -0.4, 0, 0.4, 0.8]) for (const sz of [-CAGE_ZF, CAGE_ZF]) L.barH.push([cx, cy + by, cz + sz]);
    }
    ktxInst(parent, geoCageRailV, matCage, L.railV);
    ktxInst(parent, geoCageRailH, matCage, L.railH);
    ktxInst(parent, geoCageBarV, matCage, L.barV);
    ktxInst(parent, geoCageBarH, matCage, L.barH);
  };

  // Một tòa ký túc xá. sideOut = +1: mặt ngoài (lồng, cửa, lam) ở +z; −1: ở −z. Mặt sân (hành lang mở) ngược lại.
  const ktxBlock = (name, len, zc, sideOut, mat, withLam) => {
    const b = new THREE.Group();
    b.name = name;
    ktx.add(b);
    const faceOut = zc + sideOut * KTX_D / 2;   // mặt ngoài
    const faceIn = zc - sideOut * KTX_D / 2;    // mặt sân
    const inDir = -sideOut;                     // hướng từ thân vào sân
    const nBay = Math.floor(len / 6);           // nhịp mặt tiền ~6 m, đối xứng quanh x = 0
    const xBay = (i) => -(nBay - 1) * 3 + 6 * i;

    // Thân + mái (mái xám nhạt, 2 hộp HVAC trắng)
    placeBox(b, THREE, len, KTX_TOP - KTX_BASE, KTX_D, mat, 0, (KTX_TOP + KTX_BASE) / 2, zc);
    placeBox(b, THREE, len + 0.6, 0.4, KTX_D + 0.6, matRoofLight, 0, KTX_TOP + 0.2, zc);
    placeBox(b, THREE, 3, 1.2, 2.5, matWhite, -len / 3, KTX_TOP + 0.4 + 0.6, zc);
    placeBox(b, THREE, 3, 1.2, 2.5, matWhite, len / 3, KTX_TOP + 0.4 + 0.6, zc);

    const colP = [], postP = [], cageP = [], acP = [], glassP = [], curtP = [], finP = [];
    const zRail = faceIn + inDir * 1.15;        // lan can ở mép ngoài hành lang (hành lang nhô 1,2 m)
    for (let i = 0; i < nBay; i++) {
      const xb = xBay(i);
      for (const dz of [-4.5, 4.5]) colP.push([xb, KTX_BASE / 2, zc + dz]);       // cột tầng trệt
      for (let k = 0; k < 4; k++) {               // cửa sổ tầng 2–5: 2 cửa mỗi nhịp, kẹp hai bên lồng điều hòa (đợt 4)
        const base = KTX_BASE + k * KTX_FLOOR;
        for (const sx of [-2.2, 2.2]) {
          glassP.push([xb + sx, base + 1.2, faceOut + sideOut * 0.1]);
          curtP.push([xb + sx, base + 1.6, faceOut + sideOut * 0.13]);
        }
      }
      for (let k = 0; k < 3; k++) {               // lồng điều hòa tầng 2–4 (xếp chồng 3)
        const base = KTX_BASE + k * KTX_FLOOR;
        cageP.push([xb, base + 1.5, faceOut + sideOut * 0.25]);
        acP.push([xb, base + 1.5 + 1.1 + 0.25, faceOut + sideOut * 0.25]);   // cục nóng trên nóc MỖI lồng (đợt 4: thêm cho lồng dưới cùng)
      }
    }
    if (withLam) {                                // lam dọc bước 0,2 m (lam 0,18 m): che ~90% mặt ngoài như ảnh thật (đợt 4)
      for (let x = -len / 2 + 0.3; x <= len / 2 - 0.3 + 1e-6; x += 0.2) finP.push([x, (KTX_TOP + KTX_BASE) / 2, faceOut + sideOut * 0.05]);
    }

    // Hành lang mở mặt sân: mỗi tầng 2–5 một sàn 0,3 m nhô 1,2 m (đợt 4: sơn cùng màu tường tòa, không còn xám) + lan can trắng
    for (let k = 0; k < 4; k++) {
      const base = KTX_BASE + k * KTX_FLOOR;
      placeBox(b, THREE, len, 0.3, 1.2, mat, 0, base, faceIn + inDir * 0.6);
      placeBox(b, THREE, len, 0.06, 0.06, matWhite, 0, base + 1.25, zRail);
      for (let x = -len / 2 + 0.75; x <= len / 2 - 0.75 + 1e-6; x += 1.5) postP.push([x, base + 0.7, zRail]);
    }

    ktxInst(b, geoCol, matWhite, colP);
    ktxInst(b, geoPost, matWhite, postP);
    ktxCageInst(b, cageP);
    ktxInst(b, geoAc, matAcUnit, acP);
    ktxInst(b, geoGlass, matGlassDorm, glassP);
    ktxInst(b, geoCurtain, matCurtain, curtP);
    ktxInst(b, geoFin, matLam, finP);
    return b;
  };

  // Tòa xanh (ký túc xá chính): 60 m, tâm z +10,5, mặt ngoài +z (phía tây-nam), hành lang mở mặt đông-bắc (phía sân)
  ktxBlock('ktx-blue', KTX_LEN_BLUE, KTX_BLUE_Z, +1, matDormBlue, false);
  // Tòa cam: 50 m, tâm z −10,5, mặt ngoài −z (đông-bắc) có lam dọc, hành lang mở mặt tây-nam (phía sân)
  ktxBlock('ktx-orange', KTX_LEN_ORANGE, KTX_CAM_Z, -1, matDormOrange, true);

  // Sân trong: nền gạch 60 × 8 m (x −30…30, z −4…+4), dưới tòa: bê tông xám (tầng trệt mở)
  // Nền sân: brick-pavers.jpg (Antigravity), 1 ô ≈ 10 m theo chiều dài sân.
  // Đợt 4 (B4): gạch sân tự phát sáng nhẹ (emissiveMap cùng texture) để không đen khi nằm trong bóng hai tòa 15 m.
  const texBrick = loadTex(THREE, 'brick-pavers.jpg', 6, 0.8);
  const matBrick = new THREE.MeshStandardMaterial({ map: texBrick, roughness: 0.85, metalness: 0.0, emissive: 0xffffff, emissiveMap: texBrick, emissiveIntensity: 0.25 });
  const yardPlane = new THREE.Mesh(new THREE.PlaneGeometry(KTX_LEN_BLUE, KTX_YARD), matBrick);
  yardPlane.rotation.x = -Math.PI / 2;
  yardPlane.position.set(0, 0.03, 0);
  yardPlane.receiveShadow = true;
  ktx.add(yardPlane);
  // v7 đợt 4b (C1a): cỏ quanh cụm KTX có VẬT LIỆU RIÊNG (không còn trông chờ spill đèn). Lớp cỏ 84 × 54 m (local x ±42, z ±27),
  // đặc hoàn toàn trong x ±34, z ±19 (bao trọn cụm), mép mờ 8 m bằng alphaMap; cao −0,02 m (trên khuôn viên −0,05, dưới đường/sân).
  // Cùng texture cỏ, repeat 1 ô / 10 m như nền chung; emissive 0,15 để nâng nhẹ mặt cỏ trong cụm. KHÔNG đổi cỏ ngoài cụm.
  const KTX_GRASS_W = 84, KTX_GRASS_D = 54, KTX_GRASS_FEATHER = 8;
  // v7 đợt 4c (MAJOR 1): map/emissive dùng UV THẾ GIỚI (xem bên dưới) nên repeat = 1, offset 0.
  const texGrassKtx = grassTex.clone();
  texGrassKtx.repeat.set(1, 1);
  texGrassKtx.offset.set(0, 0);
  texGrassKtx.needsUpdate = true;
  const ALPHA_N = 128;
  const alphaData = new Uint8Array(ALPHA_N * ALPHA_N * 4);
  for (let j = 0; j < ALPHA_N; j++) for (let i = 0; i < ALPHA_N; i++) {
    const x = (i + 0.5) / ALPHA_N * KTX_GRASS_W - KTX_GRASS_W / 2;
    const z = (j + 0.5) / ALPHA_N * KTX_GRASS_D - KTX_GRASS_D / 2;
    const e = Math.min(KTX_GRASS_W / 2 - Math.abs(x), KTX_GRASS_D / 2 - Math.abs(z));
    const t = Math.min(1, Math.max(0, e / KTX_GRASS_FEATHER));
    const a = Math.round(255 * t * t * (3 - 2 * t));       // smoothstep; three đọc kênh G của alphaMap
    const k = (j * ALPHA_N + i) * 4;
    alphaData[k] = a; alphaData[k + 1] = a; alphaData[k + 2] = a; alphaData[k + 3] = 255;
  }
  const alphaTex = new THREE.DataTexture(alphaData, ALPHA_N, ALPHA_N, THREE.RGBAFormat);
  alphaTex.minFilter = THREE.LinearFilter;
  alphaTex.magFilter = THREE.LinearFilter;
  alphaTex.channel = 1;                                    // alpha đọc uv1 (UV cục bộ), không đọc uv0 (UV thế giới)
  alphaTex.needsUpdate = true;
  const matKtxGrass = new THREE.MeshStandardMaterial({
    map: texGrassKtx, roughness: 0.95, metalness: 0.0,
    emissive: 0xffffff, emissiveMap: texGrassKtx, emissiveIntensity: 0.15,
    transparent: true, alphaMap: alphaTex, depthWrite: false,
  });
  // UV THẾ GIỚI cho map/emissive (MAJOR 1, v7 đợt 4c): nền cỏ chung có u = (x+200)/10, v = (190−z)/10
  // (plane 400×350 tâm z 15, xoay −90°, repeat 40×35), nên mốc ô 10 m nằm ở bội số 10 của x và z ⇒ u ≡ x/10, v ≡ −z/10 (mod 1).
  // Cụm KTX xoay −45° nên đổi từng đỉnh cục bộ → thế giới bằng ma trận (ktx · ktxGrass) rồi chia 10.
  // alphaMap giữ UV cục bộ (uv1) để dải mờ 8 m vẫn nằm đúng mép cụm.
  const ktxGrassGeo = new THREE.PlaneGeometry(KTX_GRASS_W, KTX_GRASS_D);
  ktxGrassGeo.setAttribute('uv1', ktxGrassGeo.attributes.uv.clone());
  const ktxGrass = new THREE.Mesh(ktxGrassGeo, matKtxGrass);
  ktxGrass.name = 'ktx-grass';
  ktxGrass.rotation.x = -Math.PI / 2;
  ktxGrass.position.set(0, -0.02, 0);
  ktxGrass.receiveShadow = true;
  ktx.add(ktxGrass);
  ktx.updateMatrix();
  ktxGrass.updateMatrix();
  const ktxGrassToWorld = new THREE.Matrix4().multiplyMatrices(ktx.matrix, ktxGrass.matrix);
  const gPos = ktxGrassGeo.attributes.position, gUv = ktxGrassGeo.attributes.uv, gP = new THREE.Vector3();
  for (let i = 0; i < gPos.count; i++) {
    gP.fromBufferAttribute(gPos, i).applyMatrix4(ktxGrassToWorld);
    gUv.setXY(i, gP.x / 10, -gP.z / 10);
  }
  gUv.needsUpdate = true;

  // v7 đợt 4b (C1b): đèn sân — thay 1 đèn 50 m (cũ: tâm, cao 10 m, I 5; spill tới ~50 m, xuyên tường) bằng 4 đèn yếu cao 10 m
  // tại x −22, −7,33, +7,33, +22 (z 0), cutoff 22 m, I 3,8, không đổ bóng (như cũ). Mục tiêu: sân đều hơn, spill ra ngoài cụm nhỏ.
  // Số đo tính tay (chưa chạy được script; xem báo cáo đợt 4b), đơn vị = irradiance như đèn nắng: tâm sân ≈ 0,40 (cũ 0,50);
  // x ±22 ≈ 0,39; x ±28 ≈ 0,24 (cũ 0,04); x 36 (5 m ngoài đầu) ≈ 0,05 (cũ 0,02); z 22 (5 m ngoài tòa) = 0 (cũ 0,08); z 32 (15 m) = 0 (cũ 0,03).
  for (const lx of [-22, -7.33, 7.33, 22]) {
    const yardFill = new THREE.PointLight(0xfff4e6, 3.8, 22, 1);
    yardFill.position.set(lx, 10, 0);
    ktx.add(yardFill);
  }
  const floorBlue = new THREE.Mesh(new THREE.PlaneGeometry(KTX_LEN_BLUE, KTX_D), matConcrete);
  floorBlue.rotation.x = -Math.PI / 2;
  floorBlue.position.set(0, 0.03, KTX_BLUE_Z);
  floorBlue.receiveShadow = true;
  ktx.add(floorBlue);
  const floorOrange = new THREE.Mesh(new THREE.PlaneGeometry(KTX_LEN_ORANGE, KTX_D), matConcrete);
  floorOrange.rotation.x = -Math.PI / 2;
  floorOrange.position.set(0, 0.03, KTX_CAM_Z);
  floorOrange.receiveShadow = true;
  ktx.add(floorOrange);
  for (const zd of [-3.1, 3.1]) placeBox(ktx, THREE, KTX_LEN_BLUE, 0.04, 0.3, matDrain, 0, 0.05, zd);   // rãnh sát 2 mép sân

  // Hành lang mái che nối 2 tòa qua sân: 3 cái (x −27, 0, 27), rộng 3 m, mái cao 3,0–3,25 m, cột hai bên bước 2 m (4 hàng)
  const walkCols = [];
  for (const xw of [-27, 0, 27]) {
    placeBox(ktx, THREE, 3, 0.25, KTX_YARD, matWhite, xw, 3.125, 0);
    for (const dx of [-1.2, 1.2]) for (const zc2 of [-3, -1, 1, 3]) walkCols.push([xw + dx, 1.5, zc2]);
  }
  // Pergola cột trắng (ảnh 98407): mái 23 × 3 m ở nửa tây sân (giữa hành lang x −27 và x 0; rút từ 38 m để không chạm hành lang),
  // cột hai hàng (z ±1,5) bước 4 m, 6 cột
  placeBox(ktx, THREE, 23, 0.25, 3, matWhite, -13.5, 3.125, 0);
  for (let i = 0; i < 6; i++) for (const zc2 of [-1.5, 1.5]) walkCols.push([-23.5 + 4 * i, 1.5, zc2]);
  ktxInst(ktx, geoWalkCol, matWhite, walkCols);

  // Hàng rào mắt cáo 2 đầu sân: 12 m dài (z −6…+6), cao 1,2 m, dày 0,08 m, đặt ngoài đầu tòa xanh (x ±31).
  // Đầu đông-nam (x +31) có LỐI ĐI 3 m (z −1,5…+1,5) để nối sân với đường biên nam: hàng rào tách 2 đoạn 4,5 m.
  placeBox(ktx, THREE, 0.08, 1.2, 12, matFence, -31, 0.6, 0);
  placeBox(ktx, THREE, 0.08, 1.2, 4.5, matFence, 31, 0.6, -3.75);
  placeBox(ktx, THREE, 0.08, 1.2, 4.5, matFence, 31, 0.6, 3.75);

  // Lối đi bộ 3 m (đợt 3): từ sân qua lỗ hàng rào đầu đông-nam (x 29,5…52, z ±1,5) ra đường biên nam (z 96…104).
  // Tên 'ktx-walk-path' để lưới đi bộ (vgu-campus-v2.html: ROAD_RE chứa 'walk|path') nhận là đường đi được.
  const walkPath = new THREE.Mesh(new THREE.PlaneGeometry(22.5, 3), matConcrete);
  walkPath.name = 'ktx-walk-path';
  walkPath.rotation.x = -Math.PI / 2;
  walkPath.position.set(40.75, 0.04, 0);
  walkPath.receiveShadow = true;
  ktx.add(walkPath);
  // Lối đi bộ cũng là mặt đường (cho loại trừ cây ngẫu nhiên): tâm đổi sang hệ thế giới, hướng = trục x cục bộ đã xoay
  roadRects.push({ cx: KTX_CENTER.x + 40.75 * Math.cos(KTX_ROT), cz: KTX_CENTER.z - 40.75 * Math.sin(KTX_ROT), hl: 11.25, hw: 1.5, ux: Math.cos(KTX_ROT), uz: -Math.sin(KTX_ROT), name: 'ktx-walk-path' });

  // Ghế đá 1,8 × 0,45 × 0,5 m (4 cái) và bồn cây đá 1,2 × 0,4 × 1,2 m (8 bồn, trồng cây ở mục tree bên dưới)
  for (const [bx, bz] of [[-17, -2.5], [-17, 2.5], [11, -2.5], [11, 2.5]]) placeBox(ktx, THREE, 1.8, 0.45, 0.5, matStone, bx, 0.225, bz);
  // v7 đợt 4b (C4): bồn cây lz ±1,8 (đợt 4: ±1,9). Mép tán = 1,8 + r(0,80) = z 2,60; sàn hành lang mép z 2,80 (khoảng hở 0,20 m);
  // lan can z 2,82 (hở 0,22 m) — đạt ≥ 10 cm. Lan can/sàn nhô tới z ≈ 2,8 ở mọi tầng 2–5 (xem ktxBlock).
  const ktxTreeSpots = [[-21, -1.8], [-9, -1.8], [9, -1.8], [21, -1.8], [-21, 1.8], [-9, 1.8], [9, 1.8], [21, 1.8]];
  for (const [tx, tz] of ktxTreeSpots) placeBox(ktx, THREE, 1.2, 0.4, 1.2, matStone, tx, 0.2, tz);

  // --- Nhà mái hữu cơ (bảng #25): 28×34 m, tâm (−120, −25) — ĐỂ LỆCH 18 m NAM so với bảng (−120, −43) (v5b, MÂU THUẪN) ---
  // Bảng ghi "bắc kênh" nhưng tọa độ (−120, −43) đặt nhà chồng kênh: bờ bắc kênh tại x −120 là z ≈ −62, bờ nam z ≈ −49,
  // nhà z −60…−26 sẽ cắt kênh (vi phạm "kênh không cắt nhà"). Giữ vị trí cũ (mép bắc z −42; góc đông-bắc x −106 cách bờ nam kênh ~1.6 m).
  // Nếu sếp muốn đúng bảng, phải đổi đường kênh — chưa tự đổi.
  const organicB = new THREE.Group();
  organicB.name = 'organic-building';

  const organicRoof = new THREE.Mesh(
    new THREE.SphereGeometry(14, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.4),
    matWhite
  );
  organicRoof.scale.set(1, 0.6, 17 / 14);
  organicRoof.position.set(0, 4, 0);
  organicRoof.castShadow = true;
  organicRoof.receiveShadow = true;
  organicB.add(organicRoof);

  const orgBase = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 4, 24),
    matWhite
  );
  orgBase.scale.set(1, 1, 17 / 14);
  orgBase.position.set(0, 2, 0);
  orgBase.castShadow = true;
  organicB.add(orgBase);

  organicB.position.set(-120, 0, -25);
  group.add(organicB);

  // =====================================================
  // (9) TREES — Cây cối khuôn viên
  // =====================================================
  const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 3, 6);
  trunkGeo.translate(0, 1.5, 0);

  const leafGeoA = new THREE.IcosahedronGeometry(2.0, 1);
  const leafGeoB = new THREE.DodecahedronGeometry(2.2, 1);
  const leafGeoC = new THREE.ConeGeometry(1.6, 3.5, 7);
  leafGeoC.translate(0, 1.0, 0);

  const leafGeos = [leafGeoA, leafGeoB, leafGeoC];
  const leafMats = [matLeaf1, matLeaf2, matLeaf3, matLeaf4];

  // v7: 8 cây thân mảnh tán thưa trong bồn đá của sân KTX (đặt tay, không dùng rng); thân cao ~4,2 m.
  // v7 đợt 4b (C4): tán scale 0,40 (leafGeoA bán kính 2,0 × 0,40 = r 0,80; đợt 4: 0,44 → r 0,88), bồn lz ±1,8.
  for (const [tx, tz] of ktxTreeSpots) {
    const trunk = new THREE.Mesh(trunkGeo, matTrunk);
    trunk.position.set(tx, 0.4, tz);
    trunk.scale.set(1, 1.4, 1);
    trunk.castShadow = true;
    ktx.add(trunk);
    const crown = new THREE.Mesh(leafGeos[0], matLeaf2);
    crown.position.set(tx, 5.0, tz);
    crown.scale.setScalar(0.40);
    crown.castShadow = true;
    ktx.add(crown);
  }

  const treePositions = [];

  function seededRandom(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rng = seededRandom(20261121);

  // v5: vùng loại trừ theo khối nhà/đường mới (bảng layout-v5.md; khối đã đẩy ra thêm ~2 m đệm)
  // v5b: cập nhật theo footprint mới (mục 2, 3, 4). Vùng [x0,x1,z0,z1] theo mét.
  const excludeZones = [
    [-90, -26, -18, 28],     // tòa xám (khối trước + khối sau)
    [-42, -4, -31, -18],     // cụm trắng #5
    [-62, 4, -66, -30],      // cụm trắng #4 + #6 (vùng chung)
    [2, 52, -60, -26],       // cụm trắng #7 + tháp #8–#10 (v6: #10 dời nam tới z −29)
    [-16, 42, -2, 24],       // giảng đường (hội trường)
    [20, 64, 20, 54],        // vòm oval
    [52, 90, -41, -19],      // khán đài
    [36, 112, -86, -46],     // đường chạy (oval ngoài; v6: tâm dời bắc 2.5 m)
    [86, 134, -55, -31],     // nhà thi đấu
    [86, 122, -35, -10],     // hồ bơi + vành sàn
    [52, 124, -13, 7],       // hai nhóm sân nhỏ
    [19, 53, -32, -12],      // sân bóng rổ
    [64, 158, 2, 38],        // tòa nâu + tòa mái xanh
    [68, 114, 46, 90],       // tòa trắng sân trong
    [-140, -100, -48, -4],   // tòa hữu cơ
    [-115, -15, -98, -82],   // dãy nhà nhỏ (z −90)
    [-60, -26, -85, -67],    // nhà mái răng cưa (−43, −76)
    [28, 100, -108, -84],    // pin mặt trời
    // KTX v7: loại trừ theo vùng xoay (ktxInArea), không dùng rect (rect cũ đã bỏ)
    [-22, 22, 94, 122],      // cổng chính (tường biển, mô đất, cột cờ)
    [-14, 14, 58, 94],       // hành lang nhìn tới cổng từ phía bắc: không có cây
    [-16, 16, 58, 92],       // bùng binh + lối vào
    [-64, 73, 71, 79],       // đường đông–tây
    [-105, 20, 95, 105],     // đường biên nam
    [-5, 5, 50, 106],        // đường bắc–nam
    [146, 154, -85, 0],      // đường biên đông
    [-72, -60, -48, -30],    // bãi đậu xe (VỊ TRÍ CŨ, giữ để không đổi cây đã có; bãi thật xem dòng dưới)
    [-90, -60, -47.5, -32.5], // bãi đậu xe THỰC TẾ (parkingLot tâm (−75,−40), 30×15 m) — v7 đợt 4b (C5a)
    [-152, -128, -86, -48],  // hai đầu + mặt cầu VD4 (z −79,5…−48,5, ramp dự kiến ±5 m) — v7 đợt 4b (C5b); không kiểm chứng ramp bằng ảnh
    [-150, -112, -50, 26],   // đường nối VD4 ↔ cầu VD4 (x −141) + cầu VD4 (−140, −64)
    [-66, -38, 34, 66],      // hành lang nhìn từ tòa xám (camera điểm "Tòa nhà chính" lùi ra nam)
  ];
  // v5: điểm dừng tour + cổng, theo bảng mục 6.2 (cây không đứng trong 6 m quanh các điểm này).
  // v5b: neo hồ bơi dời theo hồ (104, −12) — cách mép nam vành sàn ~4.5 m.
  const TREE_STOPS = [[0, 100], [-56, 34], [14, 28], [43, 55], [74, -40], [104, -12], [14, 57]];

  // v2.7: ít cây hơn và to hơn. Cây NGẪU NHIÊN tối đa TREE_RANDOM_TARGET (= 65), kích thước ×1.7 (trước 0.7–1.3);
  // NGOÀI ra còn cây đặt riêng (specificTrees, 2 cây) — tổng số cây không phải 65.
  // Cây sát đường/kênh/tòa nhà giữ ~80%, cây giữa bãi trống chỉ ~30%; các cây ngẫu nhiên cách nhau ≥ 6.5 m.
  const TREE_RANDOM_TARGET = 65;
  const TREE_SIZE = 1.7;
  const treeRoads = [
    [-4, 4, 50, 106], [-64, 73, 71, 79], [-105, 20, 96, 104], [146, 154, -85, 0], [-148, -115, -48, 24],
  ];
  const rectDist = (x, z, [x0, x1, z0, z1]) => Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(z0 - z, 0, z - z1));
  // Khoảng cách từ điểm tới mặt đường xoay (roadRects). 0 nếu nằm trên đường. v7 đợt 4: VD4 xoay ~45° nên rectDist không đủ.
  const roadRectDist = (x, z, r) => {
    const dx = x - r.cx, dz = z - r.cz;
    const along = dx * r.ux + dz * r.uz;
    const across = -dx * r.uz + dz * r.ux;
    return Math.hypot(Math.max(Math.abs(along) - r.hl, 0), Math.max(Math.abs(across) - r.hw, 0));
  };
  const canalDist = (x, z) => {
    let d = Infinity;
    for (const p of canalPts) d = Math.min(d, Math.hypot(p.x - x, p.z - z));
    return d;
  };

  // v2.8: cây cố định đặt TRƯỚC vòng cây ngẫu nhiên để vòng ngẫu nhiên cũng tôn trọng khoảng cách 6.5 m với cây cố định.
  // Bỏ [5,-15] (nằm trong khối SW); [±15,70] (đứng trên vòng xuyến) dời ra [±24,70]; [12,-22] → [14.5,-21] (không chạm SW).
  // v5: giữ 2 cây hai bên bùng binh và 1 cây phía bắc cầu đỏ; bỏ các cây đứng trên kênh/cầu/tòa (bảng mới)
  // v7 đợt 4b (C5c): cây (−24,70) dời về (−24,65): thân cách mép đường đông–tây (z 71,5) 6,5 m; tán r ≤ 3,74 (leafGeoB × 1,7) → mép tán z 68,7, cách mép đường 2,8 m (≥2 m).
  const specificTrees = [
    [-24, 65, 1.0],
    [-15, 50, 0.9],
  ];
  // v7 đợt 4c (MAJOR 2): mỗi cây quyết định LOẠI TÁN + SCALE + hệ số tán TRƯỚC khi chấp nhận vị trí.
  // Bán kính ngang thực tế của tán = bán kính ngang hình học × scale × hệ số lớn nhất (x hoặc z); dùng để kiểm mép đường.
  const leafHalfR = leafGeos.map((geo) => {
    const p = geo.attributes.position;
    let m = 0;
    for (let i = 0; i < p.count; i++) m = Math.max(m, Math.hypot(p.getX(i), p.getZ(i)));
    return m;
  });
  const makeTree = (x, z, scale) => {
    const geoIdx = Math.floor(rng() * leafGeos.length);
    const matIdx = Math.floor(rng() * leafMats.length);
    const f = [0.85 + rng() * 0.3, 0.85 + rng() * 0.3, 0.85 + rng() * 0.3];
    const crownR = leafHalfR[geoIdx] * scale * Math.max(f[0], f[2]);
    return { x, z, scale, geoIdx, matIdx, f, crownR };
  };
  // Cây cố định: cùng phép kiểm (tán + 2 m tới mặt đường). Vị trí hiện tại đều đạt; nếu không đạt thì bỏ cây, không dời.
  for (const [tx, tz, ts] of specificTrees) {
    const t = makeTree(tx, tz, ts * TREE_SIZE);
    if (roadRects.some((r) => roadRectDist(tx, tz, r) < t.crownR + 2.0)) continue;
    treePositions.push(t);
  }

  let treesPlaced = 0;
  for (let tries = 0; tries < 6000 && treesPlaced < TREE_RANDOM_TARGET; tries++) {
    const x = (rng() * 2 - 1) * 200;
    const z = (rng() * 2 - 1) * 160;
    let inExclude = false;
    for (const [x0, x1, z0, z1] of excludeZones) {
      if (x > x0 - 3 && x < x1 + 3 && z > z0 - 3 && z < z1 + 3) {
        inExclude = true;
        break;
      }
    }
    if (inExclude || ktxInArea(x, z, 4)) continue;
    const tree = makeTree(x, z, (0.75 + rng() * 0.5) * TREE_SIZE);
    // v7 đợt 4 (A1) + đợt 4c (MAJOR 2): TÁN (bán kính thực tế) phải cách mặt đường ≥ 2 m, không chỉ tâm thân.
    if (roadRects.some((r) => roadRectDist(x, z, r) < tree.crownR + 2.0)) continue;
    const nearEdge = canalDist(x, z) < 16 ||
      excludeZones.some((r) => rectDist(x, z, r) < 22) ||
      treeRoads.some((r) => rectDist(x, z, r) < 10);
    if (rng() > (nearEdge ? 0.8 : 0.3)) continue;
    if (canalDist(x, z) < 8.5 || TREE_STOPS.some(([sx, sz]) => Math.hypot(sx - x, sz - z) < 6)) continue;
    if (treePositions.some((t) => Math.hypot(t.x - x, t.z - z) < 6.5)) continue;
    treePositions.push(tree);
    treesPlaced++;
  }


  {
    const totalTrees = treePositions.length;
    const trunkInst = new THREE.InstancedMesh(trunkGeo, matTrunk, totalTrees);
    trunkInst.castShadow = true;
    const batches = leafGeos.map(geo => leafMats.map(mat => {
      const mesh = new THREE.InstancedMesh(geo, mat, totalTrees);
      mesh.count = 0;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }));

    const dm = new THREE.Object3D();
    for (let i = 0; i < totalTrees; i++) {
      const { x, z, scale, geoIdx, matIdx, f } = treePositions[i];
      dm.position.set(x, 0, z);
      dm.scale.setScalar(scale);
      dm.updateMatrix();
      trunkInst.setMatrixAt(i, dm.matrix);

      // Tán nâng cao (4.6·s thay vì 3.5·s): đáy tán > 1.8 m nên lưới đi bộ chỉ chặn thân cây, không chặn cả vùng tán
      dm.position.set(x, 4.6 * scale, z);
      dm.scale.set(scale * f[0], scale * f[1], scale * f[2]);   // hệ số tán đã quyết định ở bước đặt cây (makeTree)
      dm.updateMatrix();
      const mesh = batches[geoIdx][matIdx];
      mesh.setMatrixAt(mesh.count++, dm.matrix);
    }

    trunkInst.instanceMatrix.needsUpdate = true;
    group.add(trunkInst);
    for (const row of batches) for (const mesh of row) {
      if (mesh.count) {
        mesh.instanceMatrix.needsUpdate = true;
        group.add(mesh);
      }
    }
  }

  // =====================================================
  // (10) PARKING LOT with bus
  // =====================================================
  const parkingLot = new THREE.Mesh(new THREE.PlaneGeometry(30, 15), asphaltFor(30, 15));
  parkingLot.rotation.x = -Math.PI / 2;
  parkingLot.position.set(-75, 0.02, -40);
  parkingLot.receiveShadow = true;
  group.add(parkingLot);

  const bus = new THREE.Group();
  placeBox(bus, THREE, 10, 3, 2.5, matWhite, 0, 1.5, 0);
  placeBox(bus, THREE, 9, 2.0, 0.1, matWindow, 0, 2.5, 1.3);
  placeBox(bus, THREE, 9, 2.0, 0.1, matWindow, 0, 2.5, -1.3);
  bus.position.set(-70, 0, -38);
  group.add(bus);

  // =====================================================
  // (11) LAMP POSTS
  // =====================================================
  const lampPostGeo = new THREE.CylinderGeometry(0.06, 0.08, 6, 6);
  lampPostGeo.translate(0, 3, 0);
  const lampBulbGeo = new THREE.SphereGeometry(0.3, 8, 6);
  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff8e0,
    emissive: 0xffe8a0,
    emissiveIntensity: 0.4,
    roughness: 0.3
  });
  const lampPostMat = new THREE.MeshStandardMaterial({ color: 0x404850, roughness: 0.5, metalness: 0.5 });

  {
    const lampPositions = [];
    // v5: đèn chỉ dọc đường bắc–nam (x = 0) từ cầu đỏ tới cổng
    for (let z = 56; z <= 104; z += 16) {
      lampPositions.push([-5, z]);
      lampPositions.push([5, z]);
    }
    const count = lampPositions.length;
    const postInst = new THREE.InstancedMesh(lampPostGeo, lampPostMat, count);
    postInst.castShadow = true;
    const bulbInst = new THREE.InstancedMesh(lampBulbGeo, lampBulbMat, count);
    const dm = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const [lx, lz] = lampPositions[i];
      dm.position.set(lx, 0, lz);
      dm.scale.set(1, 1, 1);
      dm.updateMatrix();
      postInst.setMatrixAt(i, dm.matrix);
      dm.position.set(lx, 6.3, lz);
      dm.updateMatrix();
      bulbInst.setMatrixAt(i, dm.matrix);
    }
    postInst.instanceMatrix.needsUpdate = true;
    bulbInst.instanceMatrix.needsUpdate = true;
    group.add(postInst);
    group.add(bulbInst);
  }

  // =====================================================
  // (12) GATE (south)
  // =====================================================
  // v2.7 (theo refs/gate-01): TƯỜNG BIỂN TÊN THẤP trên mô đất cỏ, phía sau là hàng cột cờ. Không có trụ/vòm/chốt.
  // v5: mô tả dưới đây là TRƯỚC khi xoay nhóm π (xem gateGroup.rotation). Sau xoay: biển quay ra nam (VD4),
  // cột cờ + tường phía bắc (khuôn viên), mô đất + đèn phía nam (đường). Tường tại z = 110.5, mainGate (0,0,100) trên đường biên.
  const gateGroup = new THREE.Group();
  gateGroup.name = 'main-gate';
  // v6 (mục 1): màu tường 0x9aa0a6 → 0xa9aba0 (xám ấm sáng theo mẫu pixel ảnh thật)
  const matGateConcrete = new THREE.MeshStandardMaterial({ color: 0xa9aba0, roughness: 0.85, metalness: 0.0 });
  // v6 (mục 2): bệ bê tông sáng dọc chân tường
  const matPlinth = new THREE.MeshStandardMaterial({ color: 0xc9cbc2, roughness: 0.85, metalness: 0.0 });
  const matPole = new THREE.MeshStandardMaterial({ color: 0xc8ced4, roughness: 0.3, metalness: 0.7 });
  const matLampBlack = new THREE.MeshStandardMaterial({ color: 0x1c1f22, roughness: 0.5, metalness: 0.3 });

  // Khung bê tông xám 17.4 × 4.4 m, dày 0.9 m (viền quanh biển nâu)
  placeBox(gateGroup, THREE, 17.4, 4.4, 0.9, matGateConcrete, 0, 2.2, 0);
  // v6 (đợt 3, mục 2): bệ 17.8 × 0.35 × 1.1 m ở chân tường (đỉnh 0.35 m, tâm y 0.175), nhô 0.1 m ra trước/sau tường.
  // Cỏ sát chân tường cao 0.10 m (moundH tại d = 0) nên phần bệ lộ ra ≈ 0.35 − 0.10 = 0.25 m, như ảnh thật (cỏ sát tường ~1/3 chiều cao bệ).
  placeBox(gateGroup, THREE, 17.8, 0.35, 1.1, matPlinth, 0, 0.175, 0);

  // Biển nâu đỏ 15.2 × 2.8 m (v6, mục 1): chữ VGU cam bên trái, dòng chữ trắng bên phải (canvas 2048×378, đúng tỉ lệ 15.2:2.8)
  const signCv = makeCanvas(2048, 378, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#885a44');
    grad.addColorStop(1, '#7c4f3c');
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    const fit = (text, px, maxW, weight) => {
      let s = px;
      g.font = `${weight} ${s}px Arial, sans-serif`;
      while (g.measureText(text).width > maxW && s > 16) {
        s -= 2;
        g.font = `${weight} ${s}px Arial, sans-serif`;
      }
    };
    // v2.8: chữ VGU vẽ bằng nét hình học đậm (thay font Arial): V, G có thanh ngang, U vuông. Bóng đổ nhẹ như cũ.
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.shadowColor = 'rgba(0,0,0,0.45)';
    g.shadowOffsetX = 6;
    g.shadowOffsetY = 8;
    g.shadowBlur = 10;
    // v6 (mục 1): chữ cao 82% panel (310/378), rộng ≈ 42% (860/2048); nét 67 px ≈ 0.5 m; màu #c84619.
    // Biên MỰC thực: x 110..970, y 34..344. Tọa độ đường tâm đã lùi vào 33.5 px (nửa nét) so với biên mực:
    // y tâm 67.5..310.5; x tâm V 143.5..344.5, G 456.5..646.5, U 757.5..936.5 (khe giữa các chữ theo tâm ≥ 111 px > 67 px).
    g.strokeStyle = '#c84619';
    g.lineWidth = 67;
    g.lineJoin = 'miter';
    g.lineCap = 'butt';
    // v6 (đợt 3, mục 1): V dùng 'bevel' để mũi miter đáy (góc ~45°) không vươn qua mép canvas 378 px; G, U giữ 'miter'.
    g.lineJoin = 'bevel';
    g.beginPath(); g.moveTo(143.5, 67.5); g.lineTo(244, 310.5); g.lineTo(344.5, 67.5); g.stroke(); // V
    g.lineJoin = 'miter';
    g.beginPath(); g.moveTo(646.5, 67.5); g.lineTo(456.5, 67.5); g.lineTo(456.5, 310.5); g.lineTo(646.5, 310.5);
    g.lineTo(646.5, 198); g.lineTo(546, 198); g.stroke(); // G (có thanh ngang)
    g.beginPath(); g.moveTo(757.5, 67.5); g.lineTo(757.5, 310.5); g.lineTo(936.5, 310.5); g.lineTo(936.5, 67.5); g.stroke(); // U
    g.shadowColor = 'transparent';
    g.shadowBlur = 0;
    g.shadowOffsetX = 0;
    g.shadowOffsetY = 0;
    // Dòng chữ bên phải (canh giữa khối 1120..1980)
    g.textAlign = 'center';
    g.fillStyle = '#f4efe8';
    // v6 (mục 1): dời dọc theo h = 378; thêm dòng địa chỉ sát đáy (có trong ảnh thật), sau khi đã tắt shadow
    fit('BỘ GIÁO DỤC VÀ ĐÀO TẠO', 48, 860, 'bold');
    g.fillText('BỘ GIÁO DỤC VÀ ĐÀO TẠO', 1550, h * 0.23);
    fit('TRƯỜNG ĐẠI HỌC VIỆT ĐỨC', 118, 860, 'bold');
    g.fillText('TRƯỜNG ĐẠI HỌC VIỆT ĐỨC', 1550, h * 0.47);
    fit('Vietnamesisch – Deutsche Universität', 44, 860, 'normal');
    g.fillText('Vietnamesisch – Deutsche Universität', 1550, h * 0.72);
    fit('Vietnamese – German University', 44, 860, 'normal');
    g.fillText('Vietnamese – German University', 1550, h * 0.86);
    fit('Đường Vành Đai 4, Phường Thới Hòa, TP. Bến Cát, Bình Dương', 20, 860, 'normal');
    g.fillStyle = '#d8d5cc';
    g.fillText('Đường Vành Đai 4, Phường Thới Hòa, TP. Bến Cát, Bình Dương', 1550, h * 0.965);
  });
  const signMat = new THREE.MeshStandardMaterial({
    map: canvasToTex(THREE, signCv),
    color: signCv ? 0xffffff : 0x7a3b2b,
    roughness: 0.7,
    metalness: 0.0
  });
  const gateSign = new THREE.Mesh(new THREE.PlaneGeometry(15.2, 2.8), signMat); // v6: 16×3.0 → 15.2×2.8
  gateSign.position.set(0, 2.2, -0.47);
  gateSign.rotation.y = Math.PI; // mặt chữ quay về -z (phía đường/khuôn viên)
  gateGroup.add(gateSign);

  // Mô đất cỏ giữa lề đường và tường (phía -z của tường): cao ~0.5 m sát chân tường, thoải dần về phía đường.
  // Hàm độ cao dùng chung cho mô đất và đèn rọi; zl = tọa độ cục bộ của cổng, mặt trước tường tại zl = -0.45.
  // v6 (đợt 3, mục 2): hình dạng mô đất theo ảnh thật. d = 0 (chân tường): cao 0.10 m (cỏ sát tường ~1/3 bệ);
  // tăng smoothstep lên đỉnh 0.35 m tại d = 1.8 m; rồi decay Gauss về ~0 ở phía đường (d ≈ 5 m, ≈ 0.03 m).
  // Liên tục tại d = 0 (kẹp dEff = max(0, d), không early-return), đạo hàm ≈ 0 tại d = 1.8.
  const moundH = (x, zl) => {
    const d = -0.45 - zl;
    const dEff = Math.max(0, d);
    const taper = Math.max(0, 1 - Math.pow(Math.abs(x) / 16, 2.5));
    let base;
    if (dEff <= 1.8) { const t = dEff / 1.8; const s = t * t * (3 - 2 * t); base = 0.10 + 0.25 * s; }
    else { base = 0.35 * Math.exp(-Math.pow((dEff - 1.8) / 2.0, 2)); }
    return base * taper;
  };
  const MOUND_Z = -2.9; // tâm mô đất: trải từ z -5.4 (sát lề đường) tới -0.45 (chân tường)
  const moundGeo = new THREE.PlaneGeometry(30, 4.95, 60, 12);
  moundGeo.rotateX(-Math.PI / 2);
  const moundPos = moundGeo.attributes.position;
  for (let i = 0; i < moundPos.count; i++) {
    moundPos.setY(i, moundH(moundPos.getX(i), moundPos.getZ(i) + MOUND_Z));
  }
  moundPos.needsUpdate = true;
  moundGeo.computeVertexNormals();
  const mound = new THREE.Mesh(moundGeo, new THREE.MeshStandardMaterial({ map: loadTex(THREE, 'grass.jpg', 4, 1), roughness: 0.95, metalness: 0.0 }));
  mound.name = 'gate-mound';
  mound.position.set(0, 0, MOUND_Z);
  mound.receiveShadow = true;
  gateGroup.add(mound);

  // Đèn rọi nhỏ màu đen dưới chân tường (8 chiếc, v6: KHÔNG cách đều, vị trí đo từ ảnh thật).
  // Toàn cục x đo từ ảnh (tâm tường px≈825, 78.7 px ≈ 1 m): [-8.0, -6.5, -4.4, -2.35, 0.8, 3.5, 5.7, 7.6].
  // -8.0 và -4.4 nội suy (bị bóng cây che); -6.5 đo được nhưng nhòe (±0.7 m); còn lại đo trực tiếp (±0.5 m).
  // Nhóm đã xoay π nên local x = −world x. v6 (mục 8): kích thước đèn 0.45 × 0.2 × 0.3 m (bớt dẹt), y = mô đất + 0.1 (nửa chiều cao).
  const lampLocalX = [8.0, 6.5, 4.4, 2.35, -0.8, -3.5, -5.7, -7.6];
  for (const lx of lampLocalX) {
    const lz = -2.6;
    placeBox(gateGroup, THREE, 0.45, 0.2, 0.3, matLampBlack, lx, moundH(lx, lz) + 0.1, lz);
  }

  // Hàng cột cờ phía sau tường (phía nam, z cục bộ = +4.5): 9 cột bạc cao 8.6–9.6 m, cờ VN / Đức / khác (v2.8: 10 → 9 cột)
  const starPath = (g, cx, cy, R, r) => {
    g.beginPath();
    for (let k = 0; k < 10; k++) {
      const ang = -Math.PI / 2 + (k * Math.PI) / 5;
      const rad = k % 2 ? r : R;
      g.lineTo(cx + rad * Math.cos(ang), cy + rad * Math.sin(ang));
    }
    g.closePath();
    g.fill();
  };
  const flagStyles = {
    vn: (g, w, h) => { g.fillStyle = '#da251d'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffcd00'; starPath(g, w / 2, h / 2, h * 0.36, h * 0.15); },
    de: (g, w, h) => {
      g.fillStyle = '#000000'; g.fillRect(0, 0, w, h / 3);
      g.fillStyle = '#dd0000'; g.fillRect(0, h / 3, w, h / 3);
      g.fillStyle = '#ffce00'; g.fillRect(0, (2 * h) / 3, w, h / 3);
    },
    rw: (g, w, h) => { g.fillStyle = '#d7141a'; g.fillRect(0, 0, w, h / 2); g.fillStyle = '#ffffff'; g.fillRect(0, h / 2, w, h / 2); },
    // v5b (mục 7): cờ đỏ trên – vàng dưới, ngang (cờ thứ 8 trong refs/gate-sign-vgu.webp)
    ry: (g, w, h) => { g.fillStyle = '#d7141a'; g.fillRect(0, 0, w, h / 2); g.fillStyle = '#ffce00'; g.fillRect(0, h / 2, w, h / 2); },
  };
  const flagMatOf = {};
  for (const key of Object.keys(flagStyles)) {
    const ft = canvasToTex(THREE, makeCanvas(256, 170, flagStyles[key]));
    flagMatOf[key] = new THREE.MeshStandardMaterial({
      map: ft, color: ft ? 0xffffff : 0xcc3333, roughness: 0.8, metalness: 0.0, side: THREE.DoubleSide
    });
  }
  const poleH = [8.6, 9.2, 9.6, 9.0, 9.6, 9.2, 9.0, 8.8, 9.2];
  // v5b (mục 7): thứ tự theo refs/gate-sign-vgu.webp, nhìn từ đường vào (phía nam) từ TRÁI sang PHẢI:
  // VN, Đức, đỏ-trắng, VN, Đức, đỏ-trắng, VN, đỏ-vàng, đỏ-trắng. Không có cờ xanh-trắng trong ảnh thật.
  // Lưu ý: nhóm cổng đã xoay π, nên chỉ số k = 0 (x cục bộ −14) nằm ở ĐÔNG (phải khi nhìn về bắc). Vì vậy mảng
  // dưới đây là thứ tự ĐẢO của ảnh (k = 0 là cờ bên phải cùng) để khi nhìn từ đường, trái→phải khớp ảnh.
  const flagOrder = ['rw', 'ry', 'vn', 'rw', 'de', 'vn', 'rw', 'de', 'vn'];
  for (let k = 0; k < poleH.length; k++) {
    const px = -14 + 3.5 * k, ph = poleH[k];
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, ph, 8), matPole);
    pole.position.set(px, ph / 2, 4.5);
    pole.castShadow = true;
    gateGroup.add(pole);
    const flagGeo = new THREE.PlaneGeometry(2.0, 1.33);
    flagGeo.translate(1.0, 0, 0); // mép bám vào cột
    const flag = new THREE.Mesh(flagGeo, flagMatOf[flagOrder[k]]);
    // v6 (mục 4): đỉnh cờ TĂNG ĐỀU 0.25 m/cột, định nghĩa trực tiếp (không suy từ poleH không đều nên đỉnh cờ từng giảm).
    // k = 0 → 6.3 m, k = 8 → 8.3 m (cờ trái cùng khi nhìn từ đường = cao nhất, đúng ảnh thật). Tâm cờ = đỉnh − 0.665 (cờ cao 1.33 m).
    // Đỉnh cờ cách đỉnh cột ≥ 0.4 m (nhỏ nhất k = 7: 8.8 − 8.05 = 0.75 m); đáy cờ thấp nhất 4.97 m > đỉnh tường 4.4 m.
    const flagTop = 6.3 + 0.25 * k;
    flag.position.set(px + 0.07, flagTop - 0.665, 4.5);
    gateGroup.add(flag);
  }

  // Lề đỏ-trắng xen kẽ dọc mép nam đường perimeter phía trước cổng (8 đỏ + 8 trắng, mỗi đoạn 2 m; v2.8: dời theo cổng)
  const curbRed = new THREE.InstancedMesh(new THREE.BoxGeometry(2, 0.12, 0.5), matBridgeRed, 8);
  const curbWhite = new THREE.InstancedMesh(new THREE.BoxGeometry(2, 0.12, 0.5), matWhite, 8);
  const curbDm = new THREE.Object3D();
  let nRed = 0, nWhite = 0;
  for (let j = 0; j < 16; j++) {
    const isRed = j % 2 === 0;
    // v6 (mục 6): sau khi xoay nhóm cổng π quanh Y: local z = +6.25 → toàn cục z = 104.25 (lề 104.0..104.5, mặt trong chạm mép đường z = 104).
    // y = 0.10: lề cao 0.12 m, đáy 0.04 đặt trên mặt vỉa hè mới (0.04), đỉnh 0.16.
    curbDm.position.set(-15 + 2 * j, 0.10, 6.25);
    curbDm.updateMatrix();
    if (isRed) curbRed.setMatrixAt(nRed++, curbDm.matrix);
    else curbWhite.setMatrixAt(nWhite++, curbDm.matrix);
  }
  curbRed.instanceMatrix.needsUpdate = true;
  curbWhite.instanceMatrix.needsUpdate = true;
  gateGroup.add(curbRed);
  gateGroup.add(curbWhite);

  // v5: XOAY CẢ NHÓM CỔNG 180° quanh trục Y tại (0, 0, 110.5). Sau khi xoay:
  //  - biển (chữ VGU cam) quay ra NAM (+z, phía Vành Đai 4), đúng refs/gate-sign-vgu.webp;
  //  - cột cờ + tường ở BẮC tường (phía khuôn viên);
  //  - mô đất cỏ + đèn rọi ở NAM tường (phía đường).
  // Mọi tọa độ cục bộ phía trên giữ nguyên (đã viết cho trạng thái trước xoay); riêng lề đỏ-trắng đã đổi dấu z.
  gateGroup.position.set(0, 0, 110.5);
  gateGroup.rotation.y = Math.PI;
  group.add(gateGroup);

  // v6 (mục 6): vỉa hè bê tông dọc phía cổng (x −20..20, z 104..106.5, rộng 2.5, mặt trên y = 0.04): mép nam chạm mép đường (z 104),
  // lề đỏ-trắng (z 104..104.5) ngồi hẳn trên vỉa hè. Mô đất ở z ≥ 111 nên không chồng.
  // Tọa độ TOÀN CỤC, thêm vào group (không vào gateGroup đã xoay).
  placeBox(group, THREE, 40, 0.04, 2.5, matConcrete, 0, 0.02, 105.25);

  // v6 (mục 6): vạch kẻ làn đứt trắng trên đường biên nam (z = 100, x −102…15): nét 3 m, khoảng trống 3 m (bước 6 m).
  const laneDashesS = new THREE.Group();
  laneDashesS.name = 'gate-lane-dashes-s';
  // v6 (mục 5): tâm y vạch = mặt đường 0.02 + nửa dày 0.015/2 = 0.0275 (đáy chạm mặt đường, không nổi/chìm).
  for (let x = -100.5; x <= 13.6; x += 6) placeBox(laneDashesS, THREE, 3, 0.015, 0.15, matWhite, x, 0.0275, 100);
  group.add(laneDashesS);

  // v6 (mục 5): vạch đứt trên tim đường VD4 quanh điểm nối (−37, 100): s = −24…+24 bước 6 m dọc hướng VD4, BỎ s = 0
  // (nét đó giao vạch đường biên nam tại (−37, 100), chồng mép ~7 cm). Còn 8 nét.
  const vd4Rot = -Math.atan2(0.7035, 0.7107);
  for (let s = -24; s <= 24; s += 6) {
    if (s === 0) continue;
    const dash = placeBox(group, THREE, 3, 0.015, 0.15, matWhite, -37 + 0.7107 * s, 0.0275, 100 + 0.7035 * s);
    dash.rotation.y = vd4Rot;
  }

  // v6 (mục 3, sửa): 12 cây rậm DỜI RA PHÍA BẮC ĐƯỜNG BIÊN NAM, z 88–94 (cách tường ~16–22 m), cao ≈ 6.3–7.9 m (ngọn tán ≤ 8 m).
  // Lý do: cây cũ ở z 105.5–108 che kín cột cờ (z = 106) từ cả đường lẫn khuôn viên. Nay cờ (gần người xem hơn) lộ rõ trên nền cây;
  // từ đường nhìn vào, cây vẫn hiện ngay sau tường như ảnh thật.
  // Dựng như cây khuôn viên mục (9) (cùng trunkGeo, leafGeos, leafMats, matTrunk); tọa độ cố định, không dùng rng.
  // Tọa độ TOÀN CỤC, thêm vào group (không vào gateGroup).
  // Đợt 3 (mục 3): i=1 [-17,94]→[-17,92] và i=7 [7,94]→[7,92] dời bắc 2 m vì tán vượt mép đường biên nam z = 96
  // (mép tán i=1 là 96.42, i=7 là 96.66); i=0 [-21,90]→[-22,90] và i=8 [11,90]→[12,89] dời để giữ khoảng cách ≥ 5 m với cây kề.
  // Mép tán sau sửa đều ≤ 95.68 (i=11 [21,94], hở 0.32 m tới z = 96 — nhỏ nhất).
  // Ràng buộc đã kiểm: khoảng cách giữa các cây liền kề ≥ 5.0 m (không thành bức tường xanh); z 88–94 (không hàng thẳng);
  // z ≥ 85 không lấn bùng binh; cây gần neo (0, 100) nhất (−1, 92) cách 8.06 m; cây gần (0, 106.6) nhất cách ≥ 14 m.
  {
    const bushPos = [
      [-22, 90], [-17, 92], [-13, 89], [-9, 93], [-5, 88], [-1, 92],
      [3, 89], [7, 92], [12, 89], [15, 93], [19, 89], [21, 94],
    ];
    const bushTrunk = new THREE.InstancedMesh(trunkGeo, matTrunk, bushPos.length);
    bushTrunk.castShadow = true;
    const bushLeaf = leafGeos.map(geo => leafMats.map(mat => {
      const mesh = new THREE.InstancedMesh(geo, mat, bushPos.length);
      mesh.count = 0;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }));
    const bdm = new THREE.Object3D();
    bushPos.forEach(([bx, bz], i) => {
      const s = [0.95, 1.1, 1.2, 1.05][i % 4]; // scale xen kẽ (v6 mục 3: tổng cao ≈ 6.6·s ≈ 6.3–7.9 m)
      const f = 0.85 + ((i * 7) % 5) * 0.075;   // biến thiên tán 0.85–1.15, xác định theo chỉ số
      bdm.position.set(bx, 0, bz);
      bdm.scale.setScalar(s);
      bdm.updateMatrix();
      bushTrunk.setMatrixAt(i, bdm.matrix);
      bdm.position.set(bx, 4.6 * s, bz);
      bdm.scale.setScalar(s * f);
      bdm.updateMatrix();
      const leafMesh = bushLeaf[i % leafGeos.length][i % leafMats.length];
      leafMesh.setMatrixAt(leafMesh.count++, bdm.matrix);
    });
    bushTrunk.instanceMatrix.needsUpdate = true;
    group.add(bushTrunk);
    for (const row of bushLeaf) for (const mesh of row) {
      if (mesh.count) {
        mesh.instanceMatrix.needsUpdate = true;
        group.add(mesh);
      }
    }
  }

  // v5b (mục 1, BLOCKER): hộp CHẶN CAMERA bao hàng cột cờ (world z = 110.5 − 4.5 = 106; x −16.5…16.5 bao cờ).
  // Spawn tại neo cổng (0, 100); camera sau lưng 6.6 m → (0, ~4, 106.6) sát trục cột giữa x = 0 nên cột lấp khung.
  // updateCamera chỉ kiểm tra hộp cản + lưới cao độ, không thấy cột mảnh → hộp này để camera tự kéo về phía bắc.
  // Dày 1.6 m theo z (105.2…106.8): updateCamera lấy 12 mẫu (bước ~0.55 m) nên có ≥ 2 mẫu trúng hộp.
  // visible = false: KHÔNG vẽ, KHÔNG vào lưới đi bộ (buildNav bỏ qua vật ẩn). Trang HTML đọc userData.camBlocker.
  const gateCamBlock = new THREE.Mesh(new THREE.BoxGeometry(33, 10, 1.6), matWhite);
  gateCamBlock.position.set(0, 5, 106);
  gateCamBlock.visible = false;
  gateCamBlock.userData.camBlocker = true;
  gateCamBlock.name = 'gate-cam-blocker';
  group.add(gateCamBlock);

  // =====================================================
  // ANCHORS — Vị trí đi bộ mặt đất theo hợp đồng 8 khóa
  // =====================================================
  // v5: 7 điểm dừng tour theo bảng mục 6.2 (+ cửa tòa xám ở mặt nam, cách cửa 1.6 m)
  const anchors = {
    mainGate: new THREE.Vector3(0, 0, 100),                  // mặt đường biên nam (mép 96..104)
    mainBuildingEntrance: new THREE.Vector3(-74.5, 0, 26),   // cửa chính tòa xám, mặt nam (x −74.5, z 24)
    mainBuildingFront: new THREE.Vector3(-74.5, 0, 30),      // vỉa hè trước cửa
    mainBuilding: new THREE.Vector3(-56, 0, 34),             // tour "Tòa nhà chính" (bảng: quảng trường trước mặt nam)
    lectureHall: new THREE.Vector3(14, 0, 28),               // trước hàng cột mặt nam hội trường ~7 m
    domeOval: new THREE.Vector3(43, 0, 55),                  // phía nam vòm oval (mới v5)
    pool: new THREE.Vector3(104, 0, -12),                    // phía nam hồ bơi (v5b: theo hồ mới, cách mép sàn ~4.5 m)
    track: new THREE.Vector3(74, 0, -40),                    // phía nam đường chạy
    canalBridge: new THREE.Vector3(14, 0, 57),               // đầu nam cầu đỏ, sát bùng binh (mặt đất)
  };

  return { group, anchors, buildings };
}

// ========== LIGHTING SETUP ==========
export function setupLighting(scene, THREE) {
  // Ánh nắng chính từ hướng đông-nam, đổ bóng sắc nét (giữ nguyên không làm cháy mặt nam)
  const sun = new THREE.DirectionalLight(0xfff4e0, 1.45);
  sun.position.set(80, 120, 60);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.left = -200;
  sun.shadow.camera.right = 200;
  sun.shadow.camera.top = 200;
  sun.shadow.camera.bottom = -200;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 400;
  sun.shadow.bias = -0.001;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);

  // Đèn fill từ tây-bắc — tăng cường độ để bù sáng các mặt phía tây và bắc
  const fillLight = new THREE.DirectionalLight(0xdce8f8, 0.85);
  fillLight.position.set(-60, 90, -110);
  fillLight.castShadow = false;
  scene.add(fillLight);

  // Đèn chuyên dụng rọi mặt bắc (North Fill Light) — chiếu trực diện từ Bắc vào Nam (z âm -> z dương),
  // làm sáng rõ mặt đứng bắc tòa xám, sân trong và ban công mà tuyệt đối không rọi vào mặt nam
  const northFill = new THREE.DirectionalLight(0xe4efff, 0.75);
  northFill.position.set(-55, 65, -120);
  northFill.target.position.set(-55, 10, -20);
  northFill.castShadow = false;
  scene.add(northFill);
  scene.add(northFill.target);

  // Đèn fill từ phía nam (vòng sửa 4): mặt nam chỉ nhận nắng góc nhỏ (nắng từ +z ≈ 0.39), nên bổ sung ánh sáng
  // trực diện từ nam, KHÔNG đổ bóng để không làm đen/đổi bóng hiện có.
  // v2.7: 0.55 → 0.62 (bù mặt nam tầng trên; mặt tiền xám đã giảm metalness nên không cháy các mặt nam khác)
  const southFill = new THREE.DirectionalLight(0xf6f2ea, 0.62);
  southFill.position.set(-40, 70, 120);
  southFill.castShadow = false;
  southFill.target.position.set(-55, 8, -20);
  scene.add(southFill);
  scene.add(southFill.target);

  // v7 đợt 4 (mục 1): đèn fill từ ĐÔNG-BẮC rọi mặt râm (mặt ngoài) tòa cam. Hướng = pháp tuyến mặt ngoài tòa cam
  // (cụm KTX xoay −45°): (+0,707, 0, −0,707). Đèn không đổ bóng; chỉ thêm sáng cho mặt có pháp tuyến đông-bắc.
  // Tông trung tính ấm như southFill (không đổi màu cam). Cường độ 0,6 — ước lượng, CHƯA kiểm chứng bằng render.
  const KTX_FILL_TARGET = { x: -111.0, y: 6, z: 61.6 };   // tâm cụm KTX (mặt đất ~ bậc mái thấp)
  const ktxNeFill = new THREE.DirectionalLight(0xf6f2ea, 0.6);
  ktxNeFill.position.set(KTX_FILL_TARGET.x + 56.6, 66, KTX_FILL_TARGET.z - 56.6);   // 80 m theo hướng đông-bắc, cao ~37°
  ktxNeFill.target.position.set(KTX_FILL_TARGET.x, KTX_FILL_TARGET.y, KTX_FILL_TARGET.z);
  ktxNeFill.castShadow = false;
  scene.add(ktxNeFill);
  scene.add(ktxNeFill.target);

  // Ánh sáng môi trường tán xạ bầu trời và mặt đất — nâng nhẹ để chi tiết vùng tối rõ nét
  const hemi = new THREE.HemisphereLight(0x8ec5f0, 0x5a7d3c, 1.20);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0x6c6c74, 0.65);
  scene.add(ambient);

  scene.fog = new THREE.Fog(0xc8dfe8, 250, 900);
  scene.background = new THREE.Color(0x87CEEB);
}

/**
 * VGU Campus Exterior — v2.6 (Vòng sửa 3/3 - VÒNG CUỐI: Facade crop chuẩn 100%, Skirt UV thế giới, Sân trong hành lang mở 3 tầng, Chiếu sáng mặt bắc)
 * Module ES: buildExterior(THREE), setupLighting(scene, THREE)
 *
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
BỐ CỤC NGOẠI THẤT VGU BẾN CÁT (v2.6 — Nghiệm thu vòng cuối 3/3):
• Tòa chính xám (mainBuilding, world x=-55, z=-20):
  - Khối trước (55×22×15 m) ốp kim loại xám bạc (facade-main-gray.jpg crop chuẩn sạch 100% từ drone nho-gray-02 x:40..1240, y:808..906).
  - Tầng trệt phía phải cửa: dải kính dài (x: -13.9..22.5) + hàng cột trắng + giàn leo che nắng
    có cây leo + hộp điểm nhấn xanh teal ở đầu góc đông (x: 22.5..27.5).
  - 2 hốc cửa sổ cam xếp theo chiều dọc (chồng lên nhau ở phần trái mặt tiền, tâm x=-10.0):
    Hốc trên (tầng 4, rộng 7.0×2.4 m), Hốc dưới (tầng 2-3, rộng 4.6×3.2 m).
    Mặt facade được cắt lỗ thật (7 panel khớp UV liên tục), hốc thụt sâu 0.8 m có thành cam và đáy kính sẫm.
  - Khối sau (46×18×21 m): khối xám nhô ra (cantilever) trên lối đi mở tầng trệt (undercroft sâu 4.5 m,
    cao 4.8 m có hàng cột chịu lực) với cửa sổ lớn mặt bắc và 2 dãy hành lang mở 3 tầng bao quanh sân trong (theo ảnh nho-gray-04).
  - Mái: hộp cam trên khối sau, hộp đỏ trên khối trước, cụm HVAC trắng và ống dẫn bạc. Không có biển chữ VGU.
• Cầu đi bộ đỏ qua kênh (canalBridge):
  - Dời sang tâm x = 15.0 (deck z ≈ 1.765, mút dốc bắc z ≈ -7.74).
  - Hạ cánh ngay hành lang giữa tòa SW (kết thúc ở x=9.0) và tòa SE (bắt đầu ở x=21.0) của cụm trắng.
  - Khoảng trống đi bộ tại mút dốc bắc đạt >= 4.0 m theo mọi hướng (mép deck x: 13..17 cách tường SW 4.0 m, cách tường SE 4.0 m,
    phía bắc thông suốt >18 m), lộ trình cổng chính → cầu → giảng đường / tòa chính hoàn toàn liên thông.
  - Cây cố định tại (12, -22) đặt sát mép đông tòa SW (cách tường 3 m), không chắn lối đi bộ x=13..17.
• Nền đất: nền ngoài 2400×1800 m dùng chung texture grass.jpg (repeat 240×180) phẳng mịn tiệm cận tấm khuôn viên,
  kèm dải viền chuyển tiếp 10 m được căn UV thế giới liền mạch hoàn toàn qua mép.
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

// ========== MAIN BUILD FUNCTION ==========
export function buildExterior(THREE) {
  const group = new THREE.Group();
  group.name = 'vgu-exterior-v2';

  // --- Shared materials ---
  const grassTex = loadTex(THREE, 'grass.jpg', 60, 45);
  const outerGrassTex = loadTex(THREE, 'grass.jpg', 240, 180);
  const asphaltTex = loadTex(THREE, 'asphalt.jpg', 20, 80);
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
  const matAsphalt = new THREE.MeshStandardMaterial({ map: asphaltTex, roughness: 0.85, metalness: 0.05 });
  const matWater = new THREE.MeshStandardMaterial({ map: waterTex, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.85 });
  const matConcrete = new THREE.MeshStandardMaterial({ map: concreteTex, roughness: 0.8, metalness: 0.0 });
  const matMetal = new THREE.MeshStandardMaterial({ map: metalTex, roughness: 0.4, metalness: 0.5 });
  const matWhite = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.7, metalness: 0.0 });
  const matWhiteFacade = new THREE.MeshStandardMaterial({ map: whiteFacadeTex, roughness: 0.7, metalness: 0.0 });
  const matRoof = new THREE.MeshStandardMaterial({ map: roofTex, roughness: 0.9, metalness: 0.0 });
  const matGlass = new THREE.MeshStandardMaterial({ color: 0x4a7a90, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.65 });
  const matGlassDark = new THREE.MeshStandardMaterial({ color: 0x182430, roughness: 0.15, metalness: 0.6, transparent: true, opacity: 0.85 });
  const matAccentRed = new THREE.MeshStandardMaterial({ color: 0xc03020, roughness: 0.5, metalness: 0.2 });
  const matAccentOrange = new THREE.MeshStandardMaterial({ color: 0xe8782a, roughness: 0.5, metalness: 0.15 });
  const matAccentGreen = new THREE.MeshStandardMaterial({ color: 0x2a7b7a, roughness: 0.45, metalness: 0.15 });
  const matTrellis = new THREE.MeshStandardMaterial({ color: 0x44484c, roughness: 0.5, metalness: 0.4 });
  const matWindow = new THREE.MeshStandardMaterial({ color: 0xd0e8f0, roughness: 0.2, metalness: 0.15, transparent: true, opacity: 0.5 });
  const matOvalWhite = new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.5, metalness: 0.1 });
  const matGray = new THREE.MeshStandardMaterial({ color: 0x808890, roughness: 0.5, metalness: 0.4 });
  const matCharcoal = new THREE.MeshStandardMaterial({ color: 0x383e44, roughness: 0.45, metalness: 0.5 });
  const matBackCladding = new THREE.MeshStandardMaterial({ color: 0x8a929b, roughness: 0.45, metalness: 0.45 });
  const matSilverDuct = new THREE.MeshStandardMaterial({ color: 0xd8e0e8, roughness: 0.25, metalness: 0.8 });
  const matBridge = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.5, metalness: 0.3 });
  const matBridgeRed = new THREE.MeshStandardMaterial({ color: 0xb83020, roughness: 0.5, metalness: 0.3 });
  const matBlue = new THREE.MeshStandardMaterial({ color: 0xb0d0e8, roughness: 0.7, metalness: 0.0 });
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

  // Tấm khuôn viên chính 600×450 m
  const groundGeo = new THREE.PlaneGeometry(600, 450);
  const ground = new THREE.Mesh(groundGeo, matGrass);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  group.add(ground);

  // Dải viền chuyển tiếp (skirt apron) rộng 10 m bao quanh mép 600×450 m, xóa sạch đường ranh giới
  const skirtShape = new THREE.Shape();
  skirtShape.moveTo(-305, -230);
  skirtShape.lineTo(305, -230);
  skirtShape.lineTo(305, 230);
  skirtShape.lineTo(-305, 230);
  skirtShape.lineTo(-305, -230);
  const skirtHole = new THREE.Path();
  skirtHole.moveTo(-295, -220);
  skirtHole.lineTo(295, -220);
  skirtHole.lineTo(295, 220);
  skirtHole.lineTo(-295, 220);
  skirtHole.lineTo(-295, -220);
  skirtShape.holes.push(skirtHole);
  const skirtGeo = new THREE.ShapeGeometry(skirtShape);
  skirtGeo.rotateX(-Math.PI / 2);

  // Căn UV của skirt theo hệ tọa độ thế giới (10 m / chu kỳ lặp khớp hoàn toàn với PlaneGeometry 600×450)
  // Xóa sạch hiện tượng lệch pha vân cỏ tại mép tiếp giáp giữa tấm chính và skirt
  const skirtPos = skirtGeo.attributes.position;
  const skirtUv = skirtGeo.attributes.uv;
  for (let i = 0; i < skirtPos.count; i++) {
    const px = skirtPos.getX(i);
    const pz = skirtPos.getZ(i);
    skirtUv.setXY(i, (px + 300) / 600, (-pz + 225) / 450);
  }
  skirtUv.needsUpdate = true;

  const skirtMesh = new THREE.Mesh(skirtGeo, matGrass);
  skirtMesh.position.y = -0.0502;
  skirtMesh.receiveShadow = true;
  group.add(skirtMesh);

  // =====================================================
  // (1b) ROADS — đường giao thông nội khu
  // =====================================================
  const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(8, 220), matAsphalt);
  roadNS.rotation.x = -Math.PI / 2;
  roadNS.position.set(0, 0.02, 0);
  roadNS.receiveShadow = true;
  group.add(roadNS);

  const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(200, 7), matAsphalt);
  roadEW.rotation.x = -Math.PI / 2;
  roadEW.position.set(0, 0.02, -30);
  roadEW.receiveShadow = true;
  group.add(roadEW);

  const roadSouth = new THREE.Mesh(new THREE.PlaneGeometry(140, 7), matAsphalt);
  roadSouth.rotation.x = -Math.PI / 2;
  roadSouth.position.set(0, 0.02, 85);
  roadSouth.receiveShadow = true;
  group.add(roadSouth);

  const roadEast = new THREE.Mesh(new THREE.PlaneGeometry(7, 150), matAsphalt);
  roadEast.rotation.x = -Math.PI / 2;
  roadEast.position.set(90, 0.02, -10);
  roadEast.receiveShadow = true;
  group.add(roadEast);

  const roadPerimS = new THREE.Mesh(new THREE.PlaneGeometry(250, 8), matAsphalt);
  roadPerimS.rotation.x = -Math.PI / 2;
  roadPerimS.position.set(20, 0.02, 100);
  roadPerimS.receiveShadow = true;
  group.add(roadPerimS);

  const vd4Geo = new THREE.PlaneGeometry(18, 350);
  const vd4 = new THREE.Mesh(vd4Geo, matAsphalt);
  vd4.rotation.x = -Math.PI / 2;
  vd4.rotation.z = Math.PI * 0.12;
  vd4.position.set(-130, 0.01, 30);
  vd4.receiveShadow = true;
  group.add(vd4);

  // =====================================================
  // (1c) ROUNDABOUT — đảo tròn giao thông
  // =====================================================
  const rbGeo = new THREE.CylinderGeometry(15, 15, 0.15, 32);
  const roundabout = new THREE.Mesh(rbGeo, matGrass);
  roundabout.position.set(0, 0.08, 75);
  roundabout.receiveShadow = true;
  group.add(roundabout);

  const rbRoadShape = new THREE.Shape();
  rbRoadShape.absarc(0, 0, 20, 0, Math.PI * 2, false);
  const rbHole = new THREE.Path();
  rbHole.absarc(0, 0, 14, 0, Math.PI * 2, true);
  rbRoadShape.holes.push(rbHole);
  const rbRoadGeo = new THREE.ShapeGeometry(rbRoadShape, 32);
  rbRoadGeo.rotateX(-Math.PI / 2);
  const rbRoad = new THREE.Mesh(rbRoadGeo, matAsphalt);
  rbRoad.position.set(0, 0.03, 75);
  rbRoad.receiveShadow = true;
  group.add(rbRoad);

  // =====================================================
  // (1d) CANAL — kênh uốn lượn
  // =====================================================
  const canalPoints = [
    [-200, 12],
    [-140, 10],
    [-110, 12],
    [-82, 8],
    [-55, 2],
    [-27, -2],
    [0, 0],
    [17, 2],
    [50, 2],
    [75, 8],
    [100, 20],
    [130, 30],
    [160, 42],
  ];

  for (let i = 0; i < canalPoints.length - 1; i++) {
    const [x0, z0] = canalPoints[i];
    const [x1, z1] = canalPoints[i + 1];
    const dx = x1 - x0;
    const dz = z1 - z0;
    const len = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);

    const seg = new THREE.Mesh(
      new THREE.PlaneGeometry(12, len + 2),
      matWater
    );
    seg.rotation.x = -Math.PI / 2;
    seg.rotation.z = -angle;
    seg.position.set((x0 + x1) / 2, 0.04, (z0 + z1) / 2);
    seg.receiveShadow = true;
    group.add(seg);

    for (const side of [-1, 1]) {
      const bank = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.5, len + 2),
        matConcrete
      );
      bank.position.set(
        (x0 + x1) / 2 + side * 6.3 * Math.cos(angle),
        0.25,
        (z0 + z1) / 2 - side * 6.3 * Math.sin(angle)
      );
      bank.rotation.y = -angle;
      bank.castShadow = true;
      bank.receiveShadow = true;
      group.add(bank);
    }
  }

  function canalZAtX(xTarget) {
    for (let i = 0; i < canalPoints.length - 1; i++) {
      const [x0, z0] = canalPoints[i];
      const [x1, z1] = canalPoints[i + 1];
      if ((xTarget >= x0 && xTarget <= x1) || (xTarget >= x1 && xTarget <= x0)) {
        const t = (xTarget - x0) / (x1 - x0);
        return z0 + t * (z1 - z0);
      }
    }
    return 0;
  }

  // =====================================================
  // (1e) BRIDGES — CẦU QUA KÊNH
  // =====================================================
  // --- RED PEDESTRIAN BRIDGE (CẦU ĐỎ) ---
  // SỬA LỖI 1: Cầu đỏ dời sang x = 15.0.
  // Tại x = 15.0: tâm kênh z ≈ 1.765. Mặt cầu dài 14 m (từ z=-5.24 đến z=8.76).
  // Mút dốc bắc (dài 2.5 m) chạm đất tại z = -7.74.
  // Khoảng cách tới tòa SW (mặt đông x=9.0): 13.0 - 9.0 = 4.0 m >= 3.0 m.
  // Khoảng cách tới tòa SE (mặt tây x=21.0): 21.0 - 17.0 = 4.0 m >= 3.0 m.
  // Phía bắc là hành lang giữa 2 tòa rộng 12 m, trống suốt >18 m lên sân trung tâm.
  const redBridgeX = 15.0;
  const redBridgeZ = canalZAtX(redBridgeX); // ≈ 1.7647
  const RED_DECK_Y = 1.35;
  const RED_RAMP_LEN = 2.5;

  const redBridgeGroup = new THREE.Group();
  redBridgeGroup.name = 'bridge-red';
  // Deck mặt cầu rộng 4 m, dài 14 m
  placeBox(redBridgeGroup, THREE, 4, 0.3, 14, matBridgeRed, 0, RED_DECK_Y, 0);
  // Railings
  placeBox(redBridgeGroup, THREE, 0.1, 1.0, 14, matBridgeRed, -1.9, RED_DECK_Y + 0.5, 0);
  placeBox(redBridgeGroup, THREE, 0.1, 1.0, 14, matBridgeRed, 1.9, RED_DECK_Y + 0.5, 0);
  // Posts
  for (let zi = -6; zi <= 6; zi += 3) {
    placeBox(redBridgeGroup, THREE, 0.15, 1.5, 0.15, matBridgeRed, -1.9, RED_DECK_Y + 0.3, zi);
    placeBox(redBridgeGroup, THREE, 0.15, 1.5, 0.15, matBridgeRed, 1.9, RED_DECK_Y + 0.3, zi);
  }
  // Dốc 2 đầu (đầu bắc chạm đất tại z = -7.74; đầu nam tại z = 11.26)
  for (const dir of [-1, 1]) {
    const rampGeo = new THREE.BoxGeometry(4, 0.2, RED_RAMP_LEN);
    const ramp = new THREE.Mesh(rampGeo, matBridgeRed);
    ramp.position.set(0, RED_DECK_Y / 2, dir * (7 + RED_RAMP_LEN / 2));
    ramp.rotation.x = dir * Math.atan2(RED_DECK_Y, RED_RAMP_LEN);
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    redBridgeGroup.add(ramp);
  }
  redBridgeGroup.position.set(redBridgeX, 0, redBridgeZ);
  group.add(redBridgeGroup);

  // --- WHITE TRUSS BRIDGE (CẦU TRẮNG) ---
  const whiteBridgeX = -25;
  const whiteBridgeZ = canalZAtX(whiteBridgeX);
  const WHITE_DECK_Y = 1.175;
  const WHITE_RAMP_LEN = 2.8;

  const whiteBridgeGroup = new THREE.Group();
  whiteBridgeGroup.name = 'bridge-white';
  placeBox(whiteBridgeGroup, THREE, 5, 0.35, 16, matBridge, 0, WHITE_DECK_Y, 0);
  placeBox(whiteBridgeGroup, THREE, 0.15, 4.0, 16, matBridge, -2.4, WHITE_DECK_Y + 2.0, 0);
  placeBox(whiteBridgeGroup, THREE, 0.15, 4.0, 16, matBridge, 2.4, WHITE_DECK_Y + 2.0, 0);
  placeBox(whiteBridgeGroup, THREE, 5, 0.3, 16, matBridge, 0, WHITE_DECK_Y + 4.0, 0);
  for (let zi = -6; zi <= 6; zi += 4) {
    for (const sx of [-1, 1]) {
      const brace = placeBox(whiteBridgeGroup, THREE, 0.1, 4.5, 0.1, matBridge,
        sx * 2.4, WHITE_DECK_Y + 2.0, zi);
      brace.rotation.z = sx * 0.4;
    }
  }
  for (const dir of [-1, 1]) {
    const rampGeo = new THREE.BoxGeometry(5, 0.2, WHITE_RAMP_LEN);
    const ramp = new THREE.Mesh(rampGeo, matBridge);
    ramp.position.set(0, WHITE_DECK_Y / 2, dir * (8 + WHITE_RAMP_LEN / 2));
    ramp.rotation.x = dir * Math.atan2(WHITE_DECK_Y, WHITE_RAMP_LEN);
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    whiteBridgeGroup.add(ramp);
  }
  whiteBridgeGroup.position.set(whiteBridgeX, 0, whiteBridgeZ);
  group.add(whiteBridgeGroup);

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
  // - 2 hốc cam xếp theo CHIỀU DỌC (chồng lên nhau ở phần trái mặt tiền x ≈ -10.0).
  // - Cắt lỗ THẬT trên mặt facade xung quanh 2 hốc cam; hốc lõm 3D sâu 0.8 m với kính sẫm ở đáy.
  // - Mái: hộp cam khối sau, hộp đỏ khối trước, HVAC trắng, ống bạc.
  // - TUYỆT ĐỐI KHÔNG CÓ BIỂN CHỮ "VGU" TRÊN TÒA XÁM.
  const mainB = new THREE.Group();
  mainB.name = 'main-building';

  const MB_W = 55, MB_D = 22, MB_H = 15;
  const MB_BACK_W = 46, MB_BACK_D = 18, MB_BACK_H = 21;
  const backOffsetX = 6.0;
  const backOffsetZ = -6.0;
  const UNDER_H = 4.8; // Chiều cao thông thủy lối đi mở sân trong

  // --- 2a. Khối sau & Sân trong (Tái hiện chi tiết ảnh đối chiếu nho-gray-04) ---
  // Khối thân trên nhô ra (cantilever từ y = UNDER_H đến MB_BACK_H) dùng vật liệu xám bạc sáng
  const backUpperH = MB_BACK_H - UNDER_H;
  placeBox(mainB, THREE, MB_BACK_W, backUpperH, MB_BACK_D, matBackCladding,
    backOffsetX, UNDER_H + backUpperH / 2, backOffsetZ);
  // Trần vát sáng màu dưới đáy khối nhô ra (underside cantilever tại y = UNDER_H)
  placeBox(mainB, THREE, MB_BACK_W, 0.2, MB_BACK_D, matWhite,
    backOffsetX, UNDER_H - 0.1, backOffsetZ);

  // Cửa sổ mặt bắc khối sau (tầng 4 và tầng 5 nhìn ra sân trong theo ảnh nho-gray-04)
  const northWinY1 = UNDER_H + 3.8;
  const northWinY2 = UNDER_H + 9.2;
  for (let nx = backOffsetX - MB_BACK_W / 2 + 5; nx <= backOffsetX + MB_BACK_W / 2 - 5; nx += 7) {
    placeBox(mainB, THREE, 3.2, 2.2, 0.2, matWindow, nx, northWinY1, backOffsetZ - MB_BACK_D / 2 - 0.05);
    placeBox(mainB, THREE, 3.2, 2.2, 0.2, matWindow, nx, northWinY2, backOffsetZ - MB_BACK_D / 2 - 0.05);
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

  [
    { x: westWingX, innerSide: +1 }, // Cánh tây, mặt mở nhìn về phía đông (+x)
    { x: eastWingX, innerSide: -1 }, // Cánh đông, mặt mở nhìn về phía tây (-x)
  ].forEach(wing => {
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

  placeBox(mainB, THREE, DOOR_W + 0.4, 0.15, 0.4, matWhite, DOOR_X, DOOR_H + 0.08, southZ + 0.08);
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
  placeBox(mainB, THREE, glassW, 3.6, 0.15, matGlassDark,
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
  const mainFacadeMat = new THREE.MeshStandardMaterial({
    map: facadeGrayTex,
    roughness: 0.4,
    metalness: 0.5
  });

  // Tọa độ 2 hốc cam xếp dọc (chồng lên nhau ở phần trái mặt tiền, tâm x = -10.0):
  // - Hốc trên (tầng 4): x từ -13.5 đến -6.5 (rộng 7.0 m), y từ 11.8 đến 14.2 (cao 2.4 m, tỉ lệ ngang dài)
  // - Hốc dưới (tầng 2-3): x từ -12.3 đến -7.7 (rộng 4.6 m), y từ 6.0 đến 9.2 (cao 3.2 m, tỉ lệ đứng hơn)
  // Cả hai hốc thụt sâu 0.8 m vào bên trong.
  const NICHE_X = -10.0;
  const NICHE_DEPTH = 0.8;

  const N_UPPER = { x0: -13.5, x1: -6.5, y0: 11.8, y1: 14.2 }; // w=7.0, h=2.4
  const N_LOWER = { x0: -12.3, x1: -7.7, y0: 6.0,  y1: 9.2  }; // w=4.6, h=3.2

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
  // Panel 1: Cánh tây (toàn bộ chiều cao từ mép tây đến mép trái cột hốc)
  mainB.add(createFacadePanel(-MB_W / 2, -13.5, 3.8, MB_H, fz));
  // Panel 2: Cánh đông (toàn bộ chiều cao từ mép phải cột hốc đến mép đông)
  mainB.add(createFacadePanel(-6.5, MB_W / 2, 3.8, MB_H, fz));
  // Panel 3: Dải đáy dưới hốc dưới (y: 3.8 .. 6.0)
  mainB.add(createFacadePanel(-13.5, -6.5, 3.8, N_LOWER.y0, fz));
  // Panel 4: Dải bên trái hốc dưới (x: -13.5 .. -12.3, y: 6.0 .. 9.2)
  mainB.add(createFacadePanel(-13.5, N_LOWER.x0, N_LOWER.y0, N_LOWER.y1, fz));
  // Panel 5: Dải bên phải hốc dưới (x: -7.7 .. -6.5, y: 6.0 .. 9.2)
  mainB.add(createFacadePanel(N_LOWER.x1, -6.5, N_LOWER.y0, N_LOWER.y1, fz));
  // Panel 6: Dải trung gian giữa 2 hốc (y: 9.2 .. 11.8)
  mainB.add(createFacadePanel(-13.5, -6.5, N_LOWER.y1, N_UPPER.y0, fz));
  // Panel 7: Dải đỉnh trên hốc trên (y: 14.2 .. 15.0)
  mainB.add(createFacadePanel(-13.5, -6.5, N_UPPER.y1, MB_H, fz));

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

  mainB.position.set(-55, 0, -20);
  group.add(mainB);
  buildings.mainBuilding = mainB;

  // =====================================================
  // (3) WHITE CLUSTER — 4 TÒA NHÀ TRẮNG TRUNG TÂM
  // =====================================================
  // Cụm đặt tại group (10, 0, 20).
  // Tòa Tây-Nam (SW): world center (-6, -18.5), w=30, d=16 -> world x in [-21, 9], z in [-26.5, -10.5].
  // Tòa Đông-Nam (SE): world center (35, -14.0), w=28, d=15 -> world x in [21, 49], z in [-21.5, -6.5].
  // Hành lang giữa tòa SW và SE: x từ 9.0 đến 21.0 (rộng 12.0 m).
  // Cầu đỏ tâm x=15.0 rộng 4 m (x: 13..17): cách tòa SW 4.0 m, cách tòa SE 4.0 m -> thông thoáng hoàn toàn.
  const whiteCluster = new THREE.Group();
  whiteCluster.name = 'white-cluster';

  const whiteBuildings = [
    { x: -20, z: 0, w: 35, d: 18, h: 20 },      // northwest (world center: -10, 20)
    { x: 20, z: 0, w: 30, d: 16, h: 18 },       // northeast (world center: 30, 20)
    { x: -16, z: -38.5, w: 30, d: 16, h: 16 },  // southwest (world center: -6, -18.5) — ĐÃ ĐIỀU CHỈNH THÔNG THOÁNG CẦU
    { x: 25, z: -34.0, w: 28, d: 15, h: 20 },   // southeast (world center: 35, -14.0)
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

  whiteCluster.position.set(10, 0, 20);
  group.add(whiteCluster);
  buildings.whiteCluster = whiteCluster;

  // =====================================================
  // (4) LECTURE HALL — giảng đường + mái vòm oval
  // =====================================================
  const lectureHall = new THREE.Group();
  lectureHall.name = 'lecture-hall';

  const LH_W = 65, LH_D = 20, LH_H = 14;
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

  const ovalGeo = new THREE.SphereGeometry(16, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const oval = new THREE.Mesh(ovalGeo, matOvalWhite);
  oval.scale.set(1.5, 0.75, 1);
  oval.position.set(LH_W / 2 + 20, 0, 5);
  oval.castShadow = true;
  oval.receiveShadow = true;
  lectureHall.add(oval);

  const ovalBase = new THREE.Mesh(
    new THREE.CylinderGeometry(24, 24, 2, 32),
    matGray
  );
  ovalBase.scale.set(1, 1, 0.65);
  ovalBase.position.set(LH_W / 2 + 20, 1, 5);
  ovalBase.castShadow = true;
  lectureHall.add(ovalBase);

  lectureHall.position.set(50, 0, 20);
  group.add(lectureHall);
  buildings.ovalHall = lectureHall;

  // =====================================================
  // (5) SPORTS AREA — khu thể thao
  // =====================================================
  const trackShape = new THREE.Shape();
  trackShape.absarc(0, 0, 32, 0, Math.PI * 2, false);
  const trackHole = new THREE.Path();
  trackHole.absarc(0, 0, 25, 0, Math.PI * 2, true);
  trackShape.holes.push(trackHole);

  const trackGeo = new THREE.ShapeGeometry(trackShape, 48);
  trackGeo.rotateX(-Math.PI / 2);
  const trackMesh = new THREE.Mesh(trackGeo, new THREE.MeshStandardMaterial({ map: trackTex, roughness: 0.8, metalness: 0.0 }));
  trackMesh.position.set(140, 0.03, -50);
  trackMesh.receiveShadow = true;
  group.add(trackMesh);

  const infieldGeo = new THREE.CircleGeometry(25, 32);
  infieldGeo.rotateX(-Math.PI / 2);
  const infield = new THREE.Mesh(infieldGeo, matGrass);
  infield.position.set(140, 0.02, -50);
  infield.receiveShadow = true;
  group.add(infield);

  const tennisMat = new THREE.MeshStandardMaterial({ map: tennisTex, roughness: 0.75, metalness: 0.0 });
  for (let ti = 0; ti < 2; ti++) {
    const court = new THREE.Mesh(new THREE.PlaneGeometry(18, 36), tennisMat);
    court.rotation.x = -Math.PI / 2;
    court.position.set(140 + 50 + ti * 20, 0.04, -40);
    court.receiveShadow = true;
    group.add(court);
  }

  const sportsHall = new THREE.Group();
  sportsHall.name = 'sports-hall';
  placeBox(sportsHall, THREE, 50, 12, 35, matWhite, 0, 6, 0);
  placeBox(sportsHall, THREE, 52, 1, 37, matDarkRoof, 0, 12.5, 0);
  placeBox(sportsHall, THREE, 50, 2, 0.2, matWindow, 0, 10, 17.5);
  placeBox(sportsHall, THREE, 50, 2, 0.2, matWindow, 0, 10, -17.5);

  sportsHall.position.set(190, 0, -50);
  group.add(sportsHall);
  buildings.sportsHall = sportsHall;

  // =====================================================
  // (6) POOL — hồ bơi
  // =====================================================
  const poolMat = new THREE.MeshStandardMaterial({ map: poolTex, roughness: 0.1, metalness: 0.05 });
  const poolSurface = new THREE.Mesh(new THREE.PlaneGeometry(25, 12), poolMat);
  poolSurface.rotation.x = -Math.PI / 2;
  poolSurface.position.set(190, 0.05, 10);
  poolSurface.receiveShadow = true;
  group.add(poolSurface);

  const poolDeckShape = new THREE.Shape();
  poolDeckShape.moveTo(-15, -8);
  poolDeckShape.lineTo(15, -8);
  poolDeckShape.lineTo(15, 8);
  poolDeckShape.lineTo(-15, 8);
  poolDeckShape.lineTo(-15, -8);
  const poolHole = new THREE.Path();
  poolHole.moveTo(-12.5, -6);
  poolHole.lineTo(12.5, -6);
  poolHole.lineTo(12.5, 6);
  poolHole.lineTo(-12.5, 6);
  poolHole.lineTo(-12.5, -6);
  poolDeckShape.holes.push(poolHole);
  const poolDeckGeo = new THREE.ShapeGeometry(poolDeckShape);
  poolDeckGeo.rotateX(-Math.PI / 2);
  const poolDeck = new THREE.Mesh(poolDeckGeo, matConcrete);
  poolDeck.position.set(190, 0.06, 10);
  poolDeck.receiveShadow = true;
  group.add(poolDeck);

  // =====================================================
  // (7) COURTYARD BUILDING
  // =====================================================
  const courtyardB = new THREE.Group();
  courtyardB.name = 'courtyard-building';

  const CB_W = 50, CB_D = 40, CB_H = 18;
  const FLOOR_H = 3.6;
  placeBox(courtyardB, THREE, CB_W, CB_H, 6, matBlue, 0, CB_H / 2, -CB_D / 2 + 3);
  placeBox(courtyardB, THREE, CB_W, CB_H, 6, matBlue, 0, CB_H / 2, CB_D / 2 - 3);
  placeBox(courtyardB, THREE, 6, CB_H, CB_D, matBlue, -CB_W / 2 + 3, CB_H / 2, 0);

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

  courtyardB.position.set(100, 0, 60);
  group.add(courtyardB);
  buildings.courtyardBuilding = courtyardB;

  // =====================================================
  // (8) ORGANIC ROOF BUILDING
  // =====================================================
  const organicB = new THREE.Group();
  organicB.name = 'organic-building';

  const organicRoof = new THREE.Mesh(
    new THREE.SphereGeometry(14, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.4),
    matWhite
  );
  organicRoof.scale.set(1.5, 0.6, 1);
  organicRoof.position.set(0, 4, 0);
  organicRoof.castShadow = true;
  organicRoof.receiveShadow = true;
  organicB.add(organicRoof);

  const orgBase = new THREE.Mesh(
    new THREE.CylinderGeometry(18, 20, 4, 24),
    matWhite
  );
  orgBase.scale.set(1.2, 1, 0.8);
  orgBase.position.set(0, 2, 0);
  orgBase.castShadow = true;
  organicB.add(orgBase);

  organicB.position.set(-110, 0, -15);
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

  const excludeZones = [
    [-90, -20, -35, -5],   // main building xám
    [-25, 55, -28, 32],    // white cluster (đã bao quát hành lang cầu đỏ)
    [15, 130, 5, 45],      // lecture hall + oval
    [105, 220, -85, 0],    // sports area
    [70, 135, 35, 85],     // courtyard building
    [-8, 8, -110, 110],    // main road
    [-110, 110, -34, -26], // EW road
    [-140, -100, -30, -5], // organic building
    [170, 215, -5, 25],    // pool
    [-130, 130, 60, 110],  // south roads
  ];

  let treesPlaced = 0;
  for (let tries = 0; tries < 1000 && treesPlaced < 100; tries++) {
    const x = (rng() * 2 - 1) * 200;
    const z = (rng() * 2 - 1) * 160;
    let inExclude = false;
    for (const [x0, x1, z0, z1] of excludeZones) {
      if (x > x0 - 3 && x < x1 + 3 && z > z0 - 3 && z < z1 + 3) {
        inExclude = true;
        break;
      }
    }
    if (inExclude) continue;
    const scale = 0.7 + rng() * 0.6;
    treePositions.push({ x, z, scale });
    treesPlaced++;
  }

  // Cây cố định: cây tại [12, -22] nằm sát sườn đông tòa SW (cách tường 3.0 m),
  // cách mép deck cầu đỏ x=13..17 và trục đi bộ an toàn, không chắn đường đi bộ
  const specificTrees = [
    [-15, 70, 1.0], [15, 70, 1.0],
    [-15, 50, 0.9], [15, 50, 0.9],
    [5, -15, 1.0], [12, -22, 1.0],
    [-30, 10, 1.1], [-30, 30, 0.9],
  ];
  for (const [tx, tz, ts] of specificTrees) {
    treePositions.push({ x: tx, z: tz, scale: ts });
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
      const { x, z, scale } = treePositions[i];
      dm.position.set(x, 0, z);
      dm.scale.setScalar(scale);
      dm.updateMatrix();
      trunkInst.setMatrixAt(i, dm.matrix);

      dm.position.set(x, 3.5 * scale, z);
      dm.scale.set(scale * (0.85 + rng() * 0.3), scale * (0.85 + rng() * 0.3), scale * (0.85 + rng() * 0.3));
      dm.updateMatrix();
      const mesh = batches[Math.floor(rng() * leafGeos.length)][Math.floor(rng() * leafMats.length)];
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
  const parkingLot = new THREE.Mesh(new THREE.PlaneGeometry(30, 15), matAsphalt);
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
    for (let z = -80; z <= 90; z += 20) {
      lampPositions.push([-6, z]);
      lampPositions.push([6, z]);
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
  const gateGroup = new THREE.Group();
  gateGroup.name = 'main-gate';
  for (const gx of [-6, 6]) {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 7, 1.5),
      matWhite
    );
    pillar.position.set(gx, 3.5, 0);
    pillar.castShadow = true;
    gateGroup.add(pillar);
  }
  const gateSignTex = canvasTex(THREE, 'VIETNAMESE-GERMAN UNIVERSITY', '#1a3f70', '#ffffff', 1024, 128, 0.55);
  if (gateSignTex) {
    const gateSignMat = new THREE.MeshStandardMaterial({
      map: gateSignTex,
      roughness: 0.5
    });
    const gateSign = new THREE.Mesh(new THREE.PlaneGeometry(12, 1.5), gateSignMat);
    gateSign.position.set(0, 6.5, 0.8);
    gateGroup.add(gateSign);
  }

  gateGroup.position.set(0, 0, 100);
  group.add(gateGroup);

  // =====================================================
  // ANCHORS — Vị trí đi bộ mặt đất theo hợp đồng 8 khóa
  // =====================================================
  const anchors = {
    mainGate: new THREE.Vector3(0, 0, 95),
    mainBuildingEntrance: new THREE.Vector3(-70.5, 0, -7.5),
    mainBuildingFront: new THREE.Vector3(-70.5, 0, -3.0),
    mainBuilding: new THREE.Vector3(-55, 0, -3.0),
    lectureHall: new THREE.Vector3(50, 0, 32),
    pool: new THREE.Vector3(190, 0, 20),
    track: new THREE.Vector3(140, 0, -30),
    canalBridge: new THREE.Vector3(redBridgeX, RED_DECK_Y, redBridgeZ),
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

  // Ánh sáng môi trường tán xạ bầu trời và mặt đất — nâng nhẹ để chi tiết vùng tối rõ nét
  const hemi = new THREE.HemisphereLight(0x8ec5f0, 0x5a7d3c, 1.20);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0x6c6c74, 0.65);
  scene.add(ambient);

  scene.fog = new THREE.Fog(0xc8dfe8, 250, 900);
  scene.background = new THREE.Color(0x87CEEB);
}

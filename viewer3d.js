/* NPC Showcase — 3D viewer
 * Renders the selected NPC the way the game builds them:
 * outfit-textured capsule body + skin-tone coin head + painted face,
 * plus their signature accessory, hat, cape or cane.
 */
import * as THREE from './three.module.js';
import { ACCESSORY_DEFS, DEFAULT_LOADOUT, buildAccessory } from './accessory-library.js';

const SKIN = {
  'mayor-mayor': 13209446, 'gideon': 11567710, 'lyla-lens': 12155224,
  'chip-chance': 10119242, 'barnaby-bargain': 13671024, 'pip-parade': 13142373,
  'agnes-alley': 11171419, 'dottie-daly': 14724482, 'peggy-plank': 12024663,
  'mr-buck-coinsworth': 14197369, 'fern-bramble': 9658950,
  'stanley-stamp': 12946278, 'bobby-gill': 12092257,
};

function mat(color, roughness = 0.6) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.05 });
}
function mesh(geo, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

const ACCESSORIES = {
  'mayor-mayor'() { const g = new THREE.Group();
    const handle = mesh(new THREE.CylinderGeometry(0.022,0.026,0.42,10), mat(0x8a5a34), 0,0.1,0); handle.rotation.z = 0.5;
    const head = mesh(new THREE.CylinderGeometry(0.055,0.055,0.16,14), mat(0x6e4526), 0.13,0.28,0); head.rotation.z = 0.5;
    const b1 = mesh(new THREE.CylinderGeometry(0.058,0.058,0.02,14), mat(0xe4aa38,0.35), 0.1,0.245,0); b1.rotation.z = 0.5;
    const b2 = mesh(new THREE.CylinderGeometry(0.058,0.058,0.02,14), mat(0xe4aa38,0.35), 0.16,0.315,0); b2.rotation.z = 0.5;
    g.add(handle, head, b1, b2); return g; },
  'gideon'() { const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.016,0.016,0.85,8), mat(0x8a6a4a,0.7), 0,0.32,0));
    const s = new THREE.Shape(); s.moveTo(0,0); s.lineTo(0.34,0.09); s.lineTo(0,0.18); s.lineTo(0,0);
    const flag = new THREE.Mesh(new THREE.ShapeGeometry(s), mat(0xb07a3f,0.7));
    flag.position.set(0.016,0.58,0); flag.castShadow = true;
    g.add(flag, mesh(new THREE.SphereGeometry(0.028,10,8), mat(0xe4aa38,0.4), 0,0.76,0)); return g; },
  'barnaby-bargain'() { const g = new THREE.Group();
    const c = mesh(new THREE.CylinderGeometry(0.085,0.085,0.028,24), mat(0xe4aa38,0.35)); c.rotation.x = Math.PI/2.4;
    const r = mesh(new THREE.TorusGeometry(0.085,0.012,10,24), mat(0xc78f2a,0.4)); r.rotation.x = Math.PI/2.4;
    g.add(c, r); g.position.y = 0.1; return g; },
  'pip-parade'() { const g = new THREE.Group();
    const b = mesh(new THREE.SphereGeometry(0.14,20,16), mat(0xe76854,0.45), 0,0.42,0); b.scale.y = 1.15;
    const k = mesh(new THREE.ConeGeometry(0.03,0.05,10), mat(0xc74f3d), 0,0.26,0); k.rotation.x = Math.PI;
    g.add(b, k, mesh(new THREE.CylinderGeometry(0.006,0.006,0.22,6), mat(0xf5f0e7,0.8), 0,0.14,0)); return g; },
  'agnes-alley'() { const g = new THREE.Group();
    g.add(mesh(new THREE.SphereGeometry(0.11,20,16), mat(0xd9a7c7,0.85)));
    g.add(mesh(new THREE.TorusGeometry(0.11,0.014,8,24), mat(0xc48fb5,0.85)));
    const w2 = mesh(new THREE.TorusGeometry(0.11,0.014,8,24), mat(0xc48fb5,0.85));
    w2.rotation.x = Math.PI/2; w2.rotation.y = 0.5; g.add(w2);
    const t = mesh(new THREE.CylinderGeometry(0.008,0.008,0.2,6), mat(0xd9a7c7,0.85), 0.1,-0.12,0.03);
    t.rotation.z = 0.7; g.add(t); g.position.y = 0.12; return g; },
  'dottie-daly'() { const g = new THREE.Group();
    const s = mesh(new THREE.CylinderGeometry(0.05,0.05,0.32,16), mat(0xf3e6cf,0.8)); s.rotation.z = Math.PI/2;
    const b = mesh(new THREE.CylinderGeometry(0.056,0.056,0.05,16), mat(0xb4552d,0.6)); b.rotation.z = Math.PI/2;
    g.add(s, b, mesh(new THREE.SphereGeometry(0.028,12,10), mat(0xe4aa38,0.4), 0,0.062,0));
    g.position.y = 0.12; return g; },
  'mr-buck-coinsworth'() { const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(0.2,0.09,0.1), mat(0xe4aa38,0.3)));
    g.add(mesh(new THREE.BoxGeometry(0.16,0.02,0.08), mat(0xf2c86f,0.25), 0,0.055,0));
    g.position.y = 0.1; return g; },
  'fern-bramble'() { const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.075,0.06,0.1,14), mat(0xb4552d,0.8), 0,-0.02,0));
    g.add(mesh(new THREE.CylinderGeometry(0.012,0.012,0.14,8), mat(0x5c8d65,0.8), 0,0.1,0));
    g.add(mesh(new THREE.SphereGeometry(0.055,14,12), mat(0xe78bb0,0.6), 0,0.2,0));
    const l = mesh(new THREE.SphereGeometry(0.035,10,8), mat(0x5c8d65,0.7), 0.045,0.12,0);
    l.scale.set(1.4,0.5,0.7); g.add(l); g.position.y = 0.1; return g; },
  'stanley-stamp'() { const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(0.24,0.15,0.025), mat(0xfbf7ec,0.85)));
    g.add(mesh(new THREE.BoxGeometry(0.24,0.07,0.028), mat(0xefe6d2,0.85), 0,0.035,0));
    g.add(mesh(new THREE.BoxGeometry(0.045,0.05,0.03), mat(0x7fb3d5,0.7), 0.085,0.045,0));
    g.rotation.x = -0.15; g.position.y = 0.12; return g; },
  'bobby-gill'() { const g = new THREE.Group();
    const rod = mesh(new THREE.CylinderGeometry(0.014,0.02,1.15,8), mat(0x8a6a4a,0.7), 0,0.45,0);
    rod.rotation.z = 0.35; rod.rotation.x = -0.2;
    const line = mesh(new THREE.CylinderGeometry(0.004,0.004,0.5,6), mat(0xf5f0e7,0.9), 0.28,0.72,-0.12);
    line.rotation.z = 0.15;
    g.add(rod, line, mesh(new THREE.SphereGeometry(0.035,12,10), mat(0xe76854,0.5), 0.32,0.48,-0.13));
    return g; },
  'lyla-lens'() { const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(0.2,0.14,0.1), mat(0x3a3f44,0.5)));
    const lens = mesh(new THREE.CylinderGeometry(0.05,0.055,0.08,14), mat(0x22262a,0.4), 0,0,0.08);
    lens.rotation.x = Math.PI/2; g.add(lens);
    g.add(mesh(new THREE.CylinderGeometry(0.02,0.02,0.02,10), mat(0x9fd4ff,0.3), 0,0,0.125));
    g.position.y = 0.12; return g; },
  'chip-chance'() { const g = new THREE.Group();
    const d = mesh(new THREE.BoxGeometry(0.13,0.13,0.13), mat(0xf5f0e7,0.5));
    d.rotation.set(0.4,0.5,0.2); g.add(d); g.position.y = 0.12; return g; },
  'peggy-plank'() { const g = new THREE.Group();
    const h = mesh(new THREE.CylinderGeometry(0.02,0.024,0.4,10), mat(0x8a5a34,0.6), 0,0.1,0); h.rotation.z = 0.4;
    const hd = mesh(new THREE.BoxGeometry(0.2,0.09,0.09), mat(0x6b7280,0.45), 0.1,0.26,0); hd.rotation.z = 0.4;
    g.add(h, hd); return g; },
};

const HATS = {
  'mayor-mayor'() { const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.34,0.36,0.05,24), mat(0x1c1e22,0.5), 0,0.02,0));
    g.add(mesh(new THREE.CylinderGeometry(0.21,0.23,0.52,24), mat(0x1c1e22,0.5), 0,0.30,0));
    g.add(mesh(new THREE.CylinderGeometry(0.215,0.215,0.02,24), mat(0x24262c,0.5), 0,0.565,0));
    g.add(mesh(new THREE.CylinderGeometry(0.232,0.232,0.07,24), mat(0x8f1f2e,0.6), 0,0.10,0));
    return g; },
  'stanley-stamp'() { const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.20,0.22,0.12,20), mat(0x2e4a6b,0.7), 0,0.06,0));
    const brim = mesh(new THREE.CylinderGeometry(0.30,0.30,0.025,20), mat(0x243c58,0.7), 0,0.01,0.10);
    brim.scale.set(1,1,0.7); g.add(brim); return g; },
  'bobby-gill'() { const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.17,0.20,0.14,18), mat(0x7a8b6f,0.8), 0,0.07,0));
    g.add(mesh(new THREE.CylinderGeometry(0.30,0.32,0.03,20), mat(0x6b7d61,0.8), 0,0,0));
    return g; },
  'fern-bramble'() { const g = new THREE.Group();
    g.add(mesh(new THREE.SphereGeometry(0.18,18,12,0,Math.PI*2,0,Math.PI/2), mat(0xd9b96a,0.85), 0,0.02,0));
    g.add(mesh(new THREE.CylinderGeometry(0.34,0.36,0.025,22), mat(0xcfa856,0.85), 0,0.02,0));
    return g; },
  'gideon'() { const g = new THREE.Group();
    const c = mesh(new THREE.SphereGeometry(0.20,18,12,0,Math.PI*2,0,Math.PI/2), mat(0xb07a3f,0.75), 0,0.03,0);
    c.scale.set(1,0.75,1); g.add(c);
    const brim = mesh(new THREE.CylinderGeometry(0.26,0.26,0.025,18), mat(0x9a6a35,0.75), 0,0.02,0.12);
    brim.scale.set(1,1,0.55); g.add(brim); return g; },
};

function addCape(g) {
  const geo = new THREE.PlaneGeometry(0.8, 1.05, 10, 10);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    const t = (0.525 - y) / 1.05;
    pos.setZ(i, -0.18*t*t - 0.06*Math.sin(x*9)*t);
    pos.setX(i, x*(1 + 0.35*t));
  }
  geo.computeVertexNormals();
  const cape = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: 0x8f1f2e, roughness: 0.85, side: THREE.DoubleSide }));
  cape.position.set(0, 0.62, -0.30); cape.castShadow = true; g.add(cape);
  g.add(mesh(new THREE.SphereGeometry(0.035,12,10), mat(0xe4aa38,0.35), 0,1.12,0.28));
}

function addCane(g) {
  const cane = new THREE.Group();
  cane.add(mesh(new THREE.CylinderGeometry(0.018,0.022,0.95,10), mat(0x6e4526,0.55), 0,0.30,0));
  cane.add(mesh(new THREE.TorusGeometry(0.07,0.018,10,20,Math.PI), mat(0x6e4526,0.55), -0.07,0.775,0));
  cane.add(mesh(new THREE.SphereGeometry(0.024,10,8), mat(0xe4aa38,0.4), -0.14,0.775,0));
  cane.position.set(-0.50, 0.25, 0.12); cane.rotation.z = 0.06;
  g.add(cane);
}

/* ---------- viewer ---------- */
let renderer = null, scene = null, camera = null, rig = null, raf = 0;
let dragging = false, lastX = 0, autoSpin = true;

function initViewer(canvas) {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(0, 1.6, 4.4);
  camera.lookAt(0, 1.0, 0);
  scene.add(new THREE.HemisphereLight(0xdfeaf2, 0x2a3430, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(3, 6, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fc3ff, 0.6);
  rim.position.set(-4, 3, -3); scene.add(rim);
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 40),
    new THREE.MeshStandardMaterial({ color: 0x2a3340, roughness: 0.95 }));
  ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground);
  rig = new THREE.Group(); scene.add(rig);

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true; lastX = e.clientX; autoSpin = false;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    rig.rotation.y += (e.clientX - lastX) * 0.012;
    lastX = e.clientX;
  });
  const endDrag = () => { dragging = false; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  const resize = () => {
    const w = canvas.clientWidth || 320, h = canvas.clientHeight || 420;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);
  resize();

  const tick = () => {
    if (autoSpin && rig) rig.rotation.y += 0.009;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();
}

const texLoader = new THREE.TextureLoader();
texLoader.setCrossOrigin('anonymous');
function loadTex(url) {
  const t = texLoader.load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function showNPC(npc, assetBase) {
  const canvas = document.getElementById('viewer3dCanvas');
  if (!renderer) initViewer(canvas);
  while (rig.children.length) {
    const c = rig.children.pop();
    c.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  }
  rig.rotation.y = 0.5;
  autoSpin = true;

  const g = new THREE.Group();
  const outfitUrl = assetBase + (npc.outfitUrl || '');
  const ot = loadTex(outfitUrl);
  ot.wrapS = THREE.RepeatWrapping; ot.offset.x = 0.25;
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.29, 0.54, 8, 20),
    new THREE.MeshStandardMaterial({ map: ot, roughness: 0.85 }));
  body.position.y = 0.66; body.castShadow = true; g.add(body);

  const skin = SKIN[npc.id] ?? 0xc99a56;
  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.34, 0.15, 32),
    new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 }));
  head.rotation.x = Math.PI/2; head.position.y = 1.66; head.castShadow = true; g.add(head); // floats above the body, matching the game (was 1.42)

  if (npc.faceUrl) {
    const face = new THREE.Mesh(
      new THREE.CircleGeometry(0.30, 40),
      new THREE.MeshBasicMaterial({ map: loadTex(assetBase + npc.faceUrl), transparent: true }));
    face.position.set(0, 1.66, 0.079);
    g.add(face);
  }
  if (ACCESSORIES[npc.id]) {
    const a = ACCESSORIES[npc.id]();
    a.position.set(0.50, 0.72, 0.12);
    g.add(a);
  }
  if (npc.id === 'gideon') addCane(g);
  if (HATS[npc.id]) {
    const h = HATS[npc.id]();
    h.position.set(0, npc.id === 'mayor-mayor' ? 2.02 : 2.00, 0); // hats follow the floated head (+0.24)
    g.add(h);
  }
  if (npc.id === 'mayor-mayor') addCape(g);
  rig.add(g);
}

export function stopViewer() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0; renderer = null; scene = null; rig = null;
}

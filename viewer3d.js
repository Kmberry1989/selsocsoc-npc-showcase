/* NPC Showcase — 3D viewer
 * Renders the selected NPC the way the game builds them:
 * outfit-textured capsule body + skin-tone coin head + painted face,
 * plus their signature accessory and hat as the real game GLBs
 * (assets/accessories/, byte-identical copies of the game's
 * assets/npc-accessories/*.glb), at the real roster anchors.
 * No procedural accessory geometry remains here: a GLB that fails to
 * load is left out, never replaced with a fake.
 */
import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { attachLivingFace } from './living-faces.js';

const SKIN = {
  'mayor-mayor': 13209446, 'gideon': 11567710, 'lyla-lens': 12155224,
  'chip-chance': 10119242, 'barnaby-bargain': 13671024, 'pip-parade': 13142373,
  'agnes-alley': 11171419, 'dottie-daly': 14724482, 'peggy-plank': 12024663,
  'mr-buck-coinsworth': 14197369, 'fern-bramble': 9658950,
  'stanley-stamp': 12946278, 'bobby-gill': 12092257,
};

/* Real game accessory GLBs, keyed by NPC id. File names and slots
 * come from the game's assets/npc-accessories/manifest.json and the
 * manifest's accessoryGlb fields; anchors are the real roster slots
 * (held (0.46, 0.64, 0.14), head (0, 1.93, 0)). GLBs carry no node
 * transform, so they load at identity scale/orientation — the game
 * states no accessory scale, so none is invented here. Their bounding
 * sizes match the old procedural extents (e.g. tophat 0.72 wide,
 * 0.58 tall), which corroborates the identity placement. */
const HELD_GLB = {
  'mayor-mayor': 'gavel.glb', 'gideon': 'flag.glb', 'lyla-lens': 'camera.glb',
  'chip-chance': 'die.glb', 'barnaby-bargain': 'coin.glb', 'pip-parade': 'balloon.glb',
  'agnes-alley': 'yarn.glb', 'dottie-daly': 'scroll.glb', 'peggy-plank': 'hammer.glb',
  'mr-buck-coinsworth': 'goldbar.glb', 'fern-bramble': 'flower.glb',
  'stanley-stamp': 'envelope.glb', 'bobby-gill': 'rod.glb',
};
const HAT_GLB = {
  'mayor-mayor': 'tophat.glb', 'gideon': 'tourcap.glb', 'fern-bramble': 'strawhat.glb',
  'stanley-stamp': 'mailcap.glb', 'bobby-gill': 'buckethat.glb',
  'lyla-lens': 'press-fedora.glb', 'chip-chance': 'showman-bowler.glb',
  'barnaby-bargain': 'bargain-bowler.glb', 'pip-parade': 'confetti-crown.glb',
  'agnes-alley': 'cat-ears.glb', 'dottie-daly': 'quest-beret.glb',
  'peggy-plank': 'hardhat.glb', 'mr-buck-coinsworth': 'banker-bowler.glb',
};
// User-directed 2026-10-28: cane and cape are back in. The game roster
// has no left HeldItemSlot and no back slot, so these two use
// user-approved placements instead of game anchors: cane mirrored from
// the right held slot, cape hanging behind the body from the shoulders.
// (Real GLBs, real geometry — only the placement is editorial.)
const LEFT_GLB = { 'gideon': 'cane.glb', 'chip-chance': 'microphone.glb' };
const BACK_GLB = {
  'mayor-mayor': 'cape.glb', 'gideon': 'tour-backpack.glb', 'lyla-lens': 'press-satchel.glb',
  'chip-chance': 'dice-pouch.glb', 'barnaby-bargain': 'merchant-satchel.glb',
  'pip-parade': 'festival-banner.glb', 'agnes-alley': 'cat-carrier.glb',
  'dottie-daly': 'quest-tube.glb', 'peggy-plank': 'tool-roll.glb',
  'mr-buck-coinsworth': 'money-bag.glb', 'fern-bramble': 'seed-pack.glb',
  'stanley-stamp': 'mailbag.glb', 'bobby-gill': 'creel.glb',
};
const glbLoader = new GLTFLoader();
const glbCache = new Map(); // file -> Promise<Group> (shared, cloned per use)
function loadGLBScene(file, remoteBase) {
  if (!glbCache.has(file)) {
    const local = 'assets/accessories/' + file;
    const remote = remoteBase ? remoteBase + 'assets/npc-accessories/' + file : null;
    glbCache.set(file, new Promise((resolve, reject) => {
      glbLoader.load(local, (gltf) => resolve(gltf.scene),
        undefined,
        () => {
          if (remote) glbLoader.load(remote, (gltf) => resolve(gltf.scene), undefined, reject);
          else reject(new Error('GLB load failed: ' + file));
        });
    }));
  }
  return glbCache.get(file);
}

/* ---------- viewer ---------- */
let renderer = null, scene = null, camera = null, rig = null, raf = 0;
let viewGen = 0; // incremented per showNPC; stale async GLB loads are discarded
let dragging = false, lastX = 0, autoSpin = true;
let living = null; // living-face handle for the shown NPC (mouth + blinking)

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
    if (living) living.update();
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
  const bodyMat = new THREE.MeshStandardMaterial({ map: ot, roughness: 0.85 });
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.29, 0.54, 8, 20), bodyMat);
  body.position.y = 0.66; body.castShadow = true; g.add(body);
  // Roster unification 2026-10-27: full roster figure (previously the
  // 3D view omitted hands, feet and shoulders).
  const shoulders = new THREE.Mesh(
    new THREE.CylinderGeometry(0.27, 0.27, 0.045, 22), bodyMat);
  shoulders.rotation.x = Math.PI / 2; shoulders.position.y = 0.97; g.add(shoulders);
  const skinMat = new THREE.MeshStandardMaterial({ color: SKIN[npc.id] ?? 0xc99a56, roughness: 0.7 });
  for (const side of [-1, 1]) {
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), skinMat);
    hand.position.set(0.46 * side, 0.68, 0); hand.castShadow = true; g.add(hand);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.14, 0.42),
      new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9 }));
    shoe.position.set(0.19 * side, 0.15, 0.045); g.add(shoe);
  }

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
    living = attachLivingFace(g, npc.id); // mouth + blinking, matching the game
  } else {
    living = null;
  }
  // Game anchors, ported from selsocsoc assets/npc-roster.js (roster
  // builder tQ): HeldItemSlot is a child of the right HandSlot
  // (0.46, 0.68, 0) at local (0, -0.04, 0.14), i.e. (0.46, 0.64, 0.14)
  // in NPC-root coords; the game attaches props with slot.add(prop),
  // so the prop group origin sits exactly on the slot. HeadAccessorySlot
  // is a child of the Head group (y 1.66) at local (0, 0.27, 0), i.e.
  // (0, 1.93, 0). Previous positions (0.50, 0.72, 0.12) and y 2.00/2.02
  // were editor-invented.
  // Real GLBs load asynchronously: attach only if this figure is still
  // the current one (generation guard), so a slow load never lands on
  // a different NPC. On load failure the item is left out (warned in
  // console), never replaced with procedural geometry.
  const gen = ++viewGen;
  const attach = (file, pos) => {
    if (!file) return;
    loadGLBScene(file, assetBase).then((sceneRoot) => {
      if (gen !== viewGen || !g.parent) return;
      const inst = sceneRoot.clone(true);
      inst.position.set(...pos);
      inst.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      g.add(inst);
    }).catch((err) => console.warn('Showcase: could not load accessory GLB', file, err));
  };
  attach(HELD_GLB[npc.id], [0.46, 0.64, 0.14]);
  attach(HAT_GLB[npc.id], [0, 1.93, 0]);
  attach(LEFT_GLB[npc.id], [-0.46, 0.64, 0.14]);
  attach(BACK_GLB[npc.id], [0, 0.55, -0.31]);
  rig.add(g);
}

export function stopViewer() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0; renderer = null; scene = null; rig = null; living = null;
}

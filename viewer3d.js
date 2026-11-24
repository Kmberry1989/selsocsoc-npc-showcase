/* NPC Showcase — 3D viewer
 * Renders the selected NPC the way the game builds them:
 * outfit-textured capsule body + skin-tone coin head + painted face,
 * plus their accessories as the real game GLBs at the roster slot
 * anchors. NOTHING about an accessory is hardcoded here: the held
 * item comes from the NPC manifest's accessoryGlb, the head / left-hand
 * / back items come from the accessories manifest (entries keyed by
 * npc + slot), skin comes from the NPC manifest's skin field, and any
 * per-item offset / rotation / scale comes from that accessories entry.
 * A GLB that fails to load is left out, never replaced with a fake.
 * The body/head/hands/shoes below are the game's roster figure itself
 * (same capsule/coin construction as npc-roster.js), not accessories.
 */
import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { attachLivingFace } from './living-faces.js';

/* Roster slot anchors, ported from selsocsoc assets/npc-roster.js
 * (roster builder tQ): HeldItemSlot is a child of the right HandSlot
 * (0.46, 0.68, 0) at local (0, -0.04, 0.14), i.e. (0.46, 0.64, 0.14)
 * in NPC-root coords; HeadAccessorySlot is a child of the Head group
 * (y 1.66) at local (0, 0.27, 0), i.e. (0, 1.93, 0). The left-hand
 * slot mirrors the right; the back slot sits behind the torso. */
const SLOT_POS = {
  hand: [0.46, 0.64, 0.14],
  handL: [-0.46, 0.64, 0.14],
  head: [0, 1.93, 0],
  back: [0, 0.55, -0.31],
};
// Skin fallback, used only when a manifest entry has no skin field.
// (The live NPC manifest now carries a skin for all 14 NPCs.)
const FALLBACK_SKIN = 0xc99a56;

const glbLoader = new GLTFLoader();
const glbCache = new Map(); // file path -> Promise<Group> (shared, cloned per use)
function loadGLBScene(file, assetBase) {
  if (!glbCache.has(file)) {
    const base = file.split('/').pop();
    const local = 'assets/accessories/' + base;
    const remote = assetBase ? assetBase + file : null;
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

/* Loadout for one NPC, derived entirely from the two live manifests:
 *  - hand: the NPC manifest's accessoryGlb
 *  - head / handL / back: accessories-manifest entries with npc === id
 *    (hand entries there duplicate accessoryGlb, so they are skipped)
 * Each entry carries id, name, file, slot, and optional offset /
 * rotation / scale. Returns [{ id, name, file, slot, offset, rotation, scale }]. */
export function loadoutFor(npc, accessories) {
  const loadout = [];
  const accList = accessories || [];
  if (npc.accessoryGlb) {
    // The accessories manifest carries the same hand item plus its
    // offset / rotation / scale (e.g. the busker's guitar) — merge it in.
    const handEntry = accList.find((a) => a.npc === npc.id && a.slot === 'hand');
    const base = npc.accessoryGlb.split('/').pop().replace(/\.glb$/i, '');
    loadout.push({
      id: handEntry?.id || base, name: handEntry?.name || npc.accessory || base,
      file: npc.accessoryGlb, slot: 'hand',
      offset: handEntry?.offset || null, rotation: handEntry?.rotation || null,
      scale: typeof handEntry?.scale === 'number' ? handEntry.scale : null,
    });
  }
  for (const a of accessories || []) {
    if (a.npc === npc.id && a.slot && a.slot !== 'hand' && a.file) {
      loadout.push({
        id: a.id, name: a.name || a.id,
        file: a.file, slot: a.slot,
        offset: a.offset || null, rotation: a.rotation || null,
        scale: typeof a.scale === 'number' ? a.scale : null,
      });
    }
  }
  return loadout;
}

/* Live rescaling: attached GLB instances by slot, the current NPC's
 * loadout, and scale overrides the user made in this session (keyed by
 * accessory id, so they survive cycling to the next NPC and back).
 * An override is only kept while it differs from the manifest scale. */
let attached = new Map(); // slot -> { instance, entry }
let currentLoadout = [];
let currentNpcId = null;
const scaleOverrides = new Map(); // accessory id -> scale
const overrideMeta = new Map(); // accessory id -> { npc, slot, was }

function manifestScale(entry) {
  return typeof entry.scale === 'number' ? entry.scale : 1;
}
function currentScale(entry) {
  return scaleOverrides.get(entry.id) ?? manifestScale(entry);
}

export function getCurrentAccessories() {
  return currentLoadout.map((e) => ({
    id: e.id, name: e.name, slot: e.slot,
    scale: currentScale(e), manifestScale: manifestScale(e),
  }));
}

export function setAccessoryScale(slot, scale) {
  const entry = currentLoadout.find((e) => e.slot === slot);
  if (!entry) return null;
  const clamped = Math.min(2, Math.max(0.25, Math.round(scale * 100) / 100));
  const was = manifestScale(entry);
  if (Math.abs(clamped - was) < 0.005) scaleOverrides.delete(entry.id);
  else scaleOverrides.set(entry.id, clamped);
  overrideMeta.set(entry.id, { npc: currentNpcId, slot, was });
  const rec = attached.get(slot);
  if (rec) rec.instance.scale.setScalar(clamped);
  return clamped;
}

export function resetAccessoryScale(slot) {
  const entry = currentLoadout.find((e) => e.slot === slot);
  if (!entry) return null;
  scaleOverrides.delete(entry.id);
  const rec = attached.get(slot);
  if (rec) rec.instance.scale.setScalar(manifestScale(entry));
  return manifestScale(entry);
}

/* Every scale the user changed this session, in manifest shape, so the
 * copied list says exactly what to change and where it came from. */
export function getScaleOverrides() {
  return [...scaleOverrides.entries()].map(([id, scale]) => {
    const meta = overrideMeta.get(id) || {};
    return { id, npc: meta.npc || null, slot: meta.slot || null, scale, was: meta.was ?? 1 };
  }).sort((a, b) => String(a.npc).localeCompare(String(b.npc)) || a.id.localeCompare(b.id));
}

export function showNPC(npc, assetBase, accessories) {
  const canvas = document.getElementById('viewer3dCanvas');
  if (!renderer) initViewer(canvas);
  while (rig.children.length) {
    const c = rig.children.pop();
    c.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  }
  attached.clear();
  currentNpcId = npc.id;
  currentLoadout = loadoutFor(npc, accessories);
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
  const skin = npc.skin || FALLBACK_SKIN;
  const skinMat = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 });
  for (const side of [-1, 1]) {
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), skinMat);
    hand.position.set(0.46 * side, 0.68, 0); hand.castShadow = true; g.add(hand);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.14, 0.42),
      new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.9 }));
    shoe.position.set(0.19 * side, 0.15, 0.045); g.add(shoe);
  }

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
  // Real GLBs load asynchronously: attach only if this figure is still
  // the current one (generation guard), so a slow load never lands on
  // a different NPC. On load failure the item is left out (warned in
  // console), never replaced with procedural geometry.
  const gen = ++viewGen;
  const attach = (entry) => {
    const pos = SLOT_POS[entry.slot];
    if (!entry.file || !pos) return;
    loadGLBScene(entry.file, assetBase).then((sceneRoot) => {
      if (gen !== viewGen || !g.parent) return;
      const inst = sceneRoot.clone(true);
      const off = entry.offset || [0, 0, 0];
      inst.position.set(pos[0] + off[0], pos[1] + off[1], pos[2] + off[2]);
      if (entry.rotation) inst.rotation.set(...entry.rotation);
      // Session rescale override wins over the manifest scale.
      inst.scale.setScalar(currentScale(entry));
      inst.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      attached.set(entry.slot, { instance: inst, entry });
      g.add(inst);
    }).catch((err) => console.warn('Showcase: could not load accessory GLB', entry.file, err));
  };
  for (const entry of currentLoadout) attach(entry);
  rig.add(g);
}

export function stopViewer() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0; renderer = null; scene = null; rig = null; living = null;
}

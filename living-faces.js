/* Living faces for the NPC editors (shared copy — same file ships in the
 * NPC Showcase and the Accessory Editor).
 * Gives the previewed NPC a real mouth and blinking eyes, matching the
 * game: the v2 face art leaves the mouth blank, so a canvas-drawn toon
 * mouth plane sits at the speaking-mouth anchor (face center - 0.135),
 * and skin-colored lid planes sweep over both eyes on a random timer.
 * The mouth gently breathes even at rest, so the preview never sits
 * frozen. Distance and interaction drivers from the game do not apply
 * here (no player in a viewer), so the face rests on its base state.
 * Under prefers-reduced-motion the breathing and blinking are skipped.
 *
 * Rig assumption (both editors): capsule body at y 0.66, coin head at
 * y 1.66, face circle radius 0.30 at (0, 1.66, 0.079). Eye positions were
 * measured from the v2 face PNGs; if a face PNG is ever redrawn,
 * re-measure the eyes or lids blink the wrong spot.
 */
import * as THREE from './three.module.js';

const STATES = ['neutral', 'smile', 'laugh', 'grin', 'frown', 'surprise', 'smirk', 'ooh'];
const FACE_Y = 1.66;
const FACE_Z = 0.079;
const MOUTH_DY = -0.135;
const MOUTH_Z = FACE_Z + 0.016;
const LID_Z = FACE_Z + 0.008;
const FACE_R = 0.30;
const CLOSE_MS = 60;
const HOLD_MS = 90;
const OPEN_MS = 60;

// fx, fy: eye center as fractions of the PNG (fy from the top).
// w, h: eye blob size as fractions of the PNG.
// skin: tone sampled from the PNG (editors show the PNG untinted).
const EYES = {
  'mayor-mayor': { l: [0.29, 0.55], r: [0.71, 0.545], w: 0.22, h: 0.105, skin: '#c88c5e' },
  'gideon': { l: [0.33, 0.42], r: [0.68, 0.42], w: 0.135, h: 0.065, skin: '#b27b59' },
  'lyla-lens': { l: [0.29, 0.47], r: [0.73, 0.45], w: 0.25, h: 0.10, skin: '#ca8d5f' },
  'chip-chance': { l: [0.32, 0.62], r: [0.68, 0.62], w: 0.14, h: 0.035, skin: '#cc9a6c' },
  'barnaby-bargain': { l: [0.28, 0.46], r: [0.71, 0.46], w: 0.22, h: 0.06, skin: '#c88c5c' },
  'pip-parade': { l: [0.31, 0.435], r: [0.69, 0.43], w: 0.18, h: 0.07, skin: '#ca8d5f' },
  'agnes-alley': { l: [0.29, 0.53], r: [0.70, 0.53], w: 0.22, h: 0.11, skin: '#ca8d5f' },
  'dottie-daly': { l: [0.30, 0.51], r: [0.70, 0.51], w: 0.19, h: 0.03, skin: '#daa576' },
  'peggy-plank': { l: [0.28, 0.40], r: [0.72, 0.40], w: 0.245, h: 0.09, skin: '#ca8d5f' },
  'mr-buck-coinsworth': { l: [0.30, 0.46], r: [0.72, 0.46], w: 0.22, h: 0.05, skin: '#c68a5d' },
  'fern-bramble': { l: [0.28, 0.46], r: [0.71, 0.46], w: 0.20, h: 0.04, skin: '#ce986f' },
  'stanley-stamp': { l: [0.29, 0.445], r: [0.70, 0.44], w: 0.195, h: 0.10, skin: '#d29567' },
  'bobby-gill': { l: [0.29, 0.43], r: [0.71, 0.43], w: 0.19, h: 0.07, skin: '#be815a' },
};

const reducedMotion = typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const INK = '#2b2118';
const MOUTH_DARK = '#3a1214';
const TONGUE = '#e0787a';
const TEETH = '#fffdf8';

// Every state is drawn on a 256x128 canvas, centered, toon style —
// the same drawings as the game's npc-mouth-states.js.
function drawState(state) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const arc = (x1, y1, cx, cy, x2, y2, width) => {
    ctx.lineWidth = width;
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();
  };
  const openMouth = (withTeeth) => {
    ctx.beginPath();
    ctx.moveTo(58, 46);
    ctx.quadraticCurveTo(128, 66, 198, 46);
    ctx.quadraticCurveTo(128, 122, 58, 46);
    ctx.closePath();
    ctx.fillStyle = MOUTH_DARK;
    ctx.fill();
    if (withTeeth) {
      ctx.beginPath();
      ctx.moveTo(66, 48);
      ctx.quadraticCurveTo(128, 64, 190, 48);
      ctx.lineTo(186, 72);
      ctx.quadraticCurveTo(128, 86, 70, 72);
      ctx.closePath();
      ctx.fillStyle = TEETH;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(128, 96, 34, 15, 0, 0, Math.PI * 2);
      ctx.fillStyle = TONGUE;
      ctx.fill();
    }
    ctx.lineWidth = 9;
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.moveTo(58, 46);
    ctx.quadraticCurveTo(128, 66, 198, 46);
    ctx.quadraticCurveTo(128, 122, 58, 46);
    ctx.closePath();
    ctx.stroke();
  };
  if (state === 'neutral') arc(80, 68, 128, 74, 176, 68, 10);
  else if (state === 'smile') arc(68, 50, 128, 108, 188, 50, 11);
  else if (state === 'laugh') openMouth(false);
  else if (state === 'grin') openMouth(true);
  else if (state === 'frown') arc(68, 86, 128, 34, 188, 86, 11);
  else if (state === 'surprise') {
    ctx.beginPath();
    ctx.ellipse(128, 66, 26, 32, 0, 0, Math.PI * 2);
    ctx.fillStyle = MOUTH_DARK;
    ctx.fill();
    ctx.lineWidth = 9;
    ctx.strokeStyle = INK;
    ctx.stroke();
  } else if (state === 'smirk') arc(78, 62, 140, 86, 188, 42, 11);
  else if (state === 'ooh') {
    ctx.beginPath();
    ctx.ellipse(128, 64, 15, 19, 0, 0, Math.PI * 2);
    ctx.fillStyle = MOUTH_DARK;
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = INK;
    ctx.stroke();
  }
  return canvas;
}

let textures = null;
function getTextures() {
  if (textures) return textures;
  textures = {};
  for (const state of STATES) {
    const texture = new THREE.CanvasTexture(drawState(state));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    textures[state] = texture;
  }
  return textures;
}

const toDisc = ([fx, fy]) => [(2 * fx - 1) * FACE_R, (1 - 2 * fy) * FACE_R];

/* Attach a living face to a figure group built on the shared editor rig.
 * Returns { setMouth(state), update() } — call update() every animation
 * frame. The handle is discarded when the figure is rebuilt. */
export function attachLivingFace(parent, npcId) {
  const spec = EYES[npcId];
  if (!parent || !spec) return null;
  const tex = getTextures();
  const mouth = new THREE.Mesh(
    new THREE.PlaneGeometry(0.26, 0.13),
    new THREE.MeshStandardMaterial({
      map: tex.smile,
      transparent: true,
      depthWrite: false,
      alphaTest: 0.02,
      roughness: 0.92,
    })
  );
  mouth.position.set(0, FACE_Y + MOUTH_DY, MOUTH_Z);
  mouth.renderOrder = 2;
  mouth.frustumCulled = false;
  mouth.castShadow = false;
  parent.add(mouth);

  const lids = [];
  for (const key of ['l', 'r']) {
    const [x, y] = toDisc(spec[key]);
    const lid = new THREE.Mesh(
      new THREE.PlaneGeometry(spec.w * FACE_R * 2 * 1.3, Math.max(spec.h * FACE_R * 2 * 1.8, 0.05)),
      new THREE.MeshStandardMaterial({ color: spec.skin, roughness: 1 })
    );
    lid.position.set(x, FACE_Y + y, LID_Z);
    lid.visible = false;
    lid.frustumCulled = false;
    lid.castShadow = false;
    parent.add(lid);
    lids.push(lid);
  }

  const handle = {
    state: 'smile',
    phase: Math.random() * 6,
    nextBlink: performance.now() + 1500 + Math.random() * 4000,
    blinkStart: 0,
    setMouth(state) {
      if (!STATES.includes(state)) return false;
      handle.state = state;
      mouth.material.map = tex[state];
      mouth.material.needsUpdate = true;
      return true;
    },
    update() {
      const now = performance.now();
      if (!reducedMotion) {
        const scale = 1 + 0.03 * Math.sin(now / 1000 * 1.1 + handle.phase);
        mouth.scale.set(scale, scale, 1);
        if (!handle.blinkStart && now >= handle.nextBlink) handle.blinkStart = now;
        if (handle.blinkStart) {
          const elapsed = now - handle.blinkStart;
          let openness = null;
          if (elapsed < CLOSE_MS) openness = elapsed / CLOSE_MS;
          else if (elapsed < CLOSE_MS + HOLD_MS) openness = 1;
          else if (elapsed < CLOSE_MS + HOLD_MS + OPEN_MS) openness = 1 - (elapsed - CLOSE_MS - HOLD_MS) / OPEN_MS;
          else {
            openness = 0;
            handle.blinkStart = 0;
            handle.nextBlink = now + 2500 + Math.random() * 4000;
          }
          const show = openness > 0;
          for (const lid of lids) {
            lid.visible = show;
            if (show) lid.scale.set(1, Math.max(openness, 0.02), 1);
          }
        }
      }
    },
  };
  return handle;
}

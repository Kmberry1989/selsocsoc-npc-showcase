/* selsocsoc accessory library — starter assets
 * Data-driven 3D accessories for NPCs: in-hand, on-head, and back slots.
 * Each def is plain JSON (no code), so the editor can read, tweak and save them.
 * Slots: 'hand' (right), 'handL' (left), 'head', 'back'.
 *
 * Part kinds: sphere, box, cylinder, cone, torus, circle, shape (flat polygon).
 *   args: geometry constructor args (numbers only)
 *   pos: [x,y,z]   rot: [x,y,z] radians   scale: [x,y,z]
 *   color: hex number   roughness: 0..1
 */
export const ACCESSORY_DEFS = [
{ id:'gavel', name:'Ceremonial Gavel', slot:'hand', npc:'mayor-mayor', parts:[
  {kind:'cylinder', args:[0.022,0.026,0.42,10], pos:[0,0.1,0], rot:[0,0,0.5], color:0x8a5a34},
  {kind:'cylinder', args:[0.055,0.055,0.16,14], pos:[0.13,0.28,0], rot:[0,0,0.5], color:0x6e4526},
  {kind:'cylinder', args:[0.058,0.058,0.02,14], pos:[0.1,0.245,0], rot:[0,0,0.5], color:0xe4aa38, roughness:0.35},
  {kind:'cylinder', args:[0.058,0.058,0.02,14], pos:[0.16,0.315,0], rot:[0,0,0.5], color:0xe4aa38, roughness:0.35},
]},
{ id:'flag', name:'Tour Pennant', slot:'hand', npc:'gideon', parts:[
  {kind:'cylinder', args:[0.016,0.016,0.85,8], pos:[0,0.32,0], color:0x8a6a4a, roughness:0.7},
  {kind:'shape', points:[[0,0],[0.34,0.09],[0,0.18],[0,0]], pos:[0.016,0.58,0], color:0xb07a3f, roughness:0.7},
  {kind:'sphere', args:[0.028,10,8], pos:[0,0.76,0], color:0xe4aa38, roughness:0.4},
]},
{ id:'coin', name:'Gold Coin', slot:'hand', npc:'barnaby-bargain', groupOffset:[0,0.1,0], parts:[
  {kind:'cylinder', args:[0.085,0.085,0.028,24], rot:[1.308,0,0], color:0xe4aa38, roughness:0.35},
  {kind:'torus', args:[0.085,0.012,10,24], rot:[1.308,0,0], color:0xc78f2a, roughness:0.4},
]},
{ id:'balloon', name:'Balloon', slot:'hand', npc:'pip-parade', parts:[
  {kind:'sphere', args:[0.14,20,16], pos:[0,0.42,0], scale:[1,1.15,1], color:0xe76854, roughness:0.45},
  {kind:'cone', args:[0.03,0.05,10], pos:[0,0.26,0], rot:[3.1416,0,0], color:0xc74f3d},
  {kind:'cylinder', args:[0.006,0.006,0.22,6], pos:[0,0.14,0], color:0xf5f0e7, roughness:0.8},
]},
{ id:'yarn', name:'Ball of Yarn', slot:'hand', npc:'agnes-alley', groupOffset:[0,0.12,0], parts:[
  {kind:'sphere', args:[0.11,20,16], color:0xd9a7c7, roughness:0.85},
  {kind:'torus', args:[0.11,0.014,8,24], color:0xc48fb5, roughness:0.85},
  {kind:'torus', args:[0.11,0.014,8,24], rot:[1.5708,0.5,0], color:0xc48fb5, roughness:0.85},
  {kind:'cylinder', args:[0.008,0.008,0.2,6], pos:[0.1,-0.12,0.03], rot:[0,0,0.7], color:0xd9a7c7, roughness:0.85},
]},
{ id:'scroll', name:'Quest Scroll', slot:'hand', npc:'dottie-daly', groupOffset:[0,0.12,0], parts:[
  {kind:'cylinder', args:[0.05,0.05,0.32,16], rot:[0,0,1.5708], color:0xf3e6cf, roughness:0.8},
  {kind:'cylinder', args:[0.056,0.056,0.05,16], rot:[0,0,1.5708], color:0xb4552d, roughness:0.6},
  {kind:'sphere', args:[0.028,12,10], pos:[0,0.062,0], color:0xe4aa38, roughness:0.4},
]},
{ id:'goldbar', name:'Gold Bar', slot:'hand', npc:'mr-buck-coinsworth', groupOffset:[0,0.1,0], parts:[
  {kind:'box', args:[0.2,0.09,0.1], color:0xe4aa38, roughness:0.3},
  {kind:'box', args:[0.16,0.02,0.08], pos:[0,0.055,0], color:0xf2c86f, roughness:0.25},
]},
{ id:'flower', name:'Potted Flower', slot:'hand', npc:'fern-bramble', groupOffset:[0,0.1,0], parts:[
  {kind:'cylinder', args:[0.075,0.06,0.1,14], pos:[0,-0.02,0], color:0xb4552d, roughness:0.8},
  {kind:'cylinder', args:[0.012,0.012,0.14,8], pos:[0,0.1,0], color:0x5c8d65, roughness:0.8},
  {kind:'sphere', args:[0.055,14,12], pos:[0,0.2,0], color:0xe78bb0, roughness:0.6},
  {kind:'sphere', args:[0.035,10,8], pos:[0.045,0.12,0], scale:[1.4,0.5,0.7], color:0x5c8d65, roughness:0.7},
]},
{ id:'envelope', name:'Envelope', slot:'hand', npc:'stanley-stamp', groupOffset:[0,0.12,0], groupRot:[-0.15,0,0], parts:[
  {kind:'box', args:[0.24,0.15,0.025], color:0xfbf7ec, roughness:0.85},
  {kind:'box', args:[0.24,0.07,0.028], pos:[0,0.035,0], color:0xefe6d2, roughness:0.85},
  {kind:'box', args:[0.045,0.05,0.03], pos:[0.085,0.045,0], color:0x7fb3d5, roughness:0.7},
]},
{ id:'rod', name:'Fishing Rod', slot:'hand', npc:'bobby-gill', parts:[
  {kind:'cylinder', args:[0.014,0.02,1.15,8], pos:[0,0.45,0], rot:[-0.2,0,0.35], color:0x8a6a4a, roughness:0.7},
  {kind:'cylinder', args:[0.004,0.004,0.5,6], pos:[0.28,0.72,-0.12], rot:[0,0,0.15], color:0xf5f0e7, roughness:0.9},
  {kind:'sphere', args:[0.035,12,10], pos:[0.32,0.48,-0.13], color:0xe76854, roughness:0.5},
]},
{ id:'camera', name:'Camera', slot:'hand', npc:'lyla-lens', groupOffset:[0,0.12,0], parts:[
  {kind:'box', args:[0.2,0.14,0.1], color:0x3a3f44, roughness:0.5},
  {kind:'cylinder', args:[0.05,0.055,0.08,14], pos:[0,0,0.08], rot:[1.5708,0,0], color:0x22262a, roughness:0.4},
  {kind:'cylinder', args:[0.02,0.02,0.02,10], pos:[0,0,0.125], color:0x9fd4ff, roughness:0.3},
]},
{ id:'die', name:'Lucky Die', slot:'hand', npc:'chip-chance', groupOffset:[0,0.12,0], parts:[
  {kind:'box', args:[0.13,0.13,0.13], rot:[0.4,0.5,0.2], color:0xf5f0e7, roughness:0.5},
]},
{ id:'hammer', name:'Hammer', slot:'hand', npc:'peggy-plank', parts:[
  {kind:'cylinder', args:[0.02,0.024,0.4,10], pos:[0,0.1,0], rot:[0,0,0.4], color:0x8a5a34, roughness:0.6},
  {kind:'box', args:[0.2,0.09,0.09], pos:[0.1,0.26,0], rot:[0,0,0.4], color:0x6b7280, roughness:0.45},
]},
{ id:'cane', name:'Walking Cane', slot:'handL', npc:'gideon', parts:[
  {kind:'cylinder', args:[0.018,0.022,0.95,10], pos:[0,0.30,0], color:0x6e4526, roughness:0.55},
  {kind:'torus', args:[0.07,0.018,10,20,3.1416], pos:[-0.07,0.775,0], color:0x6e4526, roughness:0.55},
  {kind:'sphere', args:[0.024,10,8], pos:[-0.14,0.775,0], color:0xe4aa38, roughness:0.4},
]},
/* ---- on-head ---- */
{ id:'tophat', name:'Tall Top Hat', slot:'head', npc:'mayor-mayor', parts:[
  {kind:'cylinder', args:[0.34,0.36,0.05,24], pos:[0,0.02,0], color:0x1c1e22, roughness:0.5},
  {kind:'cylinder', args:[0.21,0.23,0.52,24], pos:[0,0.30,0], color:0x1c1e22, roughness:0.5},
  {kind:'cylinder', args:[0.215,0.215,0.02,24], pos:[0,0.565,0], color:0x24262c, roughness:0.5},
  {kind:'cylinder', args:[0.232,0.232,0.07,24], pos:[0,0.10,0], color:0x8f1f2e, roughness:0.6},
]},
{ id:'mailcap', name:'Mail Cap', slot:'head', npc:'stanley-stamp', parts:[
  {kind:'cylinder', args:[0.20,0.22,0.12,20], pos:[0,0.06,0], color:0x2e4a6b, roughness:0.7},
  {kind:'cylinder', args:[0.30,0.30,0.025,20], pos:[0,0.01,0.10], scale:[1,1,0.7], color:0x243c58, roughness:0.7},
]},
{ id:'buckethat', name:'Bucket Hat', slot:'head', npc:'bobby-gill', parts:[
  {kind:'cylinder', args:[0.17,0.20,0.14,18], pos:[0,0.07,0], color:0x7a8b6f, roughness:0.8},
  {kind:'cylinder', args:[0.30,0.32,0.03,20], pos:[0,0,0], color:0x6b7d61, roughness:0.8},
]},
{ id:'strawhat', name:'Straw Sun Hat', slot:'head', npc:'fern-bramble', parts:[
  {kind:'sphere', args:[0.18,18,12,0,6.2832,0,1.5708], pos:[0,0.02,0], color:0xd9b96a, roughness:0.85},
  {kind:'cylinder', args:[0.34,0.36,0.025,22], pos:[0,0.02,0], color:0xcfa856, roughness:0.85},
]},
{ id:'tourcap', name:'Tour Cap', slot:'head', npc:'gideon', parts:[
  {kind:'sphere', args:[0.20,18,12,0,6.2832,0,1.5708], pos:[0,0.03,0], scale:[1,0.75,1], color:0xb07a3f, roughness:0.75},
  {kind:'cylinder', args:[0.26,0.26,0.025,18], pos:[0,0.02,0.12], scale:[1,1,0.55], color:0x9a6a35, roughness:0.75},
]},
/* ---- back ---- */
{ id:'microphone', name:'Microphone', slot:'handL', npc:'chip-chance', parts:[{kind:'cylinder',args:[0.028,0.032,0.24,14],pos:[0,-0.05,0],color:0x1c1e22},{kind:'sphere',args:[0.085,14,10],pos:[0,0.16,0],color:0x3a3f45}] },
{ id:'cape', name:'Crimson Cape', slot:'back', npc:'mayor-mayor', cape:{color:0x8f1f2e, width:0.8, length:1.05}, parts:[] },
{ id:'press-fedora', name:'Press Fedora', slot:'head', npc:'lyla-lens', parts:[{kind:'cylinder',args:[0.32,0.32,0.03,18],pos:[0,0.02,0],color:0x3a3f45},{kind:'cylinder',args:[0.20,0.22,0.30,18],pos:[0,0.18,0],color:0x3a3f45}] },
{ id:'showman-bowler', name:'Showman Bowler', slot:'head', npc:'chip-chance', parts:[{kind:'cylinder',args:[0.30,0.30,0.025,18],pos:[0,0.01,0],color:0x7a1f2b},{kind:'sphere',args:[0.20,18,12],pos:[0,0.10,0],scale:[1,0.8,1],color:0x7a1f2b}] },
{ id:'bargain-bowler', name:'Bargain Bowler', slot:'head', npc:'barnaby-bargain', parts:[{kind:'cylinder',args:[0.30,0.30,0.025,18],pos:[0,0.01,0],color:0x2e4a6b},{kind:'sphere',args:[0.20,18,12],pos:[0,0.10,0],scale:[1,0.8,1],color:0x2e4a6b}] },
{ id:'confetti-crown', name:'Confetti Crown', slot:'head', npc:'pip-parade', parts:[{kind:'cylinder',args:[0.23,0.23,0.12,18],pos:[0,0.06,0],color:0xe4aa38},{kind:'cone',args:[0.045,0.14,10],pos:[0.20,0.19,0],color:0xd94f6a},{kind:'cone',args:[0.045,0.14,10],pos:[-0.20,0.19,0],color:0x5bc1ce}] },
{ id:'cat-ears', name:'Cat-Ear Headband', slot:'head', npc:'agnes-alley', parts:[{kind:'cylinder',args:[0.24,0.24,0.03,18],pos:[0,0.02,0],color:0x6b4a8a},{kind:'cone',args:[0.075,0.16,10],pos:[-0.13,0.12,0],color:0x6b4a8a},{kind:'cone',args:[0.075,0.16,10],pos:[0.13,0.12,0],color:0x6b4a8a}] },
{ id:'quest-beret', name:'Quest Beret', slot:'head', npc:'dottie-daly', parts:[{kind:'sphere',args:[0.25,18,12],pos:[0,0.08,0],scale:[1,0.55,1],color:0x2f6b4f},{kind:'sphere',args:[0.045,10,8],pos:[0,0.10,0.24],color:0xe4aa38}] },
{ id:'hardhat', name:'Hard Hat', slot:'head', npc:'peggy-plank', parts:[{kind:'cylinder',args:[0.29,0.29,0.03,18],pos:[0,0.01,0],color:0xf3d067},{kind:'sphere',args:[0.22,18,12],pos:[0,0.08,0],scale:[1,0.75,1],color:0xf3d067}] },
{ id:'banker-bowler', name:'Banker Bowler', slot:'head', npc:'mr-buck-coinsworth', parts:[{kind:'cylinder',args:[0.30,0.30,0.025,18],pos:[0,0.01,0],color:0x1c1e22},{kind:'sphere',args:[0.20,18,12],pos:[0,0.10,0],scale:[1,0.8,1],color:0x1c1e22}] },
{ id:'tour-backpack', name:'Tour Backpack', slot:'back', npc:'gideon', parts:[{kind:'box',args:[0.42,0.55,0.20],pos:[0,0.02,-0.12],color:0xb07a3f},{kind:'box',args:[0.30,0.22,0.06],pos:[0,-0.10,-0.24],color:0x8a5f2e}] },
{ id:'press-satchel', name:'Press Satchel', slot:'back', npc:'lyla-lens', parts:[{kind:'box',args:[0.46,0.36,0.16],pos:[0,0,-0.11],color:0x6e4526},{kind:'box',args:[0.46,0.14,0.03],pos:[0,0.12,-0.20],color:0x5a3820}] },
{ id:'dice-pouch', name:'Dice Pouch', slot:'back', npc:'chip-chance', parts:[{kind:'box',args:[0.36,0.42,0.18],pos:[0,0,-0.11],color:0x6b4a8a},{kind:'box',args:[0.09,0.09,0.02],pos:[0,-0.02,-0.22],color:0xf2ead8}] },
{ id:'merchant-satchel', name:'Merchant Satchel', slot:'back', npc:'barnaby-bargain', parts:[{kind:'box',args:[0.46,0.38,0.16],pos:[0,0,-0.11],color:0x2f6b4f},{kind:'box',args:[0.46,0.14,0.03],pos:[0,0.13,-0.20],color:0x24563e}] },
{ id:'festival-banner', name:'Festival Banner', slot:'back', npc:'pip-parade', parts:[{kind:'cylinder',args:[0.065,0.065,0.58,14],pos:[0,0.05,-0.11],color:0xd94f6a},{kind:'cylinder',args:[0.07,0.07,0.04,14],pos:[0,0.36,-0.11],color:0xe4aa38}] },
{ id:'cat-carrier', name:'Cat Carrier', slot:'back', npc:'agnes-alley', parts:[{kind:'box',args:[0.46,0.36,0.24],pos:[0,0,-0.13],color:0x87b6ac},{kind:'box',args:[0.30,0.20,0.02],pos:[0,0,-0.26],color:0x3a3a3a}] },
{ id:'quest-tube', name:'Quest Scroll Tube', slot:'back', npc:'dottie-daly', parts:[{kind:'cylinder',args:[0.075,0.075,0.62,14],pos:[0,0.05,-0.11],color:0xd9b96a},{kind:'cylinder',args:[0.08,0.08,0.05,14],pos:[0,0.38,-0.11],color:0x8f1f2e}] },
{ id:'tool-roll', name:'Tool Roll', slot:'back', npc:'peggy-plank', parts:[{kind:'cylinder',args:[0.10,0.10,0.48,14],pos:[0,0.05,-0.12],rot:[0,0,1.5708],color:0x6e4526}] },
{ id:'money-bag', name:'Money Bag', slot:'back', npc:'mr-buck-coinsworth', parts:[{kind:'sphere',args:[0.24,14,10],pos:[0,-0.02,-0.13],scale:[1,1.15,0.65],color:0xd9b96a}] },
{ id:'seed-pack', name:'Seed Pack', slot:'back', npc:'fern-bramble', parts:[{kind:'box',args:[0.40,0.46,0.16],pos:[0,0,-0.11],color:0x91b977},{kind:'box',args:[0.10,0.14,0.02],pos:[0,0.05,-0.20],color:0xf3d067}] },
{ id:'mailbag', name:'Mailbag', slot:'back', npc:'stanley-stamp', parts:[{kind:'box',args:[0.46,0.50,0.18],pos:[0,0,-0.11],color:0x2e4a6b},{kind:'box',args:[0.46,0.16,0.03],pos:[0,0.15,-0.21],color:0x243c58}] },
{ id:'creel', name:'Fishing Creel', slot:'back', npc:'bobby-gill', parts:[{kind:'box',args:[0.42,0.32,0.20],pos:[0,0,-0.12],color:0xb07a3f},{kind:'box',args:[0.44,0.05,0.22],pos:[0,0.18,-0.12],color:0x8a5f2e}] },
];

/* Default loadout: which accessory id sits in each NPC slot. */
export const DEFAULT_LOADOUT = {
  'mayor-mayor':      { hand:'gavel',  head:'tophat',   back:'cape' },
  'gideon':           { handL:'cane', head:'tourcap' , back:'tour-backpack'},
  'lyla-lens':        { hand:'camera' , head:'press-fedora', back:'press-satchel'},
  'chip-chance':      { hand:'die' , head:'showman-bowler', back:'dice-pouch', handL:'microphone'},
  'barnaby-bargain':  { hand:'coin' , head:'bargain-bowler', back:'merchant-satchel'},
  'pip-parade':       { hand:'balloon' , head:'confetti-crown', back:'festival-banner'},
  'agnes-alley':      { hand:'yarn' , head:'cat-ears', back:'cat-carrier'},
  'dottie-daly':      { hand:'scroll' , head:'quest-beret', back:'quest-tube'},
  'peggy-plank':      { hand:'hammer' , head:'hardhat', back:'tool-roll'},
  'mr-buck-coinsworth':{ hand:'goldbar' , head:'banker-bowler', back:'money-bag'},
  'fern-bramble':     { hand:'flower', head:'strawhat' , back:'seed-pack'},
  'stanley-stamp':    { hand:'envelope', head:'mailcap' , back:'mailbag'},
  'bobby-gill':       { hand:'rod',    head:'buckethat' , back:'creel'},
};

export const SLOT_LABEL = { hand:'In hand (right)', handL:'In hand (left)', head:'On head', back:'On back' };

export function getDef(id) { return ACCESSORY_DEFS.find(d => d.id === id); }

/* Build a THREE.Group from a def. THREE is passed in (module import). */
export function buildAccessory(def, THREE) {
  const g = new THREE.Group();
  if (def.cape) {
    const { color, width, length } = def.cape;
    const geo = new THREE.PlaneGeometry(width, length, 10, 10);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      const t = (length/2 - y) / length;
      pos.setZ(i, -0.18*t*t - 0.06*Math.sin(x*9)*t);
      pos.setX(i, x*(1 + 0.35*t));
    }
    geo.computeVertexNormals();
    const cape = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color, roughness: 0.85, side: THREE.DoubleSide }));
    cape.position.set(0, 0.62, -0.30); cape.castShadow = true;
    g.add(cape);
    const clasp = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10),
      new THREE.MeshStandardMaterial({ color: 0xe4aa38, roughness: 0.35 }));
    clasp.position.set(0, 1.12, 0.28); clasp.castShadow = true;
    g.add(clasp);
    return g;
  }
  for (const p of def.parts || []) {
    let geo;
    switch (p.kind) {
      case 'sphere': geo = new THREE.SphereGeometry(...p.args); break;
      case 'box': geo = new THREE.BoxGeometry(...p.args); break;
      case 'cylinder': geo = new THREE.CylinderGeometry(...p.args); break;
      case 'cone': geo = new THREE.ConeGeometry(...p.args); break;
      case 'torus': geo = new THREE.TorusGeometry(...p.args); break;
      case 'circle': geo = new THREE.CircleGeometry(...p.args); break;
      case 'shape': {
        const s = new THREE.Shape();
        p.points.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y));
        geo = new THREE.ShapeGeometry(s); break;
      }
      default: continue;
    }
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: p.color ?? 0xffffff, roughness: p.roughness ?? 0.6, metalness: 0.05 }));
    if (p.pos) m.position.set(...p.pos);
    if (p.rot) m.rotation.set(...p.rot);
    if (p.scale) m.scale.set(...p.scale);
    m.castShadow = true;
    g.add(m);
  }
  if (def.groupOffset) g.position.set(...def.groupOffset);
  if (def.groupRot) g.rotation.set(...def.groupRot);
  return g;
}

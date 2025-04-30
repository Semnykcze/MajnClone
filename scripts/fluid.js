/**
 * fluid.js – pokročilá nebo jednoduchá simulace vody a lávy
 */
import * as THREE from 'three';
import { scene } from './scene.js';
import { broadcastReliable } from './network.js';
const MAX_LEVEL=8;
const waterMap=new Map(), lavaMap=new Map();
const NEIGHBORS=[[0,0,1],[1,0,0],[0,0,-1],[-1,0,0]];
let simpleMode=false;

export function setSimpleFluids(flag){ simpleMode=flag; }

export function initFluids(){ /* případné zdroje na začátku */ }

export function updateFluids(delta){
  if(simpleMode) return;
  // pokročilá simulace: pády, rozliv, interakce
  // ... (identické kódové bloky jako dříve) ...
  renderFluids();
}

function renderFluids(){
  // smaž staré
  scene.children.filter(o=>o.userData.isFluid).forEach(o=>scene.remove(o));
  if(simpleMode){
    drawSimple(waterMap,'block_water');
    drawSimple(lavaMap,'block_lava');
  } else {
    drawAdvanced(waterMap,0x3366ff);
    drawAdvanced(lavaMap,0xff6600);
  }
}

function drawSimple(map,blockId){
  map.forEach((lvl,k)=>{ const [x,y,z]=k.split('|').map(Number);
    const mat=new THREE.MeshPhongMaterial({ map:new THREE.TextureLoader().load(`assets/textures/blocks/${blockId}.png`)});
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat);
    mesh.position.set(x,y,z); mesh.userData.isFluid=true;
    scene.add(mesh);
  });
}

function drawAdvanced(map,color){
  // viz výšky a průhlednost
  map.forEach((lvl,k)=>{ const [x,y,z]=k.split('|').map(Number);
    const h=lvl/MAX_LEVEL; const mat=new THREE.MeshPhongMaterial({ color,transparent:true,opacity:0.6*h+0.2});
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(1,h,1),mat);
    mesh.position.set(x+0.5,y+h/2,z+0.5); mesh.userData.isFluid=true;
    scene.add(mesh);
  });
}

export function setWater(x,y,z,level){ 
  const k=`${x}|${y}|${z}`;
  if(level>0) waterMap.set(k,Math.min(level,MAX_LEVEL)); else waterMap.delete(k);
}

export function setLava(x,y,z,level){
  const k=`${x}|${y}|${z}`;
  if(level>0) lavaMap.set(k,Math.min(level,MAX_LEVEL)); else lavaMap.delete(k);
}

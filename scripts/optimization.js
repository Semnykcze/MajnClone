/**
 * optimization.js – chunking + greedy meshing loader
 */
import * as THREE from 'three';
import { scene } from './scene.js';
export const CHUNK_SIZE=16, RENDER_DISTANCE=3;
const chunks=new Map();
export function loadChunk(cx,cz){
  const key=`${cx}|${cz}`;
  if(chunks.has(key)) return Promise.resolve(chunks.get(key));
  return new Promise(res=>{
    const worker=new Worker('scripts/chunkWorker.js');
    worker.postMessage({cx,cz,size:CHUNK_SIZE});
    worker.onmessage=e=>{
      const geom=new THREE.BufferGeometry();
      geom.setAttribute('position',new THREE.BufferAttribute(new Float32Array(e.data.positions),3));
      geom.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(e.data.normals),3));
      const mesh=new THREE.Mesh(geom,new THREE.MeshStandardMaterial());
      mesh.position.set(cx*CHUNK_SIZE,0,cz*CHUNK_SIZE);
      scene.add(mesh); chunks.set(key,mesh); res(mesh);
    };
  });
}
export function updateVisibleChunks(px,pz){
  const pcx=Math.floor(px/CHUNK_SIZE), pcz=Math.floor(pz/CHUNK_SIZE);
  for(let dx=-RENDER_DISTANCE;dx<=RENDER_DISTANCE;dx++)
    for(let dz=-RENDER_DISTANCE;dz<=RENDER_DISTANCE;dz++)
      loadChunk(pcx+dx,pcz+dz);
}

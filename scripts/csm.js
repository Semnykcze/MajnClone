/**
 * csm.js – Cascaded Shadow Maps
 */
import * as THREE from 'three';
import { CSM } from 'three/examples/jsm/csm/CSM.js';
import { camera, scene } from './scene.js';

let csm;
export function initCSM(){
  csm=new CSM({
    camera, parent:scene,
    maxFar:500, cascades:4,
    shadowMapSize:2048,
    lightDirection:new THREE.Vector3(-1,-1,-1)
  });
}
export function updateCSM(cam){
  if(csm) csm.update(cam);
}

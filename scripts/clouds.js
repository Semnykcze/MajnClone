/**
 * clouds.js – generuje a animuje semi-transparentní mraky
 */
import * as THREE from 'three';
import { scene }  from './scene.js';

export let cloudMesh;

export function initClouds(){
  if(cloudMesh) scene.remove(cloudMesh);
  const geo = new THREE.PlaneGeometry(64*10,64*10);
  const mat = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('assets/textures/cloud.png'),
    transparent:true, opacity:0.5
  });
  cloudMesh = new THREE.Mesh(geo,mat);
  cloudMesh.rotation.x=-Math.PI/2;
  cloudMesh.position.y=MAX_SURFACE_HEIGHT+20;
  scene.add(cloudMesh);
}

export function updateClouds(delta){
  if(!cloudMesh) return;
  cloudMesh.position.x += delta*2;
  if(cloudMesh.position.x>32*5) cloudMesh.position.x=-32*5;
}

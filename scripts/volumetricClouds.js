/**
 * volumetricClouds.js – volumetrické mraky
 */
import { VolumetricClouds } from 'three/examples/jsm/volumetric/VolumetricClouds.js';
import { renderer, scene, camera } from './scene.js';
let clouds;
export function initVolumetricClouds(){
  clouds=new VolumetricClouds(renderer,scene,camera,{speed:1.0,density:0.5});
}
export function updateVolumetricClouds(delta){
  if(clouds) clouds.update(delta);
}

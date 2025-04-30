/**
 * scene.js – inicializuje Three.js scénu, kameru, světla a fog
 */
import * as THREE from 'three';
export let scene, camera, renderer, clock;

export function initScene() {
  scene    = new THREE.Scene();
  camera   = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias:true });
  clock    = new THREE.Clock();
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

  scene.background = new THREE.Color(0x87CEEB);
  scene.fog        = new THREE.FogExp2(0x87CEEB, 0.002);

  const sun = new THREE.DirectionalLight(0xffffff,1);
  sun.position.set(30,50,30);
  sun.castShadow = true;
  Object.assign(sun.shadow.mapSize, { width:1024, height:1024 });
  Object.assign(sun.shadow.camera, { near:1, far:100, left:-50, right:50, top:50, bottom:-50 });
  scene.add(sun);

  const hemi = new THREE.HemisphereLight(0xffffff,0x444444,0.6);
  scene.add(hemi);

  scene.userData.updateDayNight = t => {
    const cycle = 12*60; const θ = (t/cycle)*Math.PI*2;
    sun.position.set(Math.cos(θ)*30,Math.sin(θ)*30,0);
    const dayF = Math.max(0,Math.sin(θ));
    sun.intensity = dayF*1.2;
    hemi.intensity=0.2+dayF*0.8;
    renderer.setClearColor(new THREE.Color().setHSL(0.6,0.75,0.2+dayF*0.5));
    sun.shadow.radius=THREE.MathUtils.lerp(8,1,dayF);
    sun.shadow.bias  =THREE.MathUtils.lerp(-0.001,-0.0001,dayF);
  };

  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });
}

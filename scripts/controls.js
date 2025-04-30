/**
 * controls.js – pohyb hráče, pointer lock, flight, jump
 */
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { camera }              from './scene.js';
import { sendMovement }        from './network.js';

export let controls;
let moveF,moveB,moveL,moveR,moveUp,moveDown,canJump=false;
const velocity=new THREE.Vector3(),direction=new THREE.Vector3();
let lastSend=0, sendInterval=50;

export function initControls(){
  controls=new PointerLockControls(camera, document.body);
  document.addEventListener('click',()=>controls.lock());
  window.addEventListener('keydown',onKeyDown);
  window.addEventListener('keyup',onKeyUp);
}

function onKeyDown(e){
  switch(e.code){
    case'KeyW':moveF=true;break;
    case'KeyS':moveB=true;break;
    case'KeyA':moveL=true;break;
    case'KeyD':moveR=true;break;
    case'Space':moveUp=true;break;
    case'ShiftLeft':moveDown=true;break;
  }
}
function onKeyUp(e){
  switch(e.code){
    case'KeyW':moveF=false;break;
    case'KeyS':moveB=false;break;
    case'KeyA':moveL=false;break;
    case'KeyD':moveR=false;break;
    case'Space':moveUp=false;break;
    case'ShiftLeft':moveDown=false;break;
  }
}

export function updateControls(delta){
  velocity.x-=velocity.x*10*delta;
  velocity.z-=velocity.z*10*delta;
  direction.set(Number(moveR)-Number(moveL),0,Number(moveF)-Number(moveB)).normalize();
  if(moveF||moveB) velocity.z-=direction.z*400*delta;
  if(moveL||moveR) velocity.x-=direction.x*400*delta;
  controls.moveRight(-velocity.x*delta);
  controls.moveForward(-velocity.z*delta);

  if(moveUp)    camera.position.y+=20*delta;
  if(moveDown)  camera.position.y-=20*delta;
  if(camera.position.y<1.5){ camera.position.y=1.5; canJump=true; }

  const now=performance.now();
  if(now-lastSend>=sendInterval){
    sendMovement(
      controls.getObject().position.toArray(),
      [camera.rotation.x,camera.rotation.y,camera.rotation.z]
    );
    lastSend=now;
  }
}

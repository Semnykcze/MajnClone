/**
 * graphics.js – třída pro HDR, PBR, toneMapping, rozlišení, FPS, efekty, fullscreen
 */
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { scene, camera, renderer } from './scene.js';
import { ssrPass, ssaoPass } from './postprocessing.js';

export class Graphics {
  constructor({ canvas }) {
    this.renderer=renderer; this.scene=scene; this.camera=camera; this.canvas=canvas;
    this.maxFPS=60; this.vsync=true;
    this.pomEnabled = false;
    this.windEnabled = false;

    this.pmrem=new THREE.PMREMGenerator(renderer);
    new RGBELoader().setPath('assets/hdr/').load('royal_esplanade_1k.hdr',hdr=>{
      const env = this.pmrem.fromEquirectangular(hdr).texture;
      scene.environment=env; scene.background=env;
      hdr.dispose(); this.pmrem.dispose();
    });

    renderer.physicallyCorrectLights=true;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.0;
    renderer.outputEncoding=THREE.sRGBEncoding;

    window.addEventListener('resize',()=>this.onResize());
  }

  onResize(){
    const w=this.canvas.clientWidth, h=this.canvas.clientHeight;
    this.renderer.setSize(w,h);
    this.camera.aspect=w/h; this.camera.updateProjectionMatrix();
  }

  render(delta){
    // SSR & SSAO pass jsou spravovány v postprocessing
    renderer.render(this.scene, this.camera);
  }

  setResolution(w,h){
    this.renderer.setSize(w,h);
    this.onResize();
  }
  setMaxFPS(f){ this.maxFPS=f; }
  setVSync(v){ this.vsync=v; }
  setEffectEnabled(name,enabled){
    if(name==='ssaoPass') ssaoPass.enabled=enabled;
    if(name==='bloomPass'); // bloom vždy zapnut, lze přidat flag
  }

  setSSR(on){ ssrPass.enabled=on; }
  setTemporalSSAO(on){ ssaoPass.temporal=on; ssaoPass.enabled=on; }
  setPOM(on){ this.pomEnabled=on; }
  setWind(on){ this.windEnabled=on; }
  setFullscreen(on){
    if(on) document.body.requestFullscreen?.();
    else   document.exitFullscreen?.();
  }
}

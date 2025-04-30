/**
 * postprocessing.js – nastaví composer a všechny passes
 */
import * as THREE from 'three';
import { EffectComposer }  from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass }        from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass }      from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GodRaysShader }   from 'three/examples/jsm/shaders/GodRaysShader.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { MotionBlurPass }  from 'three/examples/jsm/postprocessing/MotionBlurPass.js';
import { BokehPass }       from 'three/examples/jsm/postprocessing/BokehPass.js';
import { SSRPass }         from 'three/examples/jsm/postprocessing/SSRPass.js';
import { scene, camera, renderer } from './scene.js';

let ssrPass, ssaoPass;

export function initPost() {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene,camera));

  ssrPass = new SSRPass({ renderer, scene, camera, width:window.innerWidth, height:window.innerHeight });
  ssrPass.enabled = false;
  composer.addPass(ssrPass);

  ssaoPass = new SSAOPass(scene,camera,window.innerWidth,window.innerHeight);
  ssaoPass.kernelRadius=16; ssaoPass.enabled=true; ssaoPass.temporal=false;
  composer.addPass(ssaoPass);

  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth,window.innerHeight),0.8,0.4,0.85);
  composer.addPass(bloom);

  const godray = new ShaderPass(GodRaysShader);
  composer.addPass(godray);

  const motion = new MotionBlurPass(scene,camera,{sampleCount:16,velocityFactor:1.0});
  composer.addPass(motion);

  const bokeh = new BokehPass(scene,camera,{
    focus:10, aperture:0.00015, maxblur:0.01,
    width:window.innerWidth,height:window.innerHeight
  });
  composer.addPass(bokeh);

  composer.addPass(new ShaderPass(GammaCorrectionShader));
  return composer;
}

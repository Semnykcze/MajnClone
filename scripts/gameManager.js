/**
 * gameManager.js – centrální orchestrátor: init + hlavní smyčka
 */
import { initScene, scene, camera, renderer, clock } from './scene.js';
import { Graphics }      from './graphics.js';
import { initPost }      from './postprocessing.js';
import { initControls, updateControls } from './controls.js';
import { initModes, updateModes }       from './modes.js';
import { initClouds, updateClouds }     from './clouds.js';
import * as worldManager from './worldManager.js';
import * as playerMgr    from './playerManager.js';
import * as network      from './network.js';
import * as saveLoad     from './saveLoad.js';
import { initUI }        from './ui.js';
import { populateResolutionOptions } from './resolutionSelect.js';
import { processManager } from './processManager.js';
import { initCSM, updateCSM } from './csm.js';
import { initVolumetricClouds, updateVolumetricClouds } from './volumetricClouds.js';
import { setSimpleFluids } from './fluid.js';
import * as SeasonManager from './seasonManager.js';
import * as ModManager    from './modManager.js';
import { initAchievements } from './achievementManager.js';
import { initLua, dispatchLuaEvent } from './luaScripting.js';
import { initHotReload }     from './hotReloadManager.js';
import { initTreeManager }   from './treeManager.js';
import { initCropManager }   from './cropManager.js';
import { tryShowLoadButton } from './saveLoad.js';

export let currentSeed, currentMode;
let graphics, composer, running=false;

export const GameManager = {
  init(){
    initScene();
    graphics=new Graphics({canvas:document.getElementById('gameCanvas')});
    composer=initPost();
    initControls(); initModes(); initClouds();
    network.initNetwork(); tryShowLoadButton();
    populateResolutionOptions();
    initUI(this.startGame.bind(this));
    playerMgr.initPlayer();
    SeasonManager.initSeasons();
    initAchievements();
    initLua();
    initHotReload();
    initTreeManager();
    initCropManager();
  },

  startGame(seed,isLoad=false){
    currentSeed=seed;
    currentMode=document.getElementById('modeSelect').value;
    worldManager.initWorld({seed, maxHeight:document.getElementById('maxHeight').value});
    if(!isLoad) saveLoad.saveWorld(seed);
    running=true; clock.start();
    document.body.requestPointerLock?.();
    this.animate();
  },

  animate(){
    if(!running) return;
    if(graphics.vsync) requestAnimationFrame(this.animate.bind(this));
    else setTimeout(this.animate.bind(this),1000/graphics.maxFPS);

    const delta=clock.getDelta();
    scene.userData.updateDayNight(clock.getElapsedTime());
    updateClouds(delta); updateControls(delta);
    updateModes(delta); worldManager.regenerateWorld();
    playerMgr.updatePlayer(delta);
    processManager.update(delta);
    updateCSM(camera); updateVolumetricClouds(delta);
    SeasonManager.updateSeasons(delta);
    dispatchLuaEvent('onUpdate',{delta});
    graphics.updateWindTime(clock.getElapsedTime());
    setSimpleFluids(graphics.simpleFluids);
    graphics.render(delta);
  },

  applySettings(s){
    graphics.setResolution(s.width,s.height);
    graphics.setMaxFPS(s.maxFPS); graphics.setVSync(s.vsync);
    graphics.setEffectEnabled('ssaoPass',s.effects.ssao);
    graphics.setEffectEnabled('bloomPass',s.effects.bloom);
    graphics.setEffectEnabled('motionBlurPass',s.effects.motionBlur);
    graphics.setEffectEnabled('godrayPass',s.effects.godrays);
    graphics.setEffectEnabled('bokehPass',s.effects.dof);
    graphics.setSSR(s.advanced.ssr);
    graphics.setTemporalSSAO(s.advanced.temporalSSAO);
    graphics.setPOM(s.advanced.pom);
    graphics.setWind(s.advanced.wind);
    if(s.advanced.csm) initCSM();
      else graphics.disableCSM();
    if(s.advanced.volClouds) initVolumetricClouds();
      else graphics.disableVolumetricClouds();
    graphics.setFullscreen(s.fullscreen);
    worldManager.updateParams({ dayLength:s.dayLength, maxHeight:s.maxHeight });
    setSimpleFluids(s.simpleFluids);
  },

  stop(){ running=false; }
};

window.addEventListener('DOMContentLoaded',()=>GameManager.init());

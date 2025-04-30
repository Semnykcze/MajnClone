/**
 * ui.js – init všech UI elementů a jejich handlery
 */
import { hostGame, joinGame } from './network.js';
import * as saveLoad from './saveLoad.js';
import { graphics } from './graphics.js';
import { setDayLength, setMaxHeight, setMode } from './modes.js';
import { controls }  from './controls.js';
import { populateResolutionOptions } from './resolutionSelect.js';
import { GameManager } from './gameManager.js';
import { selectHotbar, craft, player } from './playerManager.js';
import * as ModManager    from './modManager.js';
import * as SeasonManager from './seasonManager.js';
import { tooltipManager } from './tooltipManager.js';

export function initUI(onStart){
  populateResolutionOptions();
  document.getElementById('startButton').onclick=()=>{
    setMode(document.getElementById('modeSelect').value);
    document.getElementById('menu').style.display='none';
    onStart(Math.random().toString(),false);
  };
  document.getElementById('loadButton').onclick=()=>saveLoad.loadSaved(onStart);
  document.getElementById('settingsButton').onclick=()=>document.getElementById('settings').classList.remove('hidden');
  document.getElementById('closeSettings').onclick=()=>document.getElementById('settings').classList.add('hidden');
  document.querySelectorAll('.tab-btn').forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('selected'));
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.add('hidden'));
    btn.classList.add('selected');
    document.getElementById(btn.dataset.tab).classList.remove('hidden');
  });
  document.getElementById('applySettings').onclick=()=>{
    const [w,h]=document.getElementById('resolutionSelect').value.split('x').map(Number);
    const settings={
      width:w, height:h,
      maxFPS:+document.getElementById('maxFPS').value,
      vsync:document.getElementById('vsync').checked,
      effects:{
        ssao:document.getElementById('toggleSSAO').checked,
        bloom:document.getElementById('toggleBloom').checked,
        motionBlur:document.getElementById('toggleMotionBlur').checked,
        godrays:document.getElementById('toggleGodrays').checked,
        dof:document.getElementById('toggleDoF').checked
      },
      advanced:{
        ssr:document.getElementById('toggleSSR').checked,
        pom:document.getElementById('togglePOM').checked,
        wind:document.getElementById('toggleWind').checked,
        volClouds:document.getElementById('toggleVolClouds').checked,
        csm:document.getElementById('toggleCSM').checked,
        temporalSSAO:document.getElementById('toggleTemporalSSAO').checked
      },
      simpleFluids:document.getElementById('toggleSimpleFluids').checked,
      fullscreen:document.getElementById('fullscreenMode').checked,
      dayLength:+document.getElementById('dayLength').value,
      maxHeight:+document.getElementById('maxHeight').value,
      mouseSensitivity:+document.getElementById('mouseSensitivity').value,
      invertY:document.getElementById('invertY').checked
    };
    GameManager.applySettings(settings);
    document.getElementById('settings').classList.add('hidden');
  };
  document.getElementById('hostButton').onclick=()=>hostGame();
  document.getElementById('joinButton').onclick=()=>{
    const id=document.getElementById('peerIdInput').value.trim();
    if(id) joinGame(id);
  };
  document.querySelectorAll('#hotbar .slot').forEach(el=>{
    el.onclick=()=>selectHotbar(+el.dataset.index);
  });
  window.addEventListener('keydown',e=>{
    if(e.code.startsWith('Digit')) selectHotbar(+e.code.slice(-1)-1);
    if(e.code==='KeyE') document.getElementById('inventory').classList.toggle('hidden');
    if(e.code==='KeyC') craft();
  });

  // registrace tooltipů
  document.querySelectorAll('.inventory-slot, .craft-slot, #hotbar .slot').forEach(el=>{
    tooltipManager.register(el, ()=>{
      const idx = parseInt(el.dataset.index);
      const slot = el.classList.contains('inventory-slot')
        ? player.inventory[idx]
        : player.hotbar[idx];
      if(!slot) return null;
      return {
        id: slot.id,
        type: slot.id.startsWith('block_')?'block':(slot.id.startsWith('food_')?'food':'item'),
        count: slot.count,
        obtainedAt: slot.obtainedAt,
        durability: slot.durability,
        maxDurability: slot.maxDurability
      };
    });
  });
}

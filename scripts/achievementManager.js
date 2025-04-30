/**
 * achievementManager.js – definice a sledování achievementů
 */
import { ModAPI } from './modAPI.js';
const STORAGE_KEY='achievementsUnlocked';
const ACHIEVEMENTS=[
  {id:'firstTree',name:'First Tree',description:'Zasaď první strom',event:'treeFullyGrown'},
  {id:'hydrationMaster',name:'Hydration Master',description:'Polož 100 kapek vody',event:'waterPlaced',count:100},
  {id:'lavaTamer',name:'Lava Tamer',description:'Transmutuj 10 lávových bloků',event:'lavaTransmute',count:10}
];
let unlocked=new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'));
const progress={};
export function initAchievements(){
  ACHIEVEMENTS.forEach(a=>{
    progress[a.id]=0;
    ModAPI.on(a.event,data=>{
      if(unlocked.has(a.id)) return;
      if(a.count){
        progress[a.id]++;
        if(progress[a.id]>=a.count) unlock(a.id);
      } else unlock(a.id);
    });
  });
}
function unlock(id){
  const a=ACHIEVEMENTS.find(x=>x.id===id);
  unlocked.add(id); localStorage.setItem(STORAGE_KEY,JSON.stringify(Array.from(unlocked)));
  const el=document.createElement('div');el.className='achievement-notif';
  el.innerHTML=`<strong>Achievement Unlocked!</strong><div>${a.name}: ${a.description}</div>`;
  document.body.appendChild(el);
  setTimeout(()=>el.classList.add('visible'),10);
  setTimeout(()=>el.classList.remove('visible'),5000);
  setTimeout(()=>document.body.removeChild(el),5500);
}
export function getUnlocked(){return Array.from(unlocked);}
export function getAllAchievements(){return ACHIEVEMENTS.map(a=>({ ...a,unlocked:unlocked.has(a.id),progress:progress[a.id]||0 }));}

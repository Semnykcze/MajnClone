/**
 * cropManager.js – sázení, růst a sklizeň plodin
 */
import { placeBlock, removeBlock } from './world.js';
import { removeItem, addItem }     from './playerManager.js';
import { getCurrentSeason }        from './seasonManager.js';
import { broadcastReliable }       from './network.js';
import { cropById } from './cropsLoader.js';

const plantedCrops=[];
export function plantCrop(x,y,z,seedId){
  const def=Object.values(cropById).find(c=>c.seedItem===seedId);
  if(!def||!removeItem(seedId,1)) return false;
  const c={type:def.id,x,y,z,stage:0,timer:0,watered:false,ready:false};
  placeBlock(x,y+1,z,def.stages[0].blockId);
  plantedCrops.push(c);
  broadcastReliable({type:'cropPlanted',x,y,z,cropType:def.id});
  return true;
}
export function waterCrop(x,y,z){
  const c=plantedCrops.find(c=>c.x===x&&c.y===y&&c.z===z);
  if(c) c.watered=true;
}
export function updateCrops(delta){
  const season=getCurrentSeason();
  plantedCrops.forEach(c=>{
    const def=cropById.get(c.type);
    if(!def.validSeasons.includes(season)) return;
    if(def.needsWater&&!c.watered) return;
    c.timer+=delta;
    const st=def.stages[c.stage];
    if(c.timer>=st.time){
      c.timer=0; removeBlock(c.x,c.y+1,c.z);
      if(c.stage<def.stages.length-1){
        c.stage++; placeBlock(c.x,c.y+1,c.z,def.stages[c.stage].blockId);
      } else c.ready=true;
      broadcastReliable({type:'cropGrown',x:c.x,y:c.y,z:c.z,stage:c.stage});
    }
    c.watered=false;
  });
}
export function harvestCrop(x,y,z){
  const idx=plantedCrops.findIndex(c=>c.x===x&&c.y===y&&c.z===z&&c.ready);
  if(idx<0) return false;
  const c=plantedCrops[idx],def=cropById.get(c.type);
  removeBlock(x,y+1,z); addItem(def.harvest.itemId,def.harvest.count);
  plantedCrops.splice(idx,1);
  broadcastReliable({type:'cropHarvested',x,y,z,cropType:c.type});
  return true;
}

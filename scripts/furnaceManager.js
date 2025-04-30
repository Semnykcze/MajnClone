/**
 * furnaceManager.js – pec pro zpracování rud
 */
import { processManager } from './processManager.js';
import { addItem } from './playerManager.js';

export const smeltDefs={
  copper_ore:{result:'item_copper_ingot',time:12},
  iron_ore:  {result:'item_iron_ingot',  time:15},
  gold_ore:  {result:'item_gold_ingot',  time:20},
  lapis_ore: {result:'item_lapis_lazuli',time:8},
  redstone_ore:{result:'item_redstone_dust',time:5},
  emerald_ore:{result:'item_emerald_gem', time:30},
  bauxite_ore:{result:'item_aluminum_ingot',time:20},
  tin_ore:   {result:'item_tin_ingot',     time:10},
  nickel_ore:{result:'item_nickel_ingot',  time:15},
  quartz_ore:{result:'item_quartz_crystal',time:5},
  titanium_ore:{result:'item_titanium_ingot',time:25},
  cobalt_ore:{result:'item_cobalt_ingot',  time:30},
  tungsten_ore:{result:'item_tungsten_ingot',time:35},
  lithium_ore:{result:'item_lithium_compound',time:20},
  uranium_ore:{result:'item_uranium_ingot',time:40}
};

const furnaces=[]; 

export function placeFurnace(x,y,z){
  furnaces.push({x,y,z,fuel:0,queue:[]});
}

export function addFuel(x,y,z,amount){
  const f=furnaces.find(f=>f.x===x&&f.y===y&&f.z===z);
  if(f){f.fuel+=amount;return true;} return false;
}

export function addOreToFurnace(x,y,z,oreId){
  const f=furnaces.find(f=>f.x===x&&f.y===y&&f.z===z);
  const def=smeltDefs[oreId];
  if(!f||!def||f.fuel<=0) return false;
  f.fuel--; processManager.add('smelt',def.time,{result:def.result},({result})=>addItem(result,1));
  return true;
}

export function updateFurnaces(delta){
  // již spravuje processManager
}

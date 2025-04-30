/**
 * modManager.js – autodiscovery a správa módů v scripts/mods/
 */
const STORAGE_KEY='enabledMods';
const modsDir=require('path').join(process.cwd(),'scripts','mods');
const modFiles=require('fs').readdirSync(modsDir).filter(f=>f.endsWith('.js'));
const AVAILABLE_MODS=modFiles.map(file=>{
  const mod=require(require('path').join(modsDir,file));
  return { id:mod.metadata.id, name:mod.metadata.name, description:mod.metadata.description };
});
let enabledMods=new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'));
AVAILABLE_MODS.forEach(m=>{ if(enabledMods.has(m.id)) require(`${modsDir}/${m.id}.js`); });
export function getAllMods(){ return AVAILABLE_MODS.map(m=>({ ...m, enabled:enabledMods.has(m.id)})); }
export function toggleMod(modId){
  enabledMods.has(modId)?enabledMods.delete(modId):enabledMods.add(modId);
  localStorage.setItem(STORAGE_KEY,JSON.stringify(Array.from(enabledMods)));
  window.dispatchEvent(new CustomEvent('modToggle',{detail:{id:modId,enabled:enabledMods.has(modId)}}));
}
export function isModEnabled(id){ return enabledMods.has(id); }

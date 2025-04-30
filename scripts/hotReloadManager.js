/**
 * hotReloadManager.js – sleduje složku mods a reloaduje
 */
import fs from 'fs';
import path from 'path';
import { isModEnabled } from './modManager.js';
const modsDir=path.join(process.cwd(),'scripts','mods');
export function initHotReload(){
  if(!fs.existsSync(modsDir)) return;
  fs.watch(modsDir,(ev,fn)=>{
    if(!fn.endsWith('.js')) return;
    const id=fn.replace('.js',''), mpath=path.join(modsDir,fn);
    delete require.cache[require.resolve(mpath)];
    if(isModEnabled(id)){
      try{ require(mpath); console.log(`Reloaded mod ${id}`); }
      catch(e){ console.error(`Error reloading ${id}:`,e); }
    }
  });
}

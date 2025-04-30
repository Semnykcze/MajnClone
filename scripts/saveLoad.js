/**
 * saveLoad.js – ukládá seed+mode do /saves pomocí fs, načítá je
 */
import fs from 'fs';
import path from 'path';
const saveDir=path.join(process.cwd(),'saves');
if(!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);

export function saveWorld(seed){
  const mode=document.getElementById('modeSelect').value;
  fs.writeFileSync(path.join(saveDir,`${seed}.json`),
    JSON.stringify({seed,mode})
  );
}
export function tryShowLoadButton(){
  const btn=document.getElementById('loadButton');
  if(fs.existsSync(saveDir) && fs.readdirSync(saveDir).length)
    btn.style.display='inline-block';
}
export function loadSaved(cb){
  const files=fs.readdirSync(saveDir).filter(f=>f.endsWith('.json'));
  if(!files.length) return;
  const sw=JSON.parse(fs.readFileSync(path.join(saveDir,files[0]),'utf-8'));
  document.getElementById('modeSelect').value=sw.mode;
  cb(sw.seed,true);
}

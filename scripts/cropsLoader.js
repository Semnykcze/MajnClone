/**
 * cropsLoader.js – načte JSON definice plodin ze assets/crops/
 */
import fs from 'fs';
import path from 'path';
const cropsDir=path.join(process.cwd(),'assets','crops');
function loadCropDefs(){
  if(!fs.existsSync(cropsDir)) return [];
  return fs.readdirSync(cropsDir).filter(f=>f.endsWith('.json'))
    .map(f=>JSON.parse(fs.readFileSync(path.join(cropsDir,f),'utf-8')));
}
const crops=loadCropDefs();
const cropById=new Map(crops.map(c=>[c.id,c]));
export { crops, cropById };

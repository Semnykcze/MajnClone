/**
 * assetsLoader.js – načte blocks/items/foods JSON a mapy definic
 */
import fs from 'fs';
import path from 'path';
const base=path.join(process.cwd(),'assets');
function loadDefs(sub){
  const dir=path.join(base,sub);
  return fs.existsSync(dir)?
    fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>
      JSON.parse(fs.readFileSync(path.join(dir,f),'utf-8'))
    ):[];
}
export const blocks    = loadDefs('blocks');
export const items     = loadDefs('items');
export const foods     = loadDefs('foods');
export const blockById = new Map(blocks.map(b=>[b.id,b]));
export const itemById  = new Map(items.map(i=>[i.id,i]));
export const foodById  = new Map(foods.map(f=>[f.id,f]));

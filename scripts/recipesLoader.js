/**
 * recipesLoader.js – načte všechny JSONy v assets/recipes
 */
import fs from 'fs';
import path from 'path';
const dir=path.join(process.cwd(),'assets','recipes');
const recipes=fs.existsSync(dir)?
  fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>
    JSON.parse(fs.readFileSync(path.join(dir,f),'utf-8'))
  ):[];
const recipeById=new Map(recipes.map(r=>[r.id,r]));
export function getRecipeByOutput(id){ return recipeById.get('craft_'+id); }
export function findMatchingRecipe(av){
  return recipes.find(r=>r.inputs.every(i=>
    (av.get(i.id)||0)>=i.count
  ));
}
export { recipes };

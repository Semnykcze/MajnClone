/**
 * treeManager.js – správa růstu zasazených stromů
 */
import { placeBlock, removeBlock } from './world.js';
import { removeItem } from './playerManager.js';
import { broadcastReliable } from './network.js';

const TREE_DEFS={
  oak:{
    seedItem:'seed_oak',
    stages:[
      {blocks:[{x:0,y:0,z:0,id:'block_sapling_oak'}],time:30},
      {blocks:[
        {x:0,y:1,z:0,id:'block_log_oak'},
        {x:0,y:2,z:0,id:'block_leaves_oak'},
        {x:1,y:2,z:0,id:'block_leaves_oak'},
        {x:-1,y:2,z:0,id:'block_leaves_oak'},
        {x:0,y:2,z:1,id:'block_leaves_oak'},
        {x:0,y:2,z:-1,id:'block_leaves_oak'}
      ],time:90},
      {blocks:[
        {x:0,y:1,z:0,id:'block_log_oak'},
        {x:0,y:2,z:0,id:'block_log_oak'},
        {x:0,y:3,z:0,id:'block_log_oak'},
        ...[-1,0,1].flatMap(dx=>[-1,0,1].flatMap(dz=>[
          {x:dx,y:4,z:dz,id:'block_leaves_oak'},
          {x:dx,y:5,z:dz,id:'block_leaves_oak'}
        ]))
      ],time:0}
    ]
  }
};
const plantedTrees=[];
export function plantSeed(x,y,z,seedId){
  const type=Object.keys(TREE_DEFS).find(t=>TREE_DEFS[t].seedItem===seedId);
  if(!type||!removeItem(seedId,1)) return false;
  const tree={type,x,y,z,stage:0,timer:0,placedBlocks:[]};
  renderStage(tree,0); plantedTrees.push(tree);
  broadcastReliable({type:'plantTree',x,y,z,treeType:type});
  return true;
}
function renderStage(tree,si){
  tree.placedBlocks.forEach(b=>removeBlock(b.x,b.y,b.z));
  tree.placedBlocks=[];
  const stage=TREE_DEFS[tree.type].stages[si];
  stage.blocks.forEach(b=>{
    const wx=tree.x+b.x,wy=tree.y+b.y,wz=tree.z+b.z;
    placeBlock(wx,wy,wz,b.id);
    tree.placedBlocks.push({x:wx,y:wy,z:wz});
  });
}
export function updateTrees(delta){
  for(let i=plantedTrees.length-1;i>=0;i--){
    const t=plantedTrees[i],def=TREE_DEFS[t.type],st=def.stages[t.stage];
    if(st.time<=0) continue;
    t.timer+=delta;
    if(t.timer>=st.time){
      t.timer=0; t.stage++; renderStage(t,t.stage);
    }
  }
}

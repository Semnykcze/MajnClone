/**
 * world.js – generování voxelů podle 2D a 3D SimplexNoise
 */
import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';
import { scene }    from './scene.js';
import { blockById } from './assetsLoader.js';

const simplex2D = new SimplexNoise('terrain-seed');
const simplex3D = new SimplexNoise('cave-seed');

const WORLD_SIZE = 64;
const MAX_SURFACE_HEIGHT = 16;
const CAVE_SCALE = 0.08;
const CAVE_THRESHOLD = 0.6;

export function generateWorld(seed) {
  scene.children.filter(o=>o.userData.isBlock).forEach(o=>scene.remove(o));

  for (let x=0; x<WORLD_SIZE; x++) {
    for (let z=0; z<WORLD_SIZE; z++) {
      const n = simplex2D.noise2D(x/30,z/30);
      const surfaceY = Math.floor((n+1)*0.5*MAX_SURFACE_HEIGHT)+8;

      for (let y=0; y<=surfaceY; y++) {
        if (y===0) {
          placeBlock(x,y,z,'block_bedrock'); continue;
        }
        const caveVal = simplex3D.noise3D(x*CAVE_SCALE, y*CAVE_SCALE, z*CAVE_SCALE);
        if (y<surfaceY-2 && caveVal>CAVE_THRESHOLD) continue;

        if (y===surfaceY) {
          placeBlock(x,y,z,'block_grass'); continue;
        }
        if (y>=surfaceY-2) {
          placeBlock(x,y,z,'block_dirt'); continue;
        }

        if (y<4) {
          placeBlock(x,y,z,'block_granite');
        } else {
          placeBlock(x,y,z,Math.random()<0.5?'block_diorite':'block_andesite');
        }

        const oreChance = Math.random();
        if (y<8 && oreChance<0.02)      placeBlock(x,y,z,'block_diamond_ore');
        else if (y<12 && oreChance<0.04)placeBlock(x,y,z,'block_gold_ore');
        else if (y<16 && oreChance<0.06)placeBlock(x,y,z,'block_iron_ore');
        else if (oreChance<0.1)         placeBlock(x,y,z,'block_coal_ore');
      }
    }
  }
}

function placeBlock(x,y,z,id){
  const def = blockById.get(id);
  if(!def) return;
  const tex = new THREE.TextureLoader().load(`assets/textures/blocks/${id}.png`);
  const mat = new THREE.MeshLambertMaterial({ map:tex });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), mat);
  mesh.position.set(x,y,z);
  mesh.userData.isBlock = true;
  mesh.castShadow = mesh.receiveShadow = true;
  scene.add(mesh);
}

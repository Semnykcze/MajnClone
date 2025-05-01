// scripts/mapGenerator.js

/**
 * mapGenerator.js
 * —————————————————————————————————————————————————————————————————————
 * Pokročilé procedurální generování světa:
 * 1) HeightMap: multi-octave Simplex noise
 * 2) Biomes: na základě teploty+vlhkosti
 * 3) Rivers: carve podle gradientu výšky
 * 4) Caves: 3D noise carving
 */

import SimplexNoise from 'simplex-noise';

export class MapGenerator {
  constructor({ width=256, depth=256, maxHeight=64, seed='' } = {}) {
    this.width     = width;
    this.depth     = depth;
    this.maxHeight = maxHeight;
    this.seed      = seed;
    this.noise2D   = new SimplexNoise(seed + '_height');
    this.noiseTemp = new SimplexNoise(seed + '_temp');
    this.noiseHum  = new SimplexNoise(seed + '_hum');
    this.noise3D   = new SimplexNoise(seed + '_cave');
  }

  generate() {
    this._genHeightMap();
    this._genTempHumMaps();
    this._genBiomeMap();
    this._genRiverPaths();
    this._genBlocks();
  }

  _genHeightMap() {
    const { width, depth, maxHeight, noise2D } = this;
    this.heightMap = new Array(width).fill(0).map(() => new Array(depth));
    // 4 octaves
    const octaves = [
      { freq: 1/128, amp: 30 },
      { freq: 1/64,  amp: 15 },
      { freq: 1/32,  amp: 8 },
      { freq: 1/16,  amp: 4 }
    ];
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        let h = 0;
        for (const o of octaves) {
          h += o.amp * noise2D.noise2D(x * o.freq, z * o.freq);
        }
        // normalize & shift into [0,maxHeight]
        const norm = (h + octaves.reduce((s,o)=>s+o.amp,0)) / (2*octaves.reduce((s,o)=>s+o.amp,0));
        this.heightMap[x][z] = Math.floor(norm * maxHeight);
      }
    }
  }

  _genTempHumMaps() {
    const { width, depth, noiseTemp, noiseHum } = this;
    this.tempMap = new Array(width).fill(0).map(() => new Array(depth));
    this.humMap  = new Array(width).fill(0).map(() => new Array(depth));
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        this.tempMap[x][z] = 0.5 + 0.5 * noiseTemp.noise2D(x/128, z/128);
        this.humMap[x][z]  = 0.5 + 0.5 * noiseHum.noise2D(x/128, z/128);
      }
    }
  }

  _genBiomeMap() {
    const { width, depth, tempMap, humMap } = this;
    this.biomeMap = new Array(width).fill(0).map(() => new Array(depth));
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        const t = tempMap[x][z], h = humMap[x][z];
        if      (t < 0.3) this.biomeMap[x][z] = 'Snow';
        else if (t < 0.5) this.biomeMap[x][z] = h < 0.5 ? 'Taiga' : 'Forest';
        else if (t < 0.7) this.biomeMap[x][z] = h < 0.3 ? 'Desert' : 'Plains';
        else              this.biomeMap[x][z] = h < 0.5 ? 'Savanna' : 'Jungle';
      }
    }
  }

  _genRiverPaths() {
    // jednoduchá implementace: vysledky jako množina vrcholů, kde level<riverThreshold
    const { width, depth, heightMap } = this;
    this.riverMap = new Array(width).fill(0).map(() => new Array(depth).fill(false));
    const threshold = this.maxHeight * 0.1; // nejnižší 10%
    for (let x = 1; x < width-1; x++) {
      for (let z = 1; z < depth-1; z++) {
        if (heightMap[x][z] < threshold) {
          // carve river
          this.riverMap[x][z] = true;
        }
      }
    }
  }

  _genBlocks() {
    // výsledná 3D struktura
    this.blocks = [];
    const {
      width, depth, heightMap, biomeMap, riverMap,
      noise3D, maxHeight
    } = this;
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        const h = heightMap[x][z];
        for (let y = 0; y <= h; y++) {
          // cave carve
          const caveVal = noise3D.noise3D(x/32, y/32, z/32);
          if (y < h-3 && caveVal > 0.7) continue;
          let blockId;
          if (y === h) {
            // surface block by biome
            switch (biomeMap[x][z]) {
              case 'Snow':   blockId = 'block_snow'; break;
              case 'Desert': blockId = 'block_sand';  break;
              default:       blockId = 'block_grass';
            }
            // river override
            if (riverMap[x][z]) blockId = 'block_water';
          } else if (y > h - 4) {
            blockId = 'block_dirt';
          } else {
            // subsurface ores probabilistically
            const depthLevel = h - y;
            const r = Math.random();
            if (depthLevel < 5 && r < 0.01)      blockId = 'block_diamond_ore';
            else if (depthLevel < 12 && r < 0.02) blockId = 'block_gold_ore';
            else if (depthLevel < 20 && r < 0.05) blockId = 'block_iron_ore';
            else if (r < 0.1)                     blockId = 'block_stone';
            else                                  blockId = 'block_granite';
          }
          this.blocks.push({ x, y, z, blockId });
        }
      }
    }
  }
}

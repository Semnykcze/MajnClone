/**
 * worldManager.js – správa parametrů světa a (re)generace
 */
import { generateWorld } from './world.js';
import * as clouds       from './clouds.js';
import { setDayLength }  from './modes.js';

export const config = {
  seed: null, worldSize: 64, maxHeight: 8, noiseScale: 0.1, dayLength:12*60
};

export function initWorld(params={}) {
  Object.assign(config,params);
  generateWorld(config.seed);
  clouds.initClouds();
  setDayLength(config.dayLength);
}

export function regenerateWorld() {
  if (!config.seed) return;
  initWorld({ seed: config.seed });
}

export function updateParams(p={}) {
  if (p.dayLength!==undefined) setDayLength((config.dayLength = p.dayLength*60));
  if (p.worldSize  !==undefined) config.worldSize  = p.worldSize;
  if (p.maxHeight  !==undefined) config.maxHeight  = p.maxHeight;
  if (p.noiseScale !==undefined) config.noiseScale = p.noiseScale;
}

/**
 * modes.js – zákonitosti survival/creative/adventure, denní délka
 */
let gameMode='survival';
let dayLength=12*60;
export function initModes(){ }
export function updateModes(delta){ /* hunger/health apod. */ }
export function setDayLength(sec){ dayLength=sec; }
export function setMode(m){ gameMode=m; }
export function getMode(){ return gameMode; }

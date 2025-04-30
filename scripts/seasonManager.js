/**
 * seasonManager.js – herní kalendář, roční období, teploty
 */
export const Seasons=['Spring','Summer','Autumn','Winter'];
const DAY_LENGTH=60*5, DAYS_PER_SEASON=7, TOTAL_DAYS=DAYS_PER_SEASON*4;
const SEASON_TEMP_OFFSETS={Spring:5,Summer:15,Autumn:5,Winter:-5};
let elapsedTime=0, playerTemp=37.0;
const ambientBaseTemp=15, adaptRate=0.1;
export function initSeasons(){ elapsedTime=0; playerTemp=37.0; }
export function updateSeasons(delta){
  elapsedTime+=delta;
  const diff=getWorldTemperature()-playerTemp;
  playerTemp+=diff*Math.min(adaptRate*delta,1);
}
export function getCurrentDay(){ return Math.floor(elapsedTime/DAY_LENGTH)%TOTAL_DAYS; }
export function getCurrentSeason(){ return Seasons[Math.floor(getCurrentDay()/DAYS_PER_SEASON)]; }
export function getWorldTemperature(){ return ambientBaseTemp+SEASON_TEMP_OFFSETS[getCurrentSeason()]; }
export function getPlayerTemperature(){ return playerTemp; }
export function getElapsedTime(){ return elapsedTime; }

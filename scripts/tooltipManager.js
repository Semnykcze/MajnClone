/**
 * tooltipManager.js – zobrazení tooltipu pro sloty
 */
import { blockById, itemById, foodById } from './assetsLoader.js';
import { getElapsedTime } from './seasonManager.js';

class TooltipManagerClass {
  constructor(){
    this.tooltip=document.createElement('div');
    this.tooltip.id='tooltip'; document.body.appendChild(this.tooltip);
    this.tooltip.style.cssText='position:fixed;pointer-events:none;padding:8px;background:rgba(0,0,0,0.8);color:#fff;border-radius:4px;font-size:0.85em;max-width:200px;display:none;z-index:1000;';
    this._onMouseMove=this._onMouseMove.bind(this);
  }
  register(el,getData){
    el.addEventListener('mouseenter',e=>{
      this.getData=getData; this.tooltip.style.display='block';
      window.addEventListener('mousemove',this._onMouseMove);
    });
    el.addEventListener('mouseleave',()=>{
      this.tooltip.style.display='none';
      window.removeEventListener('mousemove',this._onMouseMove);
    });
  }
  _onMouseMove(e){
    const data=this.getData?.(); if(!data||!data.id) return;
    const defs = data.type==='block'?blockById:itemById;
    const def = data.type==='food'?foodById.get(data.id):defs.get(data.id);
    if(!def) return;
    let html=`<strong>${def.name}</strong><br>${def.description||''}`;
    if(data.type==='food'&&def.spoilTime){
      const age=getElapsedTime()-(data.obtainedAt||0);
      if(age>=def.spoilTime) html+='<br><span style="color:#f66">Spoiled</span>';
      else { const rem=Math.ceil(def.spoilTime-age); html+=`<br>Spoils in ${rem}s`; }
    }
    if(data.durability!=null){
      const p=Math.round(data.durability/data.maxDurability*100);
      html+=`<br>Durability: ${data.durability}/${data.maxDurability} (${p}%)`;
    }
    if(data.count!=null) html+=`<br>×${data.count}`;
    this.tooltip.innerHTML=html;
    let x=e.clientX+12,y=e.clientY+12;
    const {innerWidth,innerHeight}=window; const {offsetWidth,offsetHeight}=this.tooltip;
    if(x+offsetWidth>innerWidth) x=e.clientX-offsetWidth-12;
    if(y+offsetHeight>innerHeight) y=e.clientY-offsetHeight-12;
    this.tooltip.style.left=x+'px'; this.tooltip.style.top=y+'px';
  }
}
export const tooltipManager=new TooltipManagerClass();

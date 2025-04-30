/**
 * processManager.js – správce time-consuming tasků
 */
export class ProcessManager {
  constructor(){ this.tasks=[]; }
  add(id,duration,data,onComplete){
    this.tasks.push({id,remaining:duration,data,onComplete});
  }
  update(delta){
    for(let i=this.tasks.length-1;i>=0;i--){
      const t=this.tasks[i]; t.remaining-=delta;
      if(t.remaining<=0){ t.onComplete(t.data); this.tasks.splice(i,1); }
    }
  }
  getTasks(){ return this.tasks; }
}
export const processManager=new ProcessManager();

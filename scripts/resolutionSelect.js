/**
 * resolutionSelect.js – naplní select rozlišeními podle poměrů
 */
export function populateResolutionOptions(){
  const sel=document.getElementById('resolutionSelect');
  if(!sel) return; sel.innerHTML='';
  const maxW=window.screen.width, maxH=window.screen.height;
  const groups={
    '4:3':[[800,600],[1024,768],[1280,960],[1600,1200]],
    '16:10':[[1280,800],[1440,900],[1680,1050],[1920,1200]],
    '16:9':[[1280,720],[1366,768],[1600,900],[1920,1080],[2560,1440]]
  };
  Object.entries(groups).forEach(([lab,list])=>{
    const og=document.createElement('optgroup'); og.label=lab;
    list.forEach(([w,h])=>{
      if(w<=maxW && h<=maxH){
        const o=document.createElement('option');
        o.value=`${w}x${h}`; o.textContent=`${w} × ${h}`;
        og.appendChild(o);
      }
    });
    if(og.children.length) sel.appendChild(og);
  });
}

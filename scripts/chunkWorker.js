/**
 * chunkWorker.js – Web Worker pro greedy meshing chunků
 */
importScripts('https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js');
self.onmessage = e => {
  const {cx,cz,size}=e.data;
  const simplex=new SimplexNoise(cx+cz);
  const positions=[],normals=[];
  // jednoduchý generátor: plný kuboid
  for(let x=0;x<size;x++)for(let y=0;y<size;y++)for(let z=0;z<size;z++){
    positions.push(x,y,z, x+1,y,z, x,y+1,z, x,y,z+1);
    normals.push(0,1,0, 0,1,0, 0,1,0, 0,1,0);
  }
  self.postMessage({positions,normals});
};

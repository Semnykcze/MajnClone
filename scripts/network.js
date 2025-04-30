/**
 * network.js – P2P realtime se dvěma kanály: reliable/unreliable
 */
import { startGame, currentSeed, currentMode } from './gameManager.js';
import { placeBlock }        from './world.js';
import { updateRemotePlayer, interpolateRemote } from './world.js';

let peer, reliableConns=[], fastConns=[];
export function initNetwork(){
  if(peer) return;
  peer=new Peer(undefined,{config:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]}});
  peer.on('open',id=>document.getElementById('myPeerId').textContent=id);
  peer.on('connection',c=>{
    if(c.metadata?.type==='movement') setupFast(c);
    else setupReliable(c);
  });
}
function setupReliable(c){
  reliableConns.push(c);
  c.on('open',()=>c.send({type:'sync',seed:currentSeed,mode:currentMode}));
  c.on('data',d=>{ if(d.type==='sync') startGame(d.seed,true);
                   if(d.type==='blockPlace') placeBlock(d.x,d.y,d.z,d.blockId); });
}
function setupFast(c){
  fastConns.push(c);
  c.on('data',d=>{ if(d.type==='movement')
    updateRemotePlayer(d.peerId,d.position,d.rotation,d.timestamp);
  });
}
export function hostGame(){ initNetwork(); document.getElementById('networkUI').classList.remove('hidden'); }
export function joinGame(id){ initNetwork();
  setupReliable(peer.connect(id,{reliable:true}});
  setupFast(peer.connect(id,{reliable:false,metadata:{type:'movement'}}));
  document.getElementById('networkUI').classList.remove('hidden');
}
export function broadcastReliable(d){ reliableConns.forEach(c=>c.open&&c.send(d)); }
export function broadcastFast(d){ fastConns.forEach(c=>c.open&&c.send(d)); }
export function sendMovement(pos,rot){ broadcastFast({type:'movement',peerId:peer.id,position:pos,rotation:rot,timestamp:performance.now()}); }
export function sendBlockPlace(x,y,z,blockId){ broadcastReliable({type:'blockPlace',x,y,z,blockId}); }

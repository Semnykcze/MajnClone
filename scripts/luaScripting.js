/**
 * luaScripting.js – integrace Lua (Fengari)
 */
import { lua,lauxlib,lualib,to_luastring,to_jsstring } from 'fengari-web';
import fs from 'fs';
import path from 'path';
import { ModAPI } from './modAPI.js';
const luaDir=path.join(process.cwd(),'scripts','lua');
const luaStates=[];
export function initLua(){
  if(!fs.existsSync(luaDir)) return;
  fs.readdirSync(luaDir).filter(f=>f.endsWith('.lua')).forEach(file=>{
    const code=fs.readFileSync(path.join(luaDir,file),'utf8');
    const L=lauxlib.luaL_newstate();
    lualib.luaL_openlibs(L);
    lua.lua_pushjsfunction(L,L=>{
      const ev=to_jsstring(lua.lua_tojsstring(L,1));
      const dat=JSON.parse(to_jsstring(lua.lua_tojsstring(L,2)));
      ModAPI.emit(ev,dat); return 0;
    });
    lua.lua_setglobal(L,to_luastring('emitJS'));
    if(lauxlib.luaL_dostring(L,to_luastring(code))===lua.LUA_OK){
      lua.lua_getglobal(L,to_luastring('init'));
      if(lua.lua_isfunction(L,-1)) lua.lua_call(L,0,0);
    }
    luaStates.push(L);
  });
}
export function dispatchLuaEvent(ev,data){
  const es=to_luastring(ev), ds=to_luastring(JSON.stringify(data));
  luaStates.forEach(L=>{
    lua.lua_getglobal(L,to_luastring('onEvent'));
    if(lua.lua_isfunction(L,-1)){
      lua.lua_pushstring(L,es); lua.lua_pushstring(L,ds);
      lua.lua_call(L,2,0);
    } else lua.lua_pop(L,1);
  });
}

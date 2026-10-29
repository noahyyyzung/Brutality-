// Rumble-Tron offline cache. Bump VERSION on every release so players get the new game.
const VERSION='rumbletron-3.7';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-512-maskable.png'];
const THREE_CDN='https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(VERSION);await c.addAll(CORE);
  try{await c.add('./three.module.js');}catch(err){try{await c.add(THREE_CDN);}catch(e2){}}
  self.skipWaiting();})());});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==VERSION)await caches.delete(k);await self.clients.claim();})());});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;
 const isPage=req.mode==='navigate'||req.url.endsWith('.html');
 if(isPage){// network first, so updates show up right away; cache when offline
  e.respondWith((async()=>{try{const r=await fetch(req);const c=await caches.open(VERSION);c.put(req,r.clone());return r;}catch(err){return(await caches.match(req))||(await caches.match('./index.html'));}})());return;}
 // everything else (three.js, icons, fonts): cache first
 e.respondWith((async()=>{const hit=await caches.match(req);if(hit)return hit;try{const r=await fetch(req);if(r&&(r.ok||r.type==='opaque')){const c=await caches.open(VERSION);c.put(req,r.clone());}return r;}catch(err){return hit||Response.error();}})());});

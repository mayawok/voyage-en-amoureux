// Voyage en amoureux : jeu jouable sans connexion.
// Page du jeu : toujours la dernière version quand il y a du réseau, la copie gardée sinon.
// Musiques et images : gardées une fois téléchargées ; elles sont demandées normalement (sans délai ni option spéciale).
const C='va-cache-4';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','icon.png']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 const page=r.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname);
 if(!page){if(/\/(musique|img|sons)\//.test(u.pathname))e.respondWith((async()=>{const c=await caches.open(C);const hit=await c.match(u.pathname);if(hit)return hit;const res=await fetch(r);if(res&&res.ok&&res.status===200)c.put(u.pathname,res.clone()).catch(()=>{});return res})());return}
 e.respondWith((async()=>{const c=await caches.open(C);
  try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),6000);const res=await fetch(r.url,{cache:'no-store',signal:ctl.signal});clearTimeout(t);if(res&&res.ok)c.put('index.html',res.clone()).catch(()=>{});return res}
  catch(err){return (await c.match('index.html'))||(await c.match('./'))||Response.error()}})())});

// Voyage en amoureux : jeu jouable sans connexion.
// Toujours la dernière version quand il y a du réseau, la copie gardée sinon.
// Les musiques (dossier musique/) sont gardées une fois téléchargées (pas de nouveau téléchargement à chaque lancement).
const C='va-cache-1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','icon.png']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith((async()=>{const c=await caches.open(C);
if(/\/musique\//.test(new URL(r.url).pathname)){const hit=await c.match(r,{ignoreSearch:true});if(hit)return hit;try{const res=await fetch(r);if(res&&res.ok)c.put(r,res.clone()).catch(()=>{});return res}catch(err){return Response.error()}}
try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),6000);const res=await fetch(r,{cache:'no-store',signal:ctl.signal});clearTimeout(t);
if(res&&res.ok){const k=r.mode==='navigate'?'index.html':r;c.put(k,res.clone()).catch(()=>{})}return res}
catch(err){return (await c.match(r,{ignoreSearch:true}))||(r.mode==='navigate'?(await c.match('index.html'))||(await c.match('./')):undefined)||Response.error()}})())});

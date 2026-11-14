// Voyage en amoureux : jeu jouable sans connexion (4.26 : lancement rapide).
// Page du jeu : on demande la version du site en « revalidation » (si rien n'a changé, le site répond 304 sans renvoyer le fichier).
//   Si le réseau ne répond pas en 2,5 s, on ouvre tout de suite la copie gardée et la nouvelle version est enregistrée
//   en arrière-plan pour le lancement suivant (la page est prévenue : message « va-maj »).
// Images, musiques, sons : servis tout de suite depuis la copie gardée, puis revérifiés en arrière-plan une fois par
//   lancement (une image remplacée sous le même nom finit donc par être mise à jour, ce qui n'arrivait jamais avant).
const C='va-cache-5';
const PAGE_WAIT=2500;
const checked=new Set();
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','icon.png']).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function verOf(txt){const m=/GAME_VER='([^']*)'/.exec(txt||'');return m?m[1]:''}
async function tell(msg){try{const L=await self.clients.matchAll({type:'window'});for(const cl of L)cl.postMessage(msg)}catch(e){}}
async function pageFromNet(r){
 const c=await caches.open(C);
 const res=await fetch(r.url,{cache:'no-cache'});
 if(res&&res.ok)c.put('index.html',res.clone()).catch(()=>{});
 return {res};
}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 const page=r.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname);
 if(!page){
  if(/\/(musique|img|sons)\//.test(u.pathname))e.respondWith((async()=>{const c=await caches.open(C);const hit=await c.match(u.pathname);
   if(hit){
    // revérification discrète, une fois par lancement du service worker et par fichier
    if(!checked.has(u.pathname)){checked.add(u.pathname);e.waitUntil(fetch(u.pathname,{cache:'no-cache'}).then(res=>{if(res&&res.ok&&res.status===200)return c.put(u.pathname,res)}).catch(()=>{}))}
    return hit}
   const res=await fetch(r);if(res&&res.ok&&res.status===200)c.put(u.pathname,res.clone()).catch(()=>{});return res})());
  return}
 e.respondWith((async()=>{const c=await caches.open(C);const cached=(await c.match('index.html'))||(await c.match('./'));const cachedTxt=cached?cached.clone().text().catch(()=>''):null;
  const net=pageFromNet(r);
  if(!cached){try{return (await net).res}catch(err){return Response.error()}}
  let timer;const late=new Promise(ok=>{timer=setTimeout(()=>ok(null),PAGE_WAIT)});
  const first=await Promise.race([net.then(x=>x.res).catch(()=>null),late]);clearTimeout(timer);
  if(first&&first.ok)return first;
  // réseau lent ou absent : copie gardée tout de suite ; si la version du site arrive ensuite et qu'elle est nouvelle, on prévient la page
  e.waitUntil(net.then(async x=>{try{if(!x||!x.res||!x.res.ok)return;const nv=verOf(await x.res.clone().text()),ov=verOf(await cachedTxt);if(nv&&nv!==ov)tell({t:'va-maj',v:nv})}catch(err){}}).catch(()=>{}));
  return cached})());
});

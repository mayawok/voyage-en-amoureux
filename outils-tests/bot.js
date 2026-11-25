// Pilote automatique « joueur » pour Voyage en amoureux (tourne dans la page, appelé à chaque image par vclock)
(()=>{
const B=window.__B={t:0,log:[],seen:{},act:0,last:{},sig:'',sigT:0,stuckN:0,gearT:0,cheat:{fuel:0,tp:0,food:0},opt:{}};
const L=(ev,d)=>{let ch=-1,pr=-1;try{ch=chIdx()+1;pr=+chP().toFixed(3)}catch(e){}B.log.push({t:+B.t.toFixed(1),ch,p:pr,ev,d});if(B.log.length>20000)B.log.splice(0,5000)};
B.L=L;
const vis=el=>{if(!el)return false;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;let p=el;while(p&&p!==document.body){const q=getComputedStyle(p);if(q.display==='none'||q.visibility==='hidden')return false;p=p.parentElement}return true};
B.vis=vis;
const press=(el,why)=>{if(!el)return;const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;const o={bubbles:true,cancelable:true,clientX:x,clientY:y,pointerId:1,isPrimary:true,pointerType:'touch'};
 try{el.dispatchEvent(new PointerEvent('pointerdown',o))}catch(e){}try{el.dispatchEvent(new PointerEvent('pointerup',o))}catch(e){}try{el.click()}catch(e){}if(why)L('clic',why)};
B.press=press;
const tapAt=(el,x,y)=>{const o={bubbles:true,cancelable:true,clientX:x,clientY:y,pointerId:1,isPrimary:true,pointerType:'touch'};try{el.dispatchEvent(new PointerEvent('pointerdown',o))}catch(e){}try{el.dispatchEvent(new PointerEvent('pointerup',o))}catch(e){}};
const G=n=>{try{return eval(n)}catch(e){return undefined}};
const every=(k,s)=>{if((B.last[k]||-1e9)+s<=B.t){B.last[k]=B.t;return true}return false};
// boutons de progression connus
const PROG=['mgo','cdGo','dcx','csx','esx','bzx','burx','helx','va5go','ppx','hlx','obx','btx','va48t','va13w','va63c'];
const SKIP_IDS=new Set(['menu','msnd','mnew','mvol','mfs','mdk','mmg','nbb','snd','mhelp','va426u','va48sk','va48rt','dkbk']);
function visibleButtons(){const out=[];for(const b of document.querySelectorAll('button,[role=button],.b')){if(!vis(b))continue;out.push(b)}return out}
B.visibleButtons=()=>visibleButtons().map(b=>(b.id||b.className||b.tagName)+':'+(b.textContent||'').trim().slice(0,30));
// --- hooks de journal
function hook(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){try{fn.apply(this,arguments)}catch(e){}return o.apply(this,arguments)};}
const H0=()=>{
 hook('openCine',k=>L('cine',k));hook('openCard',cd=>L('carte',cd&&cd.t));hook('choice',(k,t)=>L('choix',k+' · '+t));
 hook('mgxOpen',d=>L('minijeu',d&&d.k));hook('pzOpen',k=>L('minijeu','pz-'+k));hook('openHelp',k=>L('aide',k));hook('fbStart',()=>L('minijeu','sous-marin'));
 hook('openEnd',i=>L('finChapitre',i));hook('va5Open',i=>L('garage',i));hook('docShow',d=>L('doc',d&&d.t));hook('ferStart',()=>L('bac','départ'));
 hook('openBoat',b=>L('bateau',b?'retour':'aller'));hook('openFinale',()=>L('finale','animaux'));hook('startOutro',()=>L('finale','demande'));
 hook('openObs',()=>L('photo','obs'));hook('ppOpen',()=>L('minijeu','pieces'));hook('openBur',()=>L('cine','bur'));hook('openHeli',()=>L('cine','heli'));
 hook('openBzh',()=>L('bzh','appel'));hook('goChapter2',i=>L('goChapter',i));
 const sv=window.saveTrip;
};
H0();
B.drive=true;
function modal(){const m=[];const chk={cardOpen:G('cardOpen'),cs:G('cs')&&G('cs').k,MGX:G('MGX')&&(G('MGX').k||1),pz:G('pz')&&(G('pz').k||1),hl:G('hl')&&G('hl').k,fb:!!G('fb'),fn:!!G('fn'),ot:!!G('ot'),es:!!G('es'),bz:!!G('bz'),bt:!!G('bt'),obv:!!G('obv'),pp:!!G('pp'),bur:!!G('bur'),hel:!!G('hel'),chQ:!!G('chQ'),va5G:!!G('va5G'),fv:!!G('fv'),night:!!G('night'),doc:!!G('docOpenF'),winch:!!G('winch'),work:!!G('work'),tow:!!G('tow'),crashed:!!G('crashed'),menu:vis(document.getElementById('menu')),intro:G('introT')>0};
 for(const k in chk)if(chk[k])m.push(k+(chk[k]===true?'':'='+chk[k]));return m.join(',')}
B.modal=modal;
let stuckSince=-1,slowT=0,winchT=-99,lastX=0,lastLv=0;
window.__bot=(step)=>{const dt=step/1000;B.t+=dt;
 if(G('dkP')||G('va9P'))return;
 const md=modal();
 // 1) menu
 const menu=document.getElementById('menu');if(vis(menu)){if(every('menu',1.5))press(document.getElementById('mgo'),'menu');return}
 // 2) tutoriel / avertissements
 for(const id of ['va48t']){const e=document.getElementById(id);if(vis(e)&&every(id,1.2)){press(e,id)}}
 // 3) choix
 const chv=document.getElementById('chv');if(vis(chv)){if(every('chv',1.5)){const bs=[...chv.querySelectorAll('#cho button')];const k=(G('chQ')||{}).k||'?';const i=B.opt.choice?B.opt.choice(k,bs.length):0;L('choixFait',k+' -> '+i+' '+(bs[i]&&bs[i].textContent.trim().slice(0,40)));press(bs[i])}return}
 // 4) aide aux animaux : toucher les cibles
 const hl=G('hl');if(hl&&!hl.end&&!G('va48').fr){if(every('hl',.45)){const hc=document.getElementById('hlC')||G('hlC');const r=hc.getBoundingClientRect();let q=null;if(hl.H.ord)q=hl.tg.find(z=>z.c<z.n);else q=hl.tg.find(z=>z.c<z.n);if(q){const p=G('hlPos')(q);tapAt(hc,r.left+p[0],r.top+p[1])}}}
 // 5) mini-jeux : on joue un peu puis on « gagne » proprement par leur fin
 const mgx=G('MGX');if(mgx&&!G('va48').fr){B.mg=B.mg||{k:mgx.k,t:0};if(B.mg.k!==mgx.k)B.mg={k:mgx.k,t:0};B.mg.t+=dt;if(B.mg.t>8&&every('mgxw',3)){L('minijeuForce',mgx.k);try{mgxClose(true)}catch(e){L('ERREUR','mgxClose '+e.message)}}}
 const pz=G('pz');if(pz&&!G('va48').fr){B.pzT=(B.pzT||0)+dt;if(B.pzT>8&&every('pzw',3)){L('minijeuForce','pz-'+pz.k);try{pzClose(1)}catch(e){L('ERREUR','pzClose '+e.message)}B.pzT=0}}else B.pzT=0;
 const fb=G('fb');if(fb&&!G('va48').fr&&!fb.go){B.fbT=(B.fbT||0)+dt;if(B.fbT>8){L('minijeuForce','sous-marin');fb.go=1;fb.t=G('FB_T');B.fbT=0}}
 const pp=G('pp');if(pp&&!pp.done&&every('pp',2)){const el=document.querySelector('[data-id="'+pp.tg+'"]');if(el){L('pieces','trouvée');try{ppPick(el)}catch(e){}}}
 // 6) boutons de progression visibles
 for(const id of PROG){const e=document.getElementById(id);if(!vis(e))continue;
  if(id==='cdGo'&&getComputedStyle(e).visibility==='hidden')continue;
  if(id==='csx'){const c2=G('cs');if(c2&&c2.t<c2.end-.3)continue}
  if(every('b_'+id,id==='cdGo'?1.2:1.0)){press(e,id==='cdGo'?null:id)}}
 // 7) conduite
 if(!B.drive)return;
 const started=G('started'),paused=G('paused');
 if(!G('inGame')||paused||G('cs')||G('es')||G('fn')||G('ot')||G('bz')||G('va5G')){stuckCheck(md,dt);return}
 const st=G('st'),c=G('c'),v=G('v');
 if(G('crashed')){if(every('crash',2)){L('accident','rescue');press(document.getElementById('again'))}stuckCheck(md,dt);return}
 // nuit : dormir
 const night=G('night');if(night){stuckCheck(md,dt);return}
 try{const slp=document.getElementById('slpb');const h=hourNow()%24;if(vis(slp)&&(h>=21.5||h<5)&&every('slp',3)){L('dormir',h.toFixed(1));press(slp)}}catch(e){}
 if(!G('ign')&&G('fuel')>0&&every('key',2)){try{toggleKey()}catch(e){}}
 if(G('fuel')<.15){B.cheat.fuel++;window.fuel=.8;try{fuel=.8}catch(e){};L('triche','essence')}
 // mini-panneaux (déblayer, pompe, roue)
 const mg=G('mg'),mgEl=G('mgEl');
 if(mg&&mgEl&&vis(mgEl)){if(mg.k==='clear'){if(every('clr',.12))tapAt(mgEl,10,10)}else if(mg.k==='wheel'){const MG_B=G('MG_B');const ph=(mg.t%MG_B)/MG_B;if(mg.sw<=0&&(ph>=.75)&&every('whl',.3))tapAt(mgEl,10,10)}else{if(mg.busy<=0&&every('pmp',.3))tapAt(mgEl,10,10)}}
 let gas=1,brake=0;
 const sr=G('stopReq');if(sr&&typeof sr.x==='number'){const d=sr.x-c.x;if(d<2200){gas=0;brake=1}}
 const o=G('nextObs')(500);
 if(o){const d=o.x-(c.x+58);if(o.type==='sheep'||o.type==='van'){if(d<420&&every('horn',1)){L('obstacle',o.type);actPress()}}
  else{let sm=false;try{sm=G('canSmash')(o)}catch(e){}if(!sm){if(d<180){gas=0;brake=1;if(G('canWork')(o)&&!G('work')&&every('work',1)){L('obstacle',o.type);actPress()}}}}}
 if(G('work')){gas=0;brake=0}
 if(G('flatW')>=0){gas=0;brake=1;if(Math.hypot(v.x,v.y)<25&&every('flat',.4)){actPress()}}
 if(G('stalled'))gas=0;
 // passage difficile : 4L puis treuil
 const spd=Math.hypot(v.x,v.y);
 if(gas&&spd<15){slowT+=dt}else if(spd>60){slowT=Math.max(0,slowT-dt*2)}
 if(slowT>2.5&&st.gear!==3){setGear(3);B.gearT=B.t;L('vitesse','4L')}
 if(slowT>5&&B.t-winchT>8){winchT=B.t;L('treuil','essai');try{startWinch()}catch(e){}}
 if(st.gear===3&&B.t-B.gearT>12&&spd>80&&slowT<.5){setGear(1);L('vitesse','4H')}
 if(st.gear===0||st.gear===2){setGear(1)}
 st.gas=gas;st.brake=brake;st.hb=G('work')?1:0;
 stuckCheck(md,dt)};
function snap(){const o={};try{const c=G('c'),v=G('v');Object.assign(o,{x:Math.round(c.x),vx:Math.round(v.x),lv:G('level'),paused:G('paused'),modal:modal(),stopReq:G('stopReq')?JSON.stringify(G('stopReq')).slice(0,80):null,ign:G('ign'),fuel:+G('fuel').toFixed(2),gear:G('st').gear,gas:G('st').gas,brake:G('st').brake,hb:G('st').hb,z:G('Z')(c.x)[2],hour:+(hourNow()%24).toFixed(1),cardQ:G('cardQ').length,talkQ:G('talkQ').length,btn:B.visibleButtons().slice(0,8)})}catch(e){o.err=e.message}return o}
B.snap=snap;
function stuckCheck(md,dt){let sig;try{const c=G('c');const cs=G('cs');const sc=['cs','bz','fn','ot','es','hl','fb'].map(k=>{const o=G(k);return o&&typeof o.t==='number'?Math.floor(o.t/3):''}).join(',');sig=[G('level'),Math.round(c.x/80),md,sc,G('cardQ').length].join('|');const cs2=G('cs');if(cs2&&cs2.t>cs2.end+20&&every('csl',30)){L('BLOQUE','cinématique '+cs2.k+' dépasse sa fin ('+cs2.t.toFixed(0)+'/'+cs2.end+' s)');}}catch(e){sig='?'}
 if(sig!==B.sig){B.sig=sig;B.sigT=0;return}B.sigT+=dt;
 if(B.sigT>40){B.sigT=0;B.stuckN++;const s=snap();L('BLOQUE',s);B.onStuck&&B.onStuck(s);unstick(s)}}
function unstick(s){
 const bs=visibleButtons().filter(b=>!SKIP_IDS.has(b.id)&&!(b.closest&&b.closest('#dash')));
 if(G('paused')&&!G('cardOpen')&&!G('cs')&&!G('MGX')&&!G('pz')&&!G('hl')&&!G('fb')&&!G('es')&&!G('fn')&&!G('ot')&&!G('bz')&&!G('va5G')&&!G('chQ')&&!G('obv')&&!G('bt')&&!G('pp')&&!G('docOpenF')&&!G('fv')&&!G('bur')&&!G('hel')&&!G('night')){L('FIGE','pause sans rien à l’écran');try{paused=false}catch(e){}return}
 if(G('obv')&&every('obvx',1)){L('force','photo fermée');try{obClose?obClose():0}catch(e){}}
 if(bs.length){L('essaiBouton',bs.map(b=>b.id||b.textContent.trim().slice(0,20)).join(' / '));press(bs[0]);return}
 if(!G('paused')&&G('started')){const c=G('c');B.cheat.tp++;L('teleport',Math.round(c.x));c.x+=500;try{settleCar()}catch(e){}}
}
})();

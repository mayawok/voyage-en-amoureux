// node vh.js t_play.js <nom> <minutesVirtuelles> [chapitreDepart(1-12)] [chapitreFin]
const fs=require('fs'),path=require('path');
module.exports=async(p,run,errs,args)=>{const name=args[0]||'run',mins=+(args[1]||30),ch0=+(args[2]||0),chEnd=+(args[3]||13);
const out='/home/claude/caps/'+name;fs.mkdirSync(out,{recursive:true});
await p.waitForTimeout(2500);
await p.addScriptTag({path:path.resolve(__dirname,'bot.js')});
if(ch0>0){await p.evaluate(ch=>{SV.diff=1;closeMenu()},ch0);await run(2);
 await p.evaluate(ch=>{try{bz=null;document.body.classList.remove('cine');gid('bzs')&&(gid('bzs').style.display='none')}catch(e){};goChapter2(ch-1);paused=false},ch0);}
const t0=Date.now();let lastCh=-1,shots=0,lastLog=0;
for(let m=0;m<mins*2;m++){await run(30,33);
 const s=await p.evaluate(()=>({t:__B.t,ch:chIdx()+1,p:+chP().toFixed(3),lv:level,x:Math.round(c.x),md:__B.modal(),stuck:__B.stuckN,n:__B.log.length,ver:GAME_VER}));
 const nl=await p.evaluate(n=>__B.log.slice(n),lastLog);lastLog=s.n;
 for(const e of nl){if(['BLOQUE','FIGE','ERREUR','teleport','essaiBouton'].includes(e.ev)){if(shots<40){shots++;await p.screenshot({path:out+'/'+String(shots).padStart(2,'0')+'_'+e.ev+'_ch'+e.ch+'.png'})}}}
 if(m%4===0||s.ch!==lastCh)console.log(`[${Math.round((Date.now()-t0)/1000)}s réel] t=${Math.round(s.t)} ch${s.ch} ${(s.p*100).toFixed(1)}% x=${s.x} ${s.md} bloc=${s.stuck} err=${errs.length}`);
 if(s.ch!==lastCh){lastCh=s.ch;await p.screenshot({path:out+'/ch'+s.ch+'_debut.png'})}
 fs.writeFileSync(out+'/log.json',JSON.stringify(await p.evaluate(()=>__B.log)));
 if(s.ch>=chEnd)break;
 if(await p.evaluate(()=>!!window.__B.done))break;}
fs.writeFileSync(out+'/errs.json',JSON.stringify(errs));
console.log('triches',JSON.stringify(await p.evaluate(()=>__B.cheat)));
};

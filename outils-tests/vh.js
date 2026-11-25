// node vh.js script.js [args]  (page servie sur http://localhost:8770)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:844,height:390},deviceScaleFactor:1,hasTouch:true});
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message+' '+(e.stack||'').split('\n').slice(1,3).join(' ')));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,400))});
await p.addInitScript({path:path.resolve(__dirname,'vclock.js')});
await p.goto('http://localhost:8770/index.html');
const run=async(sec,step)=>p.evaluate(([s,st])=>window.__run(s*1000,st),[sec,step||16]);
const f=require(path.resolve(process.argv[2]));
try{await f(p,run,errs,process.argv.slice(3))}catch(e){console.log('ERR',e.stack)}
console.log('erreurs:',errs.length,JSON.stringify(errs.slice(0,15)));
await b.close()})();

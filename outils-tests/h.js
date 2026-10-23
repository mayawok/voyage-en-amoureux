// harness: node h.js script.js  -> script exports async (page,adv,shot)
const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:844,height:390},deviceScaleFactor:2,hasTouch:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.addInitScript(()=>{window.__T=0;window.requestAnimationFrame=()=>0;});
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));
await p.waitForTimeout(300);
const adv=async(sec,step=16)=>{await p.evaluate(([sec,step])=>{for(let i=0;i<sec*1000/step;i++){window.__T+=step;try{loop(window.__T)}catch(e){console.error('loop '+e.message)}}},[sec,step])};
const shot=async n=>p.screenshot({path:n+'.png'});
const f=require(require('path').resolve(process.argv[2]));
try{await f(p,adv,shot)}catch(e){console.log('ERR',e.message)}
console.log('pageerrors:',JSON.stringify(errs.slice(0,10)));
await b.close()})();

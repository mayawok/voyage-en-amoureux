const L=require('./lib.js');module.exports=async(p,adv,shot)=>{const out=[];
for(let ch=0;ch<12;ch++){await L.boot(p,adv,ch);
out.push(await p.evaluate(()=>{const r={};let n=0;for(let x=2000;x<MAP_L-1000;x+=100){n++;const s=surfAt(x)||'route';r[s]=(r[s]||0)+1}
let sp=[];try{sp=va56L().filter(q=>q.k==='sand').length}catch(e){}
const o=Object.entries(r).map(([k,v])=>k+' '+Math.round(100*v/n)+'%').join(', ');return 'ch'+(chIdx()+1)+' '+(CHAP[chIdx()].fin||'')+' : '+o+' | passages sable '+sp}))}
console.log(out.join('\n'))}

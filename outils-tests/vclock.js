// horloge virtuelle : setTimeout/setInterval/performance.now/rAF pilotés par __run(ms)
(()=>{let vt=0;const base=Date.now();const T=[];let id=1;let R=[];
window.__vt=()=>vt;
try{performance.now=()=>vt}catch(e){Object.defineProperty(performance,'now',{value:()=>vt})}
Date.now=()=>base+vt;
window.setTimeout=(f,ms,...a)=>{const i=id++;T.push({i,t:vt+Math.max(0,+ms||0),f,a});return i};
window.setInterval=(f,ms,...a)=>{const i=id++;const r=Math.max(10,+ms||0);T.push({i,t:vt+r,f,a,rep:r});return i};
window.clearTimeout=window.clearInterval=i=>{const k=T.findIndex(q=>q.i===i);if(k>=0)T.splice(k,1)};
window.requestAnimationFrame=f=>{R.push(f);return id++};window.cancelAnimationFrame=()=>{};
window.__timers=()=>T.length;
window.__run=(ms,step)=>{step=step||16;const end=vt+ms;while(vt<end){vt+=step;
 for(let n=0;n<2000;n++){let m=null,mi=-1;for(let k=0;k<T.length;k++)if(T[k].t<=vt&&(!m||T[k].t<m.t)){m=T[k];mi=k}if(!m)break;if(m.rep)m.t+=m.rep;else T.splice(mi,1);try{const pre=window.__tw0&&window.__tw0();if(typeof m.f==='function')m.f(...m.a);window.__tw&&window.__tw(pre,m.f)}catch(e){console.error('timer '+(e&&e.stack||e))}}
 if(window.__bot)try{window.__bot(step)}catch(e){console.error('bot '+(e&&e.stack||e))}
 const r=R;R=[];for(const f of r)try{f(vt)}catch(e){console.error('raf '+(e&&e.stack||e))}
 if(window.__stopRun){window.__stopRun=0;break}}};
})();

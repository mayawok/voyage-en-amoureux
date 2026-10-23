module.exports.boot=async(p,adv,ch=0)=>{await p.evaluate(()=>{SV.diff=1;closeMenu()});await adv(9);
await p.evaluate((ch)=>{try{bz=null;bt=null;fn=null;ot=null;es=null;cs=null;document.body.classList.remove('cine')}catch(e){};goChapter2(ch);cardQ.length=0;try{closeCard()}catch(e){};started=true;ign=true;paused=false},ch);await adv(1.5);
await p.evaluate(()=>{cardQ.length=0;try{closeCard()}catch(e){};sayT=0});}

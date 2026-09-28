export class Cosmos {
  // Pequeños grupos con una dirección común y variaciones de distancia y velocidad.
  shootingStar(message=false){
    const now=performance.now();
    if(this.reduced||this.birth<1||now-(this.lastMeteor||0)<1600)return;
    this.meteors??=[];
    this.meteors=this.meteors.filter(m=>now-m.born<m.duration);
    const cap=this.w<700?4:5;
    if(this.meteors.length>=cap)return;
    this.lastMeteor=now;
    const count=Math.min(cap-this.meteors.length,message?2:2+Math.floor(Math.random()*3));
    const angle=.3+Math.random()*.35,direction=Math.random()<.8?-1:1;
    const originX=direction<0?.38+Math.random()*.46:.05+Math.random()*.3,originY=.05+Math.random()*.28;
    for(let i=0;i<count;i++){
      const depth=.35+Math.random()*.65;
      this.meteors.push({born:now+i*(240+Math.random()*380),duration:1400+Math.random()*1700,x:originX+(Math.random()-.5)*.22,y:originY+(Math.random()-.5)*.12,length:45+depth*135,opacity:(message?.26:.38)*depth+.12,depth,angle:angle+(Math.random()-.5)*.1,direction});
    }
  }
  drawMeteors(c,ms){
    if(this.reduced||this.birth<1)return;
    this.nextMeteor??=ms+2200;
    if(ms>=this.nextMeteor){this.shootingStar();this.nextMeteor=ms+(this.settled?11000:6500)+Math.random()*8500}
    this.meteors=(this.meteors||[]).filter(m=>ms-m.born<m.duration);
    c.save();
    for(const m of this.meteors){
      const p=(ms-m.born)/m.duration;
      if(p<0)continue;
      const travel=Math.min(this.w*.65,650)*m.depth,dx=Math.cos(m.angle)*m.direction,dy=Math.sin(m.angle);
      const x=m.x*this.w+dx*p*travel,y=m.y*this.h+dy*p*travel;
      const tail=Math.min(m.length,this.w*.25),tx=x-dx*tail,ty=y-dy*tail;
      c.globalAlpha=Math.sin(p*Math.PI)*m.opacity*(this.focus?.55:1);
      const trail=c.createLinearGradient(x,y,tx,ty);
      trail.addColorStop(0,'#f3edff');trail.addColorStop(.2,'#b8c8f9aa');trail.addColorStop(1,'#b8c8f900');
      c.strokeStyle=trail;c.lineWidth=.5+m.depth*.8;c.beginPath();c.moveTo(x,y);c.lineTo(tx,ty);c.stroke();
      c.shadowBlur=7;c.shadowColor='#d7dfff';c.fillStyle='#f5f1ff';c.beginPath();c.arc(x,y,.5+m.depth*.75,0,Math.PI*2);c.fill();c.shadowBlur=0;
    }
    c.restore();
  }
  createClouds(){
    // Low resolution cloud textures are built once; frames only composite them.
    this.clouds=[0,1].map(layer=>{
      const image=document.createElement('canvas');image.width=640;image.height=440;
      const g=image.getContext('2d');
      for(let i=0;i<22;i++){
        const x=90+i*23,y=215+Math.sin(i*.24+layer*2)*76;
        const r=55+Math.random()*95,gradient=g.createRadialGradient(x,y,0,x,y,r);
        const color=layer?'47,111,145':'117,74,153';
        gradient.addColorStop(0,'rgba('+color+',.075)');gradient.addColorStop(.45,'rgba('+color+',.035)');gradient.addColorStop(1,'rgba('+color+',0)');
        g.fillStyle=gradient;g.fillRect(0,0,640,440);
      }return image;
    });
  }
  drawNebula(c,t){
    if(!this.clouds)this.createClouds();
    c.save();c.globalAlpha=this.birth*.85;
    c.drawImage(this.nebula,0,0,this.w,this.h);
    const seconds=this.reduced?0:this.ambientTime;
    this.clouds.forEach((cloud,i)=>{
      c.save();
      c.globalAlpha=this.birth*(this.focus?.42:.78)*(.86+.14*Math.sin(seconds*.14+i*2));
      c.translate(this.w*(.52+Math.sin(seconds*.045+i*2)*.07)+this.pointer.x*(i+1)*12,this.h*(.46+Math.cos(seconds*.035+i*3)*.06));
      c.rotate(-.38+Math.sin(seconds*.026+i)*.09);
      const scale=1.16+.05*Math.sin(seconds*.08+i);
      c.scale(scale,scale);c.drawImage(cloud,-this.w*.66,-this.h*.62,this.w*1.32,this.h*1.24);c.restore();
    });
    c.restore();
  }
  drawDriftingDust(c,t){
    this.foregroundDust??=Array.from({length:55},()=>({x:Math.random(),y:Math.random(),depth:.2+Math.random()*.8,phase:Math.random()*Math.PI*2}));
    c.save();
    const particles=this.w<700?this.foregroundDust.slice(0,28):this.foregroundDust;
    for(const p of particles){
      const x=((p.x*this.w+t*(4+8*p.depth)+this.pointer.x*p.depth*25)%(this.w+40)+this.w+40)%(this.w+40)-20;
      const y=((p.y*this.h-t*(1+3*p.depth)+Math.sin(t*.6+p.phase)*9)%(this.h+40)+this.h+40)%(this.h+40)-20;
      c.globalAlpha=this.birth*(.06+.09*p.depth)*(.65+.35*Math.sin(t*1.3+p.phase))*(this.focus?.5:1);
      c.fillStyle='#c7c5ec';c.beginPath();c.arc(x,y,.4+p.depth*1.2,0,Math.PI*2);c.fill();
    }
    c.restore();
  }
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.pointer={x:0,y:0};this.mode='welcome';this.birth=1;this.focus=null;this.zoom=0;this.camera={x:.5,y:.5};this.merge=0;this.flash=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.lowPower=(navigator.hardwareConcurrency||8)<=4||matchMedia('(pointer: coarse)').matches;this.targetPointer={x:0,y:0};if(!this.ctx){document.body.classList.add('canvas-fallback');return}this.ambientTime=0;this.resize();let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>this.resize(),120)});addEventListener('pointermove',e=>{if(!this.reduced&&e.pointerType!=='touch')this.targetPointer={x:e.clientX/innerWidth-.5,y:e.clientY/innerHeight-.5}});document.addEventListener('pointerleave',()=>{this.targetPointer={x:0,y:0}});this.tick=this.tick.bind(this);requestAnimationFrame(this.tick)}
  resize(){this.w=innerWidth;this.h=innerHeight;const d=Math.min(devicePixelRatio||1,this.lowPower?1.25:1.7);this.canvas.width=this.w*d;this.canvas.height=this.h*d;this.ctx.setTransform(d,0,0,d,0,0);this.stars??=Array.from({length:this.lowPower||this.w<700?650:1500},()=>({x:Math.random(),y:Math.random(),r:Math.random()**3*1.4+.2,a:Math.random()*.7+.15,p:Math.random()*6.28,depth:Math.random()}));this.dust??=Array.from({length:this.lowPower||this.w<700?700:1700},()=>{const a=Math.random()*Math.PI*2,r=Math.random()**.55;return{a:a+r*5,r,s:Math.random()*1.2+.3,o:Math.random()*.5+.1}});this.nebula=document.createElement('canvas');this.nebula.width=this.w;this.nebula.height=this.h;const n=this.nebula.getContext('2d');for(const [x,y,r,col] of [[.71,.43,.44,'65,48,113'],[.83,.58,.32,'30,68,110'],[.49,.77,.28,'54,30,78']]){const g=n.createRadialGradient(this.w*x,this.h*y,0,this.w*x,this.h*y,this.w*r);g.addColorStop(0,`rgba(${col},.23)`);g.addColorStop(.5,`rgba(${col},.09)`);g.addColorStop(1,`rgba(${col},0)`);n.fillStyle=g;n.fillRect(0,0,this.w,this.h)}}
  tick(ms){requestAnimationFrame(this.tick);if(document.hidden){this.last=ms;return}const interval=this.reduced?100:this.lowPower?32:16;if(ms-(this.last||0)<interval)return;const dt=Math.min(80,ms-(this.last||ms-16));this.last=ms;if(!this.reduced)this.ambientTime+=dt/1000;const ease=1-Math.exp(-dt/650);this.pointer.x+=(this.targetPointer.x-this.pointer.x)*ease;this.pointer.y+=(this.targetPointer.y-this.pointer.y)*ease;const c=this.ctx,w=this.w,h=this.h,t=this.reduced?0:this.ambientTime*.13;c.fillStyle='#050710';c.fillRect(0,0,w,h);this.drawNebula(c,t);this.zoom+=(this.focus?1-this.zoom:-this.zoom)*(this.reduced?1:1-Math.exp(-dt/600));if(this.focus){this.camera.x=this.focus.x;this.camera.y=this.focus.y}c.save();c.translate(w/2,h/2);c.scale(1+this.zoom*.7,1+this.zoom*.7);c.translate(-w*(.5+(this.camera.x-.5)*this.zoom),-h*(.5+(this.camera.y-.5)*this.zoom));c.globalAlpha=this.birth*(1-this.zoom*.4);for(const s of this.stars){let x=(s.x*w+Math.sin(t*(.4+s.depth*.5)+s.p)*7+t*s.depth*3+this.pointer.x*s.depth*17+w)%w,y=(s.y*h+Math.cos(t*(.3+s.depth*.4)+s.p)*7+this.pointer.y*s.depth*17+h)%h;c.fillStyle=`rgba(210,218,246,${s.a*(.72+.28*Math.sin(this.ambientTime*(.22+s.depth*.48)+s.p))})`;c.beginPath();c.arc(x,y,s.r,0,Math.PI*2);c.fill()}c.save();c.translate(w*(w<700?.65:.72),h*.5);c.rotate(-.48);for(const s of this.dust){const a=s.a+t*.2,x=Math.cos(a)*s.r*w*.36,y=Math.sin(a)*s.r*h*.22;c.fillStyle=`rgba(174,161,211,${s.o*(1-s.r)*.65})`;c.fillRect(x,y,s.s,s.s)}c.restore();c.restore();c.globalAlpha=1;if(this.birth<1){const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,20+this.birth*w*.8);g.addColorStop(0,`rgba(238,228,255,${Math.sin(this.birth*Math.PI)*.6})`);g.addColorStop(.08,`rgba(169,150,224,${Math.sin(this.birth*Math.PI)*.25})`);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,w,h)}this.drawDriftingDust(c,this.reduced?0:this.ambientTime*.35);this.drawMeteors(c,ms);if(this.merge>0)this.drawConstellation(c,w,h,ms);if(this.flash>0){c.fillStyle=`rgba(235,225,255,${this.flash})`;c.fillRect(0,0,w,h)}}
  drawConstellation(c,w,h,ms){const k=Math.min(1,this.merge),e=k*k*(3-2*k),size=Math.min(w*.22,h*.19),cx=w*.5,cy=h*.25;const pts=this.shape.map((p,i)=>({x:this.origins[i][0]*w*(1-e)+(cx+p[0]*size)*e,y:this.origins[i][1]*h*(1-e)+(cy+p[1]*size*.75)*e}));c.save();c.globalAlpha=this.constellationOpacity??1;c.strokeStyle=`rgba(218,192,249,${Math.max(0,(k-.72)/.28)*.65})`;c.lineWidth=1;c.shadowColor='#cfb3ff';c.shadowBlur=16;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.stroke();pts.forEach(p=>{const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,30);g.addColorStop(0,'#ffffff');g.addColorStop(.07,'#e7d5ff');g.addColorStop(.22,'#a695df88');g.addColorStop(1,'#a695df00');c.fillStyle=g;c.fillRect(p.x-30,p.y-30,60,60)});c.restore()}
}




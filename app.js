import { Cosmos } from './cosmos.js';
const $=s=>document.querySelector(s),config=window.UNIVERSE;
if(config.chapters.length!==7)throw new Error('Configura exactamente siete capítulos.');
const cosmos=new Cosmos($('#cosmos')),reduced=cosmos.reduced;
let phase='birth',completed=0,active=-1,introRun=0,toastRun=0,closing=false;
const desktop=[[.58,.39],[.80,.28],[.87,.59],[.65,.72],[.43,.64],[.29,.80],[.77,.84]];
const mobile=[[.72,.40],[.35,.48],[.76,.59],[.47,.68],[.19,.61],[.25,.83],[.76,.82]];
const landscape=[[.60,.34],[.82,.28],[.88,.56],[.68,.66],[.48,.64],[.28,.72],[.80,.76]];
const positions=()=>innerHeight<500&&innerWidth>innerHeight?landscape:innerWidth<650?mobile:desktop;
function viewport(){
  const vv=window.visualViewport;
  const height=vv&&vv.scale===1?Math.min(innerHeight,vv.height):innerHeight;
  document.documentElement.style.setProperty('--view-height',Math.round(height)+'px');
}
viewport();addEventListener('resize',viewport);window.visualViewport?.addEventListener('resize',viewport);
const sleep=(ms,reading=false)=>new Promise(r=>setTimeout(r,reduced&&!reading?Math.min(ms,200):ms));
function tween(duration,fn){return new Promise(resolve=>{const start=performance.now();function step(now){let p=Math.min(1,(now-start)/(reduced?100:duration));fn(p);if(p<1)requestAnimationFrame(step);else resolve()}requestAnimationFrame(step)})}
function make(tag,text,cls){const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e}
const notice=make('div',null,'discovery-notice');notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');notice.setAttribute('aria-atomic','true');$('#explore-copy').append(notice);
function showScene(dialog){
  if(typeof dialog.showModal==='function'){dialog.showModal();return}
  dialog.setAttribute('open','');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
  dialog.classList.add('fallback-dialog');document.body.classList.add('fallback-modal');
  dialog.querySelector('button').focus();
}
function hideScene(dialog){
  if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');
  dialog.classList.remove('fallback-dialog');document.body.classList.remove('fallback-modal');
}
document.addEventListener('keydown',e=>{
  const dialog=document.querySelector('.fallback-dialog[open]');if(!dialog)return;
  if(e.key==='Escape'){e.preventDefault();dialog.dispatchEvent(new Event('cancel',{cancelable:true}));return}
  if(e.key!=='Tab')return;
  const items=[...dialog.querySelectorAll('button,a[href],audio[controls],video[controls],[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
  const first=items[0],last=items[items.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
function pauseMedia(dialog){dialog.querySelectorAll('video,audio').forEach(e=>e.pause());ambience.duck(false)}
class Ambience{
  constructor(){this.on=true;this.ctx=null;this.file=null;this.nodes=[]}
  render(){const button=$('#sound');button.setAttribute('aria-pressed',String(this.on));button.setAttribute('aria-label',this.on?'Silenciar música ambiental':'Activar música ambiental');button.innerHTML='♫ <span>'+(this.on?'Sonido encendido':'Sonido apagado')+'</span>'}
  async start(){
    if(!this.on)return;
    try{
      if(!this.ctx&&!this.file){
        if(config.music){this.file=new Audio(config.music);this.file.loop=true;this.file.volume=.35}
        else{const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return;this.ctx=new AudioEngine();this.gain=this.ctx.createGain();this.gain.gain.value=0;this.gain.connect(this.ctx.destination);[130.81,196,261.63,329.63].forEach((freq,i)=>{const osc=this.ctx.createOscillator(),g=this.ctx.createGain();osc.type='sine';osc.frequency.value=freq;osc.detune.value=(i-1.5)*3;g.gain.value=.045;osc.connect(g);g.connect(this.gain);osc.start();this.nodes.push(osc)})}
      }
      if(this.file){if(this.file.paused)await this.file.play();if(!this.on)this.file.pause()}
      else{await this.ctx.resume();this.gain.gain.setTargetAtTime(this.on?.45:0,this.ctx.currentTime,1)}
    }catch{/* Another user gesture can retry playback when browser policy blocks it. */}
  }
  toggle(){this.on=!this.on;this.render();if(this.on)this.start();else if(this.file)this.file.pause();else if(this.ctx)this.gain.gain.setTargetAtTime(0,this.ctx.currentTime,.3)}
  duck(on){if(!this.on)return;if(this.file)this.file.volume=on?.06:.35;else if(this.ctx)this.gain.gain.setTargetAtTime(on?.08:.45,this.ctx.currentTime,.8)}
  swell(){if(this.ctx&&this.on){this.gain.gain.setTargetAtTime(.7,this.ctx.currentTime,1);setTimeout(()=>this.duck(false),4500)}}
}
const ambience=new Ambience();ambience.render();$('#sound').addEventListener('click',()=>ambience.toggle());
function startSound(e){if(!e.target.closest('#sound'))ambience.start()}
document.addEventListener('pointerdown',startSound,{passive:true});
document.addEventListener('keydown',startSound);
const buttons=config.chapters.map((chapter,i)=>{const b=make('button',null,'star locked');b.style.setProperty('--star-delay',(-i*.7)+'s');b.innerHTML='<span class="star-core"></span>';b.append(make('span',`${String(i+1).padStart(2,'0')} · ${chapter.title.toUpperCase()}`,'star-caption'));b.addEventListener('click',()=>openChapter(i));$('#starfield').append(b);return b});
function layout(){positions().forEach((p,i)=>{buttons[i].style.left=`${p[0]*100}%`;buttons[i].style.top=`${p[1]*100}%`});if(cosmos.merge)cosmos.origins=positions()}
function progress(){buttons.forEach((b,i)=>{b.className=`star ${i<completed?'complete':i===completed?'available':'locked'}`;b.disabled=i>completed;b.setAttribute('aria-label',`${i+1}. ${config.chapters[i].title}. ${i<completed?'Descubierta':i===completed?'Explorar':'Aún bloqueada'}`)});$('#progress-label').textContent=`${completed} / 7`;$('#progress-dots').textContent=Array.from({length:7},(_,i)=>i<completed?'✦':i===completed?'✧':'·').join(' ')}
layout();progress();addEventListener('resize',layout);
async function textScene(text,duration=2600){const sceneRun=introRun;cosmos.shootingStar(true);$('#scene-text').textContent=text;$('#scene-text').classList.add('visible');await sleep(duration,true);if(sceneRun!==introRun)return;$('#scene-text').classList.remove('visible');await sleep(1050)}
async function start(){if(phase!=='welcome')return;phase='intro';document.body.classList.add('departing');cosmos.focus={x:.5,y:.5};const run=++introRun;$('#welcome').classList.add('fade-out');await sleep(1000);if(run!==introRun)return;$('#welcome').hidden=true;for(const line of config.intro){await textScene(line);if(run!==introRun)return}explore()}
function explore(){introRun++;document.body.classList.add('exploring');phase='explore';cosmos.focus=null;document.body.classList.remove('departing');$('#welcome').hidden=true;$('#scene-text').classList.remove('visible');$('#starfield').hidden=false;$('#explore-copy').hidden=false;$('#footer-note').textContent='SEGUIR LA LUZ · DESCUBRIR NUESTRA HISTORIA';progress();buttons[Math.min(completed,6)].focus({preventScroll:true})}
$('#begin').addEventListener('click',start);
function appendMedia(target,data){target.replaceChildren();if(data.photos?.length){let index=0;const gallery=make('div',null,'gallery'),figure=make('figure'),img=make('img'),caption=make('figcaption'),nav=make('div',null,'gallery-nav'),prev=make('button','←'),next=make('button','→'),count=make('span');figure.style.margin='0';img.loading='lazy';img.decoding='async';prev.setAttribute('aria-label','Foto anterior');next.setAttribute('aria-label','Foto siguiente');function show(){const p=data.photos[index];img.src=typeof p==='string'?p:p.src;img.alt=typeof p==='string'?`Recuerdo ${index+1}`:p.alt||`Recuerdo ${index+1}`;caption.textContent=typeof p==='string'?'':p.caption||'';count.textContent=`${index+1} / ${data.photos.length}`}prev.onclick=()=>{index=(index-1+data.photos.length)%data.photos.length;show()};next.onclick=()=>{index=(index+1)%data.photos.length;show()};figure.append(img,caption);nav.append(prev,count,next);gallery.append(figure);if(data.photos.length>1)gallery.append(nav);target.append(gallery);show()}else if(data.galleryPlaceholder){const p=make('div',null,'media-placeholder');p.append(make('span','✧'),make('div','Aquí irán nuestras fotografías.'),make('div','Un espacio reservado para los recuerdos reales.'));target.append(p)}for(const type of ['video','audio']){if(!data[type])continue;const player=make(type);player.src=data[type];player.controls=true;player.preload='metadata';if(type==='video')player.playsInline=true;player.addEventListener('play',()=>ambience.duck(true));player.addEventListener('pause',()=>ambience.duck(false));player.addEventListener('ended',()=>ambience.duck(false));target.append(player)}}
const journeyStar=make('span',null,'journey-star');
journeyStar.setAttribute('aria-hidden','true');
$('#chapter').prepend(journeyStar);
function positionJourney(returning=false){
  const p=positions()[active];if(!p)return;
  journeyStar.style.left=returning?p[0]*100+'%':'50%';
  journeyStar.style.top=returning?p[1]*100+'%':Math.max(38,innerHeight*.1)+'px';
  const field=$('#starfield');
  field.style.transformOrigin=p[0]*100+'% '+p[1]*100+'%';
  field.style.transform=returning?'':
    'translate('+((.5-p[0])*innerWidth)+'px,'+((.5-p[1])*innerHeight)+'px) scale(1.7)';
}
addEventListener('resize',()=>{if(active>=0){const p=positions()[active];cosmos.focus=closing?null:{x:p[0],y:p[1]};positionJourney(closing)}});
async function openChapter(i){
  if(phase!=='explore'||i>completed||closing)return;
  toastRun++;notice.classList.remove('visible');$('#scene-text').classList.remove('visible');
  active=i;phase='opening';const p=positions()[i],chapter=config.chapters[i];
  const dialog=$('#chapter');
  $('#chapter-number').textContent='ESTRELLA '+String(i+1).padStart(2,'0')+' DE 07';
  $('#chapter-date').textContent=chapter.date||'';$('#chapter-title').textContent=chapter.title;
  $('#chapter-body').replaceChildren(...chapter.text.map(t=>make('p',t)));

  $('#chapter-quote').textContent=chapter.quote?'“'+chapter.quote+'”':'';
  appendMedia($('#chapter-media'),chapter);
  $('#continue').disabled=true;$('#continue').innerHTML=i===6?'Seguir hacia nuestro futuro <span>✧</span>':'Continuar <span>✧</span>';
  journeyStar.style.transition='none';journeyStar.style.left=p[0]*100+'%';journeyStar.style.top=p[1]*100+'%';
  showScene(dialog);dialog.querySelector('.chapter-scroll').scrollTop=0;
  document.body.classList.add('reading-star');buttons[i].classList.add('selected-star');
  $('#explore-copy').classList.add('retreat');
  // Deja pintar la estrella en su posición de origen antes de iniciar el viaje.
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(phase!=='opening')return;journeyStar.style.transition='';dialog.classList.add('arriving');
  cosmos.focus={x:p[0],y:p[1]};positionJourney();cosmos.shootingStar(true);
  await sleep(1050);
  if(phase!=='opening')return;
  dialog.classList.add('open');phase='chapter';$('#continue').disabled=false;
}
async function closeChapter(mark=false){
  if(closing||!['chapter','opening'].includes(phase))return;
  closing=true;phase='returning';const index=active,dialog=$('#chapter');
  pauseMedia(dialog);dialog.classList.remove('open');
  await sleep(400);
  cosmos.focus=null;dialog.classList.remove('arriving');positionJourney(true);
  await sleep(1200);
  hideScene(dialog);document.body.classList.remove('reading-star');
  buttons[index].classList.remove('selected-star');$('#explore-copy').classList.remove('retreat');
  const newlyCompleted=mark&&index===completed;
  if(newlyCompleted)completed=Math.min(7,completed+1);
  active=-1;closing=false;progress();
  if(mark&&index===6){await finale();return}
  phase='explore';$('#explore-copy').hidden=false;
  buttons[Math.min(completed,6)].focus({preventScroll:true});
  if(newlyCompleted)toast('Una estrella más descubierta.\n'+(completed===6?'Todavía queda una…':'Todavía quedan '+(7-completed)+'…'));
}
$('#continue').addEventListener('click',()=>closeChapter(true));$('#close-chapter').addEventListener('click',()=>closeChapter());$('#chapter').addEventListener('cancel',e=>{e.preventDefault();closeChapter()});
async function toast(message){cosmos.shootingStar(true);const run=++toastRun;const [title,...detail]=message.split('\n');notice.replaceChildren(make('span','✧','notice-star'),make('span',title,'notice-title'));if(detail.length)notice.append(make('span',detail.join(' '),'notice-detail'));notice.classList.add('visible');await sleep(3200);if(run===toastRun)notice.classList.remove('visible')}
async function finale(){phase='finale';document.body.classList.remove('exploring');$('#explore-copy').hidden=true;$('#starfield').classList.add('fade-out');$('#footer-note').textContent='SIETE ESTRELLAS · UNA SOLA HISTORIA';await textScene('Has llegado al final…',2100);await textScene('Aunque en realidad…',1800);await textScene('Esto no es el final.',2500);$('#starfield').hidden=true;cosmos.origins=positions();cosmos.shape=config.constellation;ambience.swell();await tween(6500,p=>{cosmos.merge=p;cosmos.flash=Math.max(0,p-.9)*1.8});await tween(2200,p=>{cosmos.flash=Math.sin(p*Math.PI)*.35});cosmos.flash=0;$('#final-prelude').textContent=config.finalPrelude;$('#final-message').textContent='';$('#birthday').textContent='';$('#gift-button').hidden=true;$('#ending').hidden=false;await sleep(2200);$('#final-message').textContent=config.finalMessage;$('#final-message').style.animation='fade 2s both';await sleep(2300);$('#birthday').textContent=config.birthday.replaceAll('{nombre}',config.name);$('#birthday').style.animation='fade 2s both';await sleep(1800);$('#gift-button').hidden=false;phase='ending'}
$('#gift-button').addEventListener('click',async()=>{if(phase!=='ending')return;phase='gift-opening';document.body.classList.add('reading-gift');$('#ending').classList.add('scene-away');await tween(700,p=>cosmos.constellationOpacity=1-p);$('#ending').hidden=true;const data=config.gift;$('#gift-title').textContent=data.title;const content=$('#gift-content');content.replaceChildren(make('p',data.text));if(data.placeholder)content.append(make('div','REGALO DE EJEMPLO · Pendiente de personalizar','media-placeholder'));if(data.letter)data.letter.split('\n').filter(Boolean).forEach(t=>content.append(make('p',t)));const media=make('div');appendMedia(media,data);content.append(media);for(const [url,label] of [[data.link,data.linkLabel],[data.location,'Ver la ubicación']]){if(!url)continue;try{const parsed=new URL(url,location.href);if(!['https:','http:'].includes(parsed.protocol))continue;const link=make('a',label,'primary');link.href=parsed.href;link.target='_blank';link.rel='noopener noreferrer';content.append(link)}catch{}}const finish=make('button','Guardar este universo en el corazón ✧','primary');finish.id='finish-journey';finish.addEventListener('click',finishJourney);content.append(finish);showScene($('#gift'));$('#gift .chapter-scroll').scrollTop=0;requestAnimationFrame(()=>$('#gift').classList.add('open'));phase='gift'});
async function closeGift(){
  if(phase!=='gift')return;
  phase='gift-closing';pauseMedia($('#gift'));$('#gift').classList.remove('open');
  await sleep(800);hideScene($('#gift'));
  $('#ending').hidden=false;document.body.classList.remove('reading-gift');
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  $('#ending').classList.remove('scene-away');
  await tween(700,p=>cosmos.constellationOpacity=p);
  phase='ending';$('#gift-button').focus({preventScroll:true});
}
async function finishJourney(){
  if(phase!=='gift')return;
  phase='finishing';pauseMedia($('#gift'));$('#gift').classList.remove('open');
  await sleep(850);hideScene($('#gift'));
  cosmos.settled=true;cosmos.constellationOpacity=0;
  const data=config.epilogue;
  $('#epilogue-title').textContent=data.title;$('#epilogue-copy').textContent=data.text;
  $('#epilogue-signature').textContent=data.signature.replace('{nombre}',config.name);
  document.body.classList.add('journey-complete');document.body.classList.remove('reading-gift');
  $('#epilogue').hidden=false;$('#footer-note').textContent='FIN DEL RECORRIDO · EL UNIVERSO SIGUE AQUÍ';
  await sleep(300);$('#epilogue').classList.add('arrived');
  $('#epilogue-title').focus({preventScroll:true});phase='complete';
}

$('#map-hint').addEventListener('click',()=>{
  const scene=$('#epilogue'),map=$('#connection-map');
  scene.scrollTo({top:scene.scrollTop+map.getBoundingClientRect().top-scene.getBoundingClientRect().top-20,behavior:reduced?'auto':'smooth'});
  map.focus({preventScroll:true});
});

$('#replay').addEventListener('click',()=>location.reload());
document.addEventListener('visibilitychange',()=>{
  if(ambience.ctx){if(document.hidden)ambience.ctx.suspend().catch(()=>{});else if(ambience.on)ambience.ctx.resume().catch(()=>{})}
  if(ambience.file){if(document.hidden)ambience.file.pause();else if(ambience.on)ambience.file.play().catch(()=>{})}
});
$('#close-gift').addEventListener('click',closeGift);$('#gift').addEventListener('cancel',e=>{e.preventDefault();closeGift()});
// Complete the birth of the galaxy before revealing any welcome content.
cosmos.birth=0;
document.body.classList.add('birthing');
$('#welcome').hidden=true;
async function revealWelcome(){
  await sleep(650);
  await tween(3200,p=>cosmos.birth=p);
  $('#welcome').hidden=false;
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  document.body.classList.remove('birthing');
  phase='welcome';
}
revealWelcome();

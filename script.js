const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(menuButton&&nav){
  menuButton.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded','false');
  }));
}

const ticker=document.querySelector('.partner-strip');
const tickerToggle=document.querySelector('#ticker-toggle');
if(ticker&&tickerToggle){
  tickerToggle.addEventListener('click',()=>{
    const paused=ticker.classList.toggle('is-paused');
    tickerToggle.textContent=paused?'▶':'Ⅱ';
    tickerToggle.setAttribute('aria-pressed',String(paused));
    tickerToggle.setAttribute('aria-label',paused?'Relancer le défilement':'Mettre en pause le défilement');
  });
}

document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{
  const select=document.querySelector('#service');
  if(select) select.value=link.dataset.service;
}));

const year=document.querySelector('#year');
if(year) year.textContent=new Date().getFullYear();

const form=document.querySelector('#quote-form');
const result=document.querySelector('#form-result');
if(form&&result){
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity()) return;
    const data=new FormData(form);
    const lines=[
      "Bonjour Deliv'tout,","",
      "Je souhaite être recontacté(e) au sujet de ma demande :",
      "Service : "+(data.get('service')||'Non précisé'),
      "Nom : "+(data.get('name')||'Non renseigné'),
      "E-mail : "+(data.get('email')||'Non renseigné'),
      "Téléphone : "+(data.get('phone')||'Non renseigné'),
      "Ville / secteur : "+(data.get('city')||'Non renseigné'),
      "Détails : "+(data.get('details')||'À préciser'),"",
      "Merci."
    ];
    const message=lines.join('\n');
    const wa='https://wa.me/33681477291?text='+encodeURIComponent(message);
    const mail='mailto:hl.delivtout@gmail.com?subject='+encodeURIComponent("Demande de contact Deliv'tout")+'&body='+encodeURIComponent(message);
    result.replaceChildren();
    const intro=document.createElement('p');
    intro.textContent='Votre demande est prête. Choisissez comment l’envoyer :';
    const waLink=document.createElement('a');
    waLink.href=wa;waLink.target='_blank';waLink.rel='noopener noreferrer';waLink.textContent='Envoyer sur WhatsApp ↗';
    const sep=document.createTextNode(' ou ');
    const mailLink=document.createElement('a');
    mailLink.href=mail;mailLink.textContent='envoyer par e-mail ↗';
    result.append(intro,waLink,sep,mailLink);
  });
}

const progressBar=document.querySelector('#scroll-progress-bar');
let scrollTick=false;
function updateScrollProgress(){
  const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
  const progress=maxScroll>0?(window.scrollY/maxScroll)*100:0;
  if(progressBar) progressBar.style.width=progress+'%';
  scrollTick=false;
}
window.addEventListener('scroll',()=>{
  if(!scrollTick){window.requestAnimationFrame(updateScrollProgress);scrollTick=true;}
},{passive:true});
window.addEventListener('resize',updateScrollProgress,{passive:true});
updateScrollProgress();

if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealTargets=document.querySelectorAll('.services-section,.service-card,.fleet-copy,.fleet-facts,.pro-band-inner,.about-mark,.about-copy,.quote-intro,.quote-form,.recruit-section');
  revealTargets.forEach(el=>el.classList.add('reveal'));
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.12});
  revealTargets.forEach(el=>revealObserver.observe(el));
}
document.addEventListener('visibilitychange',()=>{
  if(ticker&&document.hidden) ticker.classList.add('is-paused');
  else if(ticker&&tickerToggle?.getAttribute('aria-pressed')!=='true') ticker.classList.remove('is-paused');
});

// ============================================================
// HANGARSUD · configuración y datos (TODO lo editable está acá)
// Los valores son de EJEMPLO: reemplazar por los reales.
// ============================================================
const CFG={
  wa:'5493510000000',            // WhatsApp de la escuela (código país + área + número)
  pass:'hangarsud',              // acceso demo al panel (en producción: login real)
  ga4:'',                        // ej. 'G-XXXXXXXXXX'  → activa Google Analytics
  pixel:'',                      // ej. '123456789012345' → activa Meta Pixel
  intro:null,                    // vuelo de introducción (null = "Consultar"; poner el número cuando haya precio)
  hora:null,                     // hora de vuelo con instructor
  teoria:null,                   // curso teórico
  cursos:{
    privado:{n:'Piloto Privado',horas:40},
    instr:{n:'Habilitación por instrumentos',horas:20},
    comercial:{n:'Piloto Comercial',horas:100}},
  recargo:{1:0,3:.05,6:.12,12:.25},   // recargo financiero por cantidad de cuotas
  vouchers:[
    {id:'intro',n:'Vuelo de introducción',d:'Un vuelo con instructor. Ideal para regalar.',m:null},
    {id:'video',n:'Introducción + video',d:'Incluye video del vuelo para recordarlo.',m:null},
    {id:'doble',n:'Experiencia de 2 vuelos',d:'Para repetir y tomar los comandos con calma.',m:null}],
  gasto:{},                                // inversión mensual en publicidad por canal, ej. {Instagram:120000}
  tasaCierre:.3,                           // % de consultas avanzadas que cierran (para proyección)
  flota:[{m:'LV-XXX',n:'Avioneta 1',usadas:62,disp:90},{m:'LV-YYY',n:'Avioneta 2',usadas:41,disp:90},{m:'LV-ZZZ',n:'Avioneta 3',usadas:78,disp:90}]
};
const money=n=>n==null?'Consultar':'$ '+Math.round(n).toLocaleString('es-AR');
const hayPrecios=()=>CFG.hora!=null&&CFG.teoria!=null;
function calcPlan(k,hs,cuotas){
  const c=CFG.cursos[k],semanas=Math.ceil(c.horas/hs),fin=new Date();fin.setDate(fin.getDate()+semanas*7);
  const total=hayPrecios()?(c.horas*CFG.hora+CFG.teoria)*(1+(CFG.recargo[cuotas]||0)):null;
  return{curso:c.n,horas:c.horas,total,cuota:total&&total/cuotas,cuotas,semanas,fin}}
const ticketMedio=()=>hayPrecios()?calcPlan('privado',3,6).cuota:null; // cuota mensual típica (para el panel)

// ---------- almacenamiento (demo en el navegador; en producción: base de datos) ----------
const K={leads:'hs_leads_v3',slots:'hs_slots'};
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const day=n=>{const d=new Date();d.setDate(d.getDate()+n);d.setHours(10,0,0,0);return d.toISOString()};
const fmt=iso=>new Date(iso).toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'})+' · '+new Date(iso).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})+' hs';

function getSlots(){return load(K.slots,[
 {titulo:'Vuelo de introducción',fecha:day(3),cupos:6,anotados:4},
 {titulo:'Charla Piloto Privado',fecha:day(6),cupos:15,anotados:9},
 {titulo:'Vuelo de introducción',fecha:day(9),cupos:6,anotados:6},
 {titulo:'Inicio comisión Teórico',fecha:day(16),cupos:12,anotados:5}])}
function bookSlot(i){const s=getSlots();if(s[i]&&s[i].anotados<s[i].cupos){s[i].anotados++;save(K.slots,s)}}

const score=l=>l.inicio==='Lo antes posible'?'caliente':l.inicio==='Este mes'?'tibio':'frio';
const seedLeads=()=>{
 const n=['Martín Gómez','Lucía Pereyra','Julián Ríos','Camila Ferreyra','Nicolás Bustos','Agustina Luna','Tomás Herrera','Sofía Molina','Franco Acosta','Valentina Paz','Bruno Díaz','Carla Soria'];
 const o=['Instagram','Web','WhatsApp','Google','Referido'],e=['nuevo','contactado','agendado','inscripto'],i=['Vuelo de introducción','Piloto Privado','Habilitaciones'];
 const ini=['Lo antes posible','Este mes','En 1 a 3 meses','Solo averiguando'];
 const L=n.map((x,k)=>({nombre:x,tel:'351 555 '+(1000+k*37),email:'',interes:i[k%3],inicio:ini[k%4],origen:o[k%5],estado:e[(k*3)%4],tipo:'consulta',fecha:new Date(Date.now()-k*864e5*1.2-36e5*(k%3)).toISOString()}));
 L.push({nombre:'Pablo Ruiz',tel:'351 555 4040',interes:'Voucher regalo — Introducción + video',inicio:'Este mes',origen:'Instagram',estado:'inscripto',tipo:'voucher',monto:CFG.vouchers[1].m,fecha:new Date(Date.now()-3*864e5).toISOString()});
 L.push({nombre:'Ana Córdoba',tel:'351 555 4141',interes:'Vuelo de introducción',inicio:'Lo antes posible',origen:'Web',estado:'agendado',tipo:'reserva',monto:CFG.intro,fecha:new Date(Date.now()-864e5).toISOString()});
 return L};
function getLeads(){let l=load(K.leads,null);if(!l){l=seedLeads();save(K.leads,l)}return l}
function addLead(l){const a=getLeads();l.score=score(l);a.unshift(l);save(K.leads,a);track(l)}
function updateLead(i,p){const a=getLeads();Object.assign(a[i],p);save(K.leads,a)}
const origenActual=()=>{try{const u=new URLSearchParams(location.search);return u.get('utm_source')||(document.referrer?new URL(document.referrer).hostname.replace('www.',''):'Web')}catch{return 'Web'}};
const waLink=(tel,txt)=>{const d=String(tel).replace(/\D/g,'');return 'https://wa.me/'+(d.startsWith('54')?d:'549'+d)+(txt?'?text='+encodeURIComponent(txt):'')};

// ---------- medición (se activa al completar los IDs en CFG) ----------
(function(){
 if(CFG.ga4){const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+CFG.ga4;document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',CFG.ga4)}
 if(CFG.pixel){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',CFG.pixel);fbq('track','PageView')}
})();
function track(l){try{window.gtag&&gtag('event','generate_lead',{interes:l.interes,origen:l.origen});window.fbq&&fbq('track','Lead')}catch{}}

/* ══════════════════════════════════════
   CONSTANTS & DATA
══════════════════════════════════════ */
const DAIRAS=[
  {id:'jijel',name:'جيجل'},{id:'taher',name:'الطاهير'},{id:'chaqfa',name:'الشقفة'},
  {id:'milia',name:'الميلية'},{id:'ansar',name:'العنصر'},{id:'awana',name:'العوانة'},
  {id:'jimila',name:'جيملة'},{id:'taksna',name:'تاكسنة'},{id:'satara',name:'السطارة'},
  {id:'sidimaruf',name:'سيدي معروف'},{id:'ziama',name:'زيامة منصورية'},
];

const MUNICIPALITIES=[
  // ── دائرة جيجل ──
  {id:'jijel',   name:'جيجل',               daira:'jijel',     hasData:true,  url:'https://willayajijel.github.io/jijel/'},
  // ── دائرة الطاهير ──
  {id:'taher',   name:'الطاهير',             daira:'taher',     hasData:true,  url:'https://willayajijel.github.io/taher/'},
  {id:'emir',    name:'الأمير عبد القادر',   daira:'taher',     hasData:true,  url:'https://willayajijel.github.io/emir/'},
  {id:'wajana',  name:'وجانة',               daira:'taher',     hasData:true,  url:'https://willayajijel.github.io/apc-oujana/'},
  {id:'shahna',  name:'الشحنة',              daira:'taher',     hasData:true,  url:'https://willayajijel.github.io/chahna/'},
  {id:'busif',   name:'بوسيف أولاد عسكر',   daira:'taher',     hasData:true,  url:'https://willayajijel.github.io/boucifouledaskeur/'},
  // ── دائرة الشقفة ──
  {id:'chaqfa',  name:'الشقفة',              daira:'chaqfa',    hasData:true,  url:'https://willayajijel.github.io/chekfa/'},
  {id:'qanar',   name:'القنار نشفي',         daira:'chaqfa',    hasData:true,  url:'https://willayajijel.github.io/elkennar/'},
  {id:'borjthr', name:'برج الطهر',           daira:'chaqfa',    hasData:true,  url:'https://willayajijel.github.io/bordjthar/'},
  {id:'sidiazz', name:'سيدي عبد العزيز',    daira:'chaqfa',    hasData:true,  url:'https://willayajijel.github.io/sidiabdelaziz/'},
  // ── دائرة الميلية ──
  {id:'milia',   name:'الميلية',             daira:'milia',     hasData:true,  url:'https://willayajijel.github.io/elmilia/'},
  {id:'awlyhy',  name:'أولاد يحيى خدروش',   daira:'milia',     hasData:true,  url:'https://willayajijel.github.io/ouledyahia/'},
  // ── دائرة العنصر ──
  {id:'ansar',   name:'العنصر',              daira:'ansar',     hasData:true,  url:'https://willayajijel.github.io/elanser/'},
  {id:'burawi',  name:'بوراوي بلهادف',       daira:'ansar',     hasData:true,  url:'https://willayajijel.github.io/bouraoui/'},
  {id:'jmaa',    name:'الجمعة بني حبيبي',   daira:'ansar',     hasData:true,  url:'https://willayajijel.github.io/djemaa/'},
  {id:'khayri',  name:'خيري وادي العجول',   daira:'ansar',     hasData:true,  url:'https://willayajijel.github.io/kheiri/'},
  // ── دائرة العوانة ──
  {id:'awana',   name:'العوانة',             daira:'awana',     hasData:true,  url:'https://willayajijel.github.io/elaouana/'},
  {id:'salma',   name:'سلمى بن زيادة',      daira:'awana',     hasData:true,  url:'https://willayajijel.github.io/selma/'},
  // ── دائرة جيملة ──
  {id:'jimila',  name:'جيملة',              daira:'jimila',    hasData:true,  url:'https://willayajijel.github.io/djimla/'},
  {id:'boudria', name:'بودريعة بن ياجيس',   daira:'jimila',    hasData:true,  url:'https://willayajijel.github.io/boudriaabenyadjis/'},
  // ── دائرة تاكسنة ──
  {id:'taksna',  name:'تاكسنة',             daira:'taksna',    hasData:true,  url:'https://willayajijel.github.io/texenna/'},
  {id:'qawus',   name:'قاوس',               daira:'taksna',    hasData:true,  url:'https://willayajijel.github.io/kaous/'},
  // ── دائرة السطارة ──
  {id:'satara',  name:'السطارة',             daira:'satara',    hasData:true,  url:'https://willayajijel.github.io/settara/'},
  {id:'ghbala',  name:'غبالة',              daira:'satara',    hasData:true,  url:'https://willayajijel.github.io/ghebala/'},
  // ── دائرة سيدي معروف ──
  {id:'sidimaruf',name:'سيدي معروف',        daira:'sidimaruf', hasData:true,  url:'https://willayajijel.github.io/sidimaarouf/'},
  {id:'awlrba',  name:'أولاد رابح',         daira:'sidimaruf', hasData:true,  url:'https://willayajijel.github.io/ouledrabah/'},
  // ── دائرة زيامة منصورية ──
  {id:'ziama',   name:'زيامة المنصورية',    daira:'ziama',     hasData:true,  url:'https://willayajijel.github.io/ziamamansouriah/'},
  {id:'iragn',   name:'إيراقن سويسي',       daira:'ziama',     hasData:true,  url:'https://willayajijel.github.io/eraguene/'},
];

document.getElementById('hdr-munis').textContent=MUNICIPALITIES.length;

const PROGRAMS_FULL={
  'ADSEC':'برنامج دعم التنمية الاقتصادية والاجتماعية للبلديات',
  'CSGCL':'صندوق التضامن والضمان للجماعات المحلية',
  'BW':'ميزانية الولاية',
  'BC':'ميزانية البلدية',
  'FS':'أموال خاصة',
};

const PROG_CFG={
  'ADSEC':{color:'#006233',border:'rgba(0,168,78,0.35)',bg:'rgba(0,98,51,0.12)',textCol:'#4ade80',icon:'🏗️'},
  'CSGCL':{color:'#c9a84c',border:'rgba(201,168,76,0.35)',bg:'rgba(201,168,76,0.1)',textCol:'var(--gold-light)',icon:'🏦'},
  'BW':{color:'#0891b2',border:'rgba(8,145,178,0.35)',bg:'rgba(8,145,178,0.1)',textCol:'#38bdf8',icon:'🏛️'},
  'BC':{color:'#7c3aed',border:'rgba(139,92,246,0.35)',bg:'rgba(124,58,237,0.1)',textCol:'#a78bfa',icon:'🏘️'},
  'FS':{color:'#d21034',border:'rgba(210,16,52,0.35)',bg:'rgba(210,16,52,0.1)',textCol:'#f87171',icon:'💼'},
};

/* Historical static data — now includes FS & BW */
const YEARS_DATA={
  '2022':{ops_total:162,ops_ongoing:55,ops_done:72,ops_stopped:6,ops_not_started:20,ops_closed:9,
    budget_total:7200000000,budget_consumed:5400000000,progress:68,consume_rate:75,
    programs:[
      {abbr:'ADSEC',count:48,color:'#006233',bg:'rgba(0,98,51,0.15)',border:'rgba(0,168,78,0.35)'},
      {abbr:'CSGCL',count:38,color:'#c9a84c',bg:'rgba(201,168,76,0.12)',border:'rgba(201,168,76,0.3)'},
      {abbr:'FS',count:56,color:'#d21034',bg:'rgba(210,16,52,0.12)',border:'rgba(210,16,52,0.3)'},
      {abbr:'BW',count:20,color:'#0891b2',bg:'rgba(8,145,178,0.12)',border:'rgba(8,145,178,0.3)'},
    ],
    sectors:[{n:'الأشغال العمومية',e:'🚧',c:28},{n:'البناء والتعمير',e:'🏗️',c:22},{n:'التجهيزات',e:'🏫',c:36},{n:'الري',e:'💧',c:24},{n:'التربية',e:'📚',c:30},{n:'الرياضة',e:'⚽',c:22}]},
  '2023':{ops_total:198,ops_ongoing:74,ops_done:85,ops_stopped:9,ops_not_started:14,ops_closed:16,
    budget_total:9400000000,budget_consumed:7120000000,progress:76,consume_rate:81,
    programs:[
      {abbr:'ADSEC',count:65,color:'#006233',bg:'rgba(0,98,51,0.15)',border:'rgba(0,168,78,0.35)'},
      {abbr:'CSGCL',count:54,color:'#c9a84c',bg:'rgba(201,168,76,0.12)',border:'rgba(201,168,76,0.3)'},
      {abbr:'FS',count:61,color:'#d21034',bg:'rgba(210,16,52,0.12)',border:'rgba(210,16,52,0.3)'},
      {abbr:'BW',count:18,color:'#0891b2',bg:'rgba(8,145,178,0.12)',border:'rgba(8,145,178,0.3)'},
    ],
    sectors:[{n:'الأشغال العمومية',e:'🚧',c:34},{n:'البناء والتعمير',e:'🏗️',c:28},{n:'التجهيزات',e:'🏫',c:42},{n:'الري',e:'💧',c:31},{n:'التربية',e:'📚',c:38},{n:'الرياضة',e:'⚽',c:25}]},
  '2024':{ops_total:225,ops_ongoing:88,ops_done:95,ops_stopped:10,ops_not_started:16,ops_closed:16,
    budget_total:11200000000,budget_consumed:7900000000,progress:71,consume_rate:77,
    programs:[
      {abbr:'ADSEC',count:75,color:'#006233',bg:'rgba(0,98,51,0.15)',border:'rgba(0,168,78,0.35)'},
      {abbr:'CSGCL',count:60,color:'#c9a84c',bg:'rgba(201,168,76,0.12)',border:'rgba(201,168,76,0.3)'},
      {abbr:'FS',count:68,color:'#d21034',bg:'rgba(210,16,52,0.12)',border:'rgba(210,16,52,0.3)'},
      {abbr:'BW',count:22,color:'#0891b2',bg:'rgba(8,145,178,0.12)',border:'rgba(8,145,178,0.3)'},
    ],
    sectors:[{n:'الأشغال العمومية',e:'🚧',c:40},{n:'البناء والتعمير',e:'🏗️',c:32},{n:'التجهيزات',e:'🏫',c:48},{n:'الري',e:'💧',c:29},{n:'التربية',e:'📚',c:44},{n:'الرياضة',e:'⚽',c:32}]},
  '2025':{ops_total:245,ops_ongoing:92,ops_done:101,ops_stopped:11,ops_not_started:18,ops_closed:23,
    budget_total:12800000000,budget_consumed:8300000000,progress:67,consume_rate:74,
    programs:[
      {abbr:'ADSEC',count:81,color:'#006233',bg:'rgba(0,98,51,0.15)',border:'rgba(0,168,78,0.35)'},
      {abbr:'CSGCL',count:64,color:'#c9a84c',bg:'rgba(201,168,76,0.12)',border:'rgba(201,168,76,0.3)'},
      {abbr:'FS',count:72,color:'#d21034',bg:'rgba(210,16,52,0.12)',border:'rgba(210,16,52,0.3)'},
      {abbr:'BW',count:28,color:'#0891b2',bg:'rgba(8,145,178,0.12)',border:'rgba(8,145,178,0.3)'},
    ],
    sectors:[{n:'الأشغال العمومية',e:'🚧',c:44},{n:'البناء والتعمير',e:'🏗️',c:35},{n:'التجهيزات',e:'🏫',c:52},{n:'الري',e:'💧',c:33},{n:'التربية',e:'📚',c:49},{n:'الرياضة',e:'⚽',c:32}]},
  '2026':{ops_total:null,ops_ongoing:null,ops_done:null,ops_stopped:null,ops_not_started:null,ops_closed:null,
    budget_total:null,budget_consumed:null,progress:null,consume_rate:null,fromFirebase:true,
    programs:[
      {abbr:'ADSEC',count:null,color:'#006233',bg:'rgba(0,98,51,0.15)',border:'rgba(0,168,78,0.35)'},
      {abbr:'CSGCL',count:null,color:'#c9a84c',bg:'rgba(201,168,76,0.12)',border:'rgba(201,168,76,0.3)'},
      {abbr:'FS',count:null,color:'#d21034',bg:'rgba(210,16,52,0.12)',border:'rgba(210,16,52,0.3)'},
      {abbr:'BW',count:null,color:'#0891b2',bg:'rgba(8,145,178,0.12)',border:'rgba(8,145,178,0.3)'},
    ],
    sectors:[]},
};

const fmtNum=n=>new Intl.NumberFormat('ar-DZ').format(Math.round(n||0));
const fmtM=n=>{if(!n&&n!==0)return'—';if(n>=1e9)return(n/1e9).toFixed(2)+' مليار';if(n>=1e6)return(n/1e6).toFixed(1)+' مليون';return fmtNum(n);};

let _bannerYear='2026';
let _allOps=[];  // All ops from Firebase
let _statYear='2026';
let _statProg='adsec';
const PROG_IDS_MAP={1:'ADSEC',2:'CSGCL',3:'BW',4:'BC',5:'FS'};
const STATUS_COLORS={'جارية':'#00c85a','منهية':'#10b981','متوقفة':'#ef4444','غير منطلقة':'#94a3b8','مغلقة':'#6366f1'};
const STATUS_ICONS={'جارية':'⚡','منهية':'✅','متوقفة':'🔴','غير منطلقة':'🔲','مغلقة':'🔒'};

/* ══ Banner ══ */
function switchBannerYear(yr,btn){
  _bannerYear=yr;
  document.querySelectorAll('.byt').forEach(b=>{b.classList.remove('active','active-2026');});
  btn.classList.add('active');
  if(yr==='2026') btn.classList.add('active-2026');
  const d=YEARS_DATA[yr];
  if(!d) return;
  if(d.fromFirebase&&d.ops_total===null){
    document.getElementById('bs-total').textContent='⏳';
    document.getElementById('bs-budget').textContent='⏳';
    document.getElementById('bs-progress').textContent='⏳';
    document.getElementById('bs-consume').textContent='⏳';
    document.getElementById('banner-title').textContent=`📊 إحصائيات البرنامج التنموي للولاية — سنة ${yr}`;
    return;
  }
  updateBannerStats(d,yr);
  renderHomeProgramsShowcase(d,yr);
}

function updateBannerStats(d,yr){
  document.getElementById('banner-title').textContent=`📊 إحصائيات البرنامج التنموي للولاية — سنة ${yr||_bannerYear}`;
  document.getElementById('bs-total').textContent=d.ops_total??'—';
  document.getElementById('bs-budget').textContent=fmtM(d.budget_total);
  const prog=d.progress??0,cons=d.consume_rate??0;
  document.getElementById('bs-progress').textContent=prog+'%';
  document.getElementById('bs-progress-bar').style.width=prog+'%';
  document.getElementById('bs-consume').textContent=cons+'%';
  document.getElementById('bs-consume-bar').style.width=cons+'%';
  const badge=document.getElementById('banner-update-badge');
  if(yr==='2026'||_bannerYear==='2026'){
    badge.textContent=d.fromFirebase&&d.ops_total?'✓ بيانات مباشرة':'⏳ جاري التحميل';
    badge.style.cssText=d.fromFirebase&&d.ops_total?'background:rgba(0,98,51,0.15);border:1px solid rgba(0,168,78,0.3);color:#4ade80;font-size:0.7rem;font-weight:700;padding:4px 14px;border-radius:20px;':'background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.3);color:var(--gold);font-size:0.7rem;font-weight:700;padding:4px 14px;border-radius:20px;';
  }else{
    badge.textContent=`📅 بيانات ${yr}`;
    badge.style.cssText='background:rgba(30,95,168,0.15);border:1px solid rgba(30,95,168,0.3);color:#60a5fa;font-size:0.7rem;font-weight:700;padding:4px 14px;border-radius:20px;';
  }
}


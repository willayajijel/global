/* ══ Clock & Date Live ══ */
function startClock(){
  function tick(){
    const now=new Date();
    const timeEl=document.getElementById('cmd-clock-time');
    const dateEl=document.getElementById('cmd-clock-date');
    if(!timeEl) return;
    const h=String(now.getHours()).padStart(2,'0');
    const m=String(now.getMinutes()).padStart(2,'0');
    const s=String(now.getSeconds()).padStart(2,'0');
    timeEl.textContent=`${h}:${m}:${s}`;
    const days=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    const months=['جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    dateEl.textContent=`${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }
  tick();
  setInterval(tick,1000);
}

/* ══ Weather Fetch (Open-Meteo — no API key needed) ══ */
async function fetchWeatherJijel(){
  try{
    // Jijel coords: 36.82N, 5.77E
    const url='https://api.open-meteo.com/v1/forecast?latitude=36.82&longitude=5.77&current=temperature_2m,weather_code,wind_speed_10m&timezone=Africa%2FAlgiers';
    const r=await fetch(url);const d=await r.json();
    const temp=Math.round(d.current.temperature_2m);
    const code=d.current.weather_code;
    const wind=Math.round(d.current.wind_speed_10m);
    const wIcons={0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌧️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'🌨️',75:'🌨️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',96:'⛈️',99:'⛈️'};
    const wDesc={0:'صافٍ',1:'غائم جزئياً',2:'غائم جزئياً',3:'غائم',45:'ضباب',48:'ضباب',51:'رذاذ',53:'مطر خفيف',55:'مطر',61:'مطر',63:'مطر متوسط',65:'مطر غزير',71:'ثلج',73:'ثلج',75:'ثلج كثيف',80:'زخات',81:'زخات',82:'زخات غزيرة',95:'عاصفة',96:'عاصفة ورعد',99:'عاصفة ورعد'};
    const icon=wIcons[code]||'🌡️';
    const desc=wDesc[code]||'—';
    document.getElementById('cmd-weather-icon').textContent=icon;
    document.getElementById('cmd-weather-temp').textContent=temp+'°م';
    document.getElementById('cmd-weather-desc').textContent=desc+' | ريح '+wind+'km/h';
    document.getElementById('cmd-weather-widget').title=`جيجل: ${temp}°م — ${desc}`;
  }catch(e){
    document.getElementById('cmd-weather-desc').textContent='تعذّر التحميل';
  }
}

/* ══ Command Center Update (after Firebase loads) ══ */
function updateCommandCenter(ops){
  const now=new Date();
  const todayStr=now.toISOString().slice(0,10);
  let opsToday=0;
  const activeMunis=new Set();
  const todayOpsIds=[];
  ops.forEach(o=>{
    const ts=o.updated_at||o.updatedAt||o.timestamp||o.created_at||'';
    if(ts&&String(ts).includes(todayStr)){opsToday++;todayOpsIds.push(o);}
    if(o.municipality_id) activeMunis.add(o.municipality_id);
  });
  document.getElementById('cmd-active-munis').textContent=activeMunis.size+' بلدية';
  const opsEl=document.getElementById('cmd-ops-today');
  opsEl.textContent=opsToday>0?opsToday+' عملية':'لا تحديثات اليوم';
  // عند الضغط على عمليات اليوم نعرضها
  const todayClickEl=opsEl.closest?opsEl.closest('.cmd-item-clickable'):null;
  if(todayClickEl){
    todayClickEl.onclick=()=>{
      if(opsToday>0){
        document.getElementById('ops-list-title').textContent=`🔄 العمليات المحدّثة اليوم (${todayStr})`;
        document.getElementById('ops-list-count').textContent=todayOpsIds.length+' عملية';
        document.getElementById('ops-list-body').innerHTML=buildOpsListTable(todayOpsIds);
        document.getElementById('ops-list-modal').classList.add('open');
      } else {
        scrollToUpdates();
      }
    };
  }
  const hh=String(now.getHours()).padStart(2,'0');
  const mm=String(now.getMinutes()).padStart(2,'0');
  document.getElementById('cmd-last-update').textContent=`${hh}:${mm}`;
  document.getElementById('cmd-server-status').textContent=ops.length?'متصل ✓':'تحقق…';
}

/* ══ Alert Center ══ */
function renderAlertCenter(ops){
  const alerts=[];
  const now=new Date();

  if(!ops.length){
    document.getElementById('alerts-grid').innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-muted);font-size:0.82rem;">لا تتوفر بيانات كافية لعرض التنبيهات حالياً</div>`;
    document.getElementById('alert-count-badge').textContent='لا تنبيهات';
    return;
  }

  // 1) مشاريع متأخرة (متوقفة)
  const stopped=ops.filter(o=>o.status==='متوقفة');
  if(stopped.length){
    alerts.push({
      type:'red',icon:'🔴',
      title:`${stopped.length} مشروع متوقف`,
      desc:`توجد ${stopped.length} عملية في حالة توقف تستوجب تدخلاً عاجلاً لرفع العراقيل`,
      badge:'توقف',badgeColor:'#f87171',
      action:`openOpsListByFilter({status:'متوقفة'})`
    });
  }

  // 2) استهلاك ضعيف (أقل من 25%)
  const lowConsume=ops.filter(o=>{
    const bgt=+o.amount||0;
    const cons=(o.situations||[]).reduce((s,sit)=>s+(+sit.amount||0),0);
    return bgt>0&&(cons/bgt*100)<25&&o.status!=='منهية'&&o.status!=='مغلقة';
  });
  if(lowConsume.length){
    alerts.push({
      type:'orange',icon:'📉',
      title:`${lowConsume.length} عملية استهلاكها أقل من 25%`,
      desc:`هذه العمليات تعاني من ضعف في استهلاك الاعتمادات المالية المرصودة`,
      badge:'استهلاك ضعيف',badgeColor:'#fb923c',
      action:`openOpsListByFilter({})`
    });
  }

  // 3) نسبة استهلاك خطيرة (أكثر من 90% وغير منهية)
  const overConsume=ops.filter(o=>{
    const bgt=+o.amount||0;
    const cons=(o.situations||[]).reduce((s,sit)=>s+(+sit.amount||0),0);
    return bgt>0&&(cons/bgt*100)>90&&o.status==='جارية'&&(+o.progress||0)<80;
  });
  if(overConsume.length){
    alerts.push({
      type:'red',icon:'⚠️',
      title:`${overConsume.length} عملية تجاوز استهلاكها 90%`,
      desc:`عمليات تجاوزت 90% من الاعتمادات مع نسبة إنجاز دون 80% — خطر تجاوز الغلاف`,
      badge:'خطر مالي',badgeColor:'#ef4444',
      action:`openOpsListByFilter({status:'جارية'})`
    });
  }

  // 4) عمليات غير منطلقة (بلا سبب)
  const notStarted=ops.filter(o=>o.status==='غير منطلقة');
  if(notStarted.length){
    alerts.push({
      type:'yellow',icon:'🔲',
      title:`${notStarted.length} عملية لم تنطلق بعد`,
      desc:`عمليات مسجلة لم تشهد بداية الأشغال — تستدعي متابعة عاجلة`,
      badge:'لم تنطلق',badgeColor:'#ca8a04',
      action:`openOpsListByFilter({status:'غير منطلقة'})`
    });
  }

  // 5) بلديات لم تحدّث بياناتها
  const muniLastUpdate={};
  ops.forEach(o=>{
    const ts=o.updated_at||o.updatedAt||o.timestamp||o.created_at;
    if(ts&&o.municipality_id){
      const prev=muniLastUpdate[o.municipality_id];
      const tsDate=new Date(ts.seconds?ts.seconds*1000:ts);
      if(!prev||tsDate>prev) muniLastUpdate[o.municipality_id]=tsDate;
    }
  });
  const staleMusnis=[];
  MUNICIPALITIES.filter(m=>m.hasData).forEach(m=>{
    const last=muniLastUpdate[m.id];
    if(last){
      const daysSince=Math.floor((now-last)/(1000*60*60*24));
      if(daysSince>8) staleMusnis.push({name:m.name,days:daysSince,id:m.id});
    }
  });
  if(staleMusnis.length){
    const names=staleMusnis.map(m=>`${m.name} (${m.days} يوم)`).join(' ، ');
    alerts.push({
      type:'blue',icon:'📅',
      title:`${staleMusnis.length} بلدية لم تحدّث بياناتها منذ أكثر من 8 أيام`,
      desc:names,
      badge:'تحديث متأخر',badgeColor:'#60a5fa',
      action:`openStaleAlertDetail(${JSON.stringify(staleMusnis.map(m=>m.id))})`
    });
  }

  // إذا لا تنبيهات
  if(!alerts.length){
    document.getElementById('alerts-grid').innerHTML=`<div style="grid-column:1/-1;display:flex;align-items:center;gap:12px;background:rgba(0,98,51,0.08);border:1px solid rgba(0,168,78,0.2);border-radius:12px;padding:16px 20px;">
      <span style="font-size:1.6rem;">✅</span>
      <div><div style="font-size:0.85rem;font-weight:700;color:#4ade80;margin-bottom:3px;">كل شيء على ما يرام!</div>
      <div style="font-size:0.72rem;color:var(--text-muted);">لا توجد تنبيهات حالية — المنصة تعمل بشكل طبيعي</div></div>
    </div>`;
    document.getElementById('alert-count-badge').textContent='✓ لا تنبيهات';
    document.getElementById('alert-count-badge').style.cssText='background:rgba(0,98,51,0.15);border:1px solid rgba(0,168,78,0.3);color:#4ade80;font-size:0.72rem;font-weight:700;padding:3px 12px;border-radius:20px;';
    return;
  }

  const typeMap={red:'alert-red',orange:'alert-orange',yellow:'alert-yellow',blue:'alert-blue'};
  document.getElementById('alerts-grid').innerHTML=alerts.map(a=>`
    <div class="alert-card ${typeMap[a.type]}" ${a.action?`onclick="${a.action}"`:''}
      onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.3)'" onmouseout="this.style.boxShadow='none'">
      <div class="ac-icon">${a.icon}</div>
      <div class="ac-body">
        <div class="ac-title">${a.title}</div>
        <div class="ac-desc">${a.desc}</div>
        <span class="ac-badge" style="background:${a.badgeColor}22;color:${a.badgeColor};border:1px solid ${a.badgeColor}44;">
          ${a.badge} ${a.action?'↗ اضغط للعرض':''}
        </span>
      </div>
    </div>`).join('');

  document.getElementById('alert-count-badge').textContent=`${alerts.length} تنبيه`;
  document.getElementById('alert-count-badge').style.cssText='background:rgba(210,16,52,0.15);border:1px solid rgba(210,16,52,0.35);color:#f87171;font-size:0.72rem;font-weight:700;padding:3px 12px;border-radius:20px;animation:pulse 2.5s infinite;';
}

/* ══ Top 3 Performers ══ */
function renderTop3Performers(ops){
  // استخدام كل البلديات التي لها بيانات وترتيبها حسب الاستهلاك
  const rows=MUNICIPALITIES.map(m=>{
    const mOps=ops.filter(o=>o.municipality_id===m.id);
    const budget=mOps.reduce((a,o)=>a+(+o.amount||0),0);
    const consumed=mOps.reduce((a,o)=>a+(o.situations||[]).reduce((s,sit)=>s+(+sit.amount||0),0),0);
    const rate=budget?Math.round(consumed/budget*100):0;
    const avgProg=mOps.length?Math.round(mOps.reduce((a,o)=>a+(+o.progress||0),0)/mOps.length):0;
    return{muni:m,budget,consumed,rate,count:mOps.length,avgProg};
  }).filter(r=>r.count>0).sort((a,b)=>b.rate-a.rate);

  if(rows.length<1){
    document.getElementById('top3-grid').innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-muted);">لا توجد بيانات كافية</div>`;
    return;
  }

  const top3=rows.slice(0,3);
  const medals=['🥇','🥈','🥉'];
  const configs=[
    {bg:'rgba(201,168,76,0.08)',border:'rgba(201,168,76,0.3)',color:'var(--gold-light)',barColor:'linear-gradient(90deg,var(--gold-dark),var(--gold-light))'},
    {bg:'rgba(148,163,184,0.06)',border:'rgba(148,163,184,0.25)',color:'#94a3b8',barColor:'linear-gradient(90deg,#475569,#94a3b8)'},
    {bg:'rgba(180,83,9,0.06)',border:'rgba(180,83,9,0.25)',color:'#b45309',barColor:'linear-gradient(90deg,#92400e,#d97706)'},
  ];

  document.getElementById('top3-grid').innerHTML=top3.map((r,i)=>{
    const cfg=configs[i]||configs[2];
    const dairaName=DAIRAS.find(d=>d.id===r.muni.daira)?.name||'';
    return `<div class="top3-card" style="background:${cfg.bg};border-color:${cfg.border};"
      onclick="openMuni('${r.muni.id}')"
      onmouseover="this.style.boxShadow='0 16px 48px rgba(0,0,0,0.5)'" onmouseout="this.style.boxShadow='none'">
      <span class="rank-badge">${medals[i]}</span>
      <div style="text-align:right;margin-bottom:12px;">
        <div class="tc-muni">${r.muni.name}</div>
        <div class="tc-daira">📍 دائرة ${dairaName}</div>
      </div>
      <div class="tc-rate" style="color:${cfg.color};">${r.rate}%</div>
      <div style="font-size:0.68rem;color:var(--text-muted);">نسبة الاستهلاك المالي</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;font-size:0.68rem;">
        <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:6px 10px;text-align:center;">
          <div style="font-weight:700;color:#a78bfa;">${r.avgProg}%</div><div style="color:var(--text-muted);">إنجاز</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:6px 10px;text-align:center;">
          <div style="font-weight:700;color:#4ade80;">${r.count}</div><div style="color:var(--text-muted);">عملية</div>
        </div>
      </div>
      <div class="tc-bar"><div class="tc-bar-fill" style="width:${r.rate}%;background:${cfg.barColor};"></div></div>
    </div>`;
  }).join('');
}

/* ══ Municipality Performance Color by Ranking ══ */
function getMuniPerfClass(rank,total){
  const pct=(rank/total)*100;
  if(pct<=25) return'muni-perf-green';    // الأولى 1-7
  if(pct<=50) return'muni-perf-yellow';   // 8-14
  if(pct<=75) return'muni-perf-orange';   // 15-21
  return'muni-perf-red';                   // 22-28
}
function getPerfLabel(rank,total){
  const pct=(rank/total)*100;
  if(pct<=25) return{txt:'جيدة',col:'#4ade80'};
  if(pct<=50) return{txt:'متوسطة',col:'#facc15'};
  if(pct<=75) return{txt:'متأخرة',col:'#fb923c'};
  return{txt:'ضعيفة',col:'#f87171'};
}

function applyMuniPerformanceColors(ops){
  // احسب ترتيب كل بلدية
  const rows=MUNICIPALITIES.map(m=>{
    const mOps=ops.filter(o=>o.municipality_id===m.id);
    const budget=mOps.reduce((a,o)=>a+(+o.amount||0),0);
    const consumed=mOps.reduce((a,o)=>a+(o.situations||[]).reduce((s,sit)=>s+(+sit.amount||0),0),0);
    const rate=budget?Math.round(consumed/budget*100):0;
    return{id:m.id,rate,hasData:mOps.length>0};
  }).sort((a,b)=>b.rate-a.rate);

  const total=rows.length;
  const rankMap={};
  rows.forEach((r,i)=>{rankMap[r.id]={rank:i+1,rate:r.rate,hasData:r.hasData};});
  window._muniRankMap=rankMap;

  // تطبيق الألوان على بطاقات البلديات
  document.querySelectorAll('.muni-mini-card,.muni-card').forEach(card=>{
    const onclick=card.getAttribute('onclick')||'';
    const match=onclick.match(/openMuni\('([^']+)'\)/);
    if(!match) return;
    const muniId=match[1];
    const info=rankMap[muniId];
    if(!info||!info.hasData) return;
    const perfClass=getMuniPerfClass(info.rank,total);
    const label=getPerfLabel(info.rank,total);
    card.classList.remove('muni-perf-green','muni-perf-yellow','muni-perf-orange','muni-perf-red');
    card.classList.add(perfClass);
    // أضف label الأداء
    const badgeEl=card.querySelector('.muni-mini-badge,.muni-data-badge');
    if(badgeEl){
      badgeEl.innerHTML=`<span style="color:${label.col};">● ${label.txt}</span> #${info.rank}`;
    }
  });
}

/* ══ Stale Alert Detail ══ */
function openStaleAlertDetail(muniIds){
  if(!_allOps.length){alert('جاري تحميل البيانات…');return;}
  const ops=_allOps.filter(o=>muniIds.includes(o.municipality_id));
  const names=muniIds.map(id=>MUNICIPALITIES.find(m=>m.id===id)?.name||id).join('، ');
  document.getElementById('ops-list-title').textContent=`📅 عمليات البلديات المتأخرة في التحديث: ${names}`;
  document.getElementById('ops-list-count').textContent=ops.length+' عملية';
  document.getElementById('ops-list-body').innerHTML=ops.length?buildOpsListTable(ops):`<div style="text-align:center;padding:40px;color:var(--text-muted);">لا توجد عمليات مسجلة لهذه البلديات</div>`;
  document.getElementById('ops-list-modal').classList.add('open');
}

/* ══ Scroll to updates ══ */
function scrollToUpdates(){
  if(!_allOps.length){showToast('تحديثات','جاري تحميل البيانات…');return;}
  showSection('home');
  setTimeout(()=>{
    const el=document.getElementById('alert-center-section');
    if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
  },100);
}

/* ══ Notification Toast ══ */
let _lastOpsCount=0;
function showToast(title,desc){
  const container=document.getElementById('notif-toast');
  const el=document.createElement('div');
  el.className='toast-item';
  el.innerHTML=`<div class="toast-title">🔔 ${title}</div><div class="toast-desc">${desc}</div>`;
  container.appendChild(el);
  setTimeout(()=>el.remove(),5200);
}
function checkForUpdates(newOps){
  if(_lastOpsCount>0&&newOps.length!==_lastOpsCount){
    const diff=newOps.length-_lastOpsCount;
    if(diff>0) showToast('تحديث جديد','تم إضافة '+diff+' عملية جديدة على المنصة');
  }
  _lastOpsCount=newOps.length;
}

/* ══ Wali Quote Toggle ══ */
function toggleWaliQuote(){
  const wrap=document.getElementById('wali-quote-wrap');
  const btn=document.getElementById('btn-read-more');
  const fade=document.getElementById('wali-quote-fade');
  if(wrap.classList.contains('expanded')){
    wrap.classList.remove('expanded');
    btn.innerHTML='📖 قراءة الرسالة كاملة ▼';
  }else{
    wrap.classList.add('expanded');
    btn.innerHTML='🔼 طيّ الرسالة ▲';
  }
}

/* ══ NAV ══ */
function showSection(name){
  ['home','dashboard','municipalities','projects','statistics','contact'].forEach(s=>{
    const el=document.getElementById('section-'+s);
    if(el) el.style.display=s===name?'block':'none';
  });
  document.querySelectorAll('.nav-bar a').forEach(a=>a.classList.remove('active'));
  const map={home:0,dashboard:1,municipalities:2,projects:3,statistics:4,contact:5};
  if(map[name]!==undefined) document.querySelectorAll('.nav-bar a')[map[name]]?.classList.add('active');
  if(name==='projects'&&!window._projRendered){window._projRendered=true;renderProjSection('2026');}
  if(name==='contact'&&!window._contactRendered){window._contactRendered=true;renderContactMuniLinks();}
  if(name==='statistics'&&!window._statRendered){window._statRendered=true;renderStatRanking();}
}

/* ══ Contact page dynamic population ══ */
function renderContactMuniLinks(){
  const el=document.getElementById('contact-muni-links');
  if(!el) return;
  const withData=MUNICIPALITIES.filter(m=>m.hasData&&m.url);
  el.innerHTML=withData.map(m=>{
    const dName=DAIRAS.find(d=>d.id===m.daira)?.name||'';
    return `<a href="${m.url}" target="_blank" style="display:flex;align-items:center;gap:10px;background:rgba(0,98,51,0.08);border:1px solid rgba(0,168,78,0.18);border-radius:10px;padding:11px 14px;text-decoration:none;transition:all 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.borderColor='#4ade80'" onmouseout="this.style.transform='';this.style.borderColor='rgba(0,168,78,0.18)'">
      <div style="width:32px;height:32px;border-radius:8px;background:rgba(0,168,78,0.12);border:1px solid rgba(0,168,78,0.22);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;">🌐</div>
      <div>
        <div style="font-size:0.85rem;color:#fff;font-weight:700;">${m.name}</div>
        <div style="font-size:0.65rem;color:var(--text-muted);">📍 ${dName}</div>
      </div>
      <span style="margin-right:auto;font-size:0.6rem;color:#4ade80;">↗</span>
    </a>`;
  }).join('');
}

/* ══ BOOT ══ */
initDairaList();
initYearTabs();
initMuniGrid();
initHomeMuniGrid();
updateBannerStats(YEARS_DATA['2026'],'2026');
renderSidebarYear('2026');
renderHomeProgramsShowcase(YEARS_DATA['2025'],'2025'); // show 2025 while 2026 loads

// Clock & weather
startClock();
fetchWeatherJijel();
// Refresh weather every 10 minutes
setInterval(fetchWeatherJijel,10*60*1000);

// Fetch live data from Firebase (aggregated from all municipalities)
fetchAllMunicipalitiesData().then(()=>{
  renderHomeProgramsShowcase(YEARS_DATA['2026'],'2026');
  // Apply performance colors after grids rendered
  setTimeout(()=>{ if(window._muniRankMap) applyMuniPerformanceColors(_allOps); },500);
  // Set up live update check every 5 minutes
  setInterval(()=>{
    fetchAllMunicipalitiesData().then(()=>{
      renderHomeProgramsShowcase(YEARS_DATA['2026'],'2026');
      applyMuniPerformanceColors(_allOps);
    });
  },5*60*1000);
});

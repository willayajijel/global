/* ══ Home Programs Showcase ══ */
function renderHomeProgramsShowcase(d,yr){
  const grid=document.getElementById('home-prog-grid');
  const badge=document.getElementById('home-prog-badge');
  const yearEl=document.getElementById('home-prog-year');
  if(!grid) return;
  if(yearEl) yearEl.textContent=yr||'2026';
  const total=d.ops_total||0;
  const progs=[...d.programs];
  grid.innerHTML=progs.map(p=>{
    const cfg=PROG_CFG[p.abbr]||{color:'#888',border:'rgba(136,136,136,0.3)',bg:'rgba(136,136,136,0.08)',textCol:'#ccc',icon:'📌'};
    const cnt=p.count??0;
    const pct=total?Math.round(cnt/total*100):0;
    const fullName=PROGRAMS_FULL[p.abbr]||p.abbr;
    const progKey=p.abbr.toLowerCase();
    return `<div class="prog-showcase-card" style="background:${cfg.bg};border-color:${cfg.border};border-top:3px solid ${cfg.color};"
      onclick="if('${yr}'==='2026'){showSection('projects');setTimeout(()=>switchProjTab('${progKey}'),100);}">
      <div class="psc-abbr" style="color:${cfg.textCol};">${cfg.icon} ${p.abbr}</div>
      <div style="font-size:0.63rem;color:var(--text-muted);margin-bottom:4px;line-height:1.4;">${fullName}</div>
      <div class="psc-count" style="color:${cfg.textCol};">${cnt||'—'}</div>
      <div class="psc-lbl">عملية مسجلة</div>
      <div class="psc-bar"><div class="psc-bar-fill" style="width:${pct}%;background:${cfg.color};"></div></div>
      <div style="font-size:0.6rem;color:var(--text-muted);margin-top:4px;">${pct}% من الإجمالي</div>
      <div style="font-size:0.6rem;color:${cfg.textCol};margin-top:2px;opacity:0.7;">↗ اضغط للتفاصيل</div>
      <div class="prog-showcase-deco"></div>
    </div>`;
  }).join('');
  const budget=d.budget_total||0,consumed=d.budget_consumed||0;
  const cPct=budget?Math.round(consumed/budget*100):0;
  const progress=d.progress||0;
  document.getElementById('hpfs-budget').textContent=fmtM(budget);
  document.getElementById('hpfs-consumed').textContent=fmtM(consumed)+' ('+cPct+'%)';
  document.getElementById('hpfs-consumed-bar').style.width=cPct+'%';
  document.getElementById('hpfs-progress').textContent=progress+'%';
  document.getElementById('hpfs-progress-bar').style.width=progress+'%';
  if(badge) badge.textContent=total?'✓ '+total+' عملية':'—';
  if(badge&&yr!=='2026') badge.style.cssText='background:rgba(30,95,168,0.15);border:1px solid rgba(30,95,168,0.3);color:#60a5fa;font-size:0.7rem;font-weight:700;padding:5px 14px;border-radius:20px;';
  else if(badge) badge.style.cssText='background:rgba(0,98,51,0.15);border:1px solid rgba(0,168,78,0.3);color:#4ade80;font-size:0.7rem;font-weight:700;padding:5px 14px;border-radius:20px;';
}

/* ══ Sidebar Year ══ */
function sidebarSwitchYear(year,btn){
  document.querySelectorAll('.syp-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderSidebarYear(year);
}
function renderSidebarYear(year){
  const body=document.getElementById('sidebar-year-body');
  if(!body) return;
  const d=YEARS_DATA[year];
  if(!d) return;
  const isLoading=(d.fromFirebase&&!d.ops_total&&d.ops_total!==0);
  if(isLoading){
    body.innerHTML=`<div style="text-align:center;padding:24px;color:var(--text-muted);"><div style="width:28px;height:28px;border:3px solid rgba(201,168,76,0.2);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 8px;"></div><div style="font-size:0.75rem;">⏳ جاري التحميل…</div></div>`;
    return;
  }
  const items=[
    {lbl:'إجمالي العمليات',val:d.ops_total??'—',col:'#4ade80',icon:'🏗️'},
    {lbl:'جارية',val:d.ops_ongoing??'—',col:'#60a5fa',icon:'⚡'},
    {lbl:'نسبة الإنجاز',val:d.progress!=null?d.progress+'%':'—',col:'#a78bfa',icon:'📈'},
    {lbl:'الغلاف المالي',val:fmtM(d.budget_total),col:'var(--gold-light)',icon:'💰'},
  ];
  body.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;">${
    items.map(i=>`<div style="background:rgba(255,255,255,0.04);border-radius:9px;padding:9px 10px;text-align:center;border:1px solid rgba(255,255,255,0.06);">
      <div style="font-size:0.75rem;margin-bottom:2px;">${i.icon}</div>
      <div style="font-size:1rem;font-weight:900;color:${i.col};">${i.val}</div>
      <div style="font-size:0.6rem;color:var(--text-muted);margin-top:1px;">${i.lbl}</div>
    </div>`).join('')}
  </div>
  <div style="margin-top:10px;">
    <div style="display:flex;justify-content:space-between;font-size:0.68rem;color:var(--text-muted);margin-bottom:4px;"><span>استهلاك مالي</span><span style="color:var(--gold-light);">${d.consume_rate??0}%</span></div>
    <div style="background:rgba(255,255,255,0.06);border-radius:99px;height:5px;overflow:hidden;"><div style="width:${d.consume_rate??0}%;height:5px;border-radius:99px;background:linear-gradient(90deg,var(--gold-dark),var(--gold));"></div></div>
  </div>`;
}

/* ══ Daira List ══ */
function initDairaList(){
  const el=document.getElementById('daira-list');if(!el) return;
  const colors=['#006233','#c9a84c','#d21034','#1e5fa8','#7c3aed','#0891b2','#d97706','#16a34a','#dc2626','#7e22ce','#0284c7'];
  el.innerHTML=DAIRAS.map((d,i)=>{
    const cnt=MUNICIPALITIES.filter(m=>m.daira===d.id).length;
    return `<div class="daira-mini-item" onclick="filterByDairaNav('${d.id}')">
      <div class="dmi-dot" style="background:${colors[i%colors.length]};"></div>
      <div class="dmi-name">${d.name}</div>
      <div class="dmi-count">${cnt} ب</div>
    </div>`;
  }).join('');
}

/* ══ Home Muni Grid ══ */
function initHomeMuniGrid(){
  const filterEl=document.getElementById('home-daira-filter');
  DAIRAS.forEach(d=>{
    const btn=document.createElement('button');btn.className='daira-btn-home';btn.textContent=d.name;
    btn.onclick=function(){homeFilterDaira(d.id,this);};filterEl.appendChild(btn);
  });
  renderHomeMuniGrid(MUNICIPALITIES);
}
function homeFilterDaira(id,btn){
  document.querySelectorAll('#home-daira-filter button').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderHomeMuniGrid(id==='all'?MUNICIPALITIES:MUNICIPALITIES.filter(m=>m.daira===id));
}
function renderHomeMuniGrid(list){
  const grid=document.getElementById('home-muni-grid');if(!grid) return;
  grid.innerHTML=list.map(m=>{
    const dName=DAIRAS.find(d=>d.id===m.daira)?.name||'';
    const isLive=m.hasData&&m.url;
    return `<div class="muni-mini-card${m.hasData?' has-data':''}" onclick="openMuni('${m.id}')">
      <div class="muni-mini-top" style="background:${isLive?'linear-gradient(90deg,var(--gold-dark),var(--gold))':'linear-gradient(90deg,var(--green),var(--green-light))'}"></div>
      <div class="muni-mini-body">
        <div class="muni-mini-name">${m.name}</div>
        <div class="muni-mini-daira">📍 ${dName}</div>
        <div class="muni-mini-footer">
          <span class="muni-mini-badge" style="${isLive?'background:rgba(201,168,76,0.12);color:var(--gold-light);border:1px solid rgba(201,168,76,0.28);':'background:rgba(0,98,51,0.15);color:var(--green-light);border:1px solid rgba(0,168,78,0.22);'}">${isLive?'🌐 منصة متاحة':'قريباً'}</span>
          <span class="muni-mini-arrow">↗</span>
        </div>
      </div>
    </div>`;
  }).join('');
  // Apply perf colors if data loaded
  if(window._muniRankMap) setTimeout(()=>applyMuniPerformanceColors(_allOps),50);
}


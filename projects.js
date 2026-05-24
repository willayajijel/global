/* ══ Projects Section ══ */
let _projYear='2026';
window._projRendered=false;

const PROJ_TABS={
  adsec:{abbr:'ADSEC',label:'🏗️ ADSEC',progId:1,color:'#4ade80',bg:'rgba(0,98,51,0.15)',border:'rgba(0,168,78,0.25)',headerBg:'rgba(0,98,51,0.15)',gradStart:'#006233',gradEnd:'#00a84e'},
  csgcl:{abbr:'CSGCL',label:'🏦 CSGCL',progId:2,color:'var(--gold-light)',bg:'rgba(201,168,76,0.12)',border:'rgba(201,168,76,0.28)',headerBg:'rgba(201,168,76,0.12)',gradStart:'#c9a84c',gradEnd:'#e8c97a'},
  fs:{abbr:'FS',label:'💼 FS',progId:5,color:'#f87171',bg:'rgba(210,16,52,0.1)',border:'rgba(210,16,52,0.25)',headerBg:'rgba(210,16,52,0.1)',gradStart:'#d21034',gradEnd:'#ef4444'},
  bw:{abbr:'BW',label:'🏛️ BW',progId:3,color:'#38bdf8',bg:'rgba(8,145,178,0.1)',border:'rgba(8,145,178,0.25)',headerBg:'rgba(8,145,178,0.1)',gradStart:'#0891b2',gradEnd:'#38bdf8'},
};

function switchProjYear(yr,btn){
  _projYear=yr;
  document.querySelectorAll('.proj-year-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProjSection(yr);
}

function switchProjTab(tab){
  const tabs=['adsec','csgcl','fs','bw'];
  tabs.forEach(t=>{
    const btn=document.getElementById('proj-tab-'+t);
    if(!btn) return;
    const cfg=PROJ_TABS[t];
    if(t===tab){
      btn.className='year-tab active';
      btn.style=`background:linear-gradient(135deg,${cfg.gradStart},${cfg.gradEnd});border-color:${cfg.color};color:#fff;`;
    } else {
      btn.className='year-tab';
      btn.style='';
    }
    document.getElementById('proj-panel-'+t).style.display=t===tab?'block':'none';
  });
  // Re-render the active tab
  renderProjTabContent(tab,_projYear);
}

function renderProjSection(yr){
  yr=yr||_projYear;
  ['adsec','csgcl','fs','bw'].forEach(t=>renderProjTabContent(t,yr));
}

function renderProjTabContent(tab,yr){
  yr=yr||_projYear;
  const cfg=PROJ_TABS[tab];
  if(!cfg) return;
  const innerEl=document.getElementById(tab+'-inner');
  if(!innerEl) return;

  if(yr==='2026'){
    if(!_allOps.length){
      innerEl.innerHTML=`<div style="text-align:center;padding:50px;color:var(--text-muted);"><div style="width:36px;height:36px;border:3px solid rgba(201,168,76,0.2);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 14px;"></div><p>⏳ جاري تحميل البيانات المباشرة…</p></div>`;
      return;
    }
    const ops=_allOps.filter(o=>o.program_id===cfg.progId);
    innerEl.innerHTML=buildProgPanelHTML(cfg,ops,'2026');
    const si=document.getElementById(tab+'-search-2026');
    const sf=document.getElementById(tab+'-status-2026');
    if(si) si.oninput=()=>filterAndRenderTable(tab,ops);
    if(sf) sf.onchange=()=>filterAndRenderTable(tab,ops);
    filterAndRenderTable(tab,ops);
  } else {
    // Check if _allOps has year field data for this year
    const hasYearField=_allOps.length&&_allOps.some(o=>o.year||o.annee||o.annee_programmation);
    if(hasYearField&&_allOps.length){
      const yrOps=_allOps.filter(o=>{
        const y=o.year||o.annee||o.annee_programmation;
        return String(y)===String(yr);
      }).filter(o=>o.program_id===cfg.progId);
      if(yrOps.length){
        innerEl.innerHTML=buildProgPanelHTML(cfg,yrOps,yr);
        const si=document.getElementById(tab+'-search-2026');
        const sf=document.getElementById(tab+'-status-2026');
        if(si) si.oninput=()=>filterAndRenderTable(tab,yrOps);
        if(sf) sf.onchange=()=>filterAndRenderTable(tab,yrOps);
        filterAndRenderTable(tab,yrOps);
        return;
      }
    }
    // Fallback: static summary
    const d=YEARS_DATA[yr];
    const progData=d?d.programs.find(p=>p.abbr===cfg.abbr):{count:0};
    innerEl.innerHTML=buildProgPanelStaticHTML(cfg,progData,yr,d);
  }
}

function buildProgPanelHTML(cfg,ops,yr){
  const total=ops.length;
  const budget=ops.reduce((a,o)=>a+(+o.amount||0),0);
  const statusCounts={};
  ops.forEach(o=>{statusCounts[o.status]=(statusCounts[o.status]||0)+1;});
  return `
  <div style="background:${cfg.headerBg};border:1px solid ${cfg.border};border-radius:var(--radius);padding:20px 26px;margin-bottom:24px;position:relative;overflow:hidden;">
    <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${cfg.gradStart},${cfg.gradEnd});"></div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;flex-wrap:wrap;">
      <div>
        <div style="font-size:1.1rem;font-weight:900;color:${cfg.color};">${cfg.label}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);">${PROGRAMS_FULL[cfg.abbr]||cfg.abbr}</div>
      </div>
      <div style="margin-right:auto;display:flex;gap:10px;flex-wrap:wrap;">
        <span style="background:${cfg.headerBg};border:1px solid ${cfg.border};color:${cfg.color};font-size:0.75rem;font-weight:700;padding:5px 14px;border-radius:20px;">${total} عملية</span>
        <span style="background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);color:var(--gold-light);font-size:0.75rem;font-weight:700;padding:5px 14px;border-radius:20px;">💰 ${fmtM(budget)}</span>
      </div>
    </div>
    <!-- Status summary cards — clickable -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:8px;">
      ${[['غير منطلقة','#94a3b8','🔲'],['جارية','#00c85a','⚡'],['متوقفة','#ef4444','🔴'],['منهية','#10b981','✅'],['مغلقة','#6366f1','🔒']].map(([st,col,ic])=>{
        const v=statusCounts[st]||0;
        const pct=total?Math.round(v/total*100):0;
        return `<div style="background:${col}14;border:1px solid ${col}33;border-radius:10px;padding:10px 14px;cursor:pointer;transition:all 0.2s;"
          onclick="setStatusFilter('${cfg.abbr.toLowerCase()}','${st}')"
          onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="font-size:0.7rem;color:${col};font-weight:700;margin-bottom:4px;">${ic} ${st}</div>
          <div style="font-size:1.4rem;font-weight:900;color:${col};">${v}</div>
          <div style="font-size:0.6rem;color:var(--text-muted);">${pct}%</div>
          <div style="background:rgba(255,255,255,0.06);border-radius:99px;height:3px;overflow:hidden;margin-top:6px;"><div style="width:${pct}%;height:3px;border-radius:99px;background:${col};"></div></div>
        </div>`;
      }).join('')}
    </div>
    <!-- Charts row -->
    <div id="${cfg.abbr.toLowerCase()}-charts-2026" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px;">
      ${buildProjChartsHTML(ops)}
    </div>
  </div>
  <!-- Filter row -->
  <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center;">
    <div class="muni-search" style="max-width:340px;">
      <span style="color:var(--text-muted);">🔍</span>
      <input type="text" id="${cfg.abbr.toLowerCase()}-search-2026" placeholder="ابحث عن عملية..." style="flex:1;background:transparent;border:none;outline:none;color:#fff;font-family:'Cairo',sans-serif;font-size:0.88rem;padding:11px 0;">
    </div>
    <select id="${cfg.abbr.toLowerCase()}-status-2026" style="background:rgba(255,255,255,0.04);border:1px solid var(--dark-border);border-radius:10px;color:var(--text-light);padding:10px 14px;font-family:'Cairo',sans-serif;font-size:0.85rem;cursor:pointer;outline:none;">
      <option value="">كل الحالات</option>
      <option value="غير منطلقة">غير منطلقة</option>
      <option value="جارية">جارية</option>
      <option value="متوقفة">متوقفة</option>
      <option value="منهية">منهية</option>
      <option value="مغلقة">مغلقة</option>
    </select>
    <button onclick="clearStatusFilter('${cfg.abbr.toLowerCase()}')" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:var(--text-muted);border-radius:10px;padding:10px 16px;font-family:'Cairo',sans-serif;font-size:0.8rem;cursor:pointer;">↺ إعادة ضبط</button>
    <span id="${cfg.abbr.toLowerCase()}-count-badge" class="muni-count-badge">— عملية</span>
  </div>
  <div id="${cfg.abbr.toLowerCase()}-table-2026" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius);overflow:hidden;"></div>`;
}

function buildProgPanelStaticHTML(cfg,progData,yr,yearData){
  const cnt=progData?.count||0;
  const d=yearData||YEARS_DATA[yr];
  const hasAgg=d&&d.ops_total>0;
  const progKpis=hasAgg?`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:16px;">
      ${[['إجمالي العمليات',d.ops_total,'#4ade80','🏗️'],['جارية',d.ops_ongoing,'#60a5fa','⚡'],['منجزة',d.ops_done,'#10b981','✅'],['نسبة الإنجاز',(d.progress||0)+'%','#a78bfa','📈']].map(([lbl,v,col,ic])=>`
        <div style="background:${col}14;border:1px solid ${col}30;border-radius:10px;padding:10px 14px;text-align:center;">
          <div style="font-size:0.8rem;margin-bottom:3px;">${ic}</div>
          <div style="font-size:1.3rem;font-weight:900;color:${col};">${v??'—'}</div>
          <div style="font-size:0.62rem;color:var(--text-muted);">${lbl}</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:14px;background:rgba(255,255,255,0.03);border-radius:10px;padding:12px 16px;">
      <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;"><span>الغلاف المالي الإجمالي</span><span style="color:var(--gold-light);font-weight:700;">${fmtM(d.budget_total)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;"><span>المستهلك</span><span style="color:#4ade80;font-weight:700;">${fmtM(d.budget_consumed)} (${d.consume_rate||0}%)</span></div>
    </div>` : `
    <div style="text-align:center;padding:36px;">
      <div style="font-size:3rem;margin-bottom:12px;">📅</div>
      <p style="font-size:0.95rem;font-weight:700;color:var(--gold-light);">بيانات ${cfg.abbr} — سنة ${yr}</p>
      <p style="color:var(--text-muted);margin-top:8px;font-size:0.85rem;">إجمالي العمليات: <strong style="color:${cfg.color};">${cnt}</strong> عملية</p>
      <button onclick="showSection('municipalities')" style="margin-top:14px;background:linear-gradient(135deg,${cfg.gradStart},${cfg.gradEnd});border:none;color:#fff;padding:10px 24px;border-radius:10px;font-family:'Cairo',sans-serif;font-size:0.88rem;font-weight:700;cursor:pointer;">🏘️ تصفح منصات البلديات</button>
    </div>`;
  return `<div style="background:${cfg.headerBg};border:1px solid ${cfg.border};border-radius:var(--radius);padding:20px 26px;margin-bottom:24px;position:relative;overflow:hidden;">
    <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${cfg.gradStart},${cfg.gradEnd});"></div>
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
      <div><div style="font-size:1.1rem;font-weight:900;color:${cfg.color};">${cfg.label}</div>
      <div style="font-size:0.78rem;color:var(--text-muted);">${PROGRAMS_FULL[cfg.abbr]||cfg.abbr}</div></div>
      <span style="background:${cfg.headerBg};border:1px solid ${cfg.border};color:${cfg.color};font-size:0.8rem;font-weight:700;padding:5px 16px;border-radius:20px;margin-right:auto;">${cnt} عملية — ${yr}</span>
    </div>
    ${progKpis}
  </div>`;
}

function setStatusFilter(progKey,status){
  const sel=document.getElementById(progKey+'-status-2026');
  if(sel){sel.value=status;}
  // Get ops
  const cfg=Object.values(PROJ_TABS).find(c=>c.abbr.toLowerCase()===progKey);
  if(!cfg) return;
  const ops=_allOps.filter(o=>o.program_id===cfg.progId);
  filterAndRenderTable(progKey,ops);
}
function clearStatusFilter(progKey){
  const sel=document.getElementById(progKey+'-status-2026');
  const si=document.getElementById(progKey+'-search-2026');
  if(sel) sel.value='';
  if(si) si.value='';
  const cfg=Object.values(PROJ_TABS).find(c=>c.abbr.toLowerCase()===progKey);
  if(!cfg) return;
  const ops=_allOps.filter(o=>o.program_id===cfg.progId);
  filterAndRenderTable(progKey,ops);
}

function filterAndRenderTable(progKey,ops){
  const q=(document.getElementById(progKey+'-search-2026')?.value||'').trim().toLowerCase();
  const st=document.getElementById(progKey+'-status-2026')?.value||'';
  let filtered=[...ops];
  if(st) filtered=filtered.filter(o=>o.status===st);
  if(q) filtered=filtered.filter(o=>(o.name||'').toLowerCase().includes(q));
  const badge=document.getElementById(progKey+'-count-badge');
  if(badge) badge.textContent=filtered.length+' عملية';
  const tbl=document.getElementById(progKey+'-table-2026');
  if(tbl) tbl.innerHTML=buildProjTableHTML(filtered);
}

function buildProjChartsHTML(ops){
  const total=ops.length;
  const statItems=Object.entries(STATUS_COLORS).map(([s,c])=>({v:ops.filter(o=>o.status===s).length,c,l:s}));
  const svgStatus=buildDonutSVG(statItems.map(i=>({v:i.v,c:i.c})));
  const legendStatus=statItems.filter(i=>i.v>0).map(i=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;"><span style="width:9px;height:9px;border-radius:2px;background:${i.c};display:inline-block;flex-shrink:0;"></span><span style="font-size:0.72rem;color:var(--text-light);flex:1;">${STATUS_ICONS[i.l]||''} ${i.l}</span><span style="font-size:0.78rem;font-weight:900;color:${i.c};">${i.v}</span></div>`).join('');
  const pBuckets=[{l:'0-25%',min:0,max:25,c:'#ef4444'},{l:'26-50%',min:26,max:50,c:'#f59e0b'},{l:'51-75%',min:51,max:75,c:'#60a5fa'},{l:'76-99%',min:76,max:99,c:'#a78bfa'},{l:'100%',min:100,max:100,c:'#10b981'}];
  const progBuckets=pBuckets.map(b=>({...b,v:ops.filter(o=>{const p=+o.progress||0;return p>=b.min&&p<=b.max;}).length}));
  const svgProg=buildDonutSVG(progBuckets.map(i=>({v:i.v,c:i.c})));
  const legendProg=progBuckets.filter(i=>i.v>0).map(i=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;"><span style="width:9px;height:9px;border-radius:2px;background:${i.c};display:inline-block;flex-shrink:0;"></span><span style="font-size:0.72rem;color:var(--text-light);flex:1;">${i.l}</span><span style="font-size:0.78rem;font-weight:900;color:${i.c};">${i.v}</span></div>`).join('');
  const totalBudget=ops.reduce((a,o)=>a+(+o.amount||0),0);
  const totalConsumed=ops.reduce((a,o)=>a+(o.situations||[]).reduce((s,sit)=>s+(+sit.amount||0),0),0);
  const consumePct=totalBudget?Math.round(totalConsumed/totalBudget*100):0;
  const cs='background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden;';
  const hs='padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.82rem;font-weight:700;color:var(--gold-light);';
  return `
  <div style="${cs}"><div style="${hs}">📊 حسب الحالة</div>
    <div style="padding:14px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <div style="position:relative;flex-shrink:0;"><svg width="110" height="110" viewBox="0 0 130 130">${svgStatus}</svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="font-size:1.1rem;font-weight:900;color:#fff;">${total}</div><div style="font-size:0.55rem;color:var(--text-muted);">عملية</div></div></div>
      <div style="flex:1;min-width:80px;">${legendStatus}</div>
    </div>
  </div>
  <div style="${cs}"><div style="${hs}">📈 نسبة التقدم</div>
    <div style="padding:14px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
      <div style="position:relative;flex-shrink:0;"><svg width="110" height="110" viewBox="0 0 130 130">${svgProg}</svg></div>
      <div style="flex:1;min-width:80px;">${legendProg}</div>
    </div>
  </div>
  <div style="${cs}"><div style="${hs}">💰 الاستهلاك المالي</div>
    <div style="padding:14px 16px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="font-size:0.8rem;color:var(--text-muted);">الغلاف</span><span style="font-size:0.85rem;font-weight:900;color:var(--gold-light);">${fmtM(totalBudget)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:0.8rem;color:var(--text-muted);">المستهلك</span><span style="font-size:0.85rem;font-weight:900;color:#4ade80;">${fmtM(totalConsumed)}</span></div>
      <div style="background:rgba(255,255,255,0.06);border-radius:99px;height:8px;overflow:hidden;margin-bottom:8px;"><div style="width:${consumePct}%;height:8px;border-radius:99px;background:linear-gradient(90deg,var(--green),#4ade80);"></div></div>
      <div style="text-align:center;font-size:1.5rem;font-weight:900;color:var(--gold-light);">${consumePct}%</div>
      <div style="text-align:center;font-size:0.7rem;color:var(--text-muted);">نسبة الاستهلاك</div>
    </div>
  </div>`;
}

function buildProjTableHTML(ops){
  if(!ops.length) return`<div style="text-align:center;padding:50px;color:var(--text-muted);">لا توجد عمليات بهذا التصفية</div>`;
  const muniName=id=>MUNICIPALITIES.find(m=>m.id===id)?.name||id||'—';
  return `<div style="overflow-x:auto;">
  <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
    <thead><tr style="background:rgba(201,168,76,0.08);border-bottom:2px solid rgba(201,168,76,0.2);">
      <th style="padding:12px 14px;text-align:right;color:var(--gold-light);font-weight:700;">#</th>
      <th style="padding:12px 14px;text-align:right;color:var(--gold-light);font-weight:700;">العملية</th>
      <th style="padding:12px 14px;text-align:right;color:var(--gold-light);font-weight:700;white-space:nowrap;">البلدية</th>
      <th style="padding:12px 14px;text-align:center;color:var(--gold-light);font-weight:700;white-space:nowrap;">الحالة</th>
      <th style="padding:12px 14px;text-align:center;color:var(--gold-light);font-weight:700;white-space:nowrap;">الإنجاز</th>
      <th style="padding:12px 14px;text-align:center;color:var(--gold-light);font-weight:700;white-space:nowrap;">الغلاف (دج)</th>
      <th style="padding:12px 14px;text-align:center;color:var(--gold-light);font-weight:700;white-space:nowrap;">الاستهلاك%</th>
    </tr></thead>
    <tbody>${ops.map((o,i)=>{
      const sc=STATUS_COLORS[o.status]||'#888',si=STATUS_ICONS[o.status]||'•';
      const prog=+o.progress||0,bgt=+o.amount||0;
      const cons=(o.situations||[]).reduce((s,sit)=>s+(+sit.amount||0),0);
      const cPct=bgt?Math.round(cons/bgt*100):0;
      const cCol=cPct>=75?'#10b981':cPct>=50?'#60a5fa':cPct>=25?'#f59e0b':'#ef4444';
      return `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);" onmouseover="this.style.background='rgba(201,168,76,0.04)'" onmouseout="this.style.background='transparent'">
        <td style="padding:10px 14px;color:var(--text-muted);">${i+1}</td>
        <td style="padding:10px 14px;color:var(--text-light);max-width:280px;">${o.name||'—'}</td>
        <td style="padding:10px 14px;color:var(--text-light);white-space:nowrap;">${muniName(o.municipality_id)}</td>
        <td style="padding:10px 14px;text-align:center;"><span style="background:${sc}22;border:1px solid ${sc}44;color:${sc};font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap;">${si} ${o.status||'—'}</span></td>
        <td style="padding:10px 14px;text-align:center;"><div style="display:flex;align-items:center;gap:6px;justify-content:center;"><div style="width:50px;background:rgba(255,255,255,0.07);border-radius:99px;height:5px;overflow:hidden;"><div style="width:${prog}%;height:5px;border-radius:99px;background:#a78bfa;"></div></div><span style="color:#a78bfa;font-weight:700;font-size:0.78rem;">${prog}%</span></div></td>
        <td style="padding:10px 14px;text-align:center;color:var(--gold-light);white-space:nowrap;">${fmtM(bgt)}</td>
        <td style="padding:10px 14px;text-align:center;"><span style="color:${cCol};font-weight:700;">${cPct}%</span></td>
      </tr>`;
    }).join('')}
    </tbody>
  </table></div>`;
}


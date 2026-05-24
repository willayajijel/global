/* ══ SVG Charts ══ */
function buildDonutSVG(items,size=130,innerR=38){
  const cx=size/2,cy=size/2,r=size/2-6;
  const total=items.reduce((a,i)=>a+i.v,0);if(!total)return`<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.05)"/>`;
  let offset=0,paths='';
  items.filter(i=>i.v>0).forEach(item=>{
    const pct=item.v/total,angle=pct*2*Math.PI;
    const startA=offset-Math.PI/2,endA=startA+angle;
    const x1=cx+r*Math.cos(startA),y1=cy+r*Math.sin(startA);
    const x2=cx+r*Math.cos(endA),y2=cy+r*Math.sin(endA);
    const xi1=cx+innerR*Math.cos(startA),yi1=cy+innerR*Math.sin(startA);
    const xi2=cx+innerR*Math.cos(endA),yi2=cy+innerR*Math.sin(endA);
    const large=angle>Math.PI?1:0;
    paths+=`<path d="M${xi1} ${yi1} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} L${xi2} ${yi2} A${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1}Z" fill="${item.c}" opacity="0.92"/>`;
    if(pct>0.07){const midA=(startA+endA)/2,lx=cx+(r+innerR)/2*Math.cos(midA),ly=cy+(r+innerR)/2*Math.sin(midA);paths+=`<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="800" fill="#fff">${Math.round(pct*100)}%</text>`;}
    offset+=angle;
  });
  return paths+`<circle cx="${cx}" cy="${cy}" r="${innerR}" fill="rgba(13,21,32,0.9)"/>`;
}

/* ══ Ops List Modal ══ */
function openOpsListByFilter(filter){
  if(!_allOps.length){alert('جاري تحميل البيانات، يرجى الانتظار…');return;}
  let ops=[..._allOps];
  let title='📋 كل العمليات';
  if(filter.status){ops=ops.filter(o=>o.status===filter.status);title=`📋 العمليات — ${filter.status}`;}
  if(filter.prog){const pk=filter.prog.toUpperCase();ops=ops.filter(o=>PROG_IDS_MAP[o.program_id]===pk);title=`📋 عمليات ${pk}`;}
  if(filter.muni){ops=ops.filter(o=>o.municipality_id===filter.muni);}
  document.getElementById('ops-list-title').textContent=title;
  document.getElementById('ops-list-count').textContent=ops.length+' عملية';
  document.getElementById('ops-list-body').innerHTML=buildOpsListTable(ops);
  document.getElementById('ops-list-modal').classList.add('open');
}
function closeOpsModal(){
  document.getElementById('ops-list-modal').classList.remove('open');
}
function openOpsBySector(sectorId,sectorName,year){
  if(!_allOps.length){alert('جاري تحميل البيانات، يرجى الانتظار…');return;}
  const SECTOR_NAMES_MAP={1:'طرق',2:'بنية تحتية',3:'تهيئة حضرية',4:'الصحة',5:'التربية',6:'مرافق عمومية',7:'الشباب والرياضة',8:'مياه الشرب',9:'الكهرباء والغاز'};
  let ops=[..._allOps];
  // Filter by sector_id if present
  if(sectorId){
    ops=ops.filter(o=>+o.sector_id===+sectorId);
  } else if(sectorName){
    // fallback: match by name from sector lookup
    const matchId=Object.entries(SECTOR_NAMES_MAP).find(([,n])=>n===sectorName)?.[0];
    if(matchId) ops=ops.filter(o=>+o.sector_id===+matchId);
  }
  const title=`🏢 عمليات قطاع — ${sectorName||'غير محدد'}`;
  document.getElementById('ops-list-title').textContent=title;
  document.getElementById('ops-list-count').textContent=ops.length+' عملية';
  document.getElementById('ops-list-body').innerHTML=buildOpsListTable(ops);
  document.getElementById('ops-list-modal').classList.add('open');
}
document.getElementById('ops-list-modal').addEventListener('click',function(e){if(e.target===this)closeOpsModal();});

function buildOpsListTable(ops){
  if(!ops.length) return`<div style="text-align:center;padding:40px;color:var(--text-muted);">لا توجد عمليات بهذا التصفية</div>`;
  const muniName=id=>MUNICIPALITIES.find(m=>m.id===id)?.name||id||'—';
  const progName=id=>PROG_IDS_MAP[id]||'—';
  return `<div style="overflow-x:auto;">
  <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
    <thead><tr style="background:rgba(201,168,76,0.08);border-bottom:2px solid rgba(201,168,76,0.2);">
      <th style="padding:10px 12px;text-align:right;color:var(--gold-light);font-weight:700;">#</th>
      <th style="padding:10px 12px;text-align:right;color:var(--gold-light);font-weight:700;">العملية</th>
      <th style="padding:10px 12px;text-align:right;color:var(--gold-light);font-weight:700;">البلدية</th>
      <th style="padding:10px 12px;text-align:center;color:var(--gold-light);font-weight:700;">البرنامج</th>
      <th style="padding:10px 12px;text-align:center;color:var(--gold-light);font-weight:700;">الحالة</th>
      <th style="padding:10px 12px;text-align:center;color:var(--gold-light);font-weight:700;">الإنجاز</th>
      <th style="padding:10px 12px;text-align:center;color:var(--gold-light);font-weight:700;">الغلاف (دج)</th>
    </tr></thead>
    <tbody>${ops.map((o,i)=>{
      const sc=STATUS_COLORS[o.status]||'#888',si=STATUS_ICONS[o.status]||'•';
      const prog=+o.progress||0,bgt=+o.amount||0;
      const pn=progName(o.program_id);
      const pc=PROG_CFG[pn]||{textCol:'#ccc',color:'#888'};
      return `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);" onmouseover="this.style.background='rgba(201,168,76,0.04)'" onmouseout="this.style.background='transparent'">
        <td style="padding:9px 12px;color:var(--text-muted);">${i+1}</td>
        <td style="padding:9px 12px;color:var(--text-light);max-width:250px;">${o.name||'—'}</td>
        <td style="padding:9px 12px;color:var(--text-light);white-space:nowrap;">${muniName(o.municipality_id)}</td>
        <td style="padding:9px 12px;text-align:center;"><span style="color:${pc.textCol};font-weight:700;font-size:0.75rem;">${pn}</span></td>
        <td style="padding:9px 12px;text-align:center;"><span style="background:${sc}22;border:1px solid ${sc}44;color:${sc};font-size:0.68rem;font-weight:700;padding:2px 9px;border-radius:20px;white-space:nowrap;">${si} ${o.status||'—'}</span></td>
        <td style="padding:9px 12px;text-align:center;"><div style="display:flex;align-items:center;gap:5px;justify-content:center;"><div style="width:45px;background:rgba(255,255,255,0.07);border-radius:99px;height:5px;overflow:hidden;"><div style="width:${prog}%;height:5px;border-radius:99px;background:#a78bfa;"></div></div><span style="color:#a78bfa;font-weight:700;font-size:0.75rem;">${prog}%</span></div></td>
        <td style="padding:9px 12px;text-align:center;color:var(--gold-light);white-space:nowrap;">${fmtM(bgt)}</td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

/* ══ Dashboard Year Tabs ══ */
function initYearTabs(){
  const tabsEl=document.getElementById('year-tabs');
  const panelsEl=document.getElementById('year-panels');
  const years=Object.keys(YEARS_DATA);
  tabsEl.innerHTML=years.map((y,i)=>`<button class="year-tab${i===years.length-1?' active':''}" onclick="switchYear('${y}',this)">${y}${y==='2026'?' 🔴':''}</button>`).join('');
  panelsEl.innerHTML=years.map((y,i)=>buildYearPanel(y,YEARS_DATA[y],i===years.length-1)).join('');
}
function switchYear(year,btn){
  document.querySelectorAll('#year-tabs .year-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  document.querySelectorAll('.year-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+year).classList.add('active');
  if(year==='2026'&&YEARS_DATA['2026'].fromFirebase) renderYearPanel2026();
}
function renderYearPanel2026(){
  const d=YEARS_DATA['2026'];
  const panel=document.getElementById('panel-2026');if(!panel) return;
  panel.innerHTML=buildYearPanelInner('2026',d);
}
function buildYearPanel(year,d,isActive){
  return `<div class="year-panel${isActive?' active':''}" id="panel-${year}">${buildYearPanelInner(year,d)}</div>`;
}
function buildYearPanelInner(year,d){
  const isFirebase=(d.fromFirebase&&d.ops_total===null);
  if(isFirebase) return`<div style="text-align:center;padding:60px;color:var(--text-muted);"><div style="width:44px;height:44px;border:4px solid rgba(201,168,76,0.2);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;"></div><p>جاري تحميل البيانات المباشرة من منصات البلديات…</p></div>`;

  const kpis=[
    {icon:'🏗️',num:d.ops_total??'—',lbl:'إجمالي العمليات',bg:'linear-gradient(135deg,#006233,#007a3d)',action:`openOpsListByFilter({})`},
    {icon:'⚙️',num:d.ops_ongoing??'—',lbl:'عمليات جارية',bg:'linear-gradient(135deg,#1e5fa8,#2563eb)',action:`openOpsListByFilter({status:'جارية'})`},
    {icon:'✅',num:d.ops_done??'—',lbl:'عمليات منجزة',bg:'linear-gradient(135deg,#0f766e,#14b8a6)',action:`openOpsListByFilter({status:'منهية'})`},
    {icon:'⏸️',num:d.ops_stopped??'—',lbl:'عمليات متوقفة',bg:'linear-gradient(135deg,#d97706,#f59e0b)',action:`openOpsListByFilter({status:'متوقفة'})`},
    {icon:'📈',num:d.progress!=null?d.progress+'%':'—',lbl:'نسبة الإنجاز',bg:'linear-gradient(135deg,#7c3aed,#8b5cf6)',action:``},
  ];

  const statusList=`<div class="dash-box">
    <div class="dash-box-header"><div class="header-dot" style="background:#60a5fa;"></div><h3>🗂️ تفصيل حسب الحالة <span style="font-size:0.65rem;color:var(--text-muted);">(اضغط للعرض)</span></h3><span class="count-pill">${d.ops_total??'—'} إجمالي</span></div>
    <div class="dash-box-body">
      ${[['غير منطلقة',d.ops_not_started,'#94a3b8','🔲'],['جارية',d.ops_ongoing,'#00c85a','⚡'],['متوقفة',d.ops_stopped,'#ef4444','🔴'],['منهية',d.ops_done,'#10b981','✅'],['مغلقة',d.ops_closed,'#6366f1','🔒']].map(([lbl,val,col,ic])=>{
        const v=val??0,tot=d.ops_total||1,pct=Math.round(v/tot*100);
        const clickable=year==='2026'&&_allOps.length?`onclick="openOpsListByFilter({status:'${lbl}'})"`:'' ;
        return `<div class="status-list-item" ${clickable} title="اضغط لعرض عمليات: ${lbl}">
          <div class="sli-icon">${ic}</div><div class="sli-label">${lbl}</div>
          <div class="sli-bar-wrap"><div class="sli-bar-fill" style="width:${pct}%;background:${col};"></div></div>
          <div class="sli-count" style="color:${col};">${v}</div><div class="sli-pct">${pct}%</div>
          ${year==='2026'&&_allOps.length?'<span style="font-size:0.65rem;color:var(--gold);margin-right:4px;">↗</span>':''}
        </div>`;
      }).join('')}
    </div>
  </div>`;

  const budget=d.budget_total||0,consumed=d.budget_consumed||0,remaining=budget-consumed,pct=budget?Math.round(consumed/budget*100):0;
  const finBox=`<div class="dash-box">
    <div class="dash-box-header"><div class="header-dot" style="background:var(--gold);"></div><h3>💰 الوضعية المالية</h3><span class="count-pill">${fmtM(budget)}</span></div>
    <div class="dash-box-body">
      <div class="fin-item"><div class="fin-item-header"><span class="fin-item-label">الغلاف الإجمالي</span><span class="fin-item-val">${fmtM(budget)}</span></div></div>
      <div class="fin-item"><div class="fin-item-header"><span class="fin-item-label">المستهلك</span><span class="fin-item-val" style="color:#4ade80;">${fmtM(consumed)}</span></div><div class="fin-item-bar"><div class="fin-item-fill" style="width:${pct}%;background:linear-gradient(90deg,var(--green),var(--green-light));"></div></div></div>
      <div class="fin-item"><div class="fin-item-header"><span class="fin-item-label">المتبقي</span><span class="fin-item-val" style="color:#f87171;">${fmtM(remaining)}</span></div><div class="fin-item-bar"><div class="fin-item-fill" style="width:${100-pct}%;background:linear-gradient(90deg,var(--red),#f87171);"></div></div></div>
      <div class="fin-summary-grid"><div class="fin-summary-box"><div class="fsb-v" style="color:#4ade80;">${d.progress??0}%</div><div class="fsb-l">تقدم الأشغال</div></div><div class="fin-summary-box"><div class="fsb-v" style="color:var(--gold-light);">${pct}%</div><div class="fsb-l">استهلاك الاعتمادات</div></div></div>
    </div>
  </div>`;

  const secChips=(d.sectors&&d.sectors.length?d.sectors:[]).map((s,i)=>{
    const colors=['#006233','#c9a84c','#0891b2','#7c3aed','#d97706','#ef4444','#10b981'];
    const c=colors[i%colors.length];
    const clickSec=(year==='2026'&&_allOps.length)?`onclick="openOpsBySector(${s.id||0},'${s.n}','${year}')" title="اضغط لعرض عمليات قطاع ${s.n}"`:'';
    return `<div class="sector-chip" style="border-right-color:${c};" ${clickSec}>
      <span>${s.e||'📌'}</span><span style="flex:1;">${s.n}</span>
      <span class="sc-num" style="background:${c}22;color:${c};">${s.c}</span>
      ${year==='2026'&&_allOps.length?'<span style="font-size:0.6rem;color:var(--gold);margin-right:2px;">↗</span>':''}
    </div>`;
  }).join('');
  const secBox=`<div class="dash-box">
    <div class="dash-box-header"><div class="header-dot" style="background:#a78bfa;"></div><h3>🏢 توزيع القطاعات</h3><span class="count-pill">${(d.sectors||[]).length} قطاع</span></div>
    <div class="dash-box-body"><div class="sector-chip-list">${secChips||'<div style="color:var(--text-muted);font-size:0.85rem;grid-column:1/-1;text-align:center;padding:20px;">لا توجد بيانات</div>'}</div></div>
  </div>`;

  // Charts with clickable status donut for 2026
  const chartsRow=`<div class="charts-row">
    <div class="chart-box"><div class="chart-box-header"><span>📊</span><h4>توزيع حسب الحالة${year==='2026'&&_allOps.length?' <span style="font-size:0.6rem;color:var(--gold);">(اضغط للتفاصيل)</span>':''}</h4></div>${statusChartHTML(d,year)}</div>
    <div class="chart-box"><div class="chart-box-header"><span>💰</span><h4>الوضعية المالية</h4></div>${financeChartHTML(d)}</div>
    <div class="chart-box"><div class="chart-box-header"><span>🏗️</span><h4>توزيع حسب القطاعات${year==='2026'&&_allOps.length?' <span style="font-size:0.6rem;color:var(--gold);">(اضغط للتفاصيل)</span>':''}</h4></div>${sectorChartHTML(d,year)}</div>
  </div>`;

  // Programs row — clickable in 2026
  const progsRow=`<div style="margin-bottom:22px;">
    <div class="section-title" style="margin-bottom:18px;"><div class="dot"></div><h2 style="font-size:1.15rem;">🏛️ مصادر التمويل والبرامج — ${year}</h2><div class="line"></div></div>
    <div class="programs-row">
      ${d.programs.map(p=>{
        const textCol=p.color==='#c9a84c'?'var(--gold-light)':p.color==='#d21034'?'#f87171':p.color==='#0891b2'?'#38bdf8':'#4ade80';
        const fullName=PROGRAMS_FULL[p.abbr]||p.abbr;
        const pk=p.abbr.toLowerCase();
        const clickAction=year==='2026'&&_allOps.length?`onclick="showSection('projects');setTimeout(()=>switchProjTab('${pk}'),100);"`:'' ;
        return `<div class="prog-card" style="background:${p.bg};border-color:${p.border};color:#fff;" ${clickAction} title="${year==='2026'?'اضغط لعرض العمليات':''}">
          <div class="prog-abbr" style="color:${textCol}">${p.abbr}</div>
          <div class="prog-full">${fullName}</div>
          <span class="prog-count">${p.count??'—'}</span>
          <div class="prog-lbl">عملية مسجلة${year==='2026'&&_allOps.length?' ↗ اضغط':''}</div>
          <div class="prog-deco"></div>
        </div>`;
      }).join('')}
    </div>
  </div>`;

  return `<div class="kpi-row">${kpis.map(k=>`<div class="kpi-card" style="background:${k.bg};" ${k.action?`onclick="${k.action}"`:''}  title="${k.action?'اضغط لعرض التفاصيل':''}">
    <span class="kpi-icon">${k.icon}</span><span class="kpi-num">${k.num}</span><span class="kpi-lbl">${k.lbl}${k.action?' ↗':''}</span><div class="kpi-deco"></div>
  </div>`).join('')}</div>
  <div class="ops-details-grid">${statusList}${finBox}${secBox}</div>${chartsRow}${progsRow}`;
}

function statusChartHTML(d,year){
  const items=[{l:'غير منطلقة',v:d.ops_not_started||0,c:'#94a3b8',i:'🔲'},{l:'جارية',v:d.ops_ongoing||0,c:'#006233',i:'⚡'},{l:'متوقفة',v:d.ops_stopped||0,c:'#ef4444',i:'🔴'},{l:'منهية',v:d.ops_done||0,c:'#10b981',i:'✅'},{l:'مغلقة',v:d.ops_closed||0,c:'#6366f1',i:'🔒'}];
  const total=d.ops_total||0;
  const svg=buildDonutSVG(items.map(i=>({v:i.v,c:i.c})));
  const canClick=year==='2026'&&_allOps.length;
  const legend=items.map(i=>`<div style="display:flex;align-items:center;gap:7px;margin-bottom:6px;${canClick?'cursor:pointer;':''}padding:4px;border-radius:6px;transition:background 0.15s;" ${canClick?`onclick="openOpsListByFilter({status:'${i.l}'})" onmouseover="this.style.background='rgba(201,168,76,0.08)'" onmouseout="this.style.background='transparent'"`:''}>
    <span style="width:10px;height:10px;border-radius:3px;background:${i.c};flex-shrink:0;display:inline-block;"></span>
    <span style="font-size:0.8rem;color:var(--text-light);flex:1;">${i.i} ${i.l}</span>
    <span style="font-size:0.88rem;font-weight:900;color:${i.c};">${i.v}</span>
    ${canClick?'<span style="font-size:0.6rem;color:var(--gold);">↗</span>':''}
  </div>`).join('');
  return `<div class="chart-box-body" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;">
    <div style="flex-shrink:0;position:relative;">
      <svg width="130" height="130" viewBox="0 0 130 130">${svg}</svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div style="font-size:1.4rem;font-weight:900;color:#fff;">${total}</div>
        <div style="font-size:0.6rem;color:var(--text-muted);">إجمالي</div>
      </div>
    </div>
    <div style="flex:1;min-width:110px;">${legend}</div>
  </div>`;
}

function financeChartHTML(d){
  const budget=d.budget_total||0,consumed=d.budget_consumed||0,remaining=budget-consumed;
  const pct=budget?Math.round(consumed/budget*100):0;
  const svg=buildDonutSVG([{v:consumed,c:'#006233'},{v:remaining,c:'rgba(255,255,255,0.1)'}]);
  return `<div class="chart-box-body">
    <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:14px;">
      <div style="flex-shrink:0;position:relative;">
        <svg width="130" height="130" viewBox="0 0 130 130">${svg}</svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="font-size:1.4rem;font-weight:900;color:var(--gold-light);">${pct}%</div><div style="font-size:0.6rem;color:var(--text-muted);">استهلاك</div></div>
      </div>
      <div style="flex:1;">
        <div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:0.78rem;color:var(--text-muted);">الغلاف</span><span style="font-size:0.8rem;font-weight:900;color:var(--gold-light);">${fmtM(budget)}</span></div></div>
        <div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:0.78rem;color:var(--text-muted);">المستهلك</span><span style="font-size:0.8rem;font-weight:900;color:#4ade80;">${fmtM(consumed)}</span></div><div style="background:rgba(255,255,255,0.06);border-radius:99px;height:7px;overflow:hidden;"><div style="width:${pct}%;height:7px;border-radius:99px;background:linear-gradient(90deg,var(--green),var(--green-light));"></div></div></div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:0.78rem;color:var(--text-muted);">المتبقي</span><span style="font-size:0.8rem;font-weight:900;color:#f87171;">${fmtM(remaining)}</span></div></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <div style="background:rgba(0,98,51,0.1);border:1px solid rgba(0,98,51,0.2);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:1.3rem;font-weight:900;color:#4ade80;">${d.progress||0}%</div><div style="font-size:0.64rem;color:var(--text-muted);">تقدم الأشغال</div></div>
      <div style="background:rgba(201,168,76,0.07);border:1px solid rgba(201,168,76,0.18);border-radius:10px;padding:10px;text-align:center;"><div style="font-size:1.3rem;font-weight:900;color:var(--gold-light);">${pct}%</div><div style="font-size:0.64rem;color:var(--text-muted);">استهلاك الاعتمادات</div></div>
    </div>
  </div>`;
}

function sectorChartHTML(d,year){
  if(!d.sectors||!d.sectors.length) return`<div class="chart-box-body" style="text-align:center;padding:40px;color:var(--text-muted);">لا توجد بيانات</div>`;
  const total=d.sectors.reduce((a,s)=>a+s.c,0);
  const colors=['#006233','#c9a84c','#0891b2','#7c3aed','#d97706','#ef4444','#10b981','#f59e0b','#6366f1'];
  const items=d.sectors.map((s,i)=>({v:s.c,c:colors[i%colors.length],l:s.n,e:s.e,id:s.id||0}));
  const svg=buildDonutSVG(items.map(i=>({v:i.v,c:i.c})));
  const legend=items.slice(0,6).map(i=>{
    const secId=d.sectors.find(s=>s.n===i.l)?.id||0;
    const canClickSec=year==='2026'&&_allOps.length;
    return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;${canClickSec?'cursor:pointer;padding:3px 4px;border-radius:6px;transition:background 0.15s;':''}" ${canClickSec?`onclick="openOpsBySector(${secId},'${i.l}','${year}')" onmouseover="this.style.background='rgba(201,168,76,0.08)'" onmouseout="this.style.background='transparent'"`:''}>
      <span style="width:9px;height:9px;border-radius:2px;background:${i.c};flex-shrink:0;display:inline-block;"></span>
      <span style="font-size:0.76rem;color:var(--text-light);flex:1;">${i.e} ${i.l}</span>
      <span style="font-size:0.82rem;font-weight:900;color:${i.c};">${i.v}</span>
      ${canClickSec?'<span style="font-size:0.6rem;color:var(--gold);">↗</span>':''}
    </div>`;
  }).join('');
  return `<div class="chart-box-body" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;">
    <div style="flex-shrink:0;position:relative;"><svg width="130" height="130" viewBox="0 0 130 130">${svg}</svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="font-size:1.4rem;font-weight:900;color:#fff;">${total}</div><div style="font-size:0.6rem;color:var(--text-muted);">عملية</div></div></div>
    <div style="flex:1;min-width:100px;">${legend}</div>
  </div>`;
}


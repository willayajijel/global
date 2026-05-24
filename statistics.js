/* ══ Statistics ══ */
window._statRendered=false;

function statSelectYear(yr,btn){
  _statYear=yr;
  document.querySelectorAll('#stat-year-btns .stat-year-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderStatRanking();
}

function statSelectProg(prog,btn){
  _statProg=prog;
  document.querySelectorAll('#stat-prog-btns .stat-prog-btn').forEach(b=>{
    b.className='stat-prog-btn';
  });
  btn.className='stat-prog-btn active-'+prog;
  renderStatRanking();
}

function renderStatRanking(){
  const panel=document.getElementById('stat-ranking-panel');
  if(!panel) return;

  if(!_allOps.length){
    panel.innerHTML=`<div style="text-align:center;padding:60px;color:var(--text-muted);"><div style="width:44px;height:44px;border:4px solid rgba(201,168,76,0.2);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;"></div><p>⏳ جاري تحميل البيانات المباشرة…</p></div>`;
    return;
  }

  // Check if _allOps has year field — if yes, use it for any year; otherwise only 2026
  const hasYearField=_allOps.some(o=>o.year||o.annee||o.annee_programmation);
  if(_statYear==='2026'||hasYearField){
    renderRankingLive(_statProg,_statYear);
  } else {
    // No year field in data — for non-2026, show summarized static
    if(_statYear!=='2026') renderRankingStatic(_statYear,_statProg);
    else renderRankingLive(_statProg,'2026');
  }
}

function renderRankingLive(prog,year){
  year=year||'2026';
  const panel=document.getElementById('stat-ranking-panel');
  const progIds=getProgIds(prog);
  const label=getProgLabel(prog);
  const color=getProgColor(prog);

  // Filter ops by year if year field exists
  const hasYearField=_allOps.some(o=>o.year||o.annee||o.annee_programmation);
  const opsForYear=hasYearField?_allOps.filter(o=>{const y=o.year||o.annee||o.annee_programmation;return String(y)===String(year);}):_allOps;

  const rows=MUNICIPALITIES.map(m=>{
    const opsP=opsForYear.filter(o=>progIds.includes(o.program_id)&&o.municipality_id===m.id);
    const budget=opsP.reduce((a,o)=>a+(+o.amount||0),0);
    const consumed=opsP.reduce((a,o)=>a+(o.situations||[]).reduce((s,sit)=>s+(+sit.amount||0),0),0);
    const rate=budget?Math.round(consumed/budget*100):0;
    const avgProg=opsP.length?Math.round(opsP.reduce((a,o)=>a+(+o.progress||0),0)/opsP.length):0;
    return {muni:m,budget,consumed,rate,count:opsP.length,avgProg,ops:opsP};
  }).filter(r=>r.budget>0||r.count>0).sort((a,b)=>b.rate-a.rate);

  if(!rows.length){
    panel.innerHTML=`<div style="text-align:center;padding:60px;color:var(--text-muted);">لا توجد بيانات كافية للبرنامج المحدد في سنة ${year}</div>`;
    return;
  }
  panel.innerHTML=buildRankingTableHTML(rows,label,color,year,prog);
}

function renderRankingStatic(yr,prog){
  const panel=document.getElementById('stat-ranking-panel');
  const d=YEARS_DATA[yr];
  if(!d){panel.innerHTML=`<div style="text-align:center;padding:60px;color:var(--text-muted);">لا توجد بيانات لسنة ${yr}</div>`;return;}
  const label=getProgLabel(prog);
  const color=getProgColor(prog);
  // For static years, show summary by municipality without detailed ops
  const cnt=d.programs.find(p=>p.abbr===getProgAbbr(prog))?.count||0;
  const hasAgg=d.ops_total>0;
  const aggKpis=hasAgg?`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
    ${[['العمليات الإجمالية',d.ops_total,'#4ade80'],['الجارية',d.ops_ongoing,'#60a5fa'],['المنجزة',d.ops_done,'#10b981'],['نسبة الإنجاز',(d.progress||0)+'%','#a78bfa']].map(([l,v,c])=>`
      <div style="background:${c}12;border:1px solid ${c}28;border-radius:10px;padding:12px;text-align:center;">
        <div style="font-size:1.3rem;font-weight:900;color:${c};">${v??'—'}</div>
        <div style="font-size:0.65rem;color:var(--text-muted);">${l}</div>
      </div>`).join('')}
  </div>
  <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px;margin-bottom:16px;">
    <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px;"><span>الغلاف المالي الإجمالي</span><span style="color:var(--gold-light);font-weight:700;">${fmtM(d.budget_total)}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-muted);"><span>المستهلك (${d.consume_rate||0}%)</span><span style="color:#4ade80;font-weight:700;">${fmtM(d.budget_consumed)}</span></div>
  </div>` : '';
  panel.innerHTML=`<div style="background:rgba(14,20,34,0.97);border:1px solid var(--dark-border);border-radius:var(--radius);overflow:hidden;">
    <div style="background:linear-gradient(135deg,rgba(0,98,51,0.18),rgba(14,20,34,0.97));padding:16px 22px;border-bottom:1px solid var(--dark-border);display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      <div style="width:9px;height:9px;border-radius:50%;background:${color};"></div>
      <span style="font-size:0.95rem;font-weight:700;color:${color};">إحصائيات ولاية جيجل — ${label} — سنة ${yr}</span>
      <span style="margin-right:auto;background:rgba(255,255,255,0.07);border-radius:20px;padding:3px 12px;font-size:0.7rem;color:var(--text-muted);">${hasAgg?'مجموع كل البلديات':'بيانات إجمالية'}</span>
    </div>
    <div style="padding:22px 26px;">
      <p style="font-size:0.9rem;font-weight:700;color:var(--gold-light);margin-bottom:16px;">📊 ملخص ${label} — سنة ${yr}</p>
      ${aggKpis}
      <div style="text-align:center;padding:${hasAgg?'0':'20px 0'};">
        ${!hasAgg?`<div style="font-size:2.5rem;margin-bottom:12px;">📅</div>
        <p style="font-size:0.95rem;font-weight:700;color:var(--gold-light);">إجمالي عمليات ${label}: <strong style="color:${color};">${cnt} عملية</strong></p>
        <p style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">البيانات التفصيلية حسب البلدية متاحة من خلال منصاتها.</p>`:''}
        <button onclick="showSection('municipalities')" style="margin-top:16px;background:linear-gradient(135deg,var(--green),var(--green-light));border:none;color:#fff;padding:10px 24px;border-radius:10px;font-family:'Cairo',sans-serif;font-size:0.88rem;font-weight:700;cursor:pointer;">🏘️ تصفح منصات البلديات</button>
      </div>
    </div>
  </div>`;
}

function buildRankingTableHTML(rows,label,color,yr,prog){
  return `<div style="background:rgba(14,20,34,0.97);border:1px solid var(--dark-border);border-radius:var(--radius);overflow:hidden;">
    <div style="background:linear-gradient(135deg,rgba(0,98,51,0.18),rgba(14,20,34,0.97));padding:16px 22px;border-bottom:1px solid var(--dark-border);display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      <div style="width:9px;height:9px;border-radius:50%;background:${color};"></div>
      <span style="font-size:0.95rem;font-weight:700;color:${color};">ترتيب البلديات حسب الاستهلاك المالي — ${label} — ${yr}</span>
      <span style="margin-right:auto;background:rgba(255,255,255,0.07);border-radius:20px;padding:3px 12px;font-size:0.7rem;color:var(--text-muted);">${rows.length} بلدية</span>
    </div>
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.83rem;">
      <thead><tr style="background:rgba(201,168,76,0.06);border-bottom:1px solid rgba(201,168,76,0.15);">
        <th style="padding:11px 14px;text-align:center;color:var(--gold-light);font-weight:700;width:50px;">الترتيب</th>
        <th style="padding:11px 14px;text-align:right;color:var(--gold-light);font-weight:700;">البلدية</th>
        <th style="padding:11px 14px;text-align:center;color:var(--gold-light);font-weight:700;">العمليات</th>
        <th style="padding:11px 14px;text-align:center;color:var(--gold-light);font-weight:700;">الغلاف</th>
        <th style="padding:11px 14px;text-align:center;color:var(--gold-light);font-weight:700;">المستهلك</th>
        <th style="padding:11px 14px;text-align:center;color:var(--gold-light);font-weight:700;">متوسط الإنجاز</th>
        <th style="padding:11px 14px;text-align:center;color:var(--gold-light);font-weight:700;min-width:160px;">نسبة الاستهلاك</th>
      </tr></thead>
      <tbody>
      ${rows.map((r,i)=>{
        const medal=i<3?`<span style="font-size:1.1rem;">${['🥇','🥈','🥉'][i]}</span>`:`<span style="color:var(--text-muted);font-weight:700;">${i+1}</span>`;
        const barC=r.rate>=75?'#10b981':r.rate>=50?'#60a5fa':r.rate>=25?'#f59e0b':'#ef4444';
        return `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);" onmouseover="this.style.background='rgba(201,168,76,0.03)'" onmouseout="this.style.background='transparent'">
          <td style="padding:11px 14px;text-align:center;">${medal}</td>
          <td style="padding:11px 14px;color:var(--text-light);font-weight:600;">
            ${r.muni.name}
            ${r.muni.hasData&&r.muni.url?`<a href="${r.muni.url}" target="_blank" style="margin-right:6px;font-size:0.65rem;color:#60a5fa;text-decoration:none;">🌐</a>`:''}
            ${r.count>0?`<span onclick="openOpsListByFilter({prog:'${getProgAbbr(prog)}',muni:'${r.muni.id}'})" style="margin-right:4px;font-size:0.65rem;color:var(--gold);cursor:pointer;" title="عرض عمليات هذه البلدية">📋</span>`:''}
          </td>
          <td style="padding:11px 14px;text-align:center;color:${color};font-weight:700;">${r.count}</td>
          <td style="padding:11px 14px;text-align:center;color:var(--gold-light);white-space:nowrap;">${fmtM(r.budget)}</td>
          <td style="padding:11px 14px;text-align:center;color:#4ade80;white-space:nowrap;">${fmtM(r.consumed)}</td>
          <td style="padding:11px 14px;text-align:center;color:#a78bfa;font-weight:700;">${r.avgProg}%</td>
          <td style="padding:11px 14px;"><div style="display:flex;align-items:center;gap:8px;"><div style="flex:1;background:rgba(255,255,255,0.07);border-radius:99px;height:8px;overflow:hidden;"><div style="width:${r.rate}%;height:8px;border-radius:99px;background:${barC};"></div></div><span style="color:${barC};font-weight:900;font-size:0.9rem;min-width:36px;text-align:left;">${r.rate}%</span></div></td>
        </tr>`;
      }).join('')}
      </tbody>
    </table></div>
  </div>`;
}

function getProgIds(prog){
  if(prog==='adsec') return[1];
  if(prog==='csgcl') return[2];
  if(prog==='bw') return[3];
  if(prog==='fs') return[5];
  if(prog==='both') return[1,2,3,5];
  return[];
}
function getProgLabel(prog){
  if(prog==='adsec') return'ADSEC';
  if(prog==='csgcl') return'CSGCL';
  if(prog==='bw') return'BW (ميزانية الولاية)';
  if(prog==='fs') return'FS (أموال خاصة)';
  if(prog==='both') return'جميع البرامج';
  return prog;
}
function getProgAbbr(prog){
  if(prog==='adsec') return'ADSEC';
  if(prog==='csgcl') return'CSGCL';
  if(prog==='bw') return'BW';
  if(prog==='fs') return'FS';
  return'ALL';
}
function getProgColor(prog){
  if(prog==='adsec') return'#4ade80';
  if(prog==='csgcl') return'var(--gold-light)';
  if(prog==='bw') return'#38bdf8';
  if(prog==='fs') return'#f87171';
  if(prog==='both') return'#a78bfa';
  return'#fff';
}


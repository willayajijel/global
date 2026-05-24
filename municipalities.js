/* ══ Municipalities Grid ══ */
let currentDairaFilter='all';
function initMuniGrid(){
  const filterEl=document.getElementById('daira-filter');
  DAIRAS.forEach(d=>{const btn=document.createElement('button');btn.className='daira-btn';btn.textContent=d.name;btn.onclick=function(){filterByDaira(d.id,this);};filterEl.appendChild(btn);});
  renderMuniGrid(MUNICIPALITIES);
}
function renderMuniGrid(list){
  document.getElementById('muni-grid').innerHTML=list.map(m=>`
    <div class="muni-card${m.hasData?' has-data':''}" onclick="openMuni('${m.id}')">
      <div class="muni-card-top"></div>
      <div class="muni-card-body">
        <div class="muni-name">${m.name}</div>
        <div class="muni-daira">📍 دائرة ${DAIRAS.find(d=>d.id===m.daira)?.name||''}</div>
        ${m.hasData?`<div style="margin-top:8px;font-size:0.7rem;color:#4ade80;font-weight:600;">🌐 منصة متاحة عبر الإنترنت</div>`:''}
      </div>
      <div class="muni-card-footer">
        <span style="font-size:0.76rem;color:var(--text-muted);">عمليات البلدية</span>
        <span class="muni-data-badge">${m.hasData?'✓ بيانات متاحة':'قريباً'}</span>
      </div>
      <div class="muni-arrow">↗</div>
    </div>`).join('');
  document.getElementById('muni-count-badge').textContent=list.length+' بلدية';
  if(window._muniRankMap) setTimeout(()=>applyMuniPerformanceColors(_allOps),50);
}
function filterMunis(){
  const q=document.getElementById('muni-search-input').value.trim();
  let list=MUNICIPALITIES;
  if(currentDairaFilter!=='all') list=list.filter(m=>m.daira===currentDairaFilter);
  if(q) list=list.filter(m=>m.name.includes(q));
  renderMuniGrid(list);
}
function filterByDaira(dairaId,btn){
  currentDairaFilter=dairaId;
  document.querySelectorAll('.daira-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');filterMunis();
}
function filterByDairaNav(dairaId){
  showSection('municipalities');
  setTimeout(()=>{currentDairaFilter=dairaId;filterMunis();},100);
}

/* ══ Modal ══ */
function openMuni(id){
  const m=MUNICIPALITIES.find(x=>x.id===id);if(!m) return;
  document.getElementById('modal-title').textContent='بلدية '+m.name;
  const liveStats=document.getElementById('modal-live-stats');
  const body=document.getElementById('modal-body');
  if(m.hasData&&m.url){
    liveStats.style.display='flex';
    body.innerHTML=`<div class="emir-platform-container">
      <div class="emir-loading" id="emir-loading">
        <div class="spin"></div>
        <p style="color:var(--text-muted);">جاري تحميل منصة بلدية ${m.name}…</p>
        <a href="${m.url}" target="_blank" style="color:var(--gold-light);font-size:0.85rem;margin-top:6px;">🔗 فتح في نافذة جديدة ↗</a>
      </div>
      <iframe id="emir-iframe" src="${m.url}" style="width:100%;flex:1;min-height:calc(100vh - 80px);border:none;display:none;" allowfullscreen sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
    </div>`;
    const iframe=document.getElementById('emir-iframe');
    iframe.onload=()=>{document.getElementById('emir-loading').style.display='none';iframe.style.display='block';};
    // Live stats from ops
    const muniOps=_allOps.filter(o=>o.municipality_id===m.id);
    if(muniOps.length){
      document.getElementById('mls-total').textContent=muniOps.length;
      document.getElementById('mls-ongoing').textContent=muniOps.filter(o=>o.status==='جارية').length;
      document.getElementById('mls-progress').textContent=(muniOps.length?Math.round(muniOps.reduce((a,o)=>a+(+o.progress||0),0)/muniOps.length):0)+'%';
    } else {
      const d=YEARS_DATA['2026'];
      if(d.ops_total!=null){
        document.getElementById('mls-total').textContent=d.ops_total;
        document.getElementById('mls-ongoing').textContent=d.ops_ongoing;
        document.getElementById('mls-progress').textContent=(d.progress||0)+'%';
      }
    }
  }else{
    liveStats.style.display='none';
    body.innerHTML=`<div class="no-data-state">
      <div class="nd-icon">🏗️</div>
      <h3>بلدية ${m.name}</h3>
      <p>منصة متابعة المشاريع التنموية لبلدية <strong style="color:var(--gold-light)">${m.name}</strong><br>قيد الإعداد والتطوير حالياً.</p>
      <span class="coming-badge">⏳ في انتظار إنجاز منصة البلدية</span>
    </div>`;
  }
  document.getElementById('muni-modal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeMuniModal(){
  document.getElementById('muni-modal').classList.remove('open');
  document.getElementById('modal-body').innerHTML='';
  document.getElementById('modal-live-stats').style.display='none';
  document.body.style.overflow='';
}
document.getElementById('muni-modal').addEventListener('click',function(e){if(e.target===this)closeMuniModal();});


/* ══ Firebase — collection names per municipality ══ */
const MUNI_YEAR_COLLECTIONS={
  // الأمير عبد القادر — collections خاصة بدون prefix
  'emir':{
    2022:'operations_2022',2023:'operations_2023',2024:'operations_2024',
    2025:'operations_2025',2026:'operations'
  },
  // باقي البلديات — prefix + _operations_ + سنة
  'iragn':{
    2022:'Eraguene_operations_2022',2023:'Eraguene_operations_2023',
    2024:'Eraguene_operations_2024',2025:'Eraguene_operations_2025',2026:'Eraguene_operations_2026'
  },
  'awana':{
    2022:'ElAouana_operations_2022',2023:'ElAouana_operations_2023',
    2024:'ElAouana_operations_2024',2025:'ElAouana_operations_2025',2026:'ElAouana_operations_2026'
  },
  'ziama':{
    2022:'ZiamaMansouriah_operations_2022',2023:'ZiamaMansouriah _operations_2023',
    2024:'ZiamaMansouriah _operations_2024',2025:'ZiamaMansouriah_operations_2025',2026:'ZiamaMansouriah_operations_2026'
  },
  'wajana':{
    2022:'oujana_operations_2022',2023:'oujana_operations_2023', 
    2024:'oujana_operations_2024',2025:'oujana_operations_2025',2026:'oujana_operations-2026'
  },
  'busif':{ 
    2022:'BoucifOuledAskeur_operations_2022',2023:'BoucifOuledAskeur_operations_2023',
    2024:'BoucifOuledAskeur_operations_2024',2025:'BoucifOuledAskeur_operations_2025',2026:'BoucifOuledAskeur_operations_2026'
  },
  'borjthr':{
    2022:'BordjThar_operations_2022',2023:'BordjThar_operations_2023',
    2024:'BordjThar_operations_2024',2025:'BordjThar_operations_2025',2026:'BordjThar_operations_2026'
  },

  // ── البلديات الجديدة — تمت الإضافة ──
  'jijel':{
    2022:'Jijel_operations_2022',2023:'Jijel_operations_2023',
    2024:'Jijel_operations_2024',2025:'Jijel_operations_2025',2026:'Jijel_operations_2026'
  },
  'taher':{
    2022:'Taher_operations_2022',2023:'Taher_operations_2023',
    2024:'Taher_operations_2024',2025:'Taher_operations_2025',2026:'Taher_operations_2026'
  },
  'shahna':{
    2022:'Chahna_operations_2022',2023:'Chahna_operations_2023',
    2024:'Chahna_operations_2024',2025:'Chahna_operations_2025',2026:'Chahna_operations_2026'
  },
  'chaqfa':{
    2022:'Chekfa_operations_2022',2023:'Chekfa_operations_2023',
    2024:'Chekfa_operations_2024',2025:'Chekfa_operations_2025',2026:'Chekfa_operations_2026'
  },
  'qanar':{
    2022:'ElKennarNouchfi_operations_2022',2023:'ElKennarNouchfi_operations_2023',
    2024:'ElKennarNouchfi_operations_2024',2025:'ElKennarNouchfi_operations_2025',2026:'ElKennarNouchfi_operations_2026'
  },
  'sidiazz':{
    2022:'SidiAbdelaziz_operations_2022',2023:'SidiAbdelaziz_operations_2023',
    2024:'SidiAbdelaziz_operations_2024',2025:'SidiAbdelaziz_operations_2025',2026:'SidiAbdelaziz_operations_2026'
  },
  'milia':{
    2022:'ElMilia_operations_2022',2023:'ElMilia_operations_2023',
    2024:'ElMilia_operations_2024',2025:'ElMilia_operations_2025',2026:'ElMilia_operations_2026'
  },
  'awlyhy':{
    2022:'OuledYahiaKhedrouche_operations_2022',2023:'OuledYahiaKhedrouche_operations_2023',
    2024:'OuledYahiaKhedrouche_operations_2024',2025:'OuledYahiaKhedrouche_operations_2025',2026:'OuledYahiaKhedrouche_operations_2026'
  },
  'ansar':{
    2022:'ElAncer_operations_2022',2023:'ElAncer_operations_2023',
    2024:'ElAncer_operations_2024',2025:'ElAncer_operations_2025',2026:'ElAncer_operations_2026'
  },
  'burawi':{
    2022:'BouraouiBelhadef_operations_2022',2023:'BouraouiBelhadef_operations_2023',
    2024:'BouraouiBelhadef_operations_2024',2025:'BouraouiBelhadef_operations_2025',2026:'BouraouiBelhadef_operations_2026'
  },
  'jmaa':{
    2022:'DjemaaBeniHabibi_operations_2022',2023:'DjemaaBeniHabibi_operations_2023',
    2024:'DjemaaBeniHabibi_operations_2024',2025:'DjemaaBeniHabibi_operations_2025',2026:'DjemaaBeniHabibi_operations_2026'
  },
  'khayri':{
    2022:'KheiriOuedAdjoul_operations_2022',2023:'KheiriOuedAdjoul_operations_2023',
    2024:'KheiriOuedAdjoul_operations_2024',2025:'KheiriOuedAdjoul_operations_2025',2026:'KheiriOuedAdjoul_operations_2026'
  },
  'salma':{
    2022:'SelmaBenziada_operations_2022',2023:'SelmaBenziada_operations_2023',
    2024:'SelmaBenziada_operations_2024',2025:'SelmaBenziada_operations_2025',2026:'SelmaBenziada_operations_2026'
  },
  'jimila':{
    2022:'Djimla_operations_2022',2023:'Djimla_operations_2023',
    2024:'Djimla_operations_2024',2025:'Djimla_operations_2025',2026:'Djimla_operations_2026'
  },
  'taksna':{
    2022:'Texenna_operations_2022',2023:'Texenna_operations_2023',
    2024:'Texenna_operations_2024',2025:'Texenna_operations_2025',2026:'Texenna_operations_2026'
  },
  'qawus':{
    2022:'Kaous_operations_2022',2023:'Kaous_operations_2023',
    2024:'Kaous_operations_2024',2025:'Kaous_operations_2025',2026:'Kaous_operations_2026'
  },
  'satara':{
    2022:'Settara_operations_2022',2023:'Settara_operations_2023',
    2024:'Settara_operations_2024',2025:'Settara_operations_2025',2026:'Settara_operations_2026'
  },
  'ghbala':{
    2022:'Ghebala_operations_2022',2023:'Ghebala_operations_2023',
    2024:'Ghebala_operations_2024',2025:'Ghebala_operations_2025',2026:'Ghebala_operations_2026'
  },
  'sidimaruf':{
    2022:'SidiMaarouf_operations_2022',2023:'SidiMaarouf_operations_2023',
    2024:'SidiMaarouf_operations_2024',2025:'SidiMaarouf_operations_2025',2026:'SidiMaarouf_operations_2026'
  },
  'awlrba':{
    2022:'OuledRabah_operations_2022',2023:'OuledRabah_operations_2023',
    2024:'OuledRabah_operations_2024',2025:'OuledRabah_operations_2025',2026:'OuledRabah_operations_2026'
  },
  'boudria':{
    2022:'BoudriaaBenYadjis_operations_2022',2023:'BoudriaaBenYadjis_operations_2023',
    2024:'BoudriaaBenYadjis_operations_2024',2025:'BoudriaaBenYadjis_operations_2025',2026:'BoudriaaBenYadjis_operations_2026'
  },
};

/* ══ Firebase — fetch ALL municipalities from all their collections ══ */
async function fetchAllMunicipalitiesData(){
  try{
    const{initializeApp,getApps}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const{getFirestore,collection,getDocs}=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const cfg={apiKey:"AIzaSyBrivdXRLE96ko1gIxDqZ_fNvYLYNAUj6M",authDomain:"technique-fd670.firebaseapp.com",projectId:"technique-fd670",storageBucket:"technique-fd670.firebasestorage.app",messagingSenderId:"440076781298",appId:"1:440076781298:web:1e0250c77d45ced6a2326b"};
    const app=getApps().length?getApps()[0]:initializeApp(cfg);
    const db=getFirestore(app);

    const YEARS=[2022,2023,2024,2025,2026];
    const allOps=[];

    // بناء قائمة كل collections المطلوب جلبها
    const fetchTasks=[];
    for(const [muniId,yearCols] of Object.entries(MUNI_YEAR_COLLECTIONS)){
      for(const yr of YEARS){
        const colName=yearCols[yr];
        if(!colName) continue;
        fetchTasks.push({muniId,yr,colName});
      }
    }

    // جلب كل collections بشكل متوازٍ
    const results=await Promise.allSettled(
      fetchTasks.map(async({muniId,yr,colName})=>{
        const snap=await getDocs(collection(db,colName));
        const docs=[];
        snap.forEach(d=>{
          const data=d.data();
          // إضافة حقول municipality_id و year إذا لم تكن موجودة
          if(!data.municipality_id) data.municipality_id=muniId;
          if(!data.year&&!data.annee&&!data.annee_programmation) data.year=yr;
          docs.push(data);
        });
        return docs;
      })
    );

    // تجميع كل النتائج
    results.forEach((res,i)=>{
      if(res.status==='fulfilled'){
        allOps.push(...res.value);
      }else{
        console.warn(`فشل جلب collection: ${fetchTasks[i].colName}`,res.reason);
      }
    });

    console.log(`✅ تم جلب ${allOps.length} عملية من ${fetchTasks.length} collection`);
    _allOps=allOps;
    processAggregatedData(allOps);
    return allOps;
  }catch(e){
    console.warn('Firebase error:',e);
    document.getElementById('banner-update-badge').textContent='⚠️ تعذّر التحديث';
    return [];
  }
}

/* ══ Aggregation helper — builds wilaya totals from all municipality ops ══ */
function aggregateOpsForYear(ops,yr){
  const SECTOR_NAMES={1:{n:'طرق',e:'🛣️'},2:{n:'بنية تحتية',e:'🏗️'},3:{n:'تهيئة حضرية',e:'🏘️'},4:{n:'الصحة',e:'🏥'},5:{n:'التربية',e:'🏫'},6:{n:'مرافق عمومية',e:'🏛️'},7:{n:'الشباب والرياضة',e:'⚽'},8:{n:'مياه الشرب',e:'💧'},9:{n:'الكهرباء والغاز',e:'⚡'}};
  // Filter by year field if it exists in the data
  const hasYearField=ops.some(o=>o.year||o.annee||o.annee_programmation);
  let filtered=ops;
  if(hasYearField){
    filtered=ops.filter(o=>{
      const y=o.year||o.annee||o.annee_programmation;
      return String(y)===String(yr);
    });
  }
  const total=filtered.length;
  const ongoing=filtered.filter(o=>o.status==='جارية').length;
  const done=filtered.filter(o=>o.status==='منهية').length;
  const stopped=filtered.filter(o=>o.status==='متوقفة').length;
  const notStarted=filtered.filter(o=>o.status==='غير منطلقة').length;
  const closed=filtered.filter(o=>o.status==='مغلقة').length;
  const budget=filtered.reduce((a,o)=>a+(+o.amount||0),0);
  const consumed=filtered.reduce((a,o)=>a+(o.situations||[]).reduce((s,sit)=>s+(+sit.amount||0),0),0);
  const avgProgress=total?Math.round(filtered.reduce((a,o)=>a+(+o.progress||0),0)/total):0;
  const consumeRate=budget?Math.round(consumed/budget*100):0;
  const progCounts={ADSEC:0,CSGCL:0,BW:0,BC:0,FS:0};
  filtered.forEach(o=>{const p=PROG_IDS_MAP[o.program_id];if(p)progCounts[p]++;});
  const secCounts={};
  filtered.forEach(o=>{if(o.sector_id)secCounts[o.sector_id]=(secCounts[o.sector_id]||0)+1;});
  const sectors=Object.entries(secCounts).filter(([,c])=>c>0).map(([id,c])=>({n:(SECTOR_NAMES[id]?.n||'أخرى'),e:(SECTOR_NAMES[id]?.e||'📌'),c,id:+id})).sort((a,b)=>b.c-a.c);
  return {total,ongoing,done,stopped,notStarted,closed,budget,consumed,avgProgress,consumeRate,progCounts,sectors,filteredOps:filtered};
}

function processAggregatedData(ops){
  // === Aggregate 2026 (live data) from ALL municipalities in Firebase ===
  const agg2026=aggregateOpsForYear(ops,'2026');
  YEARS_DATA['2026']={...YEARS_DATA['2026'],
    ops_total:agg2026.total,ops_ongoing:agg2026.ongoing,ops_done:agg2026.done,
    ops_stopped:agg2026.stopped,ops_not_started:agg2026.notStarted,ops_closed:agg2026.closed,
    budget_total:agg2026.budget,budget_consumed:agg2026.consumed,progress:agg2026.avgProgress,
    consume_rate:agg2026.consumeRate,sectors:agg2026.sectors,
    programs:YEARS_DATA['2026'].programs.map(p=>({...p,count:agg2026.progCounts[p.abbr]||0}))
  };

  // === If ops have year field → also aggregate previous years from real data ===
  const hasYearField=ops.some(o=>o.year||o.annee||o.annee_programmation);
  if(hasYearField){
    ['2022','2023','2024','2025'].forEach(yr=>{
      const aggYr=aggregateOpsForYear(ops,yr);
      if(aggYr.total>0){
        YEARS_DATA[yr]={...YEARS_DATA[yr],
          ops_total:aggYr.total,ops_ongoing:aggYr.ongoing,ops_done:aggYr.done,
          ops_stopped:aggYr.stopped,ops_not_started:aggYr.notStarted,ops_closed:aggYr.closed,
          budget_total:aggYr.budget,budget_consumed:aggYr.consumed,progress:aggYr.avgProgress,
          consume_rate:aggYr.consumeRate,sectors:aggYr.sectors,fromFirebase:true,
          programs:(YEARS_DATA[yr]?.programs||YEARS_DATA['2026'].programs).map(p=>({...p,count:aggYr.progCounts[p.abbr]||0}))
        };
      }
    });
  }

  if(_bannerYear==='2026') updateBannerStats(YEARS_DATA['2026'],'2026');
  renderHomeProgramsShowcase(YEARS_DATA['2026'],'2026');
  document.getElementById('wqk-ops').textContent=agg2026.total||'—';
  const cOps=document.getElementById('contact-ops-count');if(cOps)cOps.textContent=agg2026.total||'—';
  document.getElementById('wqk-prog').textContent=agg2026.avgProgress?agg2026.avgProgress+'%':'—';
  document.getElementById('wqk-fin').textContent=agg2026.consumeRate?agg2026.consumeRate+'%':'—';
  renderSidebarYear('2026');

  // Update dashboard panels that are already rendered
  ['2022','2023','2024','2025','2026'].forEach(yr=>{
    const p=document.getElementById('panel-'+yr);
    if(p&&p.classList.contains('active')){
      if(yr==='2026') renderYearPanel2026();
      else p.innerHTML=buildYearPanelInner(yr,YEARS_DATA[yr]);
    }
  });

  if(window._projRendered) renderProjSection(_projYear);
  if(window._statRendered) renderStatRanking();

  // ══ NEW: Update command center, alert center, top 3, performance colors ══
  updateCommandCenter(_allOps);
  renderAlertCenter(_allOps);
  renderTop3Performers(_allOps);
  // Re-render grids to apply perf colors after a short delay (DOM must be ready)
  setTimeout(()=>applyMuniPerformanceColors(_allOps),300);
  checkForUpdates(_allOps);
}


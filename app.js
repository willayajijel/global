/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  app.js — نظام التنقل الذكي للمنصة الرقمية لولاية جيجل
 *  SPA Navigation System with Browser History API
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  المشكلة التي يحلّها هذا الملف:
 *  ─────────────────────────────────
 *  عند فتح Modal أو التنقل بين الأقسام، كان زر الرجوع في المتصفح
 *  يُخرج المستخدم من الموقع مباشرةً. السبب: لا توجد سجلات في تاريخ
 *  المتصفح تُمثّل حالات التنقل الداخلية.
 *
 *  الحل المستخدم:
 *  ─────────────
 *  1. history.pushState()  → نضيف "إدخالاً" في تاريخ المتصفح عند
 *     كل تنقل داخلي (قسم أو modal)، دون تغيير الصفحة الفعلية.
 *
 *  2. window.onpopstate   → نستمع لحدث الرجوع. عند تفعيله، نتحقق
 *     من الحالة المخزّنة ونُطبّق الإجراء المناسب:
 *     - إغلاق modal مفتوح
 *     - أو العودة للقسم السابق
 *
 *  3. history.replaceState() → عند تحميل الصفحة لأول مرة، نُثبّت
 *     الحالة الأساسية (الرئيسية) حتى لا تكون بداية التاريخ فارغة.
 *
 *  هذا الملف يجب تحميله آخر سكريبت في index.html ليكون قادرًا
 *  على التقاط وتحسين الدوال المُعرَّفة في الملفات الأخرى.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────────
   *  § 1 — تعريف الأقسام الرئيسية والـ Modals المتاحة
   * ─────────────────────────────────────────────────────────────────────
   *  SECTIONS: مصفوفة بأسماء الأقسام المعرّفة في index.html بشكل
   *  `<div id="section-NAME">`. كل قسم يُعرض/يُخفى بـ display.
   *
   *  MODALS: قائمة بكل نوافذ Modal الموجودة في المنصة مع:
   *    - id: معرّف العنصر في DOM
   *    - closeFn: اسم الدالة المسؤولة عن إغلاقه
   *    - stateKey: مفتاح يُستخدم في history state لتمييز هذا الـ modal
   * ─────────────────────────────────────────────────────────────────────*/
  var SECTIONS = ['home', 'dashboard', 'municipalities', 'projects', 'statistics', 'contact'];

  var MODALS = [
    {
      id: 'muni-modal',        // Modal تفاصيل البلدية
      closeFn: 'closeMuniModal',
      stateKey: 'muni-modal'
    },
    {
      id: 'ops-list-modal',    // Modal قائمة العمليات
      closeFn: 'closeOpsModal',
      stateKey: 'ops-modal'
    }
  ];

  /* ─────────────────────────────────────────────────────────────────────
   *  § 2 — متغيرات الحالة الداخلية
   * ─────────────────────────────────────────────────────────────────────
   *  _currentSection: القسم الحالي المعروض
   *  _navigationDepth: عمق التنقل (كم pushState تم منذ الدخول)
   *  _isHandlingPop: علامة لمنع تكرار معالجة popstate
   * ─────────────────────────────────────────────────────────────────────*/
  var _currentSection = 'home';
  var _navigationDepth = 0;
  var _isHandlingPop = false;

  /* ─────────────────────────────────────────────────────────────────────
   *  § 3 — دوال مساعدة: كشف الـ Modal المفتوح حالياً
   * ─────────────────────────────────────────────────────────────────────
   *  نتحقق من كل modal هل يحمل class "open" أو style display != none.
   *  الـ CSS في هذه المنصة يعتمد على .open لإظهار الـ modals.
   * ─────────────────────────────────────────────────────────────────────*/
  function getOpenModal() {
    for (var i = 0; i < MODALS.length; i++) {
      var el = document.getElementById(MODALS[i].id);
      if (el && el.classList.contains('open')) {
        return MODALS[i];
      }
    }
    return null;
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 4 — بناء كائن الحالة لـ pushState / replaceState
   * ─────────────────────────────────────────────────────────────────────
   *  كل إدخال في تاريخ المتصفح يحمل هذا الكائن:
   *  {
   *    spa: true,           ← علامة تميّز إدخالاتنا عن إدخالات خارجية
   *    section: 'home',     ← القسم الحالي
   *    modal: null|'key',   ← اسم الـ modal المفتوح (إن وُجد)
   *    muniId: null|'id',   ← معرّف البلدية (لموdal البلدية)
   *    depth: 0             ← عمق التنقل
   *  }
   * ─────────────────────────────────────────────────────────────────────*/
  function buildState(section, modal, muniId) {
    return {
      spa: true,
      section: section || _currentSection,
      modal: modal || null,
      muniId: muniId || null,
      depth: _navigationDepth
    };
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 5 — بناء عنوان URL الذي يظهر في شريط العنوان
   * ─────────────────────────────────────────────────────────────────────
   *  نستخدم hash (#) لأن المنصة ملف واحد (لا server-side routing).
   *  مثال: #home | #dashboard | #muni=jijel | #ops
   *
   *  ملاحظة: هذا اختياري بحت — المهم هو state الكائن أعلاه.
   *  لكنه يجعل عنوان المتصفح أكثر وضوحاً للمستخدم.
   * ─────────────────────────────────────────────────────────────────────*/
  function buildURL(section, modal, muniId) {
    if (modal === 'muni-modal' && muniId) {
      return '#muni=' + encodeURIComponent(muniId);
    }
    if (modal === 'ops-modal') {
      return '#ops';
    }
    return '#' + (section || 'home');
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 6 — pushNavigationState()
   * ─────────────────────────────────────────────────────────────────────
   *  الدالة المركزية التي تُسجّل كل تنقل داخلي في تاريخ المتصفح.
   *  تُستدعى من: showSection() و openMuniPatched() و openOpsPatched()
   *
   *  history.pushState(stateObj, title, url):
   *  - stateObj: كائن الحالة المُبنى بـ buildState()
   *  - title: مُهمَل من معظم المتصفحات لكن نُعطيه قيمة وصفية
   *  - url: عنوان يظهر في شريط المتصفح دون تحميل صفحة جديدة
   * ─────────────────────────────────────────────────────────────────────*/
  function pushNavigationState(section, modal, muniId) {
    // نتجنب إضافة إدخالات مكررة لنفس الحالة
    var current = history.state;
    if (
      current &&
      current.spa &&
      current.section === section &&
      current.modal === (modal || null) &&
      current.muniId === (muniId || null)
    ) {
      return; // نفس الحالة — لا داعي للـ push
    }

    _navigationDepth++;
    var state = buildState(section, modal, muniId);
    var url = buildURL(section, modal, muniId);
    var title = buildPageTitle(section, modal, muniId);

    history.pushState(state, title, url);

    // تحديث عنوان الصفحة في المتصفح (tab title)
    document.title = title;
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 7 — buildPageTitle() — بناء عنوان صفحة وصفي
   * ─────────────────────────────────────────────────────────────────────*/
  var SECTION_TITLES = {
    home: 'الرئيسية',
    dashboard: 'لوحة المتابعة',
    municipalities: 'البلديات',
    projects: 'المشاريع',
    statistics: 'الإحصائيات',
    contact: 'التواصل'
  };

  function buildPageTitle(section, modal, muniId) {
    var base = 'منصة متابعة المشاريع — ولاية جيجل';
    if (modal === 'muni-modal' && muniId) {
      // نحاول إيجاد اسم البلدية إن كانت بيانات MUNICIPALITIES متاحة
      if (typeof MUNICIPALITIES !== 'undefined') {
        var muni = MUNICIPALITIES.find(function (m) { return m.id === muniId; });
        if (muni) return 'بلدية ' + muni.name + ' — ' + base;
      }
      return 'البلدية — ' + base;
    }
    if (modal === 'ops-modal') {
      return 'قائمة العمليات — ' + base;
    }
    var sectionTitle = SECTION_TITLES[section] || section;
    return sectionTitle + ' — ' + base;
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 8 — restoreState() — استعادة الحالة عند popstate
   * ─────────────────────────────────────────────────────────────────────
   *  تُستدعى من window.onpopstate عند ضغط زر الرجوع/الأمام.
   *  تُحلّل state الإدخال الجديد وتُطبّق الواجهة المناسبة:
   *
   *  الخوارزمية:
   *  1. إذا كان هناك modal مفتوح حالياً → نُغلقه بدون تغيير القسم
   *  2. إذا كان الـ state يحمل modal → نفتحه
   *  3. إذا كان الـ state حالة قسم → نعرض ذلك القسم
   *  4. إذا لم يكن state من منصتنا → نعود للرئيسية
   * ─────────────────────────────────────────────────────────────────────*/
  function restoreState(state) {
    // حماية من التكرار
    if (_isHandlingPop) return;
    _isHandlingPop = true;

    try {
      // ─── أغلق أي modal مفتوح أولاً ───
      var openModal = getOpenModal();
      if (openModal) {
        // نستدعي دالة الإغلاق الأصلية مباشرةً (بدون pushState)
        _closeModalSilently(openModal);
        // تحديث عنوان الصفحة
        if (state && state.spa) {
          document.title = buildPageTitle(state.section, null, null);
        }
        return;
      }

      // ─── بدون state (إدخال فارغ) → الرئيسية ───
      if (!state || !state.spa) {
        _showSectionSilently('home');
        return;
      }

      _navigationDepth = state.depth || 0;

      // ─── State يحمل modal → نعيد فتحه ───
      if (state.modal) {
        if (state.modal === 'muni-modal' && state.muniId) {
          // نفتح modal البلدية صامتاً
          if (typeof openMuni === 'function') {
            _openMuniSilently(state.muniId);
          }
        } else if (state.modal === 'ops-modal') {
          // نفتح modal العمليات صامتاً
          _openOpsModalSilently();
        }
        return;
      }

      // ─── State يحمل قسم → نعرضه ───
      if (state.section) {
        _showSectionSilently(state.section);
      }
    } finally {
      // نرفع العلامة بعد تأخير قصير لتجنب تداخل الأحداث
      setTimeout(function () { _isHandlingPop = false; }, 50);
    }
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 9 — دوال "صامتة" — تُغيّر الواجهة دون إضافة history
   * ─────────────────────────────────────────────────────────────────────
   *  هذه الدوال تُستدعى فقط من restoreState() (استجابةً لـ popstate).
   *  لا تُضيف إدخالات جديدة في تاريخ المتصفح — ذلك سيُسبّب حلقة لا نهاية.
   * ─────────────────────────────────────────────────────────────────────*/

  /**
   * _showSectionSilently — عرض قسم دون pushState
   * تعيد استخدام منطق showSection() الأصلي مباشرةً
   */
  function _showSectionSilently(name) {
    SECTIONS.forEach(function (s) {
      var el = document.getElementById('section-' + s);
      if (el) el.style.display = s === name ? 'block' : 'none';
    });

    document.querySelectorAll('.nav-bar a').forEach(function (a) {
      a.classList.remove('active');
    });

    var navMap = { home: 0, dashboard: 1, municipalities: 2, projects: 3, statistics: 4, contact: 5 };
    if (navMap[name] !== undefined) {
      var navLinks = document.querySelectorAll('.nav-bar a');
      if (navLinks[navMap[name]]) navLinks[navMap[name]].classList.add('active');
    }

    // تشغيل renderers عند الحاجة (نفس منطق showSection الأصلي)
    if (name === 'projects' && !window._projRendered) {
      window._projRendered = true;
      if (typeof renderProjSection === 'function') renderProjSection('2026');
    }
    if (name === 'contact' && !window._contactRendered) {
      window._contactRendered = true;
      if (typeof renderContactMuniLinks === 'function') renderContactMuniLinks();
    }
    if (name === 'statistics' && !window._statRendered) {
      window._statRendered = true;
      if (typeof renderStatRanking === 'function') renderStatRanking();
    }

    _currentSection = name;
    document.title = buildPageTitle(name, null, null);

    // نُعيد للأعلى بسلاسة عند تغيير القسم
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * _closeModalSilently — إغلاق modal دون pushState
   * يستدعي دالة الإغلاق الأصلية مباشرةً
   */
  function _closeModalSilently(modalDef) {
    var fn = window[modalDef.closeFn];
    if (typeof fn === 'function') {
      fn();
    } else {
      // fallback يدوي: نزيل class open
      var el = document.getElementById(modalDef.id);
      if (el) el.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /**
   * _openMuniSilently — فتح modal البلدية دون pushState
   */
  function _openMuniSilently(muniId) {
    // نستدعي openMuni الأصلية مباشرةً — هي لا تستدعي pushState بعد التحسين
    if (typeof openMuni === 'function') {
      // نستخدم flag مؤقت لمنع pushState داخل openMuni
      window._suppressHistoryPush = true;
      openMuni(muniId);
      window._suppressHistoryPush = false;
    }
  }

  /**
   * _openOpsModalSilently — فتح modal العمليات دون pushState
   */
  function _openOpsModalSilently() {
    var el = document.getElementById('ops-list-modal');
    if (el) el.classList.add('open');
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 10 — تحسين showSection() الأصلية
   * ─────────────────────────────────────────────────────────────────────
   *  نُغلّف showSection() لإضافة pushState قبل تنفيذ المنطق الأصلي.
   *  الأصلية محفوظة في _originalShowSection حتى تعمل الأقسام بنفس الطريقة.
   *
   *  لماذا نُغلّف بدل إعادة الكتابة؟
   *  لأن utils.js يحتوي على منطق renderer داخل showSection()
   *  (renderProjSection, renderContactMuniLinks, renderStatRanking).
   *  لا نريد فقدان هذا المنطق.
   * ─────────────────────────────────────────────────────────────────────*/
  var _originalShowSection = window.showSection;

  window.showSection = function (name) {
    // 1. أغلق أي modal مفتوح قبل تغيير القسم (بشكل صامت)
    var openModal = getOpenModal();
    if (openModal) {
      _closeModalSilently(openModal);
    }

    // 2. تسجيل التنقل في التاريخ (pushState)
    if (!_isHandlingPop) {
      pushNavigationState(name, null, null);
    }

    // 3. تحديث الحالة الداخلية
    _currentSection = name;

    // 4. استدعاء المنطق الأصلي لعرض القسم
    if (typeof _originalShowSection === 'function') {
      _originalShowSection(name);
    } else {
      _showSectionSilently(name);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────
   *  § 11 — تحسين openMuni() الأصلية (modal البلديات)
   * ─────────────────────────────────────────────────────────────────────
   *  ننتظر حتى يكون openMuni() مُعرَّفاً (بعد تحميل municipalities.js)
   *  ثم نُغلّفه لإضافة pushState عند فتح modal البلدية.
   * ─────────────────────────────────────────────────────────────────────*/
  function patchOpenMuni() {
    if (typeof window.openMuni !== 'function') return;

    var _originalOpenMuni = window.openMuni;

    window.openMuni = function (id) {
      // استدعاء المنطق الأصلي لفتح الـ modal
      _originalOpenMuni(id);

      // إضافة التاريخ إلا إذا كنا في وضع "صامت"
      if (!_isHandlingPop && !window._suppressHistoryPush) {
        pushNavigationState(_currentSection, 'muni-modal', id);
      }
    };
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 12 — تحسين closeMuniModal() الأصلية
   * ─────────────────────────────────────────────────────────────────────
   *  عند الضغط على ✕ أو Overlay لإغلاق Modal البلدية:
   *  إذا كان هناك history entry خاص بهذا الـ modal → نرجع للخلف
   *  بدل إغلاق يدوي مباشر، حتى يبقى تاريخ المتصفح متزامناً.
   * ─────────────────────────────────────────────────────────────────────*/
  function patchCloseMuniModal() {
    if (typeof window.closeMuniModal !== 'function') return;

    var _originalCloseMuniModal = window.closeMuniModal;

    window.closeMuniModal = function () {
      // تحقق هل الـ modal مفتوح فعلاً
      var el = document.getElementById('muni-modal');
      if (!el || !el.classList.contains('open')) return;

      var currentState = history.state;

      if (!_isHandlingPop && currentState && currentState.spa && currentState.modal === 'muni-modal') {
        // الرجوع في التاريخ — popstate سيتولى إغلاق الـ modal
        history.back();
      } else {
        // إغلاق مباشر (مثلاً عند استدعاء _closeModalSilently)
        _originalCloseMuniModal();
        document.title = buildPageTitle(_currentSection, null, null);
      }
    };
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 13 — تحسين openOpsListByFilter() الأصلية (modal العمليات)
   * ─────────────────────────────────────────────────────────────────────*/
  function patchOpenOpsModal() {
    if (typeof window.openOpsListByFilter !== 'function') return;

    var _originalOpenOps = window.openOpsListByFilter;

    window.openOpsListByFilter = function (filter) {
      _originalOpenOps(filter);

      if (!_isHandlingPop && !window._suppressHistoryPush) {
        pushNavigationState(_currentSection, 'ops-modal', null);
      }
    };
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 14 — تحسين closeOpsModal() الأصلية
   * ─────────────────────────────────────────────────────────────────────*/
  function patchCloseOpsModal() {
    if (typeof window.closeOpsModal !== 'function') return;

    var _originalCloseOps = window.closeOpsModal;

    window.closeOpsModal = function () {
      var el = document.getElementById('ops-list-modal');
      if (!el || !el.classList.contains('open')) return;

      var currentState = history.state;

      if (!_isHandlingPop && currentState && currentState.spa && currentState.modal === 'ops-modal') {
        history.back();
      } else {
        _originalCloseOps();
        document.title = buildPageTitle(_currentSection, null, null);
      }
    };
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 15 — openStaleAlertDetail() — تحسين modal التنبيهات المتأخرة
   * ─────────────────────────────────────────────────────────────────────
   *  هذه الدالة تفتح ops-list-modal بشكل غير مباشر.
   *  نُغلّفها لإضافة pushState.
   * ─────────────────────────────────────────────────────────────────────*/
  function patchOpenStaleAlertDetail() {
    if (typeof window.openStaleAlertDetail !== 'function') return;

    var _original = window.openStaleAlertDetail;

    window.openStaleAlertDetail = function (muniIds) {
      _original(muniIds);

      if (!_isHandlingPop && !window._suppressHistoryPush) {
        pushNavigationState(_currentSection, 'ops-modal', null);
      }
    };
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 16 — معالج الضغط على ESC لإغلاق الـ Modals
   * ─────────────────────────────────────────────────────────────────────
   *  على الكمبيوتر، الضغط على Escape يُغلق الـ modal المفتوح.
   *  نستخدم closeMuniModal / closeOpsModal (المحسّنتين) لضمان
   *  تزامن التاريخ.
   * ─────────────────────────────────────────────────────────────────────*/
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openModal = getOpenModal();
      if (openModal) {
        var fn = window[openModal.closeFn];
        if (typeof fn === 'function') fn();
      }
    }
  });

  /* ─────────────────────────────────────────────────────────────────────
   *  § 17 — window.onpopstate — القلب النابض للنظام
   * ─────────────────────────────────────────────────────────────────────
   *  يُفعَّل تلقائياً من المتصفح عند:
   *  - الضغط على زر الرجوع (موبايل + كمبيوتر)
   *  - الضغط على زر الأمام
   *  - استدعاء history.back() أو history.forward() برمجياً
   *
   *  event.state: كائن الحالة الذي أضفناه بـ pushState
   * ─────────────────────────────────────────────────────────────────────*/
  window.addEventListener('popstate', function (event) {
    restoreState(event.state);
  });

  /* ─────────────────────────────────────────────────────────────────────
   *  § 18 — تهيئة الحالة الأولى عند تحميل الصفحة
   * ─────────────────────────────────────────────────────────────────────
   *  عند أول تحميل للصفحة، نستخدم history.replaceState() (وليس push)
   *  لأن الإدخال الحالي في التاريخ موجود مسبقاً — نُحدّثه فقط.
   *
   *  replaceState vs pushState:
   *  - pushState → يُضيف إدخالاً جديداً (يزيد عمق التاريخ)
   *  - replaceState → يُعدّل الإدخال الحالي (لا يزيد العمق)
   * ─────────────────────────────────────────────────────────────────────*/
  function initHistoryState() {
    var hash = window.location.hash.replace('#', '');
    var initialSection = 'home';

    // إذا كان هناك hash في الرابط → حاول فتح القسم المناسب
    if (hash && SECTIONS.indexOf(hash) !== -1) {
      initialSection = hash;
    }

    _currentSection = initialSection;

    // تثبيت الحالة الأولية في التاريخ
    var state = buildState(initialSection, null, null);
    history.replaceState(state, buildPageTitle(initialSection, null, null), '#' + initialSection);

    // عرض القسم الأولي إذا لم يكن الرئيسية
    if (initialSection !== 'home') {
      _showSectionSilently(initialSection);
    }
  }

  /* ─────────────────────────────────────────────────────────────────────
   *  § 19 — closeAllModals() — دالة عامة لإغلاق كل الـ Modals
   * ─────────────────────────────────────────────────────────────────────
   *  متاحة عالمياً للاستخدام من أي مكان في الكود
   * ─────────────────────────────────────────────────────────────────────*/
  window.closeAllModals = function () {
    MODALS.forEach(function (modalDef) {
      var el = document.getElementById(modalDef.id);
      if (el && el.classList.contains('open')) {
        var fn = window[modalDef.closeFn];
        if (typeof fn === 'function') fn();
      }
    });
  };

  /* ─────────────────────────────────────────────────────────────────────
   *  § 20 — openSection() — دالة عامة للتنقل بين الأقسام
   * ─────────────────────────────────────────────────────────────────────
   *  واجهة بديلة لـ showSection() — يمكن استخدامها من أي مكان
   * ─────────────────────────────────────────────────────────────────────*/
  window.openSection = function (name) {
    if (SECTIONS.indexOf(name) === -1) {
      console.warn('[SPA Nav] قسم غير معروف:', name);
      return;
    }
    window.showSection(name);
  };

  /* ─────────────────────────────────────────────────────────────────────
   *  § 21 — closeSection() — العودة للرئيسية
   * ─────────────────────────────────────────────────────────────────────*/
  window.closeSection = function () {
    window.showSection('home');
  };

  /* ─────────────────────────────────────────────────────────────────────
   *  § 22 — تشغيل التحسينات بعد تحميل الصفحة كاملاً
   * ─────────────────────────────────────────────────────────────────────
   *  نستخدم DOMContentLoaded لضمان أن كل الملفات الأخرى
   *  (municipalities.js, dashboard.js, utils.js...) قد عرّفت دوالها.
   *
   *  ترتيب التهيئة مهم:
   *  1. تهيئة التاريخ الأولي (replaceState)
   *  2. تحسين دوال التنقل (patch)
   *  3. الاستماع لأحداث Escape
   * ─────────────────────────────────────────────────────────────────────*/
  function bootstrap() {
    // تهيئة الحالة الأولية
    initHistoryState();

    // تحسين دوال التنقل الموجودة
    patchOpenMuni();
    patchCloseMuniModal();
    patchOpenOpsModal();
    patchCloseOpsModal();
    patchOpenStaleAlertDetail();

    // تأخير إضافي للدوال التي قد تُعرَّف بعد DOMContentLoaded
    setTimeout(function () {
      patchOpenMuni();
      patchCloseMuniModal();
      patchOpenOpsModal();
      patchCloseOpsModal();
      patchOpenStaleAlertDetail();
    }, 500);

    console.log(
      '%c[SPA Navigation] ✓ تم تفعيل نظام التنقل الذكي — منصة جيجل',
      'color:#c9a84c;font-weight:bold;font-size:13px;'
    );
  }

  // نبدأ بعد اكتمال تحميل DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    // الصفحة محمّلة مسبقاً
    bootstrap();
  }

})(); // ← IIFE: كل الكود داخل دالة مغلقة لتجنب تلويث النطاق العالمي

# منصة متابعة المشاريع التنموية — ولاية جيجل

## هيكل المشروع

```
jijel-project/
│
├── index.html          ← الصفحة الرئيسية (HTML فقط، بدون CSS أو JS)
├── style.css           ← كل أنماط CSS
│
├── data.js             ← البيانات الثابتة (MUNICIPALITIES, DAIRAS, YEARS_DATA...)
├── firebase.js         ← الاتصال بـ Firebase وجلب البيانات
├── home.js             ← الصفحة الرئيسية (بانر، البرامج، شبكة البلديات)
├── dashboard.js        ← لوحة المتابعة (رسوم بيانية، جداول، KPIs)
├── municipalities.js   ← قسم البلديات (شبكة، فلتر، مودال)
├── projects.js         ← قسم المشاريع (ADSEC, CSGCL, FS, BW)
├── statistics.js       ← قسم الإحصائيات (ترتيب البلديات)
└── utils.js            ← الساعة، الطقس، التنبيهات، التوست، Nav، Boot
```

## تشغيل المشروع

افتح `index.html` في أي متصفح — **لا يحتاج server** إلا إذا أردت تحميل Firebase (يحتاج HTTPS أو localhost).

> للتطوير المحلي مع Firebase: استخدم `Live Server` في VS Code أو أي HTTP server بسيط.

## إضافة بلدية جديدة

1. في `data.js` → أضف البلدية في مصفوفة `MUNICIPALITIES`
2. في `firebase.js` → أضف اسم الـ collection في `MUNI_YEAR_COLLECTIONS`

## إضافة إعلان جديد في الشريط

في `index.html` → ابحث عن `ticker-inner` وأضف:
```html
<span class="ticker-item">📢 نص الإعلان الجديد</span>
<span class="ticker-sep">◆</span>
```
*(كرر النص مرتين للتمرير المستمر)*

## الإصدار
- **v14** — مايو 2026
- Firebase: `technique-fd670`
- مطوّر المنصة: صالح عمّور — 799 340 844

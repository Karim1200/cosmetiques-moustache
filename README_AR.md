# Cosmétiques Moustache — ربط المتجر بـ Supabase

هذه النسخة تضيف لوحة إدارة عبر الإنترنت: تسجيل دخول بالبريد وكلمة المرور، إضافة/تعديل/حذف المنتجات، ورفع صور JPG/PNG/WebP إلى Supabase Storage. يقرأ الموقع العام المنتجات من قاعدة البيانات مباشرة. تبقى ملفات الموقع على GitHub Pages.

## قبل البدء
- لا تشارك كلمة مرور المدير أو مفتاح `service_role` مع أحد.
- `supabase-config.js` يحتوي فقط على Project URL و anon/publishable key العامة. حماية البيانات تعتمد على سياسات RLS في `supabase-schema.sql`، وليس على إخفاء المفتاح العام.
- لا تضع أبدًا `service_role` أو secret key في ملفات الموقع.

## 1) إنشاء مشروع Supabase
1. افتح https://supabase.com/ وسجّل الدخول.
2. أنشئ مشروعًا جديدًا (New project)، اختر اسمًا وكلمة مرور قوية لقاعدة البيانات، واحفظ كلمة المرور في مكان آمن.
3. بعد إنشاء المشروع افتح **Project Settings → API** (قد تظهر القيم تحت Connect/API Keys).
4. انسخ **Project URL** و **anon/public key** أو **publishable key** فقط.

## 2) إنشاء الجداول وسياسات الحماية
1. من مشروع Supabase افتح **SQL Editor → New query**.
2. افتح ملف `supabase-schema.sql` الموجود ضمن هذه الحزمة وانسخ محتواه كاملًا إلى SQL Editor.
3. اضغط **Run**. ينشئ هذا جدول المنتجات، وجدول حسابات المدير المسموح لهم، ومخزن صور `product-images` وسياسات RLS.

## 3) إنشاء حساب المدير
1. افتح **Authentication → Users → Add user / Create new user**.
2. أدخل بريدك الإلكتروني وكلمة مرور قوية. عطّل التسجيل العام إن كان مفعّلًا من إعدادات Authentication، ولا تضف نموذج تسجيل عام للموقع.
3. بعد إنشاء المستخدم، انسخ قيمة **User UID** الخاصة به.
4. ارجع إلى **SQL Editor** وشغّل الاستعلام التالي بعد استبدال UUID بالقيمة الحقيقية:

```sql
insert into public.admin_users (user_id)
values ('ضع-هنا-User-UID');
```

هذا الإجراء مهم: لا يستطيع المستخدم تعديل المنتجات أو رفع/حذف الصور إلا إذا أُضيف UID الخاص به إلى `admin_users`. لإضافة مدير آخر كرر الخطوات لحسابه فقط.

## 4) إعداد ملفات الموقع
1. افتح `supabase-config.js` بمحرر نصوص.
2. استبدل القيمتين:

```js
window.SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT-ID.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY"
};
```

ضع Project URL مكان الرابط، و anon/public أو publishable key مكان المفتاح. لا تضع كلمة مرور قاعدة البيانات ولا service_role/secret key.
3. احفظ الملف.

## 5) ارفع النسخة الجديدة إلى GitHub Pages
ارفع واستبدل الملفات التالية في مستودع `Karim1200/cosmetiques-moustache`:
- `index.html`
- `script.js`
- `admin.html`
- `supabase-config.js`
- `supabase-schema.sql` (يمكن الاحتفاظ به في نسخة محلية؛ ليس مطلوبًا للموقع أن يعمل)
- بقية ملفات الموقع الحالية مثل `style.css` و `products-data.js` و `README_AR.md`.

من صفحة المستودع اختر **Add file → Upload files**، اسحب الملفات من المجلد المستخرج إلى GitHub، وافق على استبدال الملفات ذات الأسماء نفسها، ثم **Commit changes**. ارفع محتويات المجلد لا ملف ZIP وحده.

## 6) استخدام لوحة الإدارة
- المتجر العام: `https://karim1200.github.io/cosmetiques-moustache/`
- لوحة الإدارة: `https://karim1200.github.io/cosmetiques-moustache/admin.html`

افتح لوحة الإدارة، سجّل الدخول بالبريد وكلمة المرور اللذين أنشأتهما في Supabase، ثم أضف المنتج والسعر والوصف والصورة. ستظهر المنتجات المنشورة في الموقع بعد تحديث الصفحة. يمكنك تعديل المنتج أو حذفه من لوحة الإدارة.

## استكشاف الأخطاء
- **Configuration Supabase manquante**: لم تُعدّل `supabase-config.js` أو لم تُرفع النسخة الجديدة.
- **Invalid login credentials**: تأكد من بريد/كلمة مرور المستخدم الذي أنشأته في Authentication.
- **permission denied / row-level security**: تأكد من تشغيل `supabase-schema.sql` وإضافة User UID إلى `public.admin_users`.
- **رفع الصورة مرفوض**: تأكد أن UID المدير موجود في `admin_users` وأن حجم الصورة أقل من 5 MB وبصيغة JPG أو PNG أو WebP.
- **المنتجات لا تظهر**: افتح Developer Console (F12) وراجع الأخطاء، وتأكد من أن Project URL والمفتاح صحيحان وأن SQL قد نُفذ.
- **GitHub Pages يعرض النسخة القديمة**: انتظر دقيقة أو دقيقتين ثم أعد تحميل الصفحة بقوة باستخدام `Ctrl+F5`.

## الشعار
- تمت إضافة ملف `logo-moustache.png` واستخدامه في رأس المتجر ولوحة الإدارة، كما يظهر بشكل بارز في القسم الرئيسي للموقع.
- عند الرفع إلى GitHub، ارفع هذا الملف مع بقية ملفات الموقع في الجذر نفسه.

## ملاحظات
- لوحة الإدارة لا تحتوي على تسجيل حساب جديد؛ الحسابات تُنشأ يدويًا من Supabase.
- الصور عامة للعرض في المتجر، لكن الرفع والتعديل والحذف محمي بصلاحيات المدير.
- الموقع يعرض المنتجات من Supabase عند نجاح الاتصال. إذا لم تُضبط إعدادات Supabase، يستخدم الموقع بيانات العرض الموجودة في `products-data.js` كخيار احتياطي.

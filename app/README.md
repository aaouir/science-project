# شبكة علاقات الشركة

تطبيق إدارة علاقات (CRM شخصي/فريقي) لفريق العلاقات العامة — Expo (iOS + Android + Web) و Supabase.

## 1) إعداد Supabase

1. أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com).
2. من SQL Editor، شغّل محتوى `supabase/migrations/0001_init.sql` كاملًا.
3. من Project Settings → API، انسخ `Project URL` و `anon public key`.
4. في هذا المجلد (`app/`)، أنشئ ملف `.env` (انظر `.env.example`):

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxx
   ```

### إنشاء أول مستخدم (مدير)

لا يوجد تسجيل ذاتي — الحسابات تُنشأ فقط عبر دعوة من مدير. لذلك أول حساب يُنشأ يدويًا:

1. Authentication → Users → Add user، أنشئ مستخدمًا ببريد وكلمة مرور.
2. Table Editor → `organizations`، أضف صفًا باسم شركتك.
3. Table Editor → `profiles`، أضف صفًا: `id` = معرّف المستخدم الذي أنشأته، `org_id` = معرّف الشركة، `name`، `email`، `role` = `admin`.
4. سجّل الدخول بهذا الحساب من التطبيق، وبعدها يمكنك دعوة بقية الفريق من الإعدادات.

## 2) نشر Edge Functions

يحتاج مشروعك [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase login
supabase link --project-ref <project-ref>
supabase functions deploy extract-card draft-message ai-insight network-query transcribe-voice send-email send-whatsapp invite-member
```

ثم أضف الأسرار (Secrets) التالية — من Project Settings → Edge Functions → Secrets، أو عبر:

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

| السر | لماذا | مطلوب لتشغيل |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | قراءة البطاقات، صياغة الرسائل، التحليل، والسؤال عن الشبكة | كل ميزات الذكاء الاصطناعي النصية والبصرية |
| `OPENAI_API_KEY` | تحويل الملاحظات الصوتية إلى نص (Whisper) — Claude لا يدعم الصوت | تسجيل الملاحظات الصوتية |
| `RESEND_API_KEY` + `SEND_FROM_EMAIL` | إرسال البريد مباشرة من التطبيق | إرسال البريد (رسالة الترحيب، الأخبار) |
| `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` | إرسال واتساب عبر WhatsApp Cloud API (Meta) | إرسال واتساب (رسالة الترحيب، تواصل دوري، الأخبار) |

`SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` متاحة تلقائيًا لدوال Supabase، لا تحتاج ضبطها يدويًا.

### حسابات خارجية تحتاج تسجيلها بنفسك

هذه الميزات الأربع تتطلب حسابات مدفوعة/مسجّلة باسمك، ولا يمكن توفيرها بدون بياناتك:

- **البريد**: أنشئ حسابًا على [Resend](https://resend.com) (أو أي مزوّد آخر، بتعديل بسيط في `send-email`).
- **واتساب**: أنشئ تطبيق WhatsApp Business على [Meta for Developers](https://developers.facebook.com) واحصل على `WHATSAPP_TOKEN` و`WHATSAPP_PHONE_NUMBER_ID`.
- **تحويل الصوت لنص**: مفتاح [OpenAI](https://platform.openai.com) (أو استبدل الاستدعاء في `transcribe-voice` بمزوّد آخر مثل Deepgram).
- **تتبع تغيّر الوظيفة/الترقيات**: هذا الإصدار لا يتضمن اتصالًا آليًا بمزوّد بيانات — جدول `job_alerts` جاهز لاستقبال بيانات من Apollo/People Data Labs عبر وظيفة مجدولة (cron) تُضاف لاحقًا عند توفر اشتراكهم.

## 3) تشغيل التطبيق

```bash
npm install
npm run web       # أو: npm run ios / npm run android (يتطلب Expo Go أو محاكي)
```

## بنية المشروع

- `app/` — شاشات Expo Router (كل ملف = مسار).
- `src/lib` — عميل Supabase، الأنواع، ودوال الوصول للبيانات.
- `src/context` — حالة تسجيل الدخول والقائمة الجانبية.
- `src/components` — عناصر مشتركة (بطاقة جهة اتصال، رأس الشاشة، مُركّب الرسائل...).
- `supabase/migrations` — مخطط قاعدة البيانات (SQL).
- `supabase/functions` — دوال Edge المتصلة بـ Claude والخدمات الخارجية.

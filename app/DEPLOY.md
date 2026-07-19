# تشغيل المشروع على سيرفرك الخاص وتثبيته على هاتفك

هذا الدليل يغطي جزأين منفصلين: (1) أين "يعيش" الباك اند (قاعدة البيانات + دوال الذكاء الاصطناعي)، و(2) كيف تُشغّل تطبيق الهاتف فعليًا.

## الجزء الأول: الباك اند (Supabase)

عندك خياران. **الموصى به هو الخيار A** — "سيرفرك الخاص" هنا لا يعني بالضرورة أن تدير قاعدة بيانات بنفسك؛ Supabase Cloud هو مشروعك أنت وحدك (بياناتك ومفاتيحك)، فقط هم من يدير السيرفر الفعلي عنك، وهذا يوفر عليك صيانة كبيرة (نسخ احتياطي، تحديثات أمنية، مراقبة).

### الخيار A — Supabase Cloud (موصى به)

هذا ما افترضناه في `README.md` سابقًا. الخطوات باختصار:

1. أنشئ مشروعًا على [supabase.com](https://supabase.com) (يوجد باقة مجانية تكفي للبداية).
2. شغّل `supabase/migrations/0001_init.sql` من SQL Editor.
3. انسخ `Project URL` و`anon key` إلى `.env` في مجلد `app/`.
4. ثبّت [Supabase CLI](https://supabase.com/docs/guides/cli) على جهازك، ثم:
   ```bash
   supabase login
   supabase link --project-ref <project-ref>
   supabase functions deploy extract-card draft-message ai-insight network-query transcribe-voice send-email send-whatsapp invite-member
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-... OPENAI_API_KEY=... RESEND_API_KEY=... SEND_FROM_EMAIL=... WHATSAPP_TOKEN=... WHATSAPP_PHONE_NUMBER_ID=...
   ```
5. أنشئ أول حساب مدير يدويًا (موضّح في `README.md`).

### الخيار B — استضافة Supabase بالكامل على سيرفر خاص بك (Docker)

اختر هذا فقط إن كان لديك سبب فعلي (بياناتك يجب أن تبقى داخل سيرفراتك، سياسة شركة، إلخ) — الصيانة هنا مسؤوليتك بالكامل.

**المتطلبات:** سيرفر (VPS) بذاكرة 2GB+ يعمل بلينكس، ومثبّت عليه Docker وDocker Compose، ونطاق (domain) موجّه للسيرفر.

```bash
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
# عدّل .env: غيّر كل كلمات المرور الافتراضية (POSTGRES_PASSWORD, JWT_SECRET, ...)
docker compose up -d
```

بعدها:
1. شغّل `0001_init.sql` عبر `psql` متصلًا بقاعدة بيانات الحاوية، أو عبر Supabase Studio (يعمل على المنفذ 3000 محليًا).
2. ركّب شهادة HTTPS (عبر Caddy أو nginx + Let's Encrypt) أمام الحاويات — لا تُشغّل التطبيق فعليًا بدون HTTPS.
3. دوال Edge على النسخة المستضافة ذاتيًا تعمل عبر حاوية `functions` في نفس docker-compose؛ ضع ملفات `supabase/functions/*` في المسار المطابق وأعد تشغيل تلك الحاوية، وأضف نفس المفاتيح (`ANTHROPIC_API_KEY`...) كمتغيرات بيئة لها بدل `supabase secrets set`.
4. في `.env` الخاص بتطبيق الهاتف، استخدم رابط نطاقك بدل `xxxx.supabase.co`.

هذا الخيار يتطلب خبرة DevOps مستمرة (تحديثات، نسخ احتياطي، مراقبة) — إن لم يكن هذا اهتمامك الأساسي، الخيار A أوفر للوقت مع نفس مستوى خصوصية بياناتك.

## الجزء الثاني: تثبيت التطبيق على هاتفك

### الطريقة السريعة — للتجربة الآن (Expo Go)

مناسبة للتجربة فورًا بدون حساب مطوّرين أو انتظار بناء:

1. نزّل تطبيق **Expo Go** من App Store أو Google Play على هاتفك.
2. على جهاز الكمبيوتر، داخل مجلد `app/`:
   ```bash
   npm install
   npx expo start
   ```
3. امسح رمز QR الظاهر في الطرفية بكاميرا الهاتف (Android) أو بتطبيق الكاميرا العادي (iPhone) — يفتح مباشرة داخل Expo Go.
4. هاتفك وجهاز الكمبيوتر يجب أن يكونا على نفس شبكة الواي فاي.

**ملاحظة:** هذه الطريقة تعتمد على أن جهاز الكمبيوتر يبقى مشغّلًا؛ التطبيق يُحمَّل من جهازك مباشرة، وليس تطبيقًا مستقلًا مثبّتًا فعليًا.

### الطريقة الدائمة — تطبيق مستقل مثبّت (EAS Build)

هذا ينتج ملف APK (أندرويد) أو IPA (آيفون) تثبّته وتستخدمه بدون Expo Go وبدون تشغيل أي شيء على الكمبيوتر:

1. أنشئ حسابًا مجانيًا على [expo.dev](https://expo.dev).
2. داخل `app/`:
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```
3. للأندرويد (الأسهل — ملف APK تثبّته مباشرة على أي جهاز أندرويد):
   ```bash
   eas build --platform android --profile preview
   ```
   بعد انتهاء البناء (يتم على سيرفرات Expo، يأخذ دقائق)، يعطيك رابط تنزيل الـ APK — افتحه من الهاتف وثبّته (فعّل "السماح بالتثبيت من مصادر غير معروفة" إن طُلب).
4. للآيفون، تحتاج حساب Apple Developer ($99/سنة) لتثبيت التطبيق على جهاز فعلي (عبر TestFlight أو ad-hoc):
   ```bash
   eas build --platform ios --profile preview
   ```
5. **قبل البناء**، تأكد أن `.env` يحتوي على `EXPO_PUBLIC_SUPABASE_URL` و`EXPO_PUBLIC_SUPABASE_ANON_KEY` الصحيحين — القيم تُخبّز داخل التطبيق وقت البناء.

### النشر على متاجر التطبيقات (لاحقًا)

عندما يكون التطبيق جاهزًا للجميع في الشركة رسميًا عبر App Store / Google Play:
```bash
eas submit --platform android
eas submit --platform ios
```
يتطلب حساب Google Play Console ($25 مرة واحدة) و/أو Apple Developer Program ($99/سنة).

## الترتيب المقترح للبدء الآن

1. أنشئ مشروع Supabase Cloud (الخيار A) — 10 دقائق.
2. ثبّت Expo Go على هاتفك وشغّل `npx expo start` من جهازك — جرّب التطبيق فورًا بكل مميزاته الحقيقية (تسجيل الدخول، الكاميرا، التسجيل الصوتي...).
3. بعد التأكد أن كل شيء يعمل كما تريد، اطلب مني بناء نسخة APK عبر EAS لتثبيتها بشكل دائم على هاتفك دون الحاجة لجهاز الكمبيوتر.

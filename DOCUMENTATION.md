# 📘 توثيق مشروع "اتحاد الملاك" — كل اللي اتعمل خطوة بخطوة

> آخر تحديث: 10 يوليو 2026

المشروع اتحول من تصميم v0.app (React/Next.js) لنظام كامل: **فرونت Angular + باك اند ASP.NET Core + قاعدة بيانات + ربط كامل**.

---

## 🗂️ هيكل الفولدرات

```
ux-ui-for-building-management (1)/
├── app/, components/, ...        ← مشروع v0 الأصلي (React) — مرجع للتصميم فقط
├── ittihad-al-mullak/            ← الفرونت اند (Angular 20)
├── ittihad-backend/              ← الباك اند (ASP.NET Core 9 — Clean Architecture)
├── BACKEND-PROMPT.md             ← (تاريخي) برومبت الباك اند قبل ما ننفذه بأنفسنا
└── DOCUMENTATION.md              ← الملف ده
```

---

## المرحلة 1: تحويل الواجهات من React لـ Angular

### الخطوات اللي اتعملت

1. **إنشاء مشروع Angular 20** باسم `ittihad-al-mullak` (استخدمنا Angular 20 مش أحدث إصدار لأن Node على الجهاز 22.12 وأحدث CLI بيطلب أعلى من كده).
2. **نقل الثيم كامل**: ملف `app/globals.css` (ألوان oklch + Tailwind 4) اتنقل زي ما هو لـ `src/styles.css`. الخط Noto Sans Arabic من Google Fonts، و`index.html` فيه `dir="rtl" lang="ar"`.
3. **استبدال المكتبات**:
   | React (v0) | Angular (البديل) |
   |---|---|
   | shadcn/ui + Radix | HTML مباشر بنفس كلاسات Tailwind |
   | lucide-react | lucide-angular |
   | recharts | Chart.js (مع helper بيقرا ألوان الثيم من CSS) |
   | useState | Angular Signals |
   | next/link + usePathname | RouterLink + RouterLinkActive |
4. **الصفحات المتحولة** (كلها متطابقة بصرياً مع v0):
   - Landing + Login (اتضافت جديدة)
   - الإدارة: Dashboard، الشقق، الفواتير، الصيانة، الإعلانات، المستخدمين، الإعدادات
   - المالك (mobile-first): الرئيسية، الفواتير، الصيانة، المحادثات، حسابي

### ملاحظات تقنية مهمة

- **مشكلة اتحلت**: ألوان الثيم oklch مبتتفهمش مباشرة في canvas بتاع Chart.js — الحل في `src/app/shared/theme-color.ts` (بيحول اللون لـ hex عن طريق canvas readback).
- الرسوم البيانية RTL: `reverse: true` على محور X و `rtl: true` للـ tooltips.

---

## المرحلة 2: الباك اند — ASP.NET Core 9 بـ Clean Architecture

### المعمارية (Clean Architecture + SOLID)

```
ittihad-backend/
├── IttihadAlMullak.sln
├── .config/dotnet-tools.json     ← dotnet-ef أداة محلية (مش global — عزل كامل)
└── src/
    ├── IttihadAlMullak.Domain/           ← الكيانات والـ Enums (صفر dependencies)
    │   ├── Entities/ (User, Building, Apartment, Invoice, Payment, Expense,
    │   │   MaintenanceRequest, Announcement, Notification, Conversation, Message,
    │   │   RefreshToken, DeviceToken)
    │   └── Enums.cs
    ├── IttihadAlMullak.Application/      ← البيزنس لوجيك (بيعتمد على Domain فقط)
    │   ├── Common/    (IApplicationDbContext — تجريد قاعدة البيانات, Exceptions, PagedResult)
    │   ├── Interfaces/ (عقود كل الخدمات + ITokenService, IPasswordHasher, IFileStorage, ICurrentUser)
    │   ├── Dtos/       (عقود الـ API)
    │   └── Services/   (12 خدمة: Auth, Dashboard, Apartments, Invoices, Expenses,
    │                    Maintenance, Announcements, Users, Settings, Owner, Messages, Notifications)
    ├── IttihadAlMullak.Infrastructure/   ← التنفيذ التقني
    │   ├── Persistence/ (AppDbContext + Migrations + DbSeeder)
    │   ├── Auth/        (TokenService — JWT, PasswordHasherService — PBKDF2)
    │   └── Storage/     (LocalFileStorage — صور الصيانة في wwwroot/uploads)
    └── IttihadAlMullak.Api/              ← طبقة رفيعة: 12 Controller + Middleware
```

**ليه كده؟** كل طبقة بتشاور لجوه بس (Dependency Inversion). البيزنس لوجيك كله في Application ومش عارف حاجة عن EF Core أو JWT — يعني تقدر تبدل SQLite بـ SQL Server أو التخزين المحلي بـ S3 من غير ما تلمس البيزنس.

### القرارات التقنية وليه

| القرار | السبب |
|---|---|
| SQLite | مفيش Docker على الجهاز؛ ملف واحد معزول جوه المشروع؛ يتبدل بسطر واحد في `Program`/`DependencyInjection` |
| EF Core Migrations | بناءً على طلبك — `InitialCreate` + `AddMaintenancePhotos`، وبتتطبق تلقائياً عند التشغيل |
| JWT + Refresh Tokens (60 يوم، بـ rotation) | جلسات طويلة لتطبيق الموبايل |
| API Versioning `/api/v1/` | تطبيقات الموبايل مبتتحدثش غصب — لازم نقدر نطلع v2 من غير ما نكسر v1 |
| Multi-tenant بـ `buildingId` في التوكن | التطبيق يخدم عمارات كتير من أول يوم — كل استعلام scoped تلقائياً |
| Enums بتتسيريلايز strings | أسهل للفرونت والموبايل (`"Pending"` بدل `1`) |
| رسائل الأخطاء بالعربي (ProblemDetails) | الفرونت بيعرضها مباشرة للمستخدم |
| بورت 5301 | غير شائع — عشان ميتعارضش مع أي حاجة على السيرفر |

### الـ Endpoints (كلها تحت `http://localhost:5301/api/v1`)

| Method | Endpoint | الوصف | الصلاحية |
|---|---|---|---|
| POST | `/auth/login` | دخول بالموبايل + كلمة المرور | عام |
| POST | `/auth/refresh` | تجديد الجلسة | عام |
| GET | `/auth/me` | بياناتي | مسجل |
| POST | `/auth/change-password` | تغيير كلمة المرور | مسجل |
| POST | `/auth/devices` | تسجيل device token (للـ Push لاحقاً) | مسجل |
| GET | `/dashboard/stats` | إحصائيات اللوحة | أدمن |
| GET | `/dashboard/collection-chart` | شارت التحصيل ٦ شهور + توزيع السداد | أدمن |
| GET/POST/PUT/DELETE | `/apartments` | إدارة الشقق (+بحث) | أدمن |
| GET | `/invoices?status=&period=&search=&page=` | الفواتير بالفلاتر | أدمن |
| GET | `/invoices/summary` | ملخص التحصيل | أدمن |
| POST | `/invoices` | إصدار فاتورة (apartmentId=null → لكل الشقق) | أدمن |
| POST | `/invoices/{id}/payments` | تسجيل دفعة (جزئي/كامل — الحالة بتتحدث تلقائياً) | مسجل* |
| POST | `/invoices/reminders` | إشعار تذكير لكل المتأخرين | أدمن |
| GET/POST/DELETE | `/expenses` | مصروفات العمارة | أدمن |
| GET/POST | `/maintenance` | الطلبات (الساكن يشوف طلباته بس) | مسجل |
| PATCH | `/maintenance/{id}/status` | تغيير الحالة (+إشعار لصاحب الطلب) | أدمن |
| POST | `/maintenance/{id}/photos` | رفع صورة (jpg/png/webp ≤ 5MB، ≤ ٥ صور) | صاحب الطلب/أدمن |
| GET/POST/PUT/DELETE | `/announcements` | الإعلانات (+إشعار لكل السكان عند النشر) | قراءة للكل، كتابة أدمن |
| GET/POST/PUT | `/users` | المستخدمين (إنشاء بيربط بشقة، تفعيل/إيقاف) | أدمن |
| GET/PUT | `/settings` | إعدادات العمارة | أدمن |
| GET | `/owner/summary`, `/owner/bills`, `/owner/maintenance` | واجهات تطبيق المالك | مسجل |
| GET/POST | `/conversations`, `/conversations/{id}/messages` | المحادثات والرسائل | مسجل |
| GET/POST | `/notifications`, `/notifications/{id}/read`, `/read-all` | الإشعارات | مسجل |

\* المالك/المستأجر يدفع فواتير شقته فقط — فيه check.

**Swagger (توثيق تفاعلي):** `http://localhost:5301/api/docs`

### قواعد البيزنس المنفذة

- الدفع الجزئي: مجموع الـ Payments بيحدد حالة الفاتورة (`Unpaid` → `Partial` → `Paid`) تلقائياً، ورفض الدفع الزائد عن المتبقي.
- `overdue` حالة محسوبة: فاتورة مش خالصة + عدى تاريخ استحقاقها.
- تذكيرات الفواتير والإعلانات وتغيير حالة الصيانة كلها بتولد إشعارات in-app (ونقطة `NotifyAsync` واحدة جاهزة تتوسع لـ Push/WhatsApp/SMS).
- المستأجر Tenant: يشوف الفواتير والإعلانات ويطلب صيانة — **مينفعش يدفع** (اتقفلت في الفرونت).

---

## المرحلة 3: ربط الفرونت بالباك

### طبقة الـ Core الجديدة في الأنجولر (`src/app/core/`)

| ملف | وظيفته |
|---|---|
| `models.ts` | كل الـ TypeScript interfaces المطابقة للـ DTOs + عنوان الـ API |
| `auth.service.ts` | تسجيل دخول/خروج، تخزين التوكنات، `currentUser` signal |
| `auth.interceptor.ts` | بيحط التوكن على كل طلب + تجديد تلقائي عند 401 |
| `guards.ts` | `authGuard` (لازم دخول) و `adminGuard` (أدمن فقط وإلا يتحول لـ /owner) |
| `api.services.ts` | 11 خدمة typed لكل موديول (DashboardApi, InvoicesApi...) |
| `format.ts` | تنسيق عربي (عملة/تواريخ/وقت نسبي) + تصدير CSV |

### اللي اتربط

- **صفحة Login جديدة** (`/login`) بنفس الثيم + أزرار ملء الحسابات التجريبية.
- كل صفحات الإدارة وتطبيق المالك بتقرا من الـ API الحقيقي (مفيش mock data).
- **الأزرار اللي كانت شكلية اتفعلت**: تصدير التقرير → CSV حقيقي، عرض الكل → روابط فعلية، اتصال → `tel:`، ادفع الآن → دفع فعلي على الـ API، إرسال تذكيرات → إشعارات حقيقية، تسجيل الخروج → فعلي.

---

## 🚀 التشغيل

```bash
# 1) الباك اند (بورت 5301)
cd ittihad-backend/src/IttihadAlMullak.Api
dotnet run
# قاعدة البيانات بتتعمل وتتملى بيانات تجريبية تلقائياً أول تشغيل

# 2) الفرونت (بورت 4300)
cd ittihad-al-mullak
npx ng serve --port 4300
```

- التطبيق: `http://localhost:4300` — Swagger: `http://localhost:5301/api/docs`

### حسابات تجريبية (كلمة المرور للجميع: `123456`)

| الدور | الاسم | الموبايل |
|---|---|---|
| أدمن (لجنة الإدارة) | أحمد محمود | `01000000001` |
| مالك | محمد أحمد علي | `01012345678` |
| مالك | سارة محمد أحمد | `01555666777` |
| مستأجر | عمر حسين علي | `01666777888` |

### أوامر EF Migrations (من فولدر `ittihad-backend`)

```bash
dotnet ef migrations add اسم_الميجريشن --project src/IttihadAlMullak.Infrastructure --startup-project src/IttihadAlMullak.Api
dotnet ef database update --project src/IttihadAlMullak.Infrastructure --startup-project src/IttihadAlMullak.Api
# ملاحظة: التطبيق بيعمل Migrate تلقائياً عند التشغيل
```

---

## ⏭️ الخطوات الجاية المقترحة

1. **Git** — المشروع لسه مش repository (أولوية قصوى لحماية الشغل).
2. الدفع الحقيقي: تكامل فوري/Paymob (محتاج حساب تاجر) — نقطة الدخول جاهزة في `InvoiceService.AddPaymentAsync`.
3. Push Notifications: الـ DeviceTokens بتتسجل بالفعل — ناقص FCM في `NotificationService.NotifyAsync`.
4. OTP بالـ SMS لتسجيل الدخول.
5. النشر: الفرونت على Vercel/Netlify، الباك اند على VPS/Azure مع SQL Server أو PostgreSQL.
6. الموبايل: PWA ثم Capacitor (الـ API جاهز ليه بالـ CORS والـ refresh tokens الطويلة).

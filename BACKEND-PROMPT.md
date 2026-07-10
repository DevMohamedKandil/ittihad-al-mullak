# برومبت بدء الباك اند — تطبيق "اتحاد الملاك"

> انسخ الكلام اللي تحت السطر ده والصقه في جلسة Claude Code جديدة (يفضّل داخل فولدر فاضي اسمه `ittihad-backend`).

---

عايزك تبني لي Backend كامل لتطبيق إدارة عمارات سكنية (اتحاد ملاك) للسوق المصري اسمه "اتحاد الملاك".

## السياق

- عندي فرونت اند Angular 20 جاهز (واجهة عربية RTL) في المسار:
  `c:\Users\m.kandil\Desktop\ux-ui-for-building-management (1)\ittihad-al-mullak`
- الفرونت حالياً شغال بـ mock data. مطلوب API حقيقي يطابق الشاشات الموجودة (اقرأ مكونات الفرونت لو محتاج تفهم شكل البيانات).
- الفرونت بيشتغل على `http://localhost:4300` (فعّل CORS ليه).

## التقنيات المطلوبة

- **NestJS** (TypeScript) — أنا مطوّر Angular فهيكون مألوف ليا.
- **PostgreSQL** مع **Prisma ORM**، و **docker-compose** لتشغيل قاعدة البيانات محلياً.
- **JWT** (access + refresh tokens) مع Role Guards.
- **Swagger** على `/api/docs` لتوثيق كل الـ endpoints.
- Validation بـ class-validator على كل DTO.

## نموذج البيانات (Prisma)

- **User**: id, name, phone (unique — الدخول بالموبايل المصري), email?, passwordHash, role (`ADMIN` | `OWNER` | `TENANT`), avatarUrl?, isActive, createdAt.
- **Building**: id, name, address, floorsCount, settings (JSON: قيمة الاشتراك الشهري، يوم الاستحقاق...).
- **Apartment**: id, buildingId, number, floor, ownerId (User), tenantId? (User).
- **Invoice**: id, apartmentId, title, amount, dueDate, status (`PAID` | `PARTIAL` | `UNPAID` | `OVERDUE`), type (`MONTHLY` | `MAINTENANCE` | `SPECIAL`), createdAt.
- **Payment**: id, invoiceId, amount, method (`CASH` | `FAWRY` | `CARD` | `BANK_TRANSFER`), paidById, paidAt, reference?.
- **Expense**: id, buildingId, title, amount, category, date, receiptUrl? (مصروفات العمارة للشفافية).
- **MaintenanceRequest**: id, buildingId, apartmentId? (null = مرافق عامة), title, description, requesterId, status (`PENDING` | `IN_PROGRESS` | `COMPLETED` | `REJECTED`), priority (`LOW` | `MEDIUM` | `HIGH`), photos[], createdAt, resolvedAt?.
- **Announcement**: id, buildingId, title, content, type (`GENERAL` | `URGENT` | `FINANCIAL`), createdById, createdAt.
- **Conversation** + **Message**: محادثات بين الملاك والإدارة (direct + مجموعة عامة للعمارة)، Message فيها senderId, content, sentAt, readAt?.
- **Notification**: id, userId, title, body, channel (`IN_APP` | `WHATSAPP` | `SMS`), status, sentAt (نفّذ IN_APP فعلياً، والباقي interface/placeholder ينفَّذ لاحقاً).

## الـ Endpoints المطلوبة (مجمّعة حسب شاشات الفرونت)

- **Auth**: register, login بالموبايل + password (وخليك جاهز لإضافة OTP لاحقاً), refresh, me.
- **Dashboard (admin)**: `GET /dashboard/stats` (نسبة التحصيل، إجمالي المصروفات، عدد طلبات الصيانة، عدد السكان) + `GET /dashboard/collection-chart` (تحصيل شهري vs مستهدف، وتوزيع حالة السداد).
- **Apartments**: CRUD + بحث + حالة السداد المجمعة لكل شقة.
- **Invoices**: CRUD + إصدار فواتير شهرية جماعية (endpoint واحد يولّد فاتورة لكل شقة) + تسجيل دفعة (جزئية أو كاملة مع تحديث الحالة تلقائياً) + فلاتر (شهر، حالة، شقة).
- **Maintenance**: CRUD + تغيير الحالة + تعليقات، والمالك يشوف طلباته بس والأدمن يشوف الكل.
- **Announcements**: CRUD (أدمن) + قراءة (الكل).
- **Users**: إدارة المستخدمين (أدمن): إضافة مالك/مستأجر وربطه بشقة، تفعيل/تعطيل.
- **Owner app**: `GET /owner/summary` (فواتيري المستحقة، آخر الإعلانات، حالة طلباتي) + فواتيري + طلباتي + بروفايلي.
- **Messages**: محادثاتي، رسائل محادثة، إرسال رسالة.

## قواعد عمل مهمة

- الصلاحيات: `ADMIN` (لجنة الإدارة) كل حاجة داخل عمارته، `OWNER` بياناته وشقته، `TENANT` صلاحيات أقل (يشوف الفواتير والإعلانات ويرفع طلبات صيانة).
- كل الكيانات مرتبطة بـ buildingId (multi-tenant من أول يوم — التطبيق هيخدم أكتر من عمارة).
- الدفع الجزئي: مجموع الـ Payments بيحدد حالة الفاتورة تلقائياً.
- المبالغ بالجنيه المصري، خزّنها كـ integer بالقروش تجنباً لمشاكل الكسور.

## Seed Data

اعمل seed script ببيانات تجريبية **مطابقة للـ mock data الموجودة في الفرونت** (نفس أسماء الملاك: محمد أحمد، سارة محمود، أحمد علي... ونفس أرقام الشقق ١٠١/١٠٢/٢٠١... ونفس طلبات الصيانة والإعلانات) عشان أول ما أوصّل الفرونت يبان بنفس الشكل.

## خطة التنفيذ

نفّذ على مراحل وبعد كل مرحلة اتأكد إن المشروع بيبني ويشتغل:
1. Scaffold + Prisma + docker-compose + auth كامل.
2. Buildings/Apartments/Users + Seed.
3. Invoices/Payments/Expenses + إحصائيات الداشبورد.
4. Maintenance + Announcements + Messages + Notifications (in-app).
5. Swagger كامل + README بالعربي فيه خطوات التشغيل.

في الآخر اديني ملخص بكل الـ endpoints وإزاي أشغّل كل حاجة، واقترح عليّ خطوات ربط الفرونت (Angular services + interceptor للتوكن).

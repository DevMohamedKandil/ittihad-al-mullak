using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Infrastructure.Persistence;

/// <summary>
/// بيانات تجريبية مطابقة للـ mock data بتاعة الفرونت
/// عشان أول ما يترربط يبان بنفس الشكل. كلمة مرور الجميع: 123456
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, IPasswordHasherService hasher)
    {
        if (await db.Buildings.AnyAsync()) return;

        var building = new Building
        {
            Code = "BLD-001",
            Name = "عمارة النيل",
            Address = "شارع النيل، المهندسين، الجيزة، مصر",
            FloorsCount = 6,
            ApartmentsCount = 24,
            MonthlySubscription = 500,
            DueDay = 15,
            Phone = "01012345678",
            WhatsApp = "01012345678",
            Email = "admin@building.com",
        };
        db.Buildings.Add(building);
        await db.SaveChangesAsync();

        var password = hasher.Hash("123456");
        User NewUser(string name, string phone, UserRole role, string? email = null) => new()
        {
            Name = name,
            Phone = phone,
            Email = email,
            PasswordHash = password,
            Role = role,
            BuildingId = building.Id,
        };

        var admin = NewUser("أحمد محمود", "01000000001", UserRole.Admin, "admin@building.com");
        var mohamed = NewUser("محمد أحمد علي", "01012345678", UserRole.Owner);
        var ahmedSaid = NewUser("أحمد محمود سعيد", "01098765432", UserRole.Owner);
        var fatma = NewUser("فاطمة حسن إبراهيم", "01122334455", UserRole.Tenant);
        var khaled = NewUser("خالد عبدالله محمد", "01234567890", UserRole.Owner);
        var sara = NewUser("سارة محمد أحمد", "01555666777", UserRole.Owner);
        var omar = NewUser("عمر حسين علي", "01666777888", UserRole.Tenant);
        db.Users.AddRange(admin, mohamed, ahmedSaid, fatma, khaled, sara, omar);
        await db.SaveChangesAsync();

        var apartments = new List<Apartment>
        {
            new() { BuildingId = building.Id, Number = "١٠١", Floor = 1, OwnerId = mohamed.Id },
            new() { BuildingId = building.Id, Number = "١٠٢", Floor = 1, OwnerId = ahmedSaid.Id },
            new() { BuildingId = building.Id, Number = "٢٠١", Floor = 2, TenantId = fatma.Id },
            new() { BuildingId = building.Id, Number = "٢٠٢", Floor = 2, OwnerId = khaled.Id },
            new() { BuildingId = building.Id, Number = "٣٠١", Floor = 3, OwnerId = sara.Id },
            new() { BuildingId = building.Id, Number = "٣٠٢", Floor = 3, TenantId = omar.Id },
        };
        db.Apartments.AddRange(apartments);
        await db.SaveChangesAsync();

        // فواتير آخر ٦ شهور لكل شقة + دفعات متنوعة (مدفوع/جزئي/غير مدفوع)
        string[] months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        var now = DateTime.UtcNow;
        var invoiceNumber = 0;
        foreach (var offset in Enumerable.Range(0, 6).Reverse()) // من الأقدم للأحدث
        {
            var month = new DateTime(now.Year, now.Month, 1).AddMonths(-offset);
            var dueDate = new DateTime(month.Year, month.Month, building.DueDay);
            var period = $"{months[month.Month - 1]} {month.Year}";

            foreach (var (apartment, index) in apartments.Select((a, i) => (a, i)))
            {
                invoiceNumber++;
                var invoice = new Invoice
                {
                    Number = $"INV-{invoiceNumber:D3}",
                    BuildingId = building.Id,
                    ApartmentId = apartment.Id,
                    Title = "اشتراك شهري",
                    Period = period,
                    Amount = building.MonthlySubscription,
                    DueDate = dueDate,
                    Type = InvoiceType.Monthly,
                    CreatedAt = month,
                };

                var payerId = apartment.TenantId ?? apartment.OwnerId;
                // نمط دفع مختلف لكل شقة عشان الإحصائيات تبان واقعية
                var isLatest = offset == 0;
                var isPrevious = offset == 1;
                var payFull = index switch
                {
                    0 => true,                       // ١٠١ ملتزم دايماً
                    1 => !isLatest && !isPrevious,   // ١٠٢ متأخر آخر شهرين
                    2 => true,                       // ٢٠١ ملتزمة
                    3 => !isLatest,                  // ٢٠٢ جزئي في الأحدث
                    4 => !isLatest,                  // ٣٠١ غير مدفوع الأحدث
                    _ => offset > 2,                 // ٣٠٢ متأخر آخر ٣ شهور
                };

                if (payFull)
                {
                    invoice.Payments.Add(new Payment
                    {
                        Amount = invoice.Amount,
                        Method = index % 2 == 0 ? PaymentMethod.Fawry : PaymentMethod.Cash,
                        PaidById = payerId,
                        PaidAt = dueDate.AddDays(-3),
                    });
                }
                else if (index == 3 && isLatest) // ٢٠٢ دفع جزئي ٣٠٠
                {
                    invoice.Payments.Add(new Payment
                    {
                        Amount = 300,
                        Method = PaymentMethod.Fawry,
                        PaidById = payerId,
                        PaidAt = dueDate.AddDays(-1),
                    });
                }

                invoice.RecalculateStatus();
                db.Invoices.Add(invoice);
            }
        }

        // فاتورة صيانة سنوية إضافية (زي "صيانة المصعد" في تطبيق المالك)
        invoiceNumber++;
        var elevator = new Invoice
        {
            Number = $"INV-{invoiceNumber:D3}",
            BuildingId = building.Id,
            ApartmentId = apartments[0].Id,
            Title = "صيانة المصعد (سنوي)",
            Period = $"{now.Year}",
            Amount = 500,
            DueDate = now.AddDays(-20),
            Type = InvoiceType.Maintenance,
            CreatedAt = now.AddMonths(-2),
        };
        elevator.RecalculateStatus();
        db.Invoices.Add(elevator);

        db.Expenses.AddRange(
            new Expense { BuildingId = building.Id, Title = "صيانة المصعد الدورية", Amount = 3500, Category = "صيانة", Date = now.AddDays(-10) },
            new Expense { BuildingId = building.Id, Title = "فاتورة كهرباء السلم", Amount = 850, Category = "كهرباء", Date = now.AddDays(-7) },
            new Expense { BuildingId = building.Id, Title = "أجرة عامل النظافة", Amount = 1200, Category = "نظافة", Date = now.AddDays(-5) },
            new Expense { BuildingId = building.Id, Title = "تنظيف خزان المياه", Amount = 600, Category = "صيانة", Date = now.AddDays(-2) });

        db.MaintenanceRequests.AddRange(
            new MaintenanceRequest
            {
                BuildingId = building.Id, ApartmentId = apartments[5].Id,
                Title = "تسريب مياه في السقف",
                Description = "يوجد تسريب مياه من السقف في الحمام الرئيسي، يزداد عند استخدام الجيران للمياه",
                Category = "سباكة", RequesterId = omar.Id,
                Status = MaintenanceStatus.InProgress, Priority = MaintenancePriority.High,
                AssignedTo = "فني السباكة - أسطى حسن", CreatedAt = now.AddHours(-2),
            },
            new MaintenanceRequest
            {
                BuildingId = building.Id,
                Title = "عطل في المصعد",
                Description = "المصعد بيقف بين الأدوار ومحتاج صيانة عاجلة",
                Category = "ميكانيكا", RequesterId = mohamed.Id,
                Status = MaintenanceStatus.InProgress, Priority = MaintenancePriority.High,
                AssignedTo = "شركة المصاعد المتحدة", CreatedAt = now.AddHours(-3),
            },
            new MaintenanceRequest
            {
                BuildingId = building.Id,
                Title = "إضاءة السلم الثاني",
                Description = "لمبات السلم في الدور الثاني محتاجة تغيير",
                Category = "كهرباء", RequesterId = sara.Id,
                Status = MaintenanceStatus.Pending, Priority = MaintenancePriority.Medium,
                CreatedAt = now.AddDays(-1),
            },
            new MaintenanceRequest
            {
                BuildingId = building.Id,
                Title = "صيانة مضخة المياه",
                Description = "الصيانة الدورية لمضخة المياه الرئيسية",
                Category = "سباكة", RequesterId = admin.Id,
                Status = MaintenanceStatus.Completed, Priority = MaintenancePriority.High,
                CreatedAt = now.AddDays(-3), ResolvedAt = now.AddDays(-2),
            },
            new MaintenanceRequest
            {
                BuildingId = building.Id,
                Title = "تنظيف خزان المياه",
                Description = "التنظيف النصف سنوي لخزان المياه",
                Category = "نظافة", RequesterId = admin.Id,
                Status = MaintenanceStatus.Pending, Priority = MaintenancePriority.Low,
                CreatedAt = now.AddDays(-7),
            },
            new MaintenanceRequest
            {
                BuildingId = building.Id, ApartmentId = apartments[0].Id,
                Title = "عطل في جرس الباب",
                Description = "جرس الباب لا يعمل منذ أسبوع",
                Category = "كهرباء", RequesterId = mohamed.Id,
                Status = MaintenanceStatus.Pending, Priority = MaintenancePriority.Low,
                CreatedAt = now.AddDays(-8),
            });

        Announcement NewAnnouncement(string title, string content, AnnouncementType type, int daysAgo, bool pinned = false) => new()
        {
            BuildingId = building.Id,
            Title = title,
            Content = content,
            Type = type,
            IsPinned = pinned,
            CreatedById = admin.Id,
            CreatedAt = now.AddDays(-daysAgo),
        };

        db.Announcements.AddRange(
            NewAnnouncement("اجتماع اتحاد الملاك السنوي",
                "يسعدنا دعوتكم لحضور الاجتماع السنوي لاتحاد الملاك يوم الجمعة القادمة بعد صلاة العصر في مدخل العمارة لمناقشة ميزانية العام الجديد وانتخاب أعضاء اللجنة",
                AnnouncementType.General, 1, pinned: true),
            NewAnnouncement("موعد صيانة المصعد",
                "سيتم إيقاف المصعد يوم الخميس من الساعة ١٠ صباحاً حتى ٤ عصراً للصيانة الدورية",
                AnnouncementType.General, 1),
            NewAnnouncement("تذكير بسداد الاشتراكات",
                $"نذكر السادة الملاك بسداد اشتراكات الشهر قبل يوم {building.DueDay} تجنباً لغرامة التأخير",
                AnnouncementType.Financial, 2),
            NewAnnouncement("تركيب كاميرات مراقبة جديدة",
                "تم بحمد الله الانتهاء من تركيب ٨ كاميرات مراقبة حديثة تغطي المدخل والجراج وجميع الأدوار، ويمكن للجنة الإدارة متابعتها مباشرة",
                AnnouncementType.General, 3),
            NewAnnouncement("انقطاع المياه",
                "سيتم قطع المياه غداً من ٩ صباحاً حتى ١٢ ظهراً بسبب أعمال الصيانة",
                AnnouncementType.Urgent, 4),
            NewAnnouncement("تعيين شركة نظافة جديدة",
                "تعاقدت اللجنة مع شركة النظافة الجديدة (النخبة كلين) بداية من أول الشهر — النظافة اليومية للسلم والمدخل ومرتين أسبوعياً للجراج",
                AnnouncementType.General, 6),
            NewAnnouncement("تنبيه هام: ممنوع ترك الكراتين في السلم",
                "برجاء عدم ترك الكراتين أو الأثاث القديم في بسطات السلم لأنها تعيق الحركة وتخالف اشتراطات الدفاع المدني — سيتم التخلص من أي متروكات خلال ٤٨ ساعة",
                AnnouncementType.Urgent, 8),
            NewAnnouncement("تحديث قيمة الاشتراك الشهري",
                "بعد موافقة الجمعية العمومية، سيتم تعديل الاشتراك الشهري ليصبح ٦٠٠ ج.م بداية من الشهر القادم لتغطية زيادة تكاليف الصيانة والنظافة",
                AnnouncementType.Financial, 10),
            NewAnnouncement("مبروك! تجديد واجهة العمارة اكتمل",
                "انتهت أعمال دهان وتجديد واجهة العمارة بالكامل — شكراً لالتزام جميع الملاك بسداد المساهمات في موعدها",
                AnnouncementType.General, 14));
        await db.SaveChangesAsync();

        // مجموعة العمارة + محادثة مباشرة بين محمد والإدارة
        var group = new Conversation
        {
            BuildingId = building.Id, IsGroup = true, Name = "مجموعة العمارة",
            Participants = [.. new[] { admin, mohamed, ahmedSaid, fatma, khaled, sara, omar }
                .Select(u => new ConversationParticipant { UserId = u.Id })],
        };
        group.Messages.Add(new Message { SenderId = admin.Id, Content = "أهلاً بالجميع في مجموعة العمارة الرسمية", SentAt = now.AddDays(-5) });
        group.Messages.Add(new Message { SenderId = sara.Id, Content = "شكراً على المجموعة، فكرة ممتازة", SentAt = now.AddDays(-5).AddMinutes(20) });

        var direct = new Conversation
        {
            BuildingId = building.Id, IsGroup = false,
            Participants =
            [
                new ConversationParticipant { UserId = mohamed.Id },
                new ConversationParticipant { UserId = admin.Id },
            ],
        };
        direct.Messages.Add(new Message { SenderId = mohamed.Id, Content = "السلام عليكم، عايز أستفسر عن فاتورة الشهر ده", SentAt = now.AddHours(-6) });
        direct.Messages.Add(new Message { SenderId = admin.Id, Content = "وعليكم السلام، اتفضل يا فندم", SentAt = now.AddHours(-5) });

        db.Conversations.AddRange(group, direct);

        db.Notifications.AddRange(
            new Notification { UserId = mohamed.Id, Title = "فاتورة جديدة", Body = "تم إصدار فاتورة الاشتراك الشهري", CreatedAt = now.AddDays(-3) },
            new Notification { UserId = mohamed.Id, Title = "إعلان جديد: موعد صيانة المصعد", Body = "سيتم إيقاف المصعد يوم الخميس للصيانة الدورية", CreatedAt = now.AddDays(-1) },
            new Notification { UserId = omar.Id, Title = "تحديث طلب الصيانة", Body = "طلبك \"تسريب مياه في السقف\" أصبح: جاري التنفيذ", CreatedAt = now.AddHours(-1) });

        await db.SaveChangesAsync();
    }
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Receipt,
  Wrench,
  Bell,
  Users,
  Shield,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Receipt,
    title: "إدارة الفواتير",
    description: "إصدار ومتابعة الفواتير الشهرية والسنوية بسهولة",
  },
  {
    icon: CreditCard,
    title: "الدفع الإلكتروني",
    description: "دعم فوري وبطاقات الائتمان والتحويل البنكي",
  },
  {
    icon: Wrench,
    title: "طلبات الصيانة",
    description: "رفع ومتابعة طلبات الصيانة بشكل فوري",
  },
  {
    icon: Bell,
    title: "الإعلانات والتنبيهات",
    description: "إشعارات فورية عبر التطبيق وواتساب وSMS",
  },
  {
    icon: MessageSquare,
    title: "التواصل المباشر",
    description: "محادثات بين الملاك والإدارة ومجموعات خاصة",
  },
  {
    icon: Shield,
    title: "أمان وخصوصية",
    description: "حماية كاملة للبيانات وصلاحيات متعددة المستويات",
  },
];

const stats = [
  { value: "٥٠٠+", label: "عمارة" },
  { value: "١٠,٠٠٠+", label: "مستخدم" },
  { value: "٩٨%", label: "رضا العملاء" },
  { value: "٢٤/٧", label: "دعم فني" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">اتحاد الملاك</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/owner">
              <Button variant="ghost">تسجيل الدخول</Button>
            </Link>
            <Link href="/admin">
              <Button>لوحة الإدارة</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance">
              إدارة العمارات السكنية
              <span className="text-primary"> بذكاء وسهولة</span>
            </h1>
            <p className="text-xl text-muted-foreground mt-6 text-pretty max-w-2xl mx-auto">
              تطبيق متكامل لإدارة المصاريف المشتركة، الصيانة، والتواصل بين ملاك
              الشقق في مصر
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link href="/owner">
                <Button size="lg" className="gap-2 text-lg px-8">
                  <Smartphone className="h-5 w-5" />
                  جرّب التطبيق
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent">
                  لوحة الإدارة
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold">{stat.value}</p>
                <p className="text-primary-foreground/80 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              كل ما تحتاجه في مكان واحد
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              مميزات متكاملة لتسهيل إدارة العمارات السكنية
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              مصمم لجميع المستخدمين
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              صلاحيات مختلفة حسب نوع المستخدم
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">لجنة الإدارة</h3>
                <p className="text-muted-foreground mb-4">
                  إدارة كاملة للعمارة والمالية والصيانة
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    إصدار الفواتير
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    إدارة الصيانة
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    التقارير المالية
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 hover:border-secondary transition-colors">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">ملاك الشقق</h3>
                <p className="text-muted-foreground mb-4">
                  متابعة الفواتير والصيانة والتواصل
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    دفع الفواتير
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    طلبات الصيانة
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    التواصل المباشر
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-muted-foreground/20 hover:border-muted-foreground transition-colors">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mx-auto mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">المستأجرين</h3>
                <p className="text-muted-foreground mb-4">
                  صلاحيات محدودة حسب احتياجاتهم
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    عرض الفواتير
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    طلبات الصيانة
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    الإعلانات
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Egyptian Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              مصمم للسوق المصري
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              مميزات خاصة تناسب احتياجات المستخدم المصري
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">فوري</div>
                <p className="text-muted-foreground">دفع عبر منافذ فوري</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-success mb-2">واتساب</div>
                <p className="text-muted-foreground">إشعارات عبر واتساب</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">SMS</div>
                <p className="text-muted-foreground">رسائل نصية قصيرة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground mb-2">عربي</div>
                <p className="text-muted-foreground">واجهة عربية كاملة</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold">
            ابدأ الآن مجاناً
          </h2>
          <p className="text-primary-foreground/80 mt-4 text-lg max-w-2xl mx-auto">
            جرّب تطبيق اتحاد الملاك واكتشف كيف يمكن أن يسهل إدارة عمارتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/owner">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
                <Smartphone className="h-5 w-5" />
                تطبيق المالك
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                لوحة الإدارة
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="font-bold">اتحاد الملاك</span>
            </div>
            <p className="text-sm text-muted-foreground">
              جميع الحقوق محفوظة {new Date().getFullYear()} - اتحاد الملاك
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

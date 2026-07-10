"use client";

import { useState } from "react";
import {
  Building2,
  Bell,
  CreditCard,
  Shield,
  Palette,
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [buildingName, setBuildingName] = useState("عمارة النيل");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">
          إعدادات النظام والعمارة
        </p>
      </div>

      <Tabs defaultValue="building" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-1">
          <TabsTrigger value="building" className="gap-2 py-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">العمارة</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 py-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2 py-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">المدفوعات</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 py-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">الأمان</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2 py-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">المظهر</span>
          </TabsTrigger>
        </TabsList>

        {/* Building Settings */}
        <TabsContent value="building" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات العمارة</CardTitle>
              <CardDescription>
                البيانات الأساسية للعمارة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="building-name">اسم العمارة</Label>
                  <Input
                    id="building-name"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="building-code">كود العمارة</Label>
                  <Input id="building-code" value="BLD-001" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    className="pr-10"
                    defaultValue="شارع النيل، المهندسين، الجيزة، مصر"
                    rows={2}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floors">عدد الأدوار</Label>
                  <Input id="floors" type="number" defaultValue="6" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apartments">عدد الشقق</Label>
                  <Input id="apartments" type="number" defaultValue="24" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>بيانات التواصل</CardTitle>
              <CardDescription>
                معلومات الاتصال الخاصة بالإدارة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contact-phone"
                      className="pr-10"
                      defaultValue="01012345678"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contact-email"
                      type="email"
                      className="pr-10"
                      defaultValue="admin@building.com"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">رقم الواتساب</Label>
                <Input
                  id="whatsapp"
                  defaultValue="01012345678"
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>
                تحكم في طريقة إرسال الإشعارات للمستخدمين
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إشعارات التطبيق</Label>
                  <p className="text-sm text-muted-foreground">
                    إرسال إشعارات داخل التطبيق
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إشعارات واتساب</Label>
                  <p className="text-sm text-muted-foreground">
                    إرسال رسائل عبر واتساب
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>رسائل SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    إرسال رسائل نصية قصيرة
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>البريد الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">
                    إرسال إشعارات عبر البريد
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تذكيرات الدفع التلقائية</CardTitle>
              <CardDescription>
                إعدادات التذكيرات التلقائية للمتأخرين
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تفعيل التذكيرات التلقائية</Label>
                  <p className="text-sm text-muted-foreground">
                    إرسال تذكيرات للمتأخرين تلقائياً
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التذكير الأول بعد</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">يوم واحد</SelectItem>
                      <SelectItem value="3">3 أيام</SelectItem>
                      <SelectItem value="5">5 أيام</SelectItem>
                      <SelectItem value="7">أسبوع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>التذكير الثاني بعد</Label>
                  <Select defaultValue="7">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 أيام</SelectItem>
                      <SelectItem value="7">أسبوع</SelectItem>
                      <SelectItem value="14">أسبوعين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>طرق الدفع</CardTitle>
              <CardDescription>
                تفعيل وإعداد طرق الدفع المتاحة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>الدفع عبر فوري</Label>
                  <p className="text-sm text-muted-foreground">
                    السماح بالدفع من خلال منافذ فوري
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>البطاقات الائتمانية</Label>
                  <p className="text-sm text-muted-foreground">
                    قبول الدفع ببطاقات Visa و Mastercard
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>التحويل البنكي</Label>
                  <p className="text-sm text-muted-foreground">
                    السماح بالتحويل البنكي المباشر
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>الدفع النقدي</Label>
                  <p className="text-sm text-muted-foreground">
                    تسجيل المدفوعات النقدية يدوياً
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات الفواتير</CardTitle>
              <CardDescription>
                ضبط إعدادات إصدار الفواتير
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>يوم إصدار الفواتير الشهرية</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">اليوم الأول</SelectItem>
                      <SelectItem value="15">اليوم الخامس عشر</SelectItem>
                      <SelectItem value="25">اليوم الخامس والعشرين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>مهلة السداد (بالأيام)</Label>
                  <Select defaultValue="15">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 أيام</SelectItem>
                      <SelectItem value="15">15 يوم</SelectItem>
                      <SelectItem value="30">30 يوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label>إصدار الفواتير تلقائياً</Label>
                  <p className="text-sm text-muted-foreground">
                    إنشاء الفواتير الشهرية تلقائياً
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
              <CardDescription>
                ضبط إعدادات أمان الحسابات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>المصادقة الثنائية</Label>
                  <p className="text-sm text-muted-foreground">
                    طلب رمز تأكيد عند تسجيل الدخول
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تسجيل الخروج التلقائي</Label>
                  <p className="text-sm text-muted-foreground">
                    تسجيل الخروج بعد فترة عدم نشاط
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>مدة الجلسة (بالدقائق)</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 دقيقة</SelectItem>
                    <SelectItem value="30">30 دقيقة</SelectItem>
                    <SelectItem value="60">ساعة</SelectItem>
                    <SelectItem value="120">ساعتين</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سياسة كلمة المرور</CardTitle>
              <CardDescription>
                متطلبات كلمة المرور للمستخدمين
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>الحد الأدنى لطول كلمة المرور</Label>
                <Select defaultValue="8">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 أحرف</SelectItem>
                    <SelectItem value="8">8 أحرف</SelectItem>
                    <SelectItem value="10">10 أحرف</SelectItem>
                    <SelectItem value="12">12 حرف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>اشتراط أحرف كبيرة وصغيرة</Label>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>اشتراط أرقام</Label>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>اشتراط رموز خاصة</Label>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المظهر العام</CardTitle>
              <CardDescription>
                تخصيص مظهر التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>الوضع الافتراضي</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="system">حسب النظام</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>اللغة</Label>
                <Select defaultValue="ar">
                  <SelectTrigger className="w-48">
                    <Globe className="h-4 w-4 ml-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>عرض التاريخ الهجري</Label>
                  <p className="text-sm text-muted-foreground">
                    إظهار التاريخ الهجري بجانب الميلادي
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
}

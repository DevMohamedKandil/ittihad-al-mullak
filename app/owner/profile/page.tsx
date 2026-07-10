"use client";

import React from "react"

import { useState } from "react";
import { OwnerHeader } from "@/components/owner/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Home,
  Phone,
  Mail,
  Bell,
  MessageSquare,
  Shield,
  LogOut,
  ChevronLeft,
  Camera,
  Pencil,
  Moon,
  Globe,
  HelpCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({
  icon,
  label,
  description,
  action,
  onClick,
  danger,
}: SettingItemProps) {
  const content = (
    <div className="flex items-center gap-4 p-4">
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0",
          danger ? "bg-destructive/10" : "bg-muted"
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium", danger && "text-destructive")}>
          {label}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action || (onClick && <ChevronLeft className="h-5 w-5 text-muted-foreground" />)}
    </div>
  );

  if (onClick) {
    return (
      <button className="w-full text-right hover:bg-accent transition-colors" onClick={onClick}>
        {content}
      </button>
    );
  }

  return content;
}

export default function ProfilePage() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    bills: true,
    maintenance: true,
    announcements: true,
    whatsapp: true,
    sms: false,
  });

  const userInfo = {
    name: "أحمد محمود",
    phone: "٠١٠١٢٣٤٥٦٧٨",
    email: "ahmed@example.com",
    apartment: "٣٠١",
    floor: "٣",
    type: "مالك",
    building: "عمارة النيل",
    address: "المعادي، القاهرة",
  };

  return (
    <div>
      <OwnerHeader title="حسابي" />

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    أم
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 left-0 h-8 w-8 rounded-full shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold mt-4">{userInfo.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">شقة {userInfo.apartment}</Badge>
                <Badge className="bg-success text-success-foreground">
                  {userInfo.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {userInfo.building} - {userInfo.address}
              </p>

              <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-4 gap-2 bg-transparent">
                    <Pencil className="h-4 w-4" />
                    تعديل الملف الشخصي
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>تعديل الملف الشخصي</DialogTitle>
                    <DialogDescription>
                      قم بتحديث بياناتك الشخصية
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>الاسم</Label>
                      <Input defaultValue={userInfo.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>رقم الهاتف</Label>
                      <Input defaultValue={userInfo.phone} dir="ltr" className="text-left" />
                    </div>
                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <Input defaultValue={userInfo.email} dir="ltr" className="text-left" />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setIsEditProfileOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => setIsEditProfileOpen(false)}
                      >
                        حفظ التغييرات
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">معلومات التواصل</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem
              icon={<Phone className="h-5 w-5 text-muted-foreground" />}
              label={userInfo.phone}
              description="رقم الهاتف"
            />
            <Separator />
            <SettingItem
              icon={<Mail className="h-5 w-5 text-muted-foreground" />}
              label={userInfo.email}
              description="البريد الإلكتروني"
            />
            <Separator />
            <SettingItem
              icon={<Home className="h-5 w-5 text-muted-foreground" />}
              label={`شقة ${userInfo.apartment} - الطابق ${userInfo.floor}`}
              description={userInfo.building}
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">الإشعارات</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem
              icon={<Bell className="h-5 w-5 text-muted-foreground" />}
              label="إشعارات الفواتير"
              description="تنبيهات عند استحقاق الفواتير"
              action={
                <Switch
                  checked={notifications.bills}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, bills: checked })
                  }
                />
              }
            />
            <Separator />
            <SettingItem
              icon={<Bell className="h-5 w-5 text-muted-foreground" />}
              label="تحديثات الصيانة"
              description="متابعة حالة طلبات الصيانة"
              action={
                <Switch
                  checked={notifications.maintenance}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, maintenance: checked })
                  }
                />
              }
            />
            <Separator />
            <SettingItem
              icon={<Bell className="h-5 w-5 text-muted-foreground" />}
              label="الإعلانات"
              description="إعلانات وأخبار العمارة"
              action={
                <Switch
                  checked={notifications.announcements}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, announcements: checked })
                  }
                />
              }
            />
            <Separator />
            <SettingItem
              icon={<MessageSquare className="h-5 w-5 text-success" />}
              label="واتساب"
              description="استلام الإشعارات عبر واتساب"
              action={
                <Switch
                  checked={notifications.whatsapp}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, whatsapp: checked })
                  }
                />
              }
            />
            <Separator />
            <SettingItem
              icon={<Phone className="h-5 w-5 text-muted-foreground" />}
              label="رسائل SMS"
              description="استلام الإشعارات عبر SMS"
              action={
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              }
            />
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">إعدادات التطبيق</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem
              icon={<Moon className="h-5 w-5 text-muted-foreground" />}
              label="الوضع الليلي"
              description="تفعيل الوضع الداكن"
              action={<Switch />}
            />
            <Separator />
            <SettingItem
              icon={<Globe className="h-5 w-5 text-muted-foreground" />}
              label="اللغة"
              description="العربية"
              onClick={() => {}}
            />
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">الدعم والمساعدة</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem
              icon={<HelpCircle className="h-5 w-5 text-muted-foreground" />}
              label="مركز المساعدة"
              description="الأسئلة الشائعة والدعم"
              onClick={() => {}}
            />
            <Separator />
            <SettingItem
              icon={<FileText className="h-5 w-5 text-muted-foreground" />}
              label="الشروط والأحكام"
              onClick={() => {}}
            />
            <Separator />
            <SettingItem
              icon={<Shield className="h-5 w-5 text-muted-foreground" />}
              label="سياسة الخصوصية"
              onClick={() => {}}
            />
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-0">
            <SettingItem
              icon={<LogOut className="h-5 w-5 text-destructive" />}
              label="تسجيل الخروج"
              onClick={() => {}}
              danger
            />
          </CardContent>
        </Card>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          اتحاد الملاك - الإصدار ١.٠.٠
        </p>
      </div>
    </div>
  );
}

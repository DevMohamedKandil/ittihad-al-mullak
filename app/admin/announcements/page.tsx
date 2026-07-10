"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Bell,
  Megaphone,
  AlertTriangle,
  Info,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye,
  Send,
  Pin,
  Clock,
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// Mock data
const announcements = [
  {
    id: "1",
    title: "موعد قطع المياه للصيانة",
    content: "سيتم قطع المياه يوم الخميس الموافق 25 يناير من الساعة 9 صباحاً حتى 2 ظهراً لأعمال الصيانة الدورية. نرجو التجهيز مسبقاً.",
    type: "تنبيه",
    priority: "عالية",
    pinned: true,
    audience: "الكل",
    createdAt: "2024-01-20T10:00:00",
    scheduledAt: null,
    views: 18,
    notifications: {
      app: true,
      whatsapp: true,
      sms: false,
    },
  },
  {
    id: "2",
    title: "اجتماع الجمعية العمومية",
    content: "نود إعلامكم بأن اجتماع الجمعية العمومية السنوي سيعقد يوم السبت 10 فبراير الساعة 7 مساءً في قاعة الاجتماعات. حضوركم مهم لمناقشة الميزانية والخطط المستقبلية.",
    type: "إعلان",
    priority: "عادية",
    pinned: false,
    audience: "الملاك",
    createdAt: "2024-01-18T14:30:00",
    scheduledAt: null,
    views: 12,
    notifications: {
      app: true,
      whatsapp: true,
      sms: true,
    },
  },
  {
    id: "3",
    title: "تذكير بسداد المستحقات",
    content: "نذكر السادة الملاك والمستأجرين بضرورة سداد مستحقات شهر يناير قبل نهاية الشهر. يمكنكم الدفع عبر التطبيق أو من خلال فوري.",
    type: "تذكير",
    priority: "متوسطة",
    pinned: false,
    audience: "الكل",
    createdAt: "2024-01-15T09:00:00",
    scheduledAt: null,
    views: 22,
    notifications: {
      app: true,
      whatsapp: false,
      sms: false,
    },
  },
  {
    id: "4",
    title: "صيانة المصعد",
    content: "تم الانتهاء من صيانة المصعد بنجاح. شكراً لتفهمكم خلال فترة التوقف.",
    type: "معلومات",
    priority: "عادية",
    pinned: false,
    audience: "الكل",
    createdAt: "2024-01-12T16:00:00",
    scheduledAt: null,
    views: 20,
    notifications: {
      app: true,
      whatsapp: false,
      sms: false,
    },
  },
];

const stats = [
  {
    label: "إجمالي الإعلانات",
    value: 24,
    icon: Megaphone,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "المثبتة",
    value: 2,
    icon: Pin,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    label: "هذا الشهر",
    value: 8,
    icon: Calendar,
    color: "text-warning-foreground",
    bg: "bg-warning/10",
  },
  {
    label: "المشاهدات",
    value: 156,
    icon: Eye,
    color: "text-success",
    bg: "bg-success/10",
  },
];

function getTypeIcon(type: string) {
  switch (type) {
    case "تنبيه":
      return <AlertTriangle className="h-4 w-4" />;
    case "إعلان":
      return <Megaphone className="h-4 w-4" />;
    case "تذكير":
      return <Bell className="h-4 w-4" />;
    case "معلومات":
      return <Info className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

function getTypeBadge(type: string, priority: string) {
  const isHighPriority = priority === "عالية";
  const baseClasses = "gap-1";
  
  switch (type) {
    case "تنبيه":
      return (
        <Badge
          className={`${baseClasses} ${
            isHighPriority
              ? "bg-destructive text-destructive-foreground"
              : "bg-destructive/10 text-destructive border-0"
          }`}
        >
          {getTypeIcon(type)}
          {type}
        </Badge>
      );
    case "إعلان":
      return (
        <Badge className={`${baseClasses} bg-primary/10 text-primary border-0`}>
          {getTypeIcon(type)}
          {type}
        </Badge>
      );
    case "تذكير":
      return (
        <Badge className={`${baseClasses} bg-warning/10 text-warning-foreground border-0`}>
          {getTypeIcon(type)}
          {type}
        </Badge>
      );
    case "معلومات":
      return (
        <Badge className={`${baseClasses} bg-secondary/10 text-secondary border-0`}>
          {getTypeIcon(type)}
          {type}
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={baseClasses}>
          {getTypeIcon(type)}
          {type}
        </Badge>
      );
  }
}

function CreateAnnouncementDialog() {
  const [open, setOpen] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إعلان جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء إعلان جديد</DialogTitle>
          <DialogDescription>
            أنشئ إعلان جديد وحدد طريقة الإرسال
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الإعلان</Label>
            <Input id="title" placeholder="أدخل عنوان الإعلان" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">محتوى الإعلان</Label>
            <Textarea
              id="content"
              placeholder="اكتب محتوى الإعلان هنا..."
              rows={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع الإعلان</Label>
              <Select defaultValue="إعلان">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="إعلان">إعلان</SelectItem>
                  <SelectItem value="تنبيه">تنبيه</SelectItem>
                  <SelectItem value="تذكير">تذكير</SelectItem>
                  <SelectItem value="معلومات">معلومات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الأولوية</Label>
              <Select defaultValue="عادية">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عادية">عادية</SelectItem>
                  <SelectItem value="متوسطة">متوسطة</SelectItem>
                  <SelectItem value="عالية">عالية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>الفئة المستهدفة</Label>
            <Select defaultValue="الكل">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">الكل (ملاك ومستأجرين)</SelectItem>
                <SelectItem value="الملاك">الملاك فقط</SelectItem>
                <SelectItem value="المستأجرين">المستأجرين فقط</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 border-t pt-4">
            <Label>طريقة الإرسال</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox id="app" defaultChecked />
                <Label htmlFor="app" className="cursor-pointer">
                  إشعار التطبيق
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="whatsapp" />
                <Label htmlFor="whatsapp" className="cursor-pointer">
                  واتساب
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="sms" />
                <Label htmlFor="sms" className="cursor-pointer">
                  رسالة SMS
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>جدولة الإعلان</Label>
              <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
            </div>
            {isScheduled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التاريخ</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>الوقت</Label>
                  <Input type="time" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border-t pt-4">
            <Checkbox id="pin" />
            <Label htmlFor="pin" className="cursor-pointer">
              تثبيت الإعلان في أعلى القائمة
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={() => setOpen(false)} className="gap-2">
            <Send className="h-4 w-4" />
            نشر الإعلان
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AnnouncementCard({
  announcement,
}: {
  announcement: (typeof announcements)[0];
}) {
  return (
    <Card className={announcement.pinned ? "border-primary/50 bg-primary/5" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            {announcement.pinned && (
              <Pin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
            )}
            <div>
              <CardTitle className="text-base">{announcement.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3" />
                {new Date(announcement.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 ml-2" />
                معاينة
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="h-4 w-4 ml-2" />
                {announcement.pinned ? "إلغاء التثبيت" : "تثبيت"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {announcement.content}
        </p>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {getTypeBadge(announcement.type, announcement.priority)}
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {announcement.audience}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            {announcement.views}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.includes(searchQuery) || ann.content.includes(searchQuery);
    const matchesType = typeFilter === "all" || ann.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Sort to show pinned first
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">الإعلانات</h1>
          <p className="text-muted-foreground">
            إنشاء وإدارة الإعلانات والتنبيهات
          </p>
        </div>
        <CreateAnnouncementDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث في الإعلانات..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="إعلان">إعلان</SelectItem>
                <SelectItem value="تنبيه">تنبيه</SelectItem>
                <SelectItem value="تذكير">تذكير</SelectItem>
                <SelectItem value="معلومات">معلومات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAnnouncements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>

      {sortedAnnouncements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد إعلانات مطابقة للبحث</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

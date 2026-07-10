"use client";

import { useState } from "react";
import { OwnerHeader } from "@/components/owner/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Clock,
  Wrench,
  CheckCircle2,
  Camera,
  Calendar,
  MessageSquare,
  ChevronLeft,
  AlertTriangle,
  Droplets,
  Zap,
  Wind,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  updates?: {
    date: string;
    message: string;
    by: string;
  }[];
}

const requests: MaintenanceRequest[] = [
  {
    id: "1",
    title: "تسريب مياه في السقف",
    description:
      "يوجد تسريب مياه من السقف في الحمام الرئيسي، يزداد عند هطول الأمطار",
    category: "سباكة",
    status: "in-progress",
    priority: "high",
    createdAt: "٣٠ يناير ٢٠٢٦",
    updatedAt: "١ فبراير ٢٠٢٦",
    updates: [
      {
        date: "١ فبراير ٢٠٢٦",
        message: "تم إرسال فني السباكة وسيتم الإصلاح خلال يومين",
        by: "الإدارة",
      },
      {
        date: "٣١ يناير ٢٠٢٦",
        message: "تم استلام الطلب وجاري المراجعة",
        by: "الإدارة",
      },
    ],
  },
  {
    id: "2",
    title: "عطل في جرس الباب",
    description: "جرس الباب لا يعمل منذ أسبوع",
    category: "كهرباء",
    status: "pending",
    priority: "low",
    createdAt: "٢٨ يناير ٢٠٢٦",
    updatedAt: "٢٨ يناير ٢٠٢٦",
  },
  {
    id: "3",
    title: "صيانة التكييف",
    description: "التكييف يصدر صوت غريب ويحتاج صيانة",
    category: "تكييف",
    status: "completed",
    priority: "medium",
    createdAt: "١٥ يناير ٢٠٢٦",
    updatedAt: "٢٠ يناير ٢٠٢٦",
    updates: [
      {
        date: "٢٠ يناير ٢٠٢٦",
        message: "تم الانتهاء من الصيانة بنجاح",
        by: "الإدارة",
      },
    ],
  },
];

const statusConfig = {
  pending: {
    label: "قيد الانتظار",
    icon: Clock,
    className: "bg-warning/10 text-warning",
    badgeClass: "bg-warning text-warning-foreground",
  },
  "in-progress": {
    label: "جاري التنفيذ",
    icon: Wrench,
    className: "bg-primary/10 text-primary",
    badgeClass: "bg-primary text-primary-foreground",
  },
  completed: {
    label: "مكتمل",
    icon: CheckCircle2,
    className: "bg-success/10 text-success",
    badgeClass: "bg-success text-success-foreground",
  },
  rejected: {
    label: "مرفوض",
    icon: AlertTriangle,
    className: "bg-destructive/10 text-destructive",
    badgeClass: "bg-destructive text-destructive-foreground",
  },
};

const priorityConfig = {
  low: { label: "منخفضة", className: "bg-muted text-muted-foreground" },
  medium: { label: "متوسطة", className: "bg-warning/10 text-warning" },
  high: { label: "عاجلة", className: "bg-destructive/10 text-destructive" },
};

const categories = [
  { value: "plumbing", label: "سباكة", icon: Droplets },
  { value: "electrical", label: "كهرباء", icon: Zap },
  { value: "hvac", label: "تكييف", icon: Wind },
  { value: "general", label: "عام", icon: Building },
];

function RequestCard({ request }: { request: MaintenanceRequest }) {
  const [isOpen, setIsOpen] = useState(false);
  const StatusIcon = statusConfig[request.status].icon;

  return (
    <>
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0",
                statusConfig[request.status].className
              )}
            >
              <StatusIcon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{request.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                {request.description}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "text-xs",
                    statusConfig[request.status].badgeClass
                  )}
                >
                  {statusConfig[request.status].label}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    priorityConfig[request.priority].className
                  )}
                >
                  {priorityConfig[request.priority].label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {request.category}
                </span>
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{request.title}</DialogTitle>
            <DialogDescription>
              تم الإرسال: {request.createdAt}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Status & Priority */}
            <div className="flex gap-2">
              <Badge
                className={cn(statusConfig[request.status].badgeClass)}
              >
                {statusConfig[request.status].label}
              </Badge>
              <Badge
                variant="outline"
                className={cn(priorityConfig[request.priority].className)}
              >
                الأولوية: {priorityConfig[request.priority].label}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">الوصف</h4>
              <p className="text-sm text-muted-foreground">
                {request.description}
              </p>
            </div>

            {/* Category */}
            <div>
              <h4 className="font-medium mb-2">التصنيف</h4>
              <Badge variant="outline">{request.category}</Badge>
            </div>

            {/* Updates Timeline */}
            {request.updates && request.updates.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">التحديثات</h4>
                <div className="space-y-4">
                  {request.updates.map((update, index) => (
                    <div
                      key={index}
                      className="relative pr-6 pb-4 border-r-2 border-border last:pb-0"
                    >
                      <div className="absolute -right-2 top-0 w-4 h-4 rounded-full bg-primary" />
                      <p className="text-xs text-muted-foreground mb-1">
                        {update.date} - {update.by}
                      </p>
                      <p className="text-sm">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                <MessageSquare className="h-4 w-4" />
                إضافة تعليق
              </Button>
              {request.status !== "completed" && (
                <Button variant="destructive" className="gap-2">
                  إلغاء الطلب
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function NewRequestForm({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label>التصنيف</Label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                category === cat.value
                  ? "border-primary bg-primary/5"
                  : "hover:bg-accent"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg",
                  category === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <cat.icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">عنوان المشكلة</Label>
        <Input id="title" placeholder="مثال: تسريب مياه في الحمام" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">وصف تفصيلي</Label>
        <Textarea
          id="description"
          placeholder="اشرح المشكلة بالتفصيل..."
          rows={4}
        />
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label>الأولوية</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الأولوية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">منخفضة - يمكن الانتظار</SelectItem>
            <SelectItem value="medium">متوسطة - خلال أسبوع</SelectItem>
            <SelectItem value="high">عاجلة - تحتاج تدخل فوري</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>صور (اختياري)</Label>
        <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer">
          <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            اضغط لإضافة صور للمشكلة
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={onClose}
        >
          إلغاء
        </Button>
        <Button className="flex-1" onClick={onClose}>
          إرسال الطلب
        </Button>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  const activeRequests = requests.filter(
    (r) => r.status === "pending" || r.status === "in-progress"
  );
  const completedRequests = requests.filter(
    (r) => r.status === "completed" || r.status === "rejected"
  );

  return (
    <div>
      <OwnerHeader title="طلبات الصيانة" />

      <div className="p-4 space-y-6">
        {/* New Request Button */}
        <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2" size="lg">
              <Plus className="h-5 w-5" />
              طلب صيانة جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>طلب صيانة جديد</DialogTitle>
              <DialogDescription>
                قم بوصف المشكلة وسيتم الرد عليك في أقرب وقت
              </DialogDescription>
            </DialogHeader>
            <NewRequestForm onClose={() => setIsNewRequestOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">
                {requests.filter((r) => r.status === "pending").length}
              </p>
              <p className="text-xs text-muted-foreground">قيد الانتظار</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {requests.filter((r) => r.status === "in-progress").length}
              </p>
              <p className="text-xs text-muted-foreground">جاري التنفيذ</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">
                {requests.filter((r) => r.status === "completed").length}
              </p>
              <p className="text-xs text-muted-foreground">مكتمل</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="active" className="gap-2">
              نشطة
              {activeRequests.length > 0 && (
                <Badge variant="secondary" className="h-5 w-5 p-0 justify-center">
                  {activeRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">مكتملة</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-4">
            {activeRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                  <p className="font-medium text-lg">لا توجد طلبات نشطة</p>
                  <p className="text-sm text-muted-foreground">
                    يمكنك إرسال طلب صيانة جديد
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-4">
            {completedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

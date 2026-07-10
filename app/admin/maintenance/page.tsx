"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Home,
  Calendar,
  MessageSquare,
  ImageIcon,
  Phone,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data
const maintenanceRequests = [
  {
    id: "MR-001",
    title: "تسريب مياه في السقف",
    description: "يوجد تسريب مياه من الشقة العلوية يؤثر على سقف الحمام. المشكلة بدأت منذ أسبوع وتزداد سوءاً.",
    category: "سباكة",
    apartment: "١٠١",
    owner: "محمد أحمد علي",
    phone: "01012345678",
    priority: "عالية",
    status: "جديد",
    createdAt: "2024-01-20T10:30:00",
    images: ["/placeholder.svg", "/placeholder.svg"],
    comments: [
      {
        author: "محمد أحمد",
        text: "المشكلة تزداد سوءاً، أرجو الإسراع",
        date: "2024-01-21T14:00:00",
        isAdmin: false,
      },
    ],
  },
  {
    id: "MR-002",
    title: "عطل في المصعد",
    description: "المصعد يصدر صوت غريب ويتوقف أحياناً بين الطوابق. يحتاج فحص عاجل.",
    category: "مصعد",
    apartment: "عام",
    owner: "أحمد محمود سعيد",
    phone: "01098765432",
    priority: "عاجلة",
    status: "قيد التنفيذ",
    createdAt: "2024-01-18T08:15:00",
    assignedTo: "شركة الأمان للمصاعد",
    images: [],
    comments: [
      {
        author: "الإدارة",
        text: "تم التواصل مع شركة الصيانة وسيتم الحضور غداً",
        date: "2024-01-18T10:00:00",
        isAdmin: true,
      },
      {
        author: "الإدارة",
        text: "الفني في الموقع الآن",
        date: "2024-01-19T09:00:00",
        isAdmin: true,
      },
    ],
  },
  {
    id: "MR-003",
    title: "إنارة السلم لا تعمل",
    description: "لمبات السلم في الدور الثاني والثالث لا تعمل، يرجى استبدالها.",
    category: "كهرباء",
    apartment: "عام",
    owner: "فاطمة حسن إبراهيم",
    phone: "01122334455",
    priority: "متوسطة",
    status: "مكتمل",
    createdAt: "2024-01-15T16:45:00",
    completedAt: "2024-01-17T11:00:00",
    images: [],
    comments: [
      {
        author: "الإدارة",
        text: "تم استبدال اللمبات",
        date: "2024-01-17T11:00:00",
        isAdmin: true,
      },
    ],
  },
  {
    id: "MR-004",
    title: "باب البوابة لا يغلق",
    description: "الباب الرئيسي للعمارة لا يغلق بشكل صحيح، مما يشكل خطر أمني.",
    category: "أمن وسلامة",
    apartment: "عام",
    owner: "خالد عبدالله محمد",
    phone: "01234567890",
    priority: "عالية",
    status: "جديد",
    createdAt: "2024-01-21T07:00:00",
    images: ["/placeholder.svg"],
    comments: [],
  },
  {
    id: "MR-005",
    title: "انسداد في مجرى الصرف",
    description: "مجرى الصرف الرئيسي في الطابق الأرضي مسدود ويسبب رائحة كريهة.",
    category: "سباكة",
    apartment: "عام",
    owner: "سارة محمد أحمد",
    phone: "01555666777",
    priority: "متوسطة",
    status: "مرفوض",
    createdAt: "2024-01-10T12:00:00",
    rejectionReason: "المشكلة خاصة بالشقة وليست عامة",
    images: [],
    comments: [
      {
        author: "الإدارة",
        text: "بعد المعاينة تبين أن المشكلة داخل الشقة وليست في الصرف العام",
        date: "2024-01-11T14:00:00",
        isAdmin: true,
      },
    ],
  },
];

const stats = [
  {
    label: "جديد",
    value: 8,
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "قيد التنفيذ",
    value: 3,
    icon: Wrench,
    color: "text-warning-foreground",
    bg: "bg-warning/10",
  },
  {
    label: "مكتمل",
    value: 15,
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "عاجل",
    value: 2,
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

const categories = [
  "سباكة",
  "كهرباء",
  "مصعد",
  "نظافة",
  "أمن وسلامة",
  "دهانات",
  "أخرى",
];

function getStatusBadge(status: string) {
  switch (status) {
    case "جديد":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
          <Clock className="h-3 w-3 ml-1" />
          جديد
        </Badge>
      );
    case "قيد التنفيذ":
      return (
        <Badge className="bg-warning/10 text-warning-foreground hover:bg-warning/20 border-0">
          <Wrench className="h-3 w-3 ml-1" />
          قيد التنفيذ
        </Badge>
      );
    case "مكتمل":
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
          <CheckCircle className="h-3 w-3 ml-1" />
          مكتمل
        </Badge>
      );
    case "مرفوض":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">
          <XCircle className="h-3 w-3 ml-1" />
          مرفوض
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "عاجلة":
      return (
        <Badge variant="destructive" className="gap-1">
          <ArrowUpCircle className="h-3 w-3" />
          عاجلة
        </Badge>
      );
    case "عالية":
      return (
        <Badge className="bg-warning text-warning-foreground hover:bg-warning/90 gap-1">
          <ArrowUpCircle className="h-3 w-3" />
          عالية
        </Badge>
      );
    case "متوسطة":
      return (
        <Badge variant="secondary" className="gap-1">
          <MinusCircle className="h-3 w-3" />
          متوسطة
        </Badge>
      );
    case "منخفضة":
      return (
        <Badge variant="outline" className="gap-1">
          <ArrowDownCircle className="h-3 w-3" />
          منخفضة
        </Badge>
      );
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
}

function RequestDetailsDialog({
  request,
}: {
  request: (typeof maintenanceRequests)[0];
}) {
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState(request.status);

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
      <DialogHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle className="text-xl">{request.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-1">
              <span>{request.id}</span>
              <span>•</span>
              <span>{request.category}</span>
              <span>•</span>
              <span>
                {new Date(request.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getStatusBadge(request.status)}
            {getPriorityBadge(request.priority)}
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-6 py-4">
          {/* Request Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{request.owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {request.apartment === "عام" ? "مناطق عامة" : `شقة ${request.apartment}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm" dir="ltr">
                {request.phone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(request.createdAt).toLocaleString("ar-EG")}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">الوصف</h4>
            <p className="text-muted-foreground">{request.description}</p>
          </div>

          {/* Images */}
          {request.images.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                الصور المرفقة ({request.images.length})
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {request.images.map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              التعليقات والتحديثات ({request.comments.length})
            </h4>
            <div className="space-y-3">
              {request.comments.map((comment, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    comment.isAdmin ? "bg-primary/5 border-r-2 border-primary" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {comment.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {comment.author}
                      </span>
                      {comment.isAdmin && (
                        <Badge variant="outline" className="text-xs">
                          إدارة
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.date).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
              ))}
              {request.comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  لا توجد تعليقات بعد
                </p>
              )}
            </div>
          </div>

          {/* Add Comment */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium">إضافة تعليق / تحديث</h4>
            <Textarea
              placeholder="اكتب تعليقك هنا..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
          </div>

          {/* Update Status */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium">تحديث الحالة</h4>
            <div className="flex gap-3">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="جديد">جديد</SelectItem>
                  <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                  <SelectItem value="مكتمل">مكتمل</SelectItem>
                  <SelectItem value="مرفوض">مرفوض</SelectItem>
                </SelectContent>
              </Select>
              {newStatus === "قيد التنفيذ" && (
                <Input placeholder="الجهة المسؤولة" className="flex-1" />
              )}
            </div>
            {newStatus === "مرفوض" && (
              <Textarea placeholder="سبب الرفض..." rows={2} />
            )}
          </div>
        </div>
      </ScrollArea>

      <DialogFooter className="border-t pt-4">
        <Button variant="outline">
          <Phone className="h-4 w-4 ml-2" />
          اتصال
        </Button>
        <Button>حفظ التحديثات</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function RequestCard({
  request,
  onSelect,
}: {
  request: (typeof maintenanceRequests)[0];
  onSelect: () => void;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{request.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span className="text-xs">{request.id}</span>
              <span>•</span>
              <span className="text-xs">{request.category}</span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={onSelect}>
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem>تعيين فني</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                رفض الطلب
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {request.description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="truncate max-w-24">{request.owner}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {request.apartment === "عام" ? "عام" : request.apartment}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {getStatusBadge(request.status)}
            {getPriorityBadge(request.priority)}
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(request.createdAt).toLocaleDateString("ar-EG")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MaintenancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<
    (typeof maintenanceRequests)[0] | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredRequests = maintenanceRequests.filter((req) => {
    const matchesSearch =
      req.title.includes(searchQuery) ||
      req.id.includes(searchQuery) ||
      req.owner.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || req.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || req.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectRequest = (request: (typeof maintenanceRequests)[0]) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">إدارة طلبات الصيانة</h1>
        <p className="text-muted-foreground">
          متابعة وإدارة جميع طلبات الصيانة
        </p>
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
                placeholder="بحث بعنوان الطلب أو رقمه أو اسم المالك..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="جديد">جديد</SelectItem>
                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests */}
      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">
            جديد ({maintenanceRequests.filter((r) => r.status === "جديد").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            قيد التنفيذ (
            {maintenanceRequests.filter((r) => r.status === "قيد التنفيذ").length}
            )
          </TabsTrigger>
          <TabsTrigger value="completed">
            مكتمل (
            {maintenanceRequests.filter((r) => r.status === "مكتمل" || r.status === "مرفوض").length})
          </TabsTrigger>
          <TabsTrigger value="all">الكل ({filteredRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests
              .filter((r) => r.status === "جديد")
              .map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onSelect={() => handleSelectRequest(request)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests
              .filter((r) => r.status === "قيد التنفيذ")
              .map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onSelect={() => handleSelectRequest(request)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests
              .filter((r) => r.status === "مكتمل" || r.status === "مرفوض")
              .map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onSelect={() => handleSelectRequest(request)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onSelect={() => handleSelectRequest(request)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedRequest && <RequestDetailsDialog request={selectedRequest} />}
      </Dialog>
    </div>
  );
}

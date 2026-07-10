"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  Shield,
  Home,
  Phone,
  Mail,
  Edit,
  Trash2,
  Key,
  UserCog,
  CheckCircle,
  XCircle,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

// Mock data
const users = [
  {
    id: "1",
    name: "أحمد محمود حسن",
    phone: "01012345678",
    email: "ahmed@email.com",
    role: "admin",
    roleLabel: "مدير",
    apartment: null,
    status: "نشط",
    lastLogin: "2024-01-21T10:30:00",
    createdAt: "2023-06-15",
  },
  {
    id: "2",
    name: "محمد أحمد علي",
    phone: "01098765432",
    email: "mohamed@email.com",
    role: "owner",
    roleLabel: "مالك",
    apartment: "١٠١",
    status: "نشط",
    lastLogin: "2024-01-20T14:00:00",
    createdAt: "2023-07-20",
  },
  {
    id: "3",
    name: "فاطمة حسن إبراهيم",
    phone: "01122334455",
    email: "fatma@email.com",
    role: "tenant",
    roleLabel: "مستأجر",
    apartment: "٢٠١",
    status: "نشط",
    lastLogin: "2024-01-19T09:15:00",
    createdAt: "2023-09-10",
  },
  {
    id: "4",
    name: "خالد عبدالله محمد",
    phone: "01234567890",
    email: "khaled@email.com",
    role: "owner",
    roleLabel: "مالك",
    apartment: "٢٠٢",
    status: "نشط",
    lastLogin: "2024-01-18T16:45:00",
    createdAt: "2023-08-05",
  },
  {
    id: "5",
    name: "سارة محمد أحمد",
    phone: "01555666777",
    email: "sara@email.com",
    role: "owner",
    roleLabel: "مالك",
    apartment: "٣٠١",
    status: "معلق",
    lastLogin: null,
    createdAt: "2024-01-10",
  },
  {
    id: "6",
    name: "عمر حسين علي",
    phone: "01666777888",
    email: "omar@email.com",
    role: "tenant",
    roleLabel: "مستأجر",
    apartment: "٣٠٢",
    status: "غير نشط",
    lastLogin: "2023-12-01T08:00:00",
    createdAt: "2023-10-15",
  },
];

const stats = [
  {
    label: "إجمالي المستخدمين",
    value: 26,
    icon: User,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "المديرين",
    value: 3,
    icon: Shield,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    label: "الملاك",
    value: 18,
    icon: Home,
    color: "text-warning-foreground",
    bg: "bg-warning/10",
  },
  {
    label: "المستأجرين",
    value: 5,
    icon: UserCog,
    color: "text-success",
    bg: "bg-success/10",
  },
];

function getRoleBadge(role: string, roleLabel: string) {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 gap-1">
          <Shield className="h-3 w-3" />
          {roleLabel}
        </Badge>
      );
    case "owner":
      return (
        <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-0 gap-1">
          <Home className="h-3 w-3" />
          {roleLabel}
        </Badge>
      );
    case "tenant":
      return (
        <Badge variant="outline" className="gap-1">
          <User className="h-3 w-3" />
          {roleLabel}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{roleLabel}</Badge>;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "نشط":
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20 border-0 gap-1">
          <CheckCircle className="h-3 w-3" />
          نشط
        </Badge>
      );
    case "معلق":
      return (
        <Badge className="bg-warning/10 text-warning-foreground hover:bg-warning/20 border-0 gap-1">
          <Clock className="h-3 w-3" />
          معلق
        </Badge>
      );
    case "غير نشط":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0 gap-1">
          <XCircle className="h-3 w-3" />
          غير نشط
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("owner");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة مستخدم
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات المستخدم الجديد
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم بالكامل</Label>
            <Input id="name" placeholder="أدخل اسم المستخدم" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" placeholder="01xxxxxxxxx" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>نوع المستخدم</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="owner">مالك</SelectItem>
                <SelectItem value="tenant">مستأجر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(role === "owner" || role === "tenant") && (
            <div className="space-y-2">
              <Label>الشقة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الشقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="101">شقة ١٠١</SelectItem>
                  <SelectItem value="102">شقة ١٠٢</SelectItem>
                  <SelectItem value="201">شقة ٢٠١</SelectItem>
                  <SelectItem value="202">شقة ٢٠٢</SelectItem>
                  <SelectItem value="301">شقة ٣٠١</SelectItem>
                  <SelectItem value="302">شقة ٣٠٢</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور المؤقتة</Label>
            <Input
              id="password"
              type="password"
              placeholder="سيتم إرسالها للمستخدم"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch id="send-invite" defaultChecked />
            <Label htmlFor="send-invite" className="cursor-pointer">
              إرسال دعوة تسجيل عبر SMS
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={() => setOpen(false)}>إضافة المستخدم</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserDetailsDialog({ user }: { user: (typeof users)[0] }) {
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>تفاصيل المستخدم</DialogTitle>
        <DialogDescription>
          معلومات وإعدادات الحساب
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {getRoleBadge(user.role, user.roleLabel)}
              {getStatusBadge(user.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              رقم الهاتف
            </p>
            <p className="font-medium" dir="ltr">
              {user.phone}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              البريد الإلكتروني
            </p>
            <p className="font-medium" dir="ltr">
              {user.email}
            </p>
          </div>
          {user.apartment && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Home className="h-3.5 w-3.5" />
                الشقة
              </p>
              <p className="font-medium">شقة {user.apartment}</p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>
        </div>

        {user.lastLogin && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">آخر تسجيل دخول</p>
            <p className="font-medium">
              {new Date(user.lastLogin).toLocaleString("ar-EG")}
            </p>
          </div>
        )}
      </div>
      <DialogFooter className="flex-col sm:flex-row gap-2">
        <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
          <Key className="h-4 w-4" />
          إعادة تعيين كلمة المرور
        </Button>
        <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
          <Edit className="h-4 w-4" />
          تعديل البيانات
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.includes(searchQuery) ||
      user.phone.includes(searchQuery) ||
      user.email.includes(searchQuery);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">
            إدارة حسابات الملاك والمستأجرين والمديرين
          </p>
        </div>
        <AddUserDialog />
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

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الهاتف أو البريد..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="owner">مالك</SelectItem>
                  <SelectItem value="tenant">مستأجر</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="معلق">معلق</SelectItem>
                  <SelectItem value="غير نشط">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                الكل ({users.length})
              </TabsTrigger>
              <TabsTrigger value="admins">
                المديرين ({users.filter((u) => u.role === "admin").length})
              </TabsTrigger>
              <TabsTrigger value="owners">
                الملاك ({users.filter((u) => u.role === "owner").length})
              </TabsTrigger>
              <TabsTrigger value="tenants">
                المستأجرين ({users.filter((u) => u.role === "tenant").length})
              </TabsTrigger>
            </TabsList>

            {["all", "admins", "owners", "tenants"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المستخدم</TableHead>
                        <TableHead>الهاتف</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الشقة</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>آخر دخول</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers
                        .filter((u) => {
                          if (tab === "all") return true;
                          if (tab === "admins") return u.role === "admin";
                          if (tab === "owners") return u.role === "owner";
                          if (tab === "tenants") return u.role === "tenant";
                          return true;
                        })
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback>
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p
                                    className="text-xs text-muted-foreground"
                                    dir="ltr"
                                  >
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell dir="ltr" className="text-right">
                              {user.phone}
                            </TableCell>
                            <TableCell>
                              {getRoleBadge(user.role, user.roleLabel)}
                            </TableCell>
                            <TableCell>
                              {user.apartment ? (
                                <span>شقة {user.apartment}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>
                              {user.lastLogin ? (
                                <span className="text-sm">
                                  {new Date(user.lastLogin).toLocaleDateString(
                                    "ar-EG"
                                  )}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  لم يسجل دخول
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem
                                        onClick={() => setSelectedUser(user)}
                                      >
                                        <User className="h-4 w-4 ml-2" />
                                        عرض التفاصيل
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 ml-2" />
                                      تعديل
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Key className="h-4 w-4 ml-2" />
                                      إعادة تعيين كلمة المرور
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="h-4 w-4 ml-2" />
                                      حذف
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                {selectedUser && (
                                  <UserDetailsDialog user={selectedUser} />
                                )}
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

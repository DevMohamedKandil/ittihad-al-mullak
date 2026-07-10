"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Home,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const apartments = [
  {
    id: "1",
    number: "١٠١",
    floor: "الأول",
    area: 120,
    owner: {
      name: "محمد أحمد علي",
      phone: "01012345678",
      email: "mohamed@email.com",
      type: "مالك",
    },
    status: "مدفوع",
    balance: 0,
    lastPayment: "2024-01-15",
  },
  {
    id: "2",
    number: "١٠٢",
    floor: "الأول",
    area: 150,
    owner: {
      name: "أحمد محمود سعيد",
      phone: "01098765432",
      email: "ahmed@email.com",
      type: "مالك",
    },
    status: "متأخر",
    balance: 1500,
    lastPayment: "2023-11-20",
  },
  {
    id: "3",
    number: "٢٠١",
    floor: "الثاني",
    area: 120,
    owner: {
      name: "فاطمة حسن إبراهيم",
      phone: "01122334455",
      email: "fatma@email.com",
      type: "مستأجر",
    },
    status: "مدفوع",
    balance: 0,
    lastPayment: "2024-01-10",
  },
  {
    id: "4",
    number: "٢٠٢",
    floor: "الثاني",
    area: 150,
    owner: {
      name: "خالد عبدالله محمد",
      phone: "01234567890",
      email: "khaled@email.com",
      type: "مالك",
    },
    status: "جزئي",
    balance: 500,
    lastPayment: "2024-01-05",
  },
  {
    id: "5",
    number: "٣٠١",
    floor: "الثالث",
    area: 120,
    owner: {
      name: "سارة محمد أحمد",
      phone: "01555666777",
      email: "sara@email.com",
      type: "مالك",
    },
    status: "مدفوع",
    balance: 0,
    lastPayment: "2024-01-18",
  },
  {
    id: "6",
    number: "٣٠٢",
    floor: "الثالث",
    area: 150,
    owner: {
      name: "عمر حسين علي",
      phone: "01666777888",
      email: "omar@email.com",
      type: "مستأجر",
    },
    status: "متأخر",
    balance: 2000,
    lastPayment: "2023-10-15",
  },
];

const stats = [
  {
    label: "إجمالي الشقق",
    value: "24",
    icon: Building2,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "ملاك",
    value: "18",
    icon: User,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    label: "مستأجرين",
    value: "6",
    icon: Home,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "شقق متأخرة",
    value: "4",
    icon: Clock,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "مدفوع":
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
          <CheckCircle className="h-3 w-3 ml-1" />
          مدفوع
        </Badge>
      );
    case "متأخر":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">
          <XCircle className="h-3 w-3 ml-1" />
          متأخر
        </Badge>
      );
    case "جزئي":
      return (
        <Badge className="bg-warning/10 text-warning-foreground hover:bg-warning/20 border-0">
          <Clock className="h-3 w-3 ml-1" />
          جزئي
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function AddApartmentDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة شقة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>إضافة شقة جديدة</DialogTitle>
          <DialogDescription>
            أدخل بيانات الشقة والمالك/المستأجر
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apt-number">رقم الشقة</Label>
              <Input id="apt-number" placeholder="مثال: ١٠١" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">الدور</Label>
              <Select>
                <SelectTrigger id="floor">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ground">الأرضي</SelectItem>
                  <SelectItem value="1">الأول</SelectItem>
                  <SelectItem value="2">الثاني</SelectItem>
                  <SelectItem value="3">الثالث</SelectItem>
                  <SelectItem value="4">الرابع</SelectItem>
                  <SelectItem value="5">الخامس</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">المساحة (م²)</Label>
              <Input id="area" type="number" placeholder="مثال: 120" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">نوع المقيم</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">مالك</SelectItem>
                  <SelectItem value="tenant">مستأجر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">بيانات المقيم</h4>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner-name">الاسم بالكامل</Label>
                <Input id="owner-name" placeholder="أدخل اسم المالك/المستأجر" />
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
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={() => setOpen(false)}>حفظ الشقة</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApartmentDetailsDialog({ apartment }: { apartment: typeof apartments[0] }) {
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>تفاصيل الشقة {apartment.number}</DialogTitle>
        <DialogDescription>
          معلومات الشقة والمقيم
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">رقم الشقة</p>
            <p className="font-medium">{apartment.number}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">الدور</p>
            <p className="font-medium">{apartment.floor}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">المساحة</p>
            <p className="font-medium">{apartment.area} م²</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">حالة الدفع</p>
            {getStatusBadge(apartment.status)}
          </div>
        </div>
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">بيانات المقيم</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{apartment.owner.name}</span>
              <Badge variant="outline" className="mr-auto">
                {apartment.owner.type}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span dir="ltr">{apartment.owner.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span dir="ltr">{apartment.owner.email}</span>
            </div>
          </div>
        </div>
        {apartment.balance > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">المبلغ المستحق</span>
              <span className="text-lg font-bold text-destructive">
                {apartment.balance.toLocaleString("ar-EG")} ج.م
              </span>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

export default function ApartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApartment, setSelectedApartment] = useState<typeof apartments[0] | null>(null);

  const filteredApartments = apartments.filter((apt) => {
    const matchesSearch =
      apt.number.includes(searchQuery) ||
      apt.owner.name.includes(searchQuery) ||
      apt.owner.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الشقق</h1>
          <p className="text-muted-foreground">
            إدارة بيانات الشقق والملاك والمستأجرين
          </p>
        </div>
        <AddApartmentDialog />
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

      {/* Filters & Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث برقم الشقة أو اسم المالك أو الهاتف..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="حالة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="مدفوع">مدفوع</SelectItem>
                <SelectItem value="متأخر">متأخر</SelectItem>
                <SelectItem value="جزئي">جزئي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">عرض جدول</TabsTrigger>
              <TabsTrigger value="cards">عرض بطاقات</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الشقة</TableHead>
                      <TableHead>المقيم</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>المستحق</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApartments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">شقة {apt.number}</p>
                            <p className="text-sm text-muted-foreground">
                              الدور {apt.floor}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{apt.owner.name}</TableCell>
                        <TableCell dir="ltr" className="text-right">
                          {apt.owner.phone}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{apt.owner.type}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(apt.status)}</TableCell>
                        <TableCell>
                          {apt.balance > 0 ? (
                            <span className="font-medium text-destructive">
                              {apt.balance.toLocaleString("ar-EG")} ج.م
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
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
                                    onClick={() => setSelectedApartment(apt)}
                                  >
                                    <Eye className="h-4 w-4 ml-2" />
                                    عرض التفاصيل
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 ml-2" />
                                  تعديل
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 ml-2" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            {selectedApartment && (
                              <ApartmentDetailsDialog apartment={selectedApartment} />
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="cards">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredApartments.map((apt) => (
                  <Card key={apt.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            شقة {apt.number}
                          </CardTitle>
                          <CardDescription>
                            الدور {apt.floor} - {apt.area} م²
                          </CardDescription>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{apt.owner.name}</span>
                        <Badge variant="outline" className="mr-auto text-xs">
                          {apt.owner.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm" dir="ltr">
                          {apt.owner.phone}
                        </span>
                      </div>
                      {apt.balance > 0 && (
                        <div className="pt-3 border-t flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            المستحق
                          </span>
                          <span className="font-bold text-destructive">
                            {apt.balance.toLocaleString("ar-EG")} ج.م
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

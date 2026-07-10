"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Receipt,
  Send,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Building2,
  FileText,
  MessageSquare,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

// Mock data
const invoices = [
  {
    id: "INV-001",
    apartment: "١٠١",
    owner: "محمد أحمد علي",
    type: "شهرية",
    period: "يناير 2024",
    amount: 500,
    paid: 500,
    status: "مدفوع",
    dueDate: "2024-01-15",
    paidDate: "2024-01-10",
    items: [
      { name: "صيانة المصعد", amount: 150 },
      { name: "نظافة", amount: 100 },
      { name: "كهرباء عمومية", amount: 150 },
      { name: "مياه عمومية", amount: 100 },
    ],
  },
  {
    id: "INV-002",
    apartment: "١٠٢",
    owner: "أحمد محمود سعيد",
    type: "شهرية",
    period: "يناير 2024",
    amount: 625,
    paid: 0,
    status: "متأخر",
    dueDate: "2024-01-15",
    paidDate: null,
    items: [
      { name: "صيانة المصعد", amount: 187.5 },
      { name: "نظافة", amount: 125 },
      { name: "كهرباء عمومية", amount: 187.5 },
      { name: "مياه عمومية", amount: 125 },
    ],
  },
  {
    id: "INV-003",
    apartment: "٢٠١",
    owner: "فاطمة حسن إبراهيم",
    type: "شهرية",
    period: "يناير 2024",
    amount: 500,
    paid: 500,
    status: "مدفوع",
    dueDate: "2024-01-15",
    paidDate: "2024-01-12",
    items: [
      { name: "صيانة المصعد", amount: 150 },
      { name: "نظافة", amount: 100 },
      { name: "كهرباء عمومية", amount: 150 },
      { name: "مياه عمومية", amount: 100 },
    ],
  },
  {
    id: "INV-004",
    apartment: "٢٠٢",
    owner: "خالد عبدالله محمد",
    type: "شهرية",
    period: "يناير 2024",
    amount: 625,
    paid: 300,
    status: "جزئي",
    dueDate: "2024-01-15",
    paidDate: "2024-01-14",
    items: [
      { name: "صيانة المصعد", amount: 187.5 },
      { name: "نظافة", amount: 125 },
      { name: "كهرباء عمومية", amount: 187.5 },
      { name: "مياه عمومية", amount: 125 },
    ],
  },
  {
    id: "INV-005",
    apartment: "٣٠١",
    owner: "سارة محمد أحمد",
    type: "شهرية",
    period: "يناير 2024",
    amount: 500,
    paid: 500,
    status: "مدفوع",
    dueDate: "2024-01-15",
    paidDate: "2024-01-08",
    items: [
      { name: "صيانة المصعد", amount: 150 },
      { name: "نظافة", amount: 100 },
      { name: "كهرباء عمومية", amount: 150 },
      { name: "مياه عمومية", amount: 100 },
    ],
  },
];

const expenseCategories = [
  { id: "elevator", name: "صيانة المصعد", defaultAmount: 3000 },
  { id: "cleaning", name: "نظافة", defaultAmount: 2000 },
  { id: "electricity", name: "كهرباء عمومية", defaultAmount: 3000 },
  { id: "water", name: "مياه عمومية", defaultAmount: 2000 },
  { id: "security", name: "حارس", defaultAmount: 4000 },
  { id: "repairs", name: "إصلاحات طارئة", defaultAmount: 0 },
];

const stats = {
  totalInvoices: 24,
  totalAmount: 12500,
  collected: 9500,
  pending: 3000,
  collectionRate: 76,
};

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
    case "جديد":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
          <FileText className="h-3 w-3 ml-1" />
          جديد
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function CreateInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState("monthly");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "elevator",
    "cleaning",
    "electricity",
    "water",
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إنشاء فاتورة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء فواتير جديدة</DialogTitle>
          <DialogDescription>
            إنشاء فواتير لجميع الشقق أو شقق محددة
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع الفاتورة</Label>
              <Select value={invoiceType} onValueChange={setInvoiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهرية</SelectItem>
                  <SelectItem value="quarterly">ربع سنوية</SelectItem>
                  <SelectItem value="yearly">سنوية</SelectItem>
                  <SelectItem value="custom">مخصصة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الفترة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan-2024">يناير 2024</SelectItem>
                  <SelectItem value="feb-2024">فبراير 2024</SelectItem>
                  <SelectItem value="mar-2024">مارس 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>الشقق</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="جميع الشقق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الشقق</SelectItem>
                <SelectItem value="unpaid">الشقق المتأخرة فقط</SelectItem>
                <SelectItem value="select">اختيار شقق محددة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>بنود المصاريف</Label>
            <div className="border rounded-lg p-4 space-y-3">
              {expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category.id,
                          ]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category.id)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={category.id} className="cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                  <Input
                    type="number"
                    className="w-32"
                    defaultValue={category.defaultAmount}
                    disabled={!selectedCategories.includes(category.id)}
                    dir="ltr"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>تاريخ الاستحقاق</Label>
            <Input type="date" />
          </div>

          <div className="space-y-2">
            <Label>ملاحظات (اختياري)</Label>
            <Textarea placeholder="أي ملاحظات إضافية على الفاتورة..." />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              <Checkbox id="send-notification" defaultChecked />
              <Label htmlFor="send-notification" className="cursor-pointer">
                إرسال إشعار للملاك عند إنشاء الفواتير
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={() => setOpen(false)}>إنشاء الفواتير</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InvoiceDetailsDialog({
  invoice,
}: {
  invoice: (typeof invoices)[0];
}) {
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>تفاصيل الفاتورة {invoice.id}</DialogTitle>
        <DialogDescription>
          شقة {invoice.apartment} - {invoice.period}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">المالك</p>
            <p className="font-medium">{invoice.owner}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">نوع الفاتورة</p>
            <p className="font-medium">{invoice.type}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">تاريخ الاستحقاق</p>
            <p className="font-medium">
              {new Date(invoice.dueDate).toLocaleDateString("ar-EG")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">الحالة</p>
            {getStatusBadge(invoice.status)}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">تفاصيل البنود</h4>
          <div className="space-y-2">
            {invoice.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>{item.amount.toLocaleString("ar-EG")} ج.م</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>الإجمالي</span>
              <span>{invoice.amount.toLocaleString("ar-EG")} ج.م</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">المدفوع</span>
            <span className="font-medium text-success">
              {invoice.paid.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">المتبقي</span>
            <span className="font-medium text-destructive">
              {(invoice.amount - invoice.paid).toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        </div>
      </div>
      <DialogFooter className="flex-col sm:flex-row gap-2">
        <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
          <Download className="h-4 w-4" />
          تحميل PDF
        </Button>
        <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
          <MessageSquare className="h-4 w-4" />
          تذكير بالدفع
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function SendRemindersDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Send className="h-4 w-4" />
          إرسال تذكيرات
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إرسال تذكيرات الدفع</DialogTitle>
          <DialogDescription>
            إرسال تذكيرات للملاك المتأخرين في الدفع
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>نوع الإشعار</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Checkbox id="whatsapp" defaultChecked />
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
              <div className="flex items-center gap-3">
                <Checkbox id="app-notification" defaultChecked />
                <Label htmlFor="app-notification" className="cursor-pointer">
                  إشعار التطبيق
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>المستهدفين</Label>
            <Select defaultValue="overdue">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overdue">المتأخرين فقط (4 شقق)</SelectItem>
                <SelectItem value="partial">المدفوع جزئياً (2 شقق)</SelectItem>
                <SelectItem value="all-unpaid">جميع غير المدفوع (6 شقق)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>نص الرسالة</Label>
            <Textarea
              defaultValue="السلام عليكم، نود تذكيركم بسداد مستحقات اتحاد الملاك لشهر يناير. يرجى السداد في أقرب وقت. شكراً لتعاونكم."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={() => setOpen(false)}>إرسال التذكيرات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<
    (typeof invoices)[0] | null
  >(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.includes(searchQuery) ||
      inv.apartment.includes(searchQuery) ||
      inv.owner.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الفواتير</h1>
          <p className="text-muted-foreground">
            إنشاء ومتابعة فواتير المصاريف المشتركة
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SendRemindersDialog />
          <CreateInvoiceDialog />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الفواتير</p>
                <p className="text-xl font-bold">{stats.totalInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Building2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المطلوب</p>
                <p className="text-xl font-bold">
                  {stats.totalAmount.toLocaleString("ar-EG")} ج.م
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المحصل</p>
                <p className="text-xl font-bold">
                  {stats.collected.toLocaleString("ar-EG")} ج.م
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Clock className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المتأخر</p>
                <p className="text-xl font-bold">
                  {stats.pending.toLocaleString("ar-EG")} ج.م
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">نسبة التحصيل هذا الشهر</span>
            <span className="text-lg font-bold text-primary">
              {stats.collectionRate}%
            </span>
          </div>
          <Progress value={stats.collectionRate} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            تم تحصيل {stats.collected.toLocaleString("ar-EG")} ج.م من أصل{" "}
            {stats.totalAmount.toLocaleString("ar-EG")} ج.م
          </p>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث برقم الفاتورة أو الشقة أو اسم المالك..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="مدفوع">مدفوع</SelectItem>
                  <SelectItem value="متأخر">متأخر</SelectItem>
                  <SelectItem value="جزئي">جزئي</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan-2024">يناير 2024</SelectItem>
                  <SelectItem value="dec-2023">ديسمبر 2023</SelectItem>
                  <SelectItem value="nov-2023">نوفمبر 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>الشقة</TableHead>
                  <TableHead>المالك</TableHead>
                  <TableHead>الفترة</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>المدفوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>
                    <TableCell>شقة {inv.apartment}</TableCell>
                    <TableCell>{inv.owner}</TableCell>
                    <TableCell>{inv.period}</TableCell>
                    <TableCell>
                      {inv.amount.toLocaleString("ar-EG")} ج.م
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          inv.paid === inv.amount
                            ? "text-success"
                            : inv.paid > 0
                              ? "text-warning-foreground"
                              : "text-muted-foreground"
                        }
                      >
                        {inv.paid.toLocaleString("ar-EG")} ج.م
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(inv.status)}</TableCell>
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
                                onClick={() => setSelectedInvoice(inv)}
                              >
                                <Eye className="h-4 w-4 ml-2" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 ml-2" />
                              تحميل PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 ml-2" />
                              إرسال تذكير
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {selectedInvoice && (
                          <InvoiceDetailsDialog invoice={selectedInvoice} />
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

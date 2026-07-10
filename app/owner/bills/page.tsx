"use client";

import { useState } from "react";
import { OwnerHeader } from "@/components/owner/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Smartphone,
  Building2,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Bill {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "paid" | "due" | "overdue" | "partial";
  paidDate?: string;
  paidAmount?: number;
}

const allBills: Bill[] = [
  {
    id: "1",
    title: "اشتراك شهر فبراير",
    description: "الاشتراك الشهري للخدمات المشتركة",
    amount: 1000,
    dueDate: "١٥ فبراير ٢٠٢٦",
    status: "due",
  },
  {
    id: "2",
    title: "صيانة المصعد (سنوي)",
    description: "نصيب الشقة من صيانة المصعد السنوية",
    amount: 500,
    dueDate: "١ فبراير ٢٠٢٦",
    status: "overdue",
  },
  {
    id: "3",
    title: "اشتراك شهر يناير",
    description: "الاشتراك الشهري للخدمات المشتركة",
    amount: 1000,
    dueDate: "١٥ يناير ٢٠٢٦",
    status: "paid",
    paidDate: "١٤ يناير ٢٠٢٦",
  },
  {
    id: "4",
    title: "اشتراك شهر ديسمبر",
    description: "الاشتراك الشهري للخدمات المشتركة",
    amount: 1000,
    dueDate: "١٥ ديسمبر ٢٠٢٥",
    status: "paid",
    paidDate: "١٢ ديسمبر ٢٠٢٥",
  },
  {
    id: "5",
    title: "رسوم إضافية - تنظيف",
    description: "تنظيف خزان المياه",
    amount: 200,
    dueDate: "١ ديسمبر ٢٠٢٥",
    status: "paid",
    paidDate: "٣٠ نوفمبر ٢٠٢٥",
  },
];

const statusConfig = {
  paid: {
    label: "مدفوع",
    icon: CheckCircle2,
    className: "bg-success/10 text-success",
    badgeClass: "bg-success text-success-foreground",
  },
  due: {
    label: "مستحق",
    icon: Clock,
    className: "bg-warning/10 text-warning",
    badgeClass: "bg-warning text-warning-foreground",
  },
  overdue: {
    label: "متأخر",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive",
    badgeClass: "bg-destructive text-destructive-foreground",
  },
  partial: {
    label: "جزئي",
    icon: Clock,
    className: "bg-primary/10 text-primary",
    badgeClass: "bg-primary text-primary-foreground",
  },
};

const paymentMethods = [
  {
    id: "fawry",
    name: "فوري",
    icon: Smartphone,
    description: "ادفع عبر أي منفذ فوري",
  },
  {
    id: "card",
    name: "بطاقة ائتمان",
    icon: CreditCard,
    description: "فيزا أو ماستركارد",
  },
  {
    id: "bank",
    name: "تحويل بنكي",
    icon: Building2,
    description: "تحويل مباشر للحساب البنكي",
  },
  {
    id: "cash",
    name: "نقداً",
    icon: Banknote,
    description: "الدفع للجنة الإدارة",
  },
];

function BillCard({ bill }: { bill: Bill }) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const StatusIcon = statusConfig[bill.status].icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0",
              statusConfig[bill.status].className
            )}
          >
            <StatusIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{bill.title}</h3>
              <Badge
                className={cn("text-xs", statusConfig[bill.status].badgeClass)}
              >
                {statusConfig[bill.status].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {bill.description}
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {bill.status === "paid" ? (
                <span>تم الدفع: {bill.paidDate}</span>
              ) : (
                <span>تاريخ الاستحقاق: {bill.dueDate}</span>
              )}
            </div>
          </div>
          <div className="text-left">
            <p className="font-bold text-xl">
              {bill.amount.toLocaleString("ar-EG")}
            </p>
            <p className="text-xs text-muted-foreground">جنيه</p>
          </div>
        </div>

        {bill.status !== "paid" && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 gap-2">
                  <CreditCard className="h-4 w-4" />
                  ادفع الآن
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>اختر طريقة الدفع</DialogTitle>
                  <DialogDescription>
                    المبلغ المستحق: {bill.amount.toLocaleString("ar-EG")} ج.م
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border hover:bg-accent transition-colors text-right"
                      onClick={() => {
                        // Handle payment
                        setIsPaymentOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                        <method.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}

        {bill.status === "paid" && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" className="flex-1 gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              تحميل الإيصال
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function BillsPage() {
  const pendingBills = allBills.filter((bill) => bill.status !== "paid");
  const paidBills = allBills.filter((bill) => bill.status === "paid");
  const totalDue = pendingBills.reduce((acc, bill) => acc + bill.amount, 0);

  return (
    <div>
      <OwnerHeader title="الفواتير" />

      <div className="p-4 space-y-6">
        {/* Summary Card */}
        <Card className="bg-gradient-to-l from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-5">
            <p className="text-sm opacity-90">إجمالي المستحق</p>
            <p className="text-3xl font-bold mt-1">
              {totalDue.toLocaleString("ar-EG")} ج.م
            </p>
            <p className="text-sm opacity-90 mt-2">
              {pendingBills.length} فواتير مستحقة
            </p>
            {totalDue > 0 && (
              <Button
                variant="secondary"
                className="w-full mt-4 gap-2"
                size="lg"
              >
                <CreditCard className="h-5 w-5" />
                ادفع كل المستحقات
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Bills Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="pending" className="gap-2">
              مستحقة
              {pendingBills.length > 0 && (
                <Badge variant="secondary" className="h-5 w-5 p-0 justify-center">
                  {pendingBills.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="paid">مدفوعة</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-4">
            {pendingBills.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                  <p className="font-medium text-lg">لا توجد فواتير مستحقة</p>
                  <p className="text-sm text-muted-foreground">
                    جميع الفواتير مدفوعة
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingBills.map((bill) => <BillCard key={bill.id} bill={bill} />)
            )}
          </TabsContent>

          <TabsContent value="paid" className="mt-4 space-y-4">
            {paidBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

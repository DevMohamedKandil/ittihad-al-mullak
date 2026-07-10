"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CreditCard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "due" | "overdue" | "partial";
  paidAmount?: number;
}

const bills: Bill[] = [
  {
    id: "1",
    title: "اشتراك شهر فبراير",
    amount: 1000,
    dueDate: "١٥ فبراير ٢٠٢٦",
    status: "due",
  },
  {
    id: "2",
    title: "صيانة المصعد (سنوي)",
    amount: 500,
    dueDate: "١ فبراير ٢٠٢٦",
    status: "overdue",
  },
];

const statusConfig = {
  due: {
    label: "مستحق",
    className: "bg-warning/10 text-warning",
  },
  overdue: {
    label: "متأخر",
    className: "bg-destructive/10 text-destructive",
  },
  partial: {
    label: "جزئي",
    className: "bg-primary/10 text-primary",
  },
};

export function PendingBills() {
  const totalDue = bills.reduce((acc, bill) => acc + bill.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">الفواتير المستحقة</CardTitle>
            <CardDescription>
              إجمالي المستحق: {totalDue.toLocaleString("ar-EG")} ج.م
            </CardDescription>
          </div>
          <Link href="/owner/bills">
            <Button variant="ghost" size="sm" className="gap-1">
              الكل
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{bill.title}</h4>
                <Badge
                  variant="secondary"
                  className={cn("text-xs", statusConfig[bill.status].className)}
                >
                  {statusConfig[bill.status].label}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {bill.dueDate}
              </div>
            </div>
            <div className="text-left">
              <p className="font-bold text-lg">
                {bill.amount.toLocaleString("ar-EG")} ج.م
              </p>
            </div>
          </div>
        ))}

        <Button className="w-full gap-2 mt-4" size="lg">
          <CreditCard className="h-5 w-5" />
          ادفع الآن
        </Button>

        <div className="flex items-center justify-center gap-4 pt-2">
          <span className="text-xs text-muted-foreground">طرق الدفع:</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              فوري
            </Badge>
            <Badge variant="outline" className="text-xs">
              بطاقة
            </Badge>
            <Badge variant="outline" className="text-xs">
              تحويل
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

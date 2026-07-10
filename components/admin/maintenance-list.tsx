"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wrench, Clock, CheckCircle2, AlertCircle, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaintenanceRequest {
  id: string;
  title: string;
  apartment: string;
  requester: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  date: string;
}

const requests: MaintenanceRequest[] = [
  {
    id: "1",
    title: "تسريب مياه في السقف",
    apartment: "٣٠١",
    requester: "عمر خالد",
    status: "pending",
    priority: "high",
    date: "منذ ساعتين",
  },
  {
    id: "2",
    title: "عطل في المصعد",
    apartment: "عام",
    requester: "محمد أحمد",
    status: "in-progress",
    priority: "high",
    date: "منذ ٣ ساعات",
  },
  {
    id: "3",
    title: "إضاءة السلم الثاني",
    apartment: "عام",
    requester: "سارة محمود",
    status: "pending",
    priority: "medium",
    date: "منذ يوم",
  },
  {
    id: "4",
    title: "صيانة مضخة المياه",
    apartment: "عام",
    requester: "لجنة الإدارة",
    status: "completed",
    priority: "high",
    date: "منذ ٣ أيام",
  },
  {
    id: "5",
    title: "تنظيف خزان المياه",
    apartment: "عام",
    requester: "لجنة الإدارة",
    status: "pending",
    priority: "low",
    date: "منذ أسبوع",
  },
];

const statusConfig = {
  pending: {
    label: "قيد الانتظار",
    icon: Clock,
    className: "text-warning bg-warning/10",
  },
  "in-progress": {
    label: "جاري التنفيذ",
    icon: Wrench,
    className: "text-primary bg-primary/10",
  },
  completed: {
    label: "مكتمل",
    icon: CheckCircle2,
    className: "text-success bg-success/10",
  },
};

const priorityConfig = {
  low: { label: "منخفض", className: "bg-muted text-muted-foreground" },
  medium: { label: "متوسط", className: "bg-warning/10 text-warning" },
  high: { label: "عاجل", className: "bg-destructive/10 text-destructive" },
};

export function MaintenanceList() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">طلبات الصيانة</CardTitle>
            <CardDescription>آخر الطلبات الواردة</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            عرض الكل
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-6 space-y-4 pb-6">
            {requests.map((request) => {
              const StatusIcon = statusConfig[request.status].icon;
              return (
                <div
                  key={request.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                      statusConfig[request.status].className
                    )}
                  >
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium truncate">{request.title}</h4>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "flex-shrink-0 text-xs",
                          priorityConfig[request.priority].className
                        )}
                      >
                        {priorityConfig[request.priority].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      شقة {request.apartment} • {request.requester}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          statusConfig[request.status].className
                        )}
                      >
                        {statusConfig[request.status].label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {request.date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

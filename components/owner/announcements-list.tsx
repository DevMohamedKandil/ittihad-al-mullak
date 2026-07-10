"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Megaphone, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "general" | "urgent" | "financial";
  isNew?: boolean;
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "موعد صيانة المصعد",
    content:
      "سيتم إيقاف المصعد يوم الخميس من الساعة ١٠ صباحاً حتى ٤ عصراً للصيانة الدورية",
    date: "٢ فبراير ٢٠٢٦",
    type: "general",
    isNew: true,
  },
  {
    id: "2",
    title: "انقطاع المياه",
    content: "سيتم قطع المياه غداً من ٩ صباحاً حتى ١٢ ظهراً",
    date: "٣٠ يناير ٢٠٢٦",
    type: "urgent",
    isNew: true,
  },
  {
    id: "3",
    title: "تذكير بسداد الاشتراكات",
    content: "نذكر السادة الملاك بسداد اشتراكات شهر فبراير قبل يوم ١٥",
    date: "١ فبراير ٢٠٢٦",
    type: "financial",
    isNew: true,
  },
];

const typeConfig = {
  general: {
    icon: Megaphone,
    className: "bg-primary/10 text-primary",
  },
  urgent: {
    icon: AlertTriangle,
    className: "bg-destructive/10 text-destructive",
  },
  financial: {
    icon: Megaphone,
    className: "bg-success/10 text-success",
  },
};

export function AnnouncementsList() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">الإعلانات</CardTitle>
            <CardDescription>آخر الأخبار والتنبيهات</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            الكل
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {announcements.map((announcement) => {
          const Icon = typeConfig[announcement.type].icon;
          return (
            <div
              key={announcement.id}
              className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                    typeConfig[announcement.type].className
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{announcement.title}</h4>
                    {announcement.isNew && (
                      <Badge className="text-[10px] px-1.5 py-0">جديد</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {announcement.date}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

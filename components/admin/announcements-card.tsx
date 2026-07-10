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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Plus, ChevronLeft, Megaphone, Calendar } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "general" | "urgent" | "financial";
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "موعد صيانة المصعد",
    content:
      "سيتم إيقاف المصعد يوم الخميس من الساعة ١٠ صباحاً حتى ٤ عصراً للصيانة الدورية",
    date: "٢ فبراير ٢٠٢٦",
    type: "general",
  },
  {
    id: "2",
    title: "تذكير بسداد الاشتراكات",
    content: "نذكر السادة الملاك بسداد اشتراكات شهر فبراير قبل يوم ١٥",
    date: "١ فبراير ٢٠٢٦",
    type: "financial",
  },
  {
    id: "3",
    title: "انقطاع المياه",
    content: "سيتم قطع المياه غداً من ٩ صباحاً حتى ١٢ ظهراً بسبب أعمال الصيانة",
    date: "٣٠ يناير ٢٠٢٦",
    type: "urgent",
  },
];

const typeConfig = {
  general: {
    label: "عام",
    className: "bg-primary/10 text-primary",
  },
  urgent: {
    label: "عاجل",
    className: "bg-destructive/10 text-destructive",
  },
  financial: {
    label: "مالي",
    className: "bg-success/10 text-success",
  },
};

export function AnnouncementsCard() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">الإعلانات</CardTitle>
            <CardDescription>آخر الإعلانات والتنبيهات</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              إضافة
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          <div className="px-6 space-y-4 pb-6">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                      <Megaphone className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-medium">{announcement.title}</h4>
                  </div>
                  <Badge
                    variant="secondary"
                    className={typeConfig[announcement.type].className}
                  >
                    {typeConfig[announcement.type].label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {announcement.content}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {announcement.date}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full gap-1">
            عرض كل الإعلانات
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

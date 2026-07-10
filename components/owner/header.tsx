"use client";

import { Bell, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function OwnerHeader({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">{title || "اتحاد الملاك"}</h1>
            <p className="text-xs text-muted-foreground">عمارة النيل - المعادي</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
            ٣
          </Badge>
        </Button>
      </div>
    </header>
  );
}

"use client";

import React from "react"

import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Wrench, Bell, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
}

function QuickStat({ icon, label, value, iconBg }: QuickStatProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0",
            iconBg
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-bold text-lg truncate">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStats() {
  const stats = [
    {
      icon: <Receipt className="h-5 w-5 text-destructive" />,
      label: "المستحق",
      value: "١,٥٠٠ ج.م",
      iconBg: "bg-destructive/10",
    },
    {
      icon: <CreditCard className="h-5 w-5 text-success" />,
      label: "آخر دفعة",
      value: "١٥ يناير",
      iconBg: "bg-success/10",
    },
    {
      icon: <Wrench className="h-5 w-5 text-warning" />,
      label: "طلبات صيانة",
      value: "٢ نشط",
      iconBg: "bg-warning/10",
    },
    {
      icon: <Bell className="h-5 w-5 text-primary" />,
      label: "إعلانات جديدة",
      value: "٣",
      iconBg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <QuickStat key={stat.label} {...stat} />
      ))}
    </div>
  );
}

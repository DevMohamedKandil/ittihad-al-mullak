"use client";

import React from "react"

import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Wrench,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  iconBg,
}: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {trend === "up" && (
                  <TrendingUp className="h-4 w-4 text-success" />
                )}
                {trend === "down" && (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    trend === "up" && "text-success",
                    trend === "down" && "text-destructive",
                    trend === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change}
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl",
              iconBg
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: "نسبة التحصيل",
      value: "78%",
      change: "+5% من الشهر الماضي",
      trend: "up" as const,
      icon: <Wallet className="h-6 w-6 text-primary" />,
      iconBg: "bg-primary/10",
    },
    {
      title: "إجمالي المصروفات",
      value: "٢٤,٥٠٠ ج.م",
      change: "-12% من الشهر الماضي",
      trend: "down" as const,
      icon: <Receipt className="h-6 w-6 text-success" />,
      iconBg: "bg-success/10",
    },
    {
      title: "طلبات الصيانة",
      value: "١٢",
      change: "٣ طلبات جديدة",
      trend: "neutral" as const,
      icon: <Wrench className="h-6 w-6 text-warning" />,
      iconBg: "bg-warning/10",
    },
    {
      title: "عدد السكان",
      value: "٤٨",
      change: "في ٢٤ شقة",
      trend: "neutral" as const,
      icon: <Users className="h-6 w-6 text-primary" />,
      iconBg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

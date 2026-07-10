"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Receipt,
  Wrench,
  MessageSquare,
  User,
} from "lucide-react";

const navItems = [
  {
    label: "الرئيسية",
    href: "/owner",
    icon: Home,
  },
  {
    label: "الفواتير",
    href: "/owner/bills",
    icon: Receipt,
  },
  {
    label: "الصيانة",
    href: "/owner/maintenance",
    icon: Wrench,
  },
  {
    label: "المحادثات",
    href: "/owner/messages",
    icon: MessageSquare,
  },
  {
    label: "حسابي",
    href: "/owner/profile",
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/owner" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[64px] active:scale-95",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "text-primary scale-110"
                )}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

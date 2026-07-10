import React from "react"
import { MobileNav } from "@/components/owner/mobile-nav";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-20">
      {children}
      <MobileNav />
    </div>
  );
}

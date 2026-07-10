import { OwnerHeader } from "@/components/owner/header";
import { QuickStats } from "@/components/owner/quick-stats";
import { PendingBills } from "@/components/owner/pending-bills";
import { AnnouncementsList } from "@/components/owner/announcements-list";

export default function OwnerHome() {
  return (
    <div>
      <OwnerHeader />
      
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-l from-primary to-primary/80 text-primary-foreground rounded-2xl p-5">
          <p className="text-sm opacity-90">مرحباً</p>
          <h2 className="text-xl font-bold mt-1">أحمد محمود</h2>
          <p className="text-sm opacity-90 mt-1">شقة ٣٠١ - الطابق الثالث</p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Pending Bills */}
        <PendingBills />

        {/* Announcements */}
        <AnnouncementsList />
      </div>
    </div>
  );
}

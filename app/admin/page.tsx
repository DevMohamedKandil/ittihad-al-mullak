import { StatsCards } from "@/components/admin/stats-cards";
import { ApartmentsTable } from "@/components/admin/apartments-table";
import { MaintenanceList } from "@/components/admin/maintenance-list";
import { AnnouncementsCard } from "@/components/admin/announcements-card";
import { CollectionChart } from "@/components/admin/collection-chart";
import { Button } from "@/components/ui/button";
import { Plus, Download, Bell } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            مرحباً بك في لوحة إدارة اتحاد الملاك
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة فاتورة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts */}
      <CollectionChart />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Apartments Table - takes 3 columns */}
        <div className="lg:col-span-3">
          <ApartmentsTable />
        </div>

        {/* Side Panel - takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <MaintenanceList />
          <AnnouncementsCard />
        </div>
      </div>
    </div>
  );
}

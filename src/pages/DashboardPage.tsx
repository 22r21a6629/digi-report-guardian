
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { NotificationBar } from "@/components/dashboard/NotificationBar";

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-4 sm:space-y-6">
        <NotificationBar />
        <DashboardStats />
        
        <div>
          <RecentReports />
        </div>
      </div>
    </AppLayout>
  );
}

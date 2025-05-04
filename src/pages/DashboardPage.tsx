
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { HealthSummary } from "@/components/dashboard/HealthSummary";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { NotificationBar } from "@/components/dashboard/NotificationBar";

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        <NotificationBar />
        <DashboardStats />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <RecentReports />
          </div>
          <div className="space-y-6">
            <HealthSummary />
            <UpcomingAppointments />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

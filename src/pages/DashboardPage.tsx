
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { HealthSummary } from "@/components/dashboard/HealthSummary";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { NotificationBar } from "@/components/dashboard/NotificationBar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardPage() {
  const isMobile = useIsMobile();
  
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-4 sm:space-y-6">
        <NotificationBar />
        <DashboardStats />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="col-span-1 md:col-span-2 order-2 md:order-1">
            <RecentReports />
          </div>
          <div className="space-y-4 sm:space-y-6 order-1 md:order-2">
            <HealthSummary />
            <UpcomingAppointments />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

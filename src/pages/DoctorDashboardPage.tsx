
import { AppLayout } from "@/components/layout/AppLayout";
import { DoctorStats } from "@/components/dashboard/doctor/DoctorStats";
import { DoctorNotificationBar } from "@/components/dashboard/doctor/DoctorNotificationBar";
import { PatientReportUpload } from "@/components/reports/PatientReportUpload";

export default function DoctorDashboardPage() {
  return (
    <AppLayout title="Doctor Dashboard">
      <div className="space-y-4 sm:space-y-6">
        <DoctorNotificationBar />
        <DoctorStats />
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Patient Reports</h2>
          <PatientReportUpload />
        </div>
      </div>
    </AppLayout>
  );
}

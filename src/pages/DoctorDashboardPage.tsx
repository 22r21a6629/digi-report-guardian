
import { AppLayout } from "@/components/layout/AppLayout";
import { DoctorStats } from "@/components/dashboard/doctor/DoctorStats";
import { DoctorNotificationBar } from "@/components/dashboard/doctor/DoctorNotificationBar";
import { PatientReportUpload } from "@/components/reports/PatientReportUpload";
import { DoctorPatientUpload } from "@/components/reports/DoctorPatientUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DoctorDashboardPage() {
  return (
    <AppLayout title="Doctor Dashboard - DiagnoWeb">
      <div className="space-y-4 sm:space-y-6">
        <DoctorNotificationBar />
        <DoctorStats />
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Patient Report Management</h2>
          
          <Tabs defaultValue="patient-upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient-upload">Upload for Patient</TabsTrigger>
              <TabsTrigger value="search-upload">Search & Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient-upload" className="mt-6">
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Upload reports directly for a patient using their email and PIN
                </div>
                <DoctorPatientUpload />
              </div>
            </TabsContent>
            
            <TabsContent value="search-upload" className="mt-6">
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Search for patients and upload reports (legacy method)
                </div>
                <PatientReportUpload />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}


import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DoctorNotificationBar() {
  return (
    <Alert className="bg-dignoweb-primary/10 border-dignoweb-primary">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Welcome to your Doctor Dashboard</AlertTitle>
      <AlertDescription>
        You can upload and manage patient reports from here. Search for patients by email or ID to upload their medical reports.
      </AlertDescription>
    </Alert>
  );
}

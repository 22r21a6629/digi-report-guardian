
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";

type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
};

const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "2025-04-20",
    time: "10:30 AM",
    location: "City General Hospital"
  },
  {
    id: "2",
    doctor: "Dr. Michael Chen",
    specialty: "Dermatologist",
    date: "2025-05-05",
    time: "2:00 PM",
    location: "MedStar Clinic"
  }
];

export function UpcomingAppointments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Upcoming Appointments</CardTitle>
        <Button variant="outline" size="sm">
          Schedule New
        </Button>
      </CardHeader>
      <CardContent>
        {mockAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CalendarClock className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="flex flex-col p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{appointment.doctor}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                  </div>
                  <Badge variant="outline" className="pill-badge bg-blue-100 text-blue-800">
                    Upcoming
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 text-sm gap-2 mt-2">
                  <div>
                    <p className="text-muted-foreground">Date:</p>
                    <p>{new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time:</p>
                    <p>{appointment.time}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Location:</p>
                    <p>{appointment.location}</p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button variant="outline" size="sm" className="text-red-500">Cancel</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

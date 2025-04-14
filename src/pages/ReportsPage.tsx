
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Filter } from "lucide-react";
import { useState } from "react";

type Report = {
  id: string;
  title: string;
  type: string;
  date: string;
  hospital: string;
  status: "normal" | "abnormal" | "critical";
};

const mockReports: Report[] = [
  {
    id: "1",
    title: "Complete Blood Count",
    type: "Blood Test",
    date: "2025-04-10",
    hospital: "City General Hospital",
    status: "normal"
  },
  {
    id: "2",
    title: "Chest X-Ray",
    type: "Radiology",
    date: "2025-04-05",
    hospital: "MedStar Clinic",
    status: "normal"
  },
  {
    id: "3",
    title: "Lipid Profile",
    type: "Blood Test",
    date: "2025-03-28",
    hospital: "Health First Medical",
    status: "abnormal"
  },
  {
    id: "4",
    title: "Liver Function Test",
    type: "Blood Test",
    date: "2025-03-15",
    hospital: "City General Hospital",
    status: "critical"
  },
  {
    id: "5",
    title: "Urinalysis",
    type: "Urine Test",
    date: "2025-03-10",
    hospital: "MedStar Clinic",
    status: "normal"
  },
  {
    id: "6",
    title: "Electrocardiogram",
    type: "Cardiac",
    date: "2025-02-22",
    hospital: "Heart & Vascular Institute",
    status: "abnormal"
  }
];

const getStatusColor = (status: Report["status"]) => {
  switch (status) {
    case "normal":
      return "bg-green-100 text-green-800";
    case "abnormal":
      return "bg-yellow-100 text-yellow-800";
    case "critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ReportsPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredReports = mockReports.filter(report => {
    // Apply status filter if selected
    if (filterStatus && report.status !== filterStatus) {
      return false;
    }
    
    // Apply search term if entered
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !report.hospital.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <AppLayout title="My Reports">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-3 pr-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-dignoweb-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={filterStatus === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterStatus(null)}
            >
              All
            </Button>
            <Button 
              variant={filterStatus === "normal" ? "default" : "outline"} 
              size="sm"
              className={filterStatus === "normal" ? "" : "text-green-800"}
              onClick={() => setFilterStatus("normal")}
            >
              Normal
            </Button>
            <Button 
              variant={filterStatus === "abnormal" ? "default" : "outline"} 
              size="sm"
              className={filterStatus === "abnormal" ? "" : "text-yellow-800"}
              onClick={() => setFilterStatus("abnormal")}
            >
              Abnormal
            </Button>
            <Button 
              variant={filterStatus === "critical" ? "default" : "outline"} 
              size="sm"
              className={filterStatus === "critical" ? "" : "text-red-800"}
              onClick={() => setFilterStatus("critical")}
            >
              Critical
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>All Reports</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium">Title</th>
                    <th className="text-left py-3 px-2 text-sm font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-sm font-medium">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-medium">Hospital</th>
                    <th className="text-left py-3 px-2 text-sm font-medium">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-2 text-sm">{report.title}</td>
                        <td className="py-3 px-2 text-sm">{report.type}</td>
                        <td className="py-3 px-2 text-sm">{report.date}</td>
                        <td className="py-3 px-2 text-sm">{report.hospital}</td>
                        <td className="py-3 px-2 text-sm">
                          <Badge variant="outline" className={`pill-badge ${getStatusColor(report.status)}`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="icon" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No reports found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

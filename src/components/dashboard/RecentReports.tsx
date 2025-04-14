
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";

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

export function RecentReports() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Reports</CardTitle>
        <Button variant="outline" size="sm">
          View all
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
              {mockReports.map((report) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

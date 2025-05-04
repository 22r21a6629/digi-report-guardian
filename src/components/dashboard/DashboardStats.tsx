
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function DashboardStats() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = (destination: string, title: string) => {
    navigate(destination);
    toast({
      title: `Navigating to ${title}`,
      description: `Viewing ${title.toLowerCase()} details`,
      duration: 3000,
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="border-l-4 border-l-dignoweb-primary hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleCardClick("/reports", "Total Reports")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">42</div>
          <p className="text-xs text-muted-foreground">
            +4 from last month
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="border-l-4 border-l-dignoweb-secondary hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleCardClick("/upload", "Recent Uploads")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
          <Upload className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-muted-foreground">
            In the last 30 days
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="border-l-4 border-l-dignoweb-accent hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleCardClick("/reports?status=pending", "Pending Reviews")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">
            Waiting for doctor review
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleCardClick("/reports?status=critical", "Critical Alerts")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">
            Requires attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, Thermometer, Droplet } from "lucide-react";

export function HealthSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Heart className="h-8 w-8 text-red-500 mb-2" />
            <div className="text-xl font-bold">72 BPM</div>
            <div className="text-sm text-muted-foreground">Heart Rate</div>
          </div>
          
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Activity className="h-8 w-8 text-dignoweb-primary mb-2" />
            <div className="text-xl font-bold">120/80</div>
            <div className="text-sm text-muted-foreground">Blood Pressure</div>
          </div>
          
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Thermometer className="h-8 w-8 text-amber-500 mb-2" />
            <div className="text-xl font-bold">98.6°F</div>
            <div className="text-sm text-muted-foreground">Temperature</div>
          </div>
          
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Droplet className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Oxygen</div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Last updated: April 12, 2025</p>
        </div>
      </CardContent>
    </Card>
  );
}

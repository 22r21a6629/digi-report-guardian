
import { Hospital } from "@/types/hospital";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Phone, Star } from "lucide-react";

interface HospitalCardProps {
  hospital: Hospital;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative">
        <img 
          src={hospital.image} 
          alt={hospital.name} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className="absolute top-3 right-3 bg-white text-dignoweb-primary">
          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
          {hospital.rating}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{hospital.name}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
          {hospital.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-2">
          <Badge variant="outline" className="font-normal">
            {hospital.specialty}
          </Badge>
        </p>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {hospital.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Phone className="h-4 w-4 mr-1" />
          {hospital.contact}
        </div>
        <Button variant="outline" size="sm" className="text-dignoweb-primary">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

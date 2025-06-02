import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Building, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HospitalFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function HospitalField({ value, onChange }: HospitalFieldProps) {
  const [open, setOpen] = useState(false);
  const [hospitals, setHospitals] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Comprehensive list of hospitals from different cities in India
  useEffect(() => {
    const hospitalsList = [
      // Apollo Hospitals network
      "Apollo Hospitals Hyderabad",
      "Apollo Hospitals Chennai",
      "Apollo Hospitals Bangalore",
      "Apollo Hospitals Delhi",
      "Apollo Hospitals Mumbai",
      
      // AIIMS network
      "AIIMS New Delhi",
      "AIIMS Rishikesh",
      "AIIMS Bhopal",
      "AIIMS Patna",
      "AIIMS Jodhpur",
      
      // Major hospitals in Hyderabad
      "KIMS Hospital Hyderabad",
      "Care Hospitals Hyderabad",
      "Sunshine Hospitals Hyderabad",
      "Yashoda Hospitals Hyderabad",
      "Continental Hospitals Hyderabad",
      "Rainbow Children's Hospital Hyderabad",
      "Global Hospitals Hyderabad",
      "Medicover Hospitals Hyderabad",
      "Asian Institute of Gastroenterology Hyderabad",
      
      // Major hospitals in Chennai
      "Fortis Malar Hospital Chennai",
      "Sankara Nethralaya Chennai",
      "Gleneagles Global Health City Chennai",
      "MIOT International Chennai",
      "Sri Ramachandra Medical Centre Chennai",
      
      // Major hospitals in Bangalore
      "Manipal Hospital Bangalore",
      "Narayana Health City Bangalore",
      "Fortis Hospital Bangalore",
      "Columbia Asia Hospital Bangalore",
      "Sakra World Hospital Bangalore",
      
      // Major hospitals in Mumbai
      "Lilavati Hospital Mumbai",
      "Hinduja Hospital Mumbai",
      "Breach Candy Hospital Mumbai",
      "Jaslok Hospital Mumbai",
      "Tata Memorial Hospital Mumbai",
      
      // Major hospitals in Delhi
      "Max Hospital Delhi",
      "Fortis Hospital Delhi",
      "BLK Super Speciality Hospital Delhi",
      "Sir Ganga Ram Hospital Delhi",
      "Indraprastha Apollo Hospital Delhi",
      
      // Other major hospitals
      "Christian Medical College Vellore",
      "Sankara Eye Hospital",
      "LV Prasad Eye Institute",
      "Narayana Hrudayalaya",
      "Medanta The Medicity Gurgaon",
      "Artemis Hospital Gurgaon",
      "Max Healthcare",
      "Fortis Healthcare",
      "City General Hospital",
      "MedStar Clinic",
      "Regional Medical Center",
      "Community Health Hospital",
      "Metropolitan Hospital",
      "Central Hospital",
      "District Hospital"
    ];
    
    setHospitals(hospitalsList.sort());
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleAddCustomHospital = () => {
    if (searchValue && searchValue.trim()) {
      onChange(searchValue.trim());
      setOpen(false);
      setSearchValue("");
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Don't render the popover content until hospitals are loaded
  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="space-y-2">
        <Label htmlFor="hospital">Hospital</Label>
        <Input
          type="text"
          id="hospital"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter hospital name"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="hospital">Hospital</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal"
          >
            {value ? value : "Select hospital..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search hospital..." 
              value={searchValue}
              onValueChange={handleSearchChange}
            />
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Building className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No hospital found</p>
                {searchValue && (
                  <Button 
                    variant="link" 
                    className="text-sm mt-2" 
                    onClick={handleAddCustomHospital}
                  >
                    Add "{searchValue}" as custom hospital
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {filteredHospitals.map((hospital) => (
                <CommandItem
                  key={hospital}
                  value={hospital}
                  onSelect={() => {
                    onChange(hospital);
                    setOpen(false);
                    setSearchValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === hospital ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {hospital}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        id="hospital"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or type to enter manually"
        className="mt-2"
      />
    </div>
  );
}

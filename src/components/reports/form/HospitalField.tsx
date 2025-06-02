
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
  const [hospitals, setHospitals] = useState<string[]>([]); // Initialize as empty array
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fetch hospitals from mock data or API
  useEffect(() => {
    // This could be replaced with an actual API call in the future
    const mockHospitals = [
      "Apollo Hospitals Hyderabad",
      "KIMS Hospital Hyderabad",
      "Care Hospitals Hyderabad",
      "Sunshine Hospitals Hyderabad",
      "Yashoda Hospitals Hyderabad",
      "City General Hospital",
      "MedStar Clinic"
    ];
    setHospitals(mockHospitals);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleAddCustomHospital = () => {
    if (searchValue) {
      onChange(searchValue);
      setOpen(false);
    }
  };

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
        <PopoverContent className="w-full p-0">
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
                <Button 
                  variant="link" 
                  className="text-sm mt-2" 
                  onClick={handleAddCustomHospital}
                >
                  Add "{searchValue || 'custom'}" hospital
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {hospitals.map((hospital) => (
                <CommandItem
                  key={hospital}
                  value={hospital}
                  onSelect={() => {
                    onChange(hospital);
                    setOpen(false);
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
      {!open && (
        <Input
          type="text"
          id="hospital"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or type to enter manually"
          className="mt-2"
        />
      )}
    </div>
  );
}

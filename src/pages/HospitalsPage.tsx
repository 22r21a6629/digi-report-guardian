
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { Hospital } from "@/types/hospital";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, MapPin, Search } from "lucide-react";

// Mock data for hospitals
const mockHospitals: Hospital[] = [
  {
    id: "1",
    name: "City General Hospital",
    location: "123 Main Street, New York, NY",
    specialty: "Multi-Specialty",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b3db4f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.7,
    contact: "+1 (555) 123-4567",
    description: "City General Hospital is a leading healthcare provider offering comprehensive medical services with state-of-the-art facilities and experienced medical professionals."
  },
  {
    id: "2",
    name: "MedStar Clinic",
    location: "456 Park Avenue, Boston, MA",
    specialty: "Cardiology",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2028&q=80",
    rating: 4.5,
    contact: "+1 (555) 987-6543",
    description: "MedStar Clinic specializes in cardiovascular care with advanced diagnostic and treatment options for heart conditions. Our team of cardiologists provides personalized care for patients."
  },
  {
    id: "3",
    name: "Health First Medical Center",
    location: "789 Elm Street, Chicago, IL",
    specialty: "Neurology",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.8,
    contact: "+1 (555) 456-7890",
    description: "Health First Medical Center offers specialized neurological services and treatments for various brain and nervous system disorders. Our neurologists use cutting-edge technology."
  },
  {
    id: "4",
    name: "Sunshine Pediatric Hospital",
    location: "321 Oak Drive, San Francisco, CA",
    specialty: "Pediatrics",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
    rating: 4.9,
    contact: "+1 (555) 789-0123",
    description: "Sunshine Pediatric Hospital is dedicated to providing compassionate care for children of all ages. Our child-friendly environment and specialized pediatric services ensure the best care for your kids."
  },
  {
    id: "5",
    name: "Metro Orthopedic Institute",
    location: "567 Pine Street, Austin, TX",
    specialty: "Orthopedics",
    image: "https://images.unsplash.com/photo-1696446701726-c693a255d01c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.6,
    contact: "+1 (555) 234-5678",
    description: "Metro Orthopedic Institute specializes in the treatment of musculoskeletal conditions and sports injuries. Our experienced orthopedic surgeons provide comprehensive care for bone and joint problems."
  },
  {
    id: "6",
    name: "Lakeside Women's Health",
    location: "890 Cedar Avenue, Miami, FL",
    specialty: "Obstetrics & Gynecology",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    rating: 4.8,
    contact: "+1 (555) 345-6789",
    description: "Lakeside Women's Health provides comprehensive care for women of all ages. Our OB/GYN specialists offer services ranging from routine check-ups to specialized treatments for women's health issues."
  }
];

export default function HospitalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  // Get unique specialties for filter dropdown
  const specialties = Array.from(new Set(mockHospitals.map(hospital => hospital.specialty)));

  // Filter hospitals based on search term and specialty
  const filteredHospitals = mockHospitals.filter(hospital => {
    const matchesSearch = searchTerm === "" || 
                         hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === "" || hospital.specialty === specialtyFilter;
    
    return matchesSearch && matchesSpecialty;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <AppLayout title="Hospitals">
      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Find Hospitals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hospital name or location"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
            <div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
          
          {filteredHospitals.length === 0 && (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Building className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No hospitals found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

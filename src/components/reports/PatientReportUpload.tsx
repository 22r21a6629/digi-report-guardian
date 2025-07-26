
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Upload } from "lucide-react";

export function PatientReportUpload() {
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  

  const handleSearch = async () => {
    if (!searchEmail) {
      toast({
        title: "Email required",
        description: "Please enter a patient email to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // For demo purposes, return mock search results
      // In a real implementation, this would search the database
      const mockResults = [
        {
          id: "1",
          email: searchEmail,
          name: "John Doe",
          phone: "+1234567890",
          last_visit: "2024-01-15"
        }
      ];
      
      // Simulate search delay
      setTimeout(() => {
        if (searchEmail.includes("@")) {
          setSearchResults(mockResults);
          toast({
            title: "Search completed",
            description: `Found ${mockResults.length} patient(s)`,
          });
        } else {
          setSearchResults([]);
          toast({
            title: "No patients found",
            description: "No patients found with that email",
            variant: "destructive",
          });
        }
        setIsSearching(false);
      }, 1000);
      
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching",
        variant: "destructive",
      });
      setIsSearching(false);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    toast({
      title: "Patient selected",
      description: `Selected ${patient.name} (${patient.email})`,
    });
  };

  const handleUpload = () => {
    if (!selectedPatient) {
      toast({
        title: "No patient selected",
        description: "Please select a patient first",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Feature not implemented",
      description: "This search and upload feature is a placeholder. Use the 'Upload for Patient' tab instead.",
      variant: "destructive",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search and Upload Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search-email">Patient Email</Label>
              <Input
                id="search-email"
                type="email"
                placeholder="Enter patient email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchEmail}
                className="flex gap-2 items-center"
              >
                <Search className="h-4 w-4" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((patient) => (
                <div 
                  key={patient.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectPatient(patient)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      {patient.phone && (
                        <p className="text-sm text-gray-600">{patient.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last visit:</p>
                      <p className="text-sm">{patient.last_visit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Patient */}
        {selectedPatient && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-800 mb-2">Selected Patient</h3>
            <p className="text-green-700">{selectedPatient.name} - {selectedPatient.email}</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="border-t pt-4">
          <Button 
            onClick={handleUpload}
            disabled={!selectedPatient}
            className="w-full flex gap-2 items-center"
          >
            <Upload className="h-4 w-4" />
            Upload Report for Selected Patient
          </Button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder search feature. 
            For a working demo, please use the "Upload for Patient" tab which allows direct upload using patient email and PIN verification.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

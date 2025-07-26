import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search as SearchIcon, FileText, Download, Eye, Calendar, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { PinAuthDialog } from "@/components/auth/PinAuthDialog";

type SearchResult = {
  id: string;
  file_name: string;
  report_type: string;
  hospital: string;
  report_date: string | null;
  description: string | null;
  file_url: string;
  created_at: string;
};

type PendingAction = {
  type: 'view' | 'download';
  result: SearchResult;
} | null;

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id, file_name, report_type, hospital, report_date, description, file_url, created_at')
        .or(`file_name.ilike.%${searchTerm}%,hospital.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,report_type.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Search error:', error);
        toast({
          title: "Search failed",
          description: error.message,
          variant: "destructive"
        });
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "There was a problem searching your reports",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleView = (result: SearchResult) => {
    setPendingAction({ type: 'view', result });
  };

  const handleDownload = (result: SearchResult) => {
    setPendingAction({ type: 'download', result });
  };

  const executePendingAction = () => {
    if (!pendingAction) return;

    const { type, result } = pendingAction;

    if (type === 'view') {
      window.open(result.file_url, '_blank');
      toast({
        title: "Opening report",
        description: `Opening ${result.file_name}`,
      });
    } else if (type === 'download') {
      try {
        const link = document.createElement('a');
        link.href = result.file_url;
        link.download = result.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download started",
          description: `Downloading ${result.file_name}`,
        });
      } catch (error) {
        console.error('Download error:', error);
        toast({
          title: "Download failed",
          description: "There was a problem downloading the report",
          variant: "destructive",
        });
      }
    }

    setPendingAction(null);
  };

  const getReportTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <AppLayout title="Search Medical Reports">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by hospital, report type, file name, or keywords..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            {/* Search Results */}
            {hasSearched && (
              <div className="mt-8">
                {isSearching ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Searching through your reports...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </h3>
                    <div className="grid gap-4">
                      {searchResults.map((result) => (
                        <Card key={result.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <h4 className="font-medium">{result.file_name}</h4>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    <span>{result.hospital}</span>
                                  </div>
                                  {result.report_date && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{new Date(result.report_date).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    {getReportTypeDisplay(result.report_type)}
                                  </Badge>
                                </div>

                                {result.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {result.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex space-x-2 ml-4">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleView(result)}
                                  title="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDownload(result)}
                                  title="Download"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reports found matching "{searchTerm}"</p>
                    <p className="text-sm mt-2">Try different keywords or check your spelling</p>
                  </div>
                )}
              </div>
            )}

            {!hasSearched && (
              <div className="mt-8 text-center text-muted-foreground">
                <p>Enter keywords to search through your medical reports</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PIN Authentication Dialog */}
      <PinAuthDialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
        onSuccess={executePendingAction}
        title={pendingAction?.type === 'view' ? 'Secure Access Required' : 'Download Authorization'}
        description={
          pendingAction?.type === 'view' 
            ? `Enter your PIN to view "${pendingAction.result.file_name}"`
            : `Enter your PIN to download "${pendingAction?.result.file_name}"`
        }
      />
    </AppLayout>
  );
}

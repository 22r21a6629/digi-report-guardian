
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileText, 
  Upload, 
  Search, 
  Hospital, 
  Settings, 
  LogOut, 
  Menu, 
  UserPlus,
  Stethoscope,
  BarChart3
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const getUserType = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserType(session.user.user_metadata?.user_type || 'patient');
      }
    };
    getUserType();
  }, []);

  // Different navigation items based on user type
  const getNavItems = () => {
    if (userType === 'doctor') {
      return [
        { name: "Doctor Dashboard", path: "/doctor-dashboard", icon: Stethoscope },
        { name: "Settings", path: "/settings", icon: Settings },
      ];
    } else {
      // Regular patient navigation
      return [
        { name: "Dashboard", path: "/dashboard", icon: Home },
        { name: "My Reports", path: "/reports", icon: FileText },
        { name: "Analysis & Insights", path: "/analysis", icon: BarChart3 },
        { name: "Upload", path: "/upload", icon: Upload },
        { name: "Search", path: "/search", icon: Search },
        { name: "Hospitals", path: "/hospitals", icon: Hospital },
        { name: "Settings", path: "/settings", icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-diagnoweb-primary">DiagnoWeb</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className={cn(
                "w-full justify-start mb-1",
                location.pathname === item.path
                  ? "bg-diagnoweb-primary text-white"
                  : "hover:bg-diagnoweb-light hover:text-diagnoweb-primary"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 border-r bg-white",
          className
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 left-4 z-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

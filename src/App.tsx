
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import HospitalsPage from "./pages/HospitalsPage";
import ReportsPage from "./pages/ReportsPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirectToSettings, setShouldRedirectToSettings] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Check if user needs to complete profile
    if (session?.user) {
      // Check if the user has uploaded reports but hasn't completed profile
      const checkUserReports = async () => {
        try {
          const { data: reports, error } = await supabase
            .from('reports')
            .select('id')
            .eq('user_id', session.user.id)
            .limit(1);
            
          if (error) {
            console.error("Error checking reports:", error);
            return;
          }

          // If the user has reports, check if they've set up their profile
          if (reports && reports.length > 0) {
            // For now we're just redirecting based on having reports
            // You could also check for specific profile fields if you add them
            setShouldRedirectToSettings(true);
          }
        } catch (error) {
          console.error("Error in reports check:", error);
        }
      };
      
      checkUserReports();
    }
  }, [session]);

  // Protected route component
  const ProtectedRoute = ({ children, path }: { children: React.ReactNode, path?: string }) => {
    if (loading) return <div>Loading...</div>;
    if (!session) return <Navigate to="/login" />;
    
    // After login, if the user has reports but needs profile setup,
    // redirect them to settings unless they're already going there
    if (shouldRedirectToSettings && path !== "/settings") {
      setShouldRedirectToSettings(false); // Reset after redirection
      return <Navigate to="/settings" />;
    }
    
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute path="/dashboard">
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute path="/upload">
                <UploadPage />
              </ProtectedRoute>
            } />
            <Route path="/hospitals" element={
              <ProtectedRoute path="/hospitals">
                <HospitalsPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute path="/reports">
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute path="/search">
                <SearchPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute path="/settings">
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

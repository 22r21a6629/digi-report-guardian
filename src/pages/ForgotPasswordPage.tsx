import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        setErrorMessage(error.message);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSent(true);
        toast({
          title: "Email sent",
          description: "Check your inbox for the password reset link",
        });
      }
    } catch (error: any) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      {isSent ? (
        <div className="space-y-6">
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              We've sent a password reset link to {email}. Please check your inbox.
            </AlertDescription>
          </Alert>
          
          <Button 
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Return to login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-dignoweb-primary hover:bg-dignoweb-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="link" 
              className="px-0 flex items-center justify-center mx-auto"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

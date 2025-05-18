
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, AlertTriangle, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if coming from registration page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      if (location.state.justRegistered) {
        setJustRegistered(true);
      }
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setNeedsVerification(false);
    
    try {
      console.log("Attempting login with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // Handle specific error codes
        if (error.message.includes("Email not confirmed")) {
          setNeedsVerification(true);
          setErrorMessage("Please check your email and confirm your account before signing in.");
        } else if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Incorrect email or password. Please try again.");
        } else {
          setErrorMessage(error.message || "Failed to sign in. Please try again.");
        }
        
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      } else if (data.user) {
        // Check user metadata for role information
        const userType = data.user.user_metadata?.user_type;
        console.log("User logged in successfully. User type:", userType);
        
        toast({
          title: "Successfully logged in",
          description: `Welcome back to Dignoweb${userType ? ` as ${userType}` : ''}`,
        });
        
        // Redirect based on role if needed
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address first.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        setErrorMessage(`Failed to resend verification email: ${error.message}`);
        toast({
          title: "Failed to resend",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setErrorMessage(null);
        toast({
          title: "Verification email sent",
          description: "Please check your inbox and follow the link to verify your email",
        });
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {justRegistered && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>Account created successfully! You can now sign in.</AlertDescription>
        </Alert>
      )}
    
      {errorMessage && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {needsVerification && (
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <Mail className="h-4 w-4 mr-2" />
          <AlertDescription className="flex flex-col gap-2">
            <span>Your email needs verification before you can sign in.</span>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-full md:w-auto border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={resendVerificationEmail}
              disabled={isLoading}
            >
              Resend verification email
            </Button>
          </AlertDescription>
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
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button 
            variant="link" 
            className="px-0 font-normal text-dignoweb-primary"
            type="button"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-dignoweb-primary hover:bg-dignoweb-primary/90 flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          "Signing in..."
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Sign in
          </>
        )}
      </Button>
      
      <div className="text-center">
        <span className="text-gray-500">Don't have an account?</span>{" "}
        <Button 
          variant="link" 
          className="px-0 text-dignoweb-primary"
          onClick={() => navigate("/register")}
        >
          Sign up
        </Button>
      </div>
    </form>
  );
}

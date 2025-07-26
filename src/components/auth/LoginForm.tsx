
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { LogIn, AlertTriangle, Mail, CheckCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PinSetupDialog } from "./PinSetupDialog";

// Define validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check if coming from registration page
  useEffect(() => {
    if (location.state?.email) {
      form.setValue("email", location.state.email);
      if (location.state?.justRegistered) {
        setJustRegistered(true);
      }
    }
  }, [location, form]);

  const checkUserPin = (email: string) => {
    // In a real application, you would check this from the user's profile in the database
    // For now, we'll check localStorage as a demo
    const userPin = localStorage.getItem(`user_pin_${email}`);
    return userPin !== null;
  };

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setNeedsVerification(false);
    
    try {
      console.log("Attempting login with:", data.email);
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
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
        
        toast.error(error.message || "Invalid email or password");
      } else if (authData.user) {
        // Check if user has a PIN set
        const hasPinSet = checkUserPin(data.email);
        
        if (!hasPinSet) {
          setUserEmail(data.email);
          setShowPinSetup(true);
          return;
        }

        // Check user metadata for role information
        const userType = authData.user.user_metadata?.user_type;
        console.log("User logged in successfully. User type:", userType);
        
        toast.success(`Welcome back to Diagnoweb${userType ? ` as ${userType}` : ''}`);
        
        // Redirect based on role if needed
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSet = async (pin: string) => {
    // Store the PIN for the user
    localStorage.setItem(`user_pin_${userEmail}`, pin);
    
    toast.success("Your security PIN has been created. Redirecting to dashboard...");
    
    setShowPinSetup(false);
    
    // Small delay before redirecting
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const resendVerificationEmail = async () => {
    const email = form.getValues("email");
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
        toast.error(error.message);
      } else {
        setErrorMessage(null);
        toast.success("Please check your inbox and follow the link to verify your email");
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      {justRegistered && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Account created successfully! You need to verify your email before signing in.</AlertDescription>
        </Alert>
      )}
    
      {errorMessage && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {needsVerification && (
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <Mail className="h-4 w-4" />
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Button 
                    variant="link" 
                    className="px-0 font-normal text-diagnoweb-primary"
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-diagnoweb-primary hover:bg-diagnoweb-primary/90 flex items-center justify-center gap-2 mt-4"
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
        </form>
      </Form>
      
      <div className="text-center">
        <span className="text-gray-500">Don't have an account?</span>{" "}
        <Button 
          variant="link" 
          className="px-0 text-diagnoweb-primary"
          onClick={() => navigate("/register")}
        >
          Sign up
        </Button>
      </div>
      
      <PinSetupDialog
        open={showPinSetup}
        onPinSet={handlePinSet}
        title="Set Security PIN"
        description="To secure your medical reports, please create a 4-digit PIN. You'll need this PIN to view or download your reports."
      />
    </div>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Mail, User, Lock, UserRound, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PinSetupDialog } from "./PinSetupDialog";

// Define validation schema
const registrationSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  userType: z.enum(["patient", "doctor", "hospital"], { 
    required_error: "Please select a user type." 
  }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredUserType, setRegisteredUserType] = useState<string>("");
  const navigate = useNavigate();
  

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      userType: "patient",
      password: "",
      confirmPassword: ""
    }
  });

  const handleSubmit = async (data: RegistrationFormData) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    
    try {
      console.log("Registering user:", data.email, "with type:", data.userType);
      
      // Register the user with Supabase including user type in metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            user_type: data.userType,
          },
          emailRedirectTo: `${window.location.origin}/login`
        },
      });
      
      if (authError) {
        console.error("Registration error:", authError);
        
        if (authError.message.includes("already registered")) {
          setError("This email is already registered. Please try logging in instead.");
          toast.error("Please try logging in with your existing account");
        } else {
          setError(authError.message);
          toast.error(authError.message);
        }
      } else {
        console.log("Registration successful:", authData);
        
        if (authData.user) {
          setRegisteredEmail(data.email);
          setRegisteredUserType(data.userType);
          setShowPinSetup(true);
        } else {
          setError("Something went wrong during registration. Please try again.");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "There was a problem creating your account";
      console.error("Registration error:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSet = async (pin: string) => {
    // Store the PIN in localStorage (in real implementation, this would be encrypted and stored securely)
    localStorage.setItem(`user_pin_${registeredEmail}`, pin);
    
    let userTypeLabel = "patient";
    if (registeredUserType === "doctor") userTypeLabel = "doctor";
    if (registeredUserType === "hospital") userTypeLabel = "hospital administrator";
    
    setSuccessMessage(`Account created successfully as ${userTypeLabel}! Please check your email to verify your account before signing in.`);
    toast.success(`You are registered as a ${userTypeLabel}. Please check your email to verify your account.`);
    
    setShowPinSetup(false);
    
    // Wait a bit before redirecting to login page
    setTimeout(() => {
      navigate("/login", { 
        state: { 
          email: registeredEmail,
          justRegistered: true,
          userType: registeredUserType
        } 
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </FormLabel>
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
            name="userType"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  I am a
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="hospital">Hospital Administrator</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-diagnoweb-primary hover:bg-diagnoweb-primary/90 mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create Account
              </span>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
        <span className="text-gray-500">Already have an account?</span>{" "}
        <Button 
          variant="link" 
          className="px-0 text-diagnoweb-primary"
          onClick={() => navigate("/login")}
          type="button"
        >
          Sign in
        </Button>
      </div>

      <PinSetupDialog
        open={showPinSetup}
        onPinSet={handlePinSet}
        title="Set Security PIN"
        description="Please create a 4-digit PIN to secure your medical reports. You'll need this PIN to view or download your reports."
      />
    </div>
  );
}

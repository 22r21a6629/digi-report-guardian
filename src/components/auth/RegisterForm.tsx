
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Mail, User, Lock, UserRound, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const navigate = useNavigate();
  const { toast } = useToast();

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
      
      // Register the user with Supabase
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
        
        // Handle specific error cases
        if (authError.message.includes("already registered")) {
          setError("This email is already registered. Please try logging in instead.");
          toast({
            title: "Email already registered",
            description: "Please try logging in with your existing account",
            variant: "destructive"
          });
        } else {
          setError(authError.message);
          toast({
            title: "Registration failed",
            description: authError.message,
            variant: "destructive"
          });
        }
      } else {
        console.log("Registration successful:", authData);
        
        if (authData.user) {
          setSuccessMessage("Account created successfully! Please check your email to verify your account before signing in.");
          toast({
            title: "Account created successfully",
            description: `Please check your email to verify your account.`,
          });
          
          // Wait a bit before redirecting to login page
          setTimeout(() => {
            navigate("/login", { 
              state: { 
                email: data.email,
                justRegistered: true 
              } 
            });
          }, 2000);
        } else {
          setError("Something went wrong during registration. Please try again.");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "There was a problem creating your account";
      console.error("Registration error:", error);
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
            className="w-full bg-dignoweb-primary hover:bg-dignoweb-primary/90 mt-6"
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
          className="px-0 text-dignoweb-primary"
          onClick={() => navigate("/login")}
          type="button"
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}

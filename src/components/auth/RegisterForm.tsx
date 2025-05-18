
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Mail, User, Lock, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      setError("Passwords don't match. Please try again.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register the user with Supabase
      console.log("Registering user with type:", userType);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });
      
      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        setError(error.message);
      } else {
        console.log("Registration successful:", data);
        toast({
          title: "Account created successfully",
          description: `You can now sign in with your credentials as a ${userType}`,
        });
        
        // Don't automatically sign in - redirect to login page
        navigate("/login");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "There was a problem creating your account";
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Registration error:", error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="fullName" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
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
        <Label htmlFor="userType" className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          I am a
        </Label>
        <Select 
          value={userType} 
          onValueChange={setUserType}
        >
          <SelectTrigger id="userType">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patient">Patient</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="hospital">Hospital Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
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
    </form>
  );
}

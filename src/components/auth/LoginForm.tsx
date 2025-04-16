import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // Handle specific error codes
        if (error.message === "Email not confirmed") {
          setErrorMessage("Please check your email and confirm your account before signing in.");
        } else if (error.message === "Invalid login credentials") {
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
        toast({
          title: "Successfully logged in",
          description: "Welcome back to Dignoweb",
        });
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

  return (
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

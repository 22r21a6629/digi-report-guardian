
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your credentials to access your account"
    >
      <LoginForm />
      
      <Card className="mt-8 border-dashed border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-blue-800">Email Verification</CardTitle>
          <CardDescription className="text-blue-600">
            Having trouble signing in? You may need to verify your email first.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-blue-600">
          Check your inbox for a verification email. If you can't find it, you may need to register again or check your spam folder.
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={() => navigate("/register")}
          >
            Register again
          </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

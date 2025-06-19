
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Mail, AlertTriangle } from "lucide-react";

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
          <CardTitle className="text-base text-blue-800 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Verification Required
          </CardTitle>
          <CardDescription className="text-blue-600">
            After registration, you must verify your email before signing in.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-blue-600">
          <div className="space-y-2">
            <p>
              <strong>1.</strong> Check your inbox for a verification email from Supabase/Diagnoweb
            </p>
            <p>
              <strong>2.</strong> Click the verification link in the email
            </p>
            <p>
              <strong>3.</strong> Return here to sign in after verification
            </p>
            <div className="mt-2 flex items-center text-yellow-600 bg-yellow-50 p-2 rounded-md">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" /> 
              <span>Don't see the email? Check your spam folder or request another verification email.</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            className="flex-1 min-w-[160px] border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={() => navigate("/register")}
          >
            Register again
          </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

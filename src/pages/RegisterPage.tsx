
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create your DiagnoWeb account" 
      subtitle="Join DiagnoWeb to securely manage your medical reports"
    >
      <RegisterForm />
    </AuthLayout>
  );
}


import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-dignoweb-primary text-9xl font-bold">404</div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Page not found</h1>
      <p className="mt-4 text-base text-gray-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="mt-8">
        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-dignoweb-primary hover:bg-dignoweb-primary/90"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

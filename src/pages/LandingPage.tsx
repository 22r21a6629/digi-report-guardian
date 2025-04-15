
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Hospital, Lock } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-dignoweb-primary">Dignoweb</h1>
          </div>
          <div className="space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="inline-flex"
            >
              Sign in
            </Button>
            <Button 
              onClick={() => navigate("/register")}
              className="inline-flex bg-dignoweb-primary hover:bg-dignoweb-primary/90"
            >
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="dignoweb-gradient text-white py-16 md:py-24 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Secure Management of Your Medical Reports
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Store, access, and share your medical reports securely from anywhere, anytime. 
              Take control of your health data with Dignoweb.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/login")}
                className="border-white text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button 
                size="lg"
                onClick={() => navigate("/register")}
                className="bg-white text-dignoweb-primary hover:bg-white/90"
              >
                Sign Up
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80" 
              alt="Medical reports illustration" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Dignoweb?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-dignoweb-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Centralized Reports</h3>
              <p className="text-gray-600">
                Store all your medical reports in one secure place, organized by type and date.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Hospital className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hospital Integration</h3>
              <p className="text-gray-600">
                Connect with hospitals and labs for automatic report transfers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-gray-600">
                Your medical data is protected with advanced encryption protocols.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Control</h3>
              <p className="text-gray-600">
                Control who can access your reports with granular permissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your medical records?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Dignoweb with their health information.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/login")}
              className="border-dignoweb-primary text-dignoweb-primary hover:bg-dignoweb-primary/10"
            >
              Sign In
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-dignoweb-primary text-white hover:bg-dignoweb-primary/90"
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-6 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-xl font-bold text-dignoweb-primary mb-4">Dignoweb</h2>
              <p className="text-gray-600 max-w-md">
                Secure, private, and easy-to-use platform for managing all your medical reports.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-800">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-dignoweb-primary">Features</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-dignoweb-primary">Pricing</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-dignoweb-primary">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-800">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-dignoweb-primary">About</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-dignoweb-primary">Blog</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-dignoweb-primary">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-800">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-dignoweb-primary">Privacy</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-dignoweb-primary">Terms</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-dignoweb-primary">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm text-center">
              © 2025 Dignoweb. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

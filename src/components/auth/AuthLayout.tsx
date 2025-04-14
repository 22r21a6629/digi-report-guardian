
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Side - Branding */}
      <div className="dignoweb-gradient hidden sm:flex sm:w-1/2 p-10 text-white flex-col justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dignoweb</h1>
          <p className="text-lg opacity-80">
            Your secure medical report management platform
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Secure & Private</h3>
              <p className="opacity-80">Your health data is protected with end-to-end encryption</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Organized Reports</h3>
              <p className="opacity-80">All your medical reports in one place, organized and accessible</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M20 7h-9" />
                <path d="M14 17H5" />
                <circle cx="17" cy="17" r="3" />
                <circle cx="7" cy="7" r="3" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Hospital Integration</h3>
              <p className="opacity-80">Connect with hospitals and labs for seamless report transfers</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm opacity-70">© 2025 Dignoweb. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-gray-600">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}

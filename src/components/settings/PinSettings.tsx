
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PinSettingsProps {
  loading: boolean;
}

export function PinSettings({ loading }: PinSettingsProps) {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  

  useEffect(() => {
    const getCurrentUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    
    getCurrentUserEmail();
  }, []);

  const getUserPin = (email: string) => {
    // In a real application, this would be retrieved from the database
    // For now, we'll get it from localStorage as a demo
    return localStorage.getItem(`user_pin_${email}`);
  };

  const setUserPin = (email: string, pin: string) => {
    // In a real application, this would be stored securely in the database
    // For now, we'll store it in localStorage as a demo
    localStorage.setItem(`user_pin_${email}`, pin);
  };

  const handleChangePIN = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPin || !newPin || !confirmPin) {
      toast({
        title: "All fields required",
        description: "Please fill in all PIN fields",
        variant: "destructive",
      });
      return;
    }

    if (!userEmail) {
      toast({
        title: "User not found",
        description: "Please log in again",
        variant: "destructive",
      });
      return;
    }

    const storedPin = getUserPin(userEmail);
    
    if (!storedPin) {
      toast({
        title: "No PIN found",
        description: "You don't have a PIN set. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    if (currentPin !== storedPin) {
      toast({
        title: "Invalid current PIN",
        description: "The current PIN you entered is incorrect",
        variant: "destructive",
      });
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast({
        title: "Invalid new PIN",
        description: "PIN must be exactly 4 digits",
        variant: "destructive",
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "New PIN and confirmation PIN must match",
        variant: "destructive",
      });
      return;
    }

    if (newPin === currentPin) {
      toast({
        title: "Same PIN",
        description: "New PIN must be different from current PIN",
        variant: "destructive",
      });
      return;
    }

    setIsChanging(true);

    // Simulate PIN change process
    setTimeout(() => {
      setUserPin(userEmail, newPin);
      
      toast({
        title: "PIN changed successfully",
        description: "Your security PIN has been updated",
      });
      
      // Clear form
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setIsChanging(false);
    }, 800);
  };

  const clearForm = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-orange-500" />
          Security PIN
        </CardTitle>
        <CardDescription>
          Change your PIN used for accessing sensitive medical reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePIN} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPin">Current PIN</Label>
            <div className="relative">
              <Input
                id="currentPin"
                type={showCurrentPin ? "text" : "password"}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="Enter current 4-digit PIN"
                maxLength={4}
                className="pr-10"
                disabled={loading || isChanging}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPin(!showCurrentPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading || isChanging}
              >
                {showCurrentPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPin">New PIN</Label>
            <div className="relative">
              <Input
                id="newPin"
                type={showNewPin ? "text" : "password"}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new 4-digit PIN"
                maxLength={4}
                className="pr-10"
                disabled={loading || isChanging}
              />
              <button
                type="button"
                onClick={() => setShowNewPin(!showNewPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading || isChanging}
              >
                {showNewPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm New PIN</Label>
            <div className="relative">
              <Input
                id="confirmPin"
                type={showConfirmPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm new 4-digit PIN"
                maxLength={4}
                className="pr-10"
                disabled={loading || isChanging}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading || isChanging}
              >
                {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-600">
              <strong>Security:</strong> Your PIN is used to protect access to your medical reports. 
              Make sure to choose a PIN that only you know.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={clearForm}
              disabled={loading || isChanging}
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={loading || isChanging || !currentPin || !newPin || !confirmPin}
            >
              {isChanging ? "Changing PIN..." : "Change PIN"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

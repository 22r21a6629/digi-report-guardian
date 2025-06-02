
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ForgotPinDialog } from "./ForgotPinDialog";

interface PinAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  title: string;
  description: string;
}

export function PinAuthDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  title, 
  description 
}: PinAuthDialogProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showForgotPin, setShowForgotPin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getCurrentUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    
    if (open) {
      getCurrentUserEmail();
    }
  }, [open]);

  const getUserPin = (email: string) => {
    // In a real application, this would be retrieved from the database
    // For now, we'll get it from localStorage as a demo
    return localStorage.getItem(`user_pin_${email}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin) {
      toast({
        title: "PIN required",
        description: "Please enter your PIN to continue",
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

    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      const userPin = getUserPin(userEmail);
      
      if (!userPin) {
        toast({
          title: "PIN not set",
          description: "Please set up your security PIN in settings",
          variant: "destructive",
        });
        setIsVerifying(false);
        return;
      }

      if (pin === userPin) {
        toast({
          title: "PIN verified",
          description: "Access granted successfully",
        });
        onSuccess();
        onOpenChange(false);
        setPin("");
      } else {
        toast({
          title: "Invalid PIN",
          description: "The PIN you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleCancel = () => {
    setPin("");
    onOpenChange(false);
  };

  const handleForgotPin = () => {
    setShowForgotPin(true);
  };

  const handlePinReset = () => {
    setShowForgotPin(false);
    toast({
      title: "PIN reset complete",
      description: "You can now use your new PIN to access reports",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-orange-500" />
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">Enter your PIN</Label>
              <div className="relative">
                <Input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  className="pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="text-center">
              <Button 
                type="button"
                variant="link" 
                className="px-0 text-sm text-orange-600 hover:text-orange-700"
                onClick={handleForgotPin}
                disabled={isVerifying}
              >
                Forgot PIN?
              </Button>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isVerifying || !pin}
                className="flex-1"
              >
                {isVerifying ? "Verifying..." : "Verify PIN"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ForgotPinDialog
        open={showForgotPin}
        onOpenChange={setShowForgotPin}
        onPinReset={handlePinReset}
      />
    </>
  );
}

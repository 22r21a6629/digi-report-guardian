
import { useState } from "react";
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
import { toast } from "@/lib/toast";
import { Mail, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ForgotPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPinReset: () => void;
}

export function ForgotPinDialog({ 
  open, 
  onOpenChange, 
  onPinReset 
}: ForgotPinDialogProps) {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user to verify email matches
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.email !== email) {
        toast({
          title: "Email not found",
          description: "This email is not associated with your account",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Generate a 6-digit reset code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setResetCode(code);

      // In a real application, you would send this code via email
      // For demo purposes, we'll show it in a toast
      toast({
        title: "Reset code sent",
        description: `Your reset code is: ${code} (In production, this would be sent to your email)`,
      });

      setStep('reset');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enteredCode || !newPin || !confirmPin) {
      toast({
        title: "All fields required",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (enteredCode !== resetCode) {
      toast({
        title: "Invalid code",
        description: "The reset code you entered is incorrect",
        variant: "destructive",
      });
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits",
        variant: "destructive",
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure both PINs match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email) {
        // Store the new PIN
        localStorage.setItem(`user_pin_${user.email}`, newPin);
        
        toast({
          title: "PIN reset successfully",
          description: "Your new PIN has been set",
        });
        
        onPinReset();
        onOpenChange(false);
        
        // Reset form
        setStep('email');
        setEmail("");
        setNewPin("");
        setConfirmPin("");
        setEnteredCode("");
        setResetCode("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset PIN. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setStep('email');
    setEmail("");
    setNewPin("");
    setConfirmPin("");
    setEnteredCode("");
    setResetCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-orange-500" />
            {step === 'email' ? 'Forgot PIN' : 'Reset PIN'}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' 
              ? 'Enter your email address to receive a reset code'
              : 'Enter the reset code and create a new PIN'
            }
          </DialogDescription>
        </DialogHeader>
        
        {step === 'email' ? (
          <form onSubmit={handleSendResetEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoFocus
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="flex-1"
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Reset Code</Label>
              <Input
                id="code"
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                autoFocus
              />
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
                />
                <button
                  type="button"
                  onClick={() => setShowNewPin(!showNewPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPin">Confirm New PIN</Label>
              <div className="relative">
                <Input
                  id="confirmNewPin"
                  type={showConfirmPin ? "text" : "password"}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Confirm new 4-digit PIN"
                  maxLength={4}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !enteredCode || !newPin || !confirmPin}
                className="flex-1"
              >
                {isLoading ? "Resetting..." : "Reset PIN"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

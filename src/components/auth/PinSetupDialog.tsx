
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
import { useToast } from "@/components/ui/use-toast";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PinSetupDialogProps {
  open: boolean;
  onPinSet: (pin: string) => void;
  title?: string;
  description?: string;
}

export function PinSetupDialog({ 
  open, 
  onPinSet, 
  title = "Set Security PIN",
  description = "Please create a 4-digit PIN to secure your medical reports"
}: PinSetupDialogProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin || !confirmPin) {
      toast({
        title: "All fields required",
        description: "Please enter and confirm your PIN",
        variant: "destructive",
      });
      return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits",
        variant: "destructive",
      });
      return;
    }

    if (pin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure both PINs match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate PIN setup delay
    setTimeout(() => {
      toast({
        title: "PIN set successfully",
        description: "Your security PIN has been created",
      });
      onPinSet(pin);
      setPin("");
      setConfirmPin("");
      setIsLoading(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
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
            <Label htmlFor="pin">Create PIN</Label>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm PIN</Label>
            <div className="relative">
              <Input
                id="confirmPin"
                type={showConfirmPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm 4-digit PIN"
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

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-600">
              <strong>Important:</strong> Remember this PIN as you'll need it to access your medical reports. 
              You can change it later in your account settings.
            </p>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !pin || !confirmPin}
            className="w-full"
          >
            {isLoading ? "Setting PIN..." : "Set PIN"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

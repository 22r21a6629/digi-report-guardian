
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface PrivacySettingsProps {
  privacy: {
    shareData: boolean;
    shareAnalytics: boolean;
    allowHealthProviders: boolean;
  };
  loading: boolean;
  onPrivacyChange: (key: keyof typeof privacy, checked: boolean) => void;
  onSave: () => void;
}

export function PrivacySettings({
  privacy,
  loading,
  onPrivacyChange,
  onSave
}: PrivacySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control how your data is used and shared
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Share Medical Data</h4>
              <p className="text-sm text-muted-foreground">Allow us to share your medical data with verified research institutions</p>
            </div>
            <Switch 
              checked={privacy.shareData}
              onCheckedChange={(checked) => onPrivacyChange('shareData', checked)}
            />
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Share Analytics</h4>
              <p className="text-sm text-muted-foreground">Allow us to collect anonymous usage data to improve our services</p>
            </div>
            <Switch 
              checked={privacy.shareAnalytics}
              onCheckedChange={(checked) => onPrivacyChange('shareAnalytics', checked)}
            />
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Health Provider Access</h4>
              <p className="text-sm text-muted-foreground">Allow your health providers to access your reports</p>
            </div>
            <Switch 
              checked={privacy.allowHealthProviders}
              onCheckedChange={(checked) => onPrivacyChange('allowHealthProviders', checked)}
            />
          </div>
        </div>
        
        <div className="pt-4 space-y-2">
          <Button onClick={onSave} disabled={loading}>Save Changes</Button>
          <p className="text-xs text-muted-foreground mt-2">
            Your privacy is important to us. We will never sell your data to third parties.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

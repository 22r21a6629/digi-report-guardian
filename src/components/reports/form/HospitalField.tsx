
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HospitalFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HospitalField({ value, onChange }: HospitalFieldProps) {
  return (
    <div>
      <Label htmlFor="hospital">Hospital</Label>
      <Input
        type="text"
        id="hospital"
        value={value}
        onChange={onChange}
        placeholder="Enter hospital name"
      />
    </div>
  );
}

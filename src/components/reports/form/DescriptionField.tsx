
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function DescriptionField({ value, onChange }: DescriptionFieldProps) {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={value}
        onChange={onChange}
        placeholder="Enter report description"
      />
    </div>
  );
}

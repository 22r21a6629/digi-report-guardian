
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ReportTypeField({ value, onChange }: ReportTypeFieldProps) {
  return (
    <div>
      <Label htmlFor="report-type">Report Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="report-type">
          <SelectValue placeholder="Select report type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="radiology">Radiology</SelectItem>
          <SelectItem value="pathology">Pathology</SelectItem>
          <SelectItem value="cardiology">Cardiology</SelectItem>
          <SelectItem value="neurology">Neurology</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

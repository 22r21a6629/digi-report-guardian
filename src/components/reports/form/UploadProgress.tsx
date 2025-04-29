
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isLoading: boolean;
  uploadProgress: number;
}

export function UploadProgress({ isLoading, uploadProgress }: UploadProgressProps) {
  if (!isLoading) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span>Uploading...</span>
        <span>{uploadProgress}%</span>
      </div>
      <Progress value={uploadProgress} className="h-2" />
    </div>
  );
}

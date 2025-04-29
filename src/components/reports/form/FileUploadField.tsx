
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Image as ImageIcon, File as FileIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FileUploadFieldProps {
  onFileChange: (file: File | null) => void;
  fileSelected: File | null;
}

export function FileUploadField({ onFileChange, fileSelected }: FileUploadFieldProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload" className="cursor-pointer">
        <div className="border border-dashed border-gray-300 rounded-md p-4 hover:bg-gray-50 transition-colors flex items-center justify-center">
          {fileSelected ? (
            <div className="flex items-center">
              {fileSelected.type.startsWith("image/") ? (
                <ImageIcon className="mr-2 h-4 w-4" />
              ) : fileSelected.type === "application/pdf" ? (
                <FileText className="mr-2 h-4 w-4" />
              ) : (
                <FileIcon className="mr-2 h-4 w-4" />
              )}
              <span className="text-sm">{fileSelected.name}</span>
              <Badge className="ml-2">{(fileSelected.size / 1024).toFixed(1)} KB</Badge>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="mb-2 h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload file</span>
              <span className="text-xs text-gray-400 mt-1">PDF, Images, or Documents</span>
            </div>
          )}
        </div>
      </Label>
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

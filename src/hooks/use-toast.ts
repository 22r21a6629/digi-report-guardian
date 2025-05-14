
import { useToast as useToastShadcn } from "@/components/ui/toast";
import { toast as toastSonner } from "sonner";

// Re-export with consistent interfaces
export const useToast = useToastShadcn;
export const toast = toastSonner;

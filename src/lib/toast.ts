import { toast as sonnerToast } from "sonner";

// Helper function to handle both old and new toast syntax
export const toast = (params: any) => {
  if (typeof params === 'string') {
    // Simple string case
    sonnerToast(params);
  } else if (params && typeof params === 'object') {
    // Object case - convert old format to new
    const { title, description, variant } = params;
    
    if (variant === 'destructive') {
      sonnerToast.error(title || description || 'Error');
    } else {
      sonnerToast.success(title || description || 'Success');
    }
  }
};

// Add the methods to match the old interface
toast.error = (message: string) => sonnerToast.error(message);
toast.success = (message: string) => sonnerToast.success(message);
toast.info = (message: string) => sonnerToast(message);
toast.warning = (message: string) => sonnerToast.warning(message);
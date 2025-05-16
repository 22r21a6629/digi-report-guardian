
// This file re-exports from the hooks folder for backward compatibility
import { useToast as useHookToast, toast as hookToast, type ToasterToast } from "@/hooks/use-toast";

// Re-export everything
export const useToast = useHookToast;
export const toast = hookToast;
export type { ToasterToast };


import { useState, createContext, useContext } from "react";
import type { Toast as ToastPrimitive } from "@/components/ui/toast";
import { toast as toastSonner } from "sonner";

type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitive>;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

const TOAST_LIMIT = 5;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ToasterType = {
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, "id">) => void;
  updateToast: (id: string, toast: ToasterToast) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToasterType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  const addToast = ({
    ...props
  }: Omit<ToasterToast, "id">) => {
    setToasts((toasts) => {
      const id = genId();
      const newToast = { id, ...props };

      // If we exceed the limit, remove the oldest one
      if (toasts.length >= TOAST_LIMIT) {
        toasts.shift();
      }
      
      return [...toasts, newToast];
    });
  };

  const updateToast = (id: string, toast: ToasterToast) => {
    setToasts((toasts) => toasts.map((t) => (t.id === id ? { ...t, ...toast } : t)));
  };

  const dismissToast = (id: string) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        updateToast,
        dismissToast
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    ...context,
    toast
  };
};

// Define the toast function interface
interface ToastFunction {
  (props: { title?: string; description?: string; variant?: "default" | "destructive" }): void;
  error: (props: { title?: string; description?: string }) => void;
  success: (props: { title?: string; description?: string }) => void;
  info: (props: { title?: string; description?: string }) => void;
  warning: (props: { title?: string; description?: string }) => void;
  action: (props: { title?: string; description?: string }) => void;
}

// Create a base function
const toastFn = ((props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
  toastSonner(props.title || "", { 
    description: props.description,
    className: props.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "" 
  });
}) as ToastFunction;

// Add methods to it
toastFn.error = (props: { title?: string; description?: string }) => {
  toastSonner.error(props.title || "", { description: props.description });
};

toastFn.success = (props: { title?: string; description?: string }) => {
  toastSonner.success(props.title || "", { description: props.description });
};

toastFn.info = (props: { title?: string; description?: string }) => {
  toastSonner(props.title || "", { description: props.description });
};

toastFn.warning = (props: { title?: string; description?: string }) => {
  toastSonner.warning(props.title || "", { description: props.description });
};

toastFn.action = (props: { title?: string; description?: string }) => {
  toastSonner(props.title || "", { description: props.description });
};

// Add other properties from toastSonner
Object.assign(toastFn, toastSonner);

// Export the toast function
export const toast = toastFn;
export type { ToasterToast };

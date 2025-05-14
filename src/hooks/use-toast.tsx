
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

// Define the toast function interface with duration property
interface ToastFunction {
  (props: { title?: string; description?: string; variant?: "default" | "destructive"; duration?: number }): void;
  error: (props: { title?: string; description?: string; duration?: number }) => void;
  success: (props: { title?: string; description?: string; duration?: number }) => void;
  info: (props: { title?: string; description?: string; duration?: number }) => void;
  warning: (props: { title?: string; description?: string; duration?: number }) => void;
  action: (props: { title?: string; description?: string; duration?: number }) => void;
}

// Create a base function
const toastFn = ((props: { title?: string; description?: string; variant?: "default" | "destructive"; duration?: number }) => {
  toastSonner(props.title || "", { 
    description: props.description,
    className: props.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "",
    duration: props.duration
  });
}) as ToastFunction;

// Add methods to it
toastFn.error = (props: { title?: string; description?: string; duration?: number }) => {
  toastSonner.error(props.title || "", { 
    description: props.description,
    duration: props.duration 
  });
};

toastFn.success = (props: { title?: string; description?: string; duration?: number }) => {
  toastSonner.success(props.title || "", { 
    description: props.description,
    duration: props.duration
  });
};

toastFn.info = (props: { title?: string; description?: string; duration?: number }) => {
  toastSonner(props.title || "", { 
    description: props.description,
    duration: props.duration
  });
};

toastFn.warning = (props: { title?: string; description?: string; duration?: number }) => {
  toastSonner.warning(props.title || "", { 
    description: props.description,
    duration: props.duration
  });
};

toastFn.action = (props: { title?: string; description?: string; duration?: number }) => {
  toastSonner(props.title || "", { 
    description: props.description,
    duration: props.duration
  });
};

// Add other properties from toastSonner
Object.assign(toastFn, toastSonner);

// Export the toast function
export const toast = toastFn;
export type { ToasterToast };

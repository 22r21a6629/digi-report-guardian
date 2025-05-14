
import { useState, useEffect, createContext, useContext } from "react";
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
const TOAST_REMOVE_DELAY = 1000;

type ToasterToastActionElement = React.ReactElement;

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

  return context;
};

// Expose a simpler toast function that works similar to sonner
export const toast = {
  ...toastSonner,
  // Add compatibility with shadcn toast format
  error: (props: { title?: string; description?: string; }) => {
    toastSonner.error(props.title || "", { description: props.description });
  },
  success: (props: { title?: string; description?: string; }) => {
    toastSonner.success(props.title || "", { description: props.description });
  },
  info: (props: { title?: string; description?: string; }) => {
    toastSonner(props.title || "", { description: props.description });
  },
  warning: (props: { title?: string; description?: string; }) => {
    toastSonner.warning(props.title || "", { description: props.description });
  },
  // Fallback for general toast usage with shadcn format
  action: (props: { title?: string; description?: string; }) => {
    toastSonner(props.title || "", { description: props.description });
  }
};

export type { ToasterToast };


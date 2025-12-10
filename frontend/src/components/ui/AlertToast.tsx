import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const alertToast = {
  success: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.success(title, {
      description,
      duration,
      icon: <CheckCircle2 className="h-5 w-5 text-success" />,
    });
  },
  error: ({ title, description, duration = 5000 }: ToastOptions) => {
    toast.error(title, {
      description,
      duration,
      icon: <XCircle className="h-5 w-5 text-destructive" />,
    });
  },
  warning: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.warning(title, {
      description,
      duration,
      icon: <AlertTriangle className="h-5 w-5 text-warning" />,
    });
  },
  info: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.info(title, {
      description,
      duration,
      icon: <Info className="h-5 w-5 text-info" />,
    });
  },
};

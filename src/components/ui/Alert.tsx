import { ReactNode } from 'react';
import { cn } from '@/utils';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

const Alert = ({ children, variant = 'info', className }: AlertProps) => {
  const variants = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
      iconClass: 'text-green-400',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: XCircle,
      iconClass: 'text-red-400',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertTriangle,
      iconClass: 'text-yellow-400',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconClass: 'text-blue-400',
    },
  };

  const { container, icon: Icon, iconClass } = variants[variant];

  return (
    <div className={cn('flex items-start p-4 border rounded-md', container, className)}>
      <Icon className={cn('h-5 w-5 mr-3 mt-0.5 flex-shrink-0', iconClass)} />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export { Alert }; 
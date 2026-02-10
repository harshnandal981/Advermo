import { BookingStatus } from '@/types';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  CheckCircle2, 
  Ban 
} from 'lucide-react';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export default function BookingStatusBadge({ status, className = '' }: BookingStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      icon: Clock,
    },
    confirmed: {
      label: 'Confirmed',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      icon: CheckCircle,
    },
    rejected: {
      label: 'Rejected',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      icon: XCircle,
    },
    active: {
      label: 'Active',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      icon: PlayCircle,
    },
    completed: {
      label: 'Completed',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      icon: CheckCircle2,
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      icon: Ban,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

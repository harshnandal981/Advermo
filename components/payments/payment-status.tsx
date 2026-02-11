'use client';

import { PaymentStatusType } from '@/types';
import { CheckCircle2, Clock, XCircle, RefreshCw, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentStatusProps {
  status: PaymentStatusType;
  amount: number;
  method?: string;
  transactionId?: string;
  completedAt?: Date | string;
  receipt?: string;
}

export default function PaymentStatus({
  status,
  amount,
  method,
  transactionId,
  completedAt,
  receipt,
}: PaymentStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'paid':
        return {
          icon: CheckCircle2,
          label: 'Paid',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950',
          borderColor: 'border-green-200 dark:border-green-800',
        };
      case 'pending':
      case 'created':
        return {
          icon: Clock,
          label: 'Pending',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
        };
      case 'failed':
        return {
          icon: XCircle,
          label: 'Failed',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950',
          borderColor: 'border-red-200 dark:border-red-800',
        };
      case 'refunded':
        return {
          icon: RefreshCw,
          label: 'Refunded',
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950',
          borderColor: 'border-blue-200 dark:border-blue-800',
        };
      default:
        return {
          icon: DollarSign,
          label: 'Unknown',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-950',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${config.bgColor}`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Payment Status</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.color} ${config.bgColor}`}
              >
                {config.label}
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              ₹{amount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mt-4 space-y-2 border-t pt-4">
        {method && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium capitalize">{method}</span>
          </div>
        )}
        {transactionId && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-xs">{transactionId}</span>
          </div>
        )}
        {completedAt && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completed On</span>
            <span className="font-medium">
              {format(new Date(completedAt), 'PPp')}
            </span>
          </div>
        )}
        {receipt && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Receipt</span>
            <span className="font-mono text-xs">{receipt}</span>
          </div>
        )}
      </div>
    </div>
  );
}

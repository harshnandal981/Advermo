'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '@/types';
import { format, parseISO } from 'date-fns';

interface BookingsChartProps {
  data: ChartDataPoint[];
  groupBy?: 'day' | 'week' | 'month';
  stacked?: boolean;
}

export default function BookingsChart({ 
  data, 
  groupBy = 'day',
  stacked = false 
}: BookingsChartProps) {
  // Format data for chart
  const formattedData = data.map(item => ({
    ...item,
    displayDate: item.date ? format(parseISO(item.date), groupBy === 'month' ? 'MMM yyyy' : 'MMM d') : '',
    displayValue: item.count || item.value || 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-1">{data.displayDate}</p>
          <p className="text-lg font-bold text-primary">
            {data.displayValue} {data.displayValue === 1 ? 'booking' : 'bookings'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-card border rounded-lg">
        <p className="text-muted-foreground">No booking data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="displayDate" 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="displayValue" 
            fill="hsl(var(--primary))"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

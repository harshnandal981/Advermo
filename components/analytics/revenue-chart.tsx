'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/types';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '@/lib/analytics/helpers';

interface RevenueChartProps {
  data: ChartDataPoint[];
  timeRange?: 'day' | 'week' | 'month';
  currency?: string;
  showArea?: boolean;
}

export default function RevenueChart({ 
  data, 
  timeRange = 'day',
  currency = '₹',
  showArea = true 
}: RevenueChartProps) {
  // Format data for chart
  const formattedData = data.map(item => ({
    ...item,
    displayDate: item.date ? format(parseISO(item.date), 'MMM d') : '',
    displayValue: item.amount || item.value || 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-1">{data.displayDate}</p>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(data.displayValue, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-card border rounded-lg">
        <p className="text-muted-foreground">No revenue data available</p>
      </div>
    );
  }

  const ChartComponent = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={formattedData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="displayDate" 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `${currency}${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          {showArea ? (
            <Area
              type="monotone"
              dataKey="displayValue"
              stroke="hsl(var(--primary))"
              fill="url(#revenueGradient)"
              strokeWidth={2}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="displayValue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/analytics/helpers';

interface AdFormatPieChartProps {
  data: Array<{ format: string; count: number; revenue: number }>;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const FORMAT_LABELS: Record<string, string> = {
  poster: 'Poster',
  screen: 'Digital Screen',
  'table-tent': 'Table Tent',
  counter: 'Counter',
  menu: 'Menu',
  outdoor: 'Outdoor',
};

export default function AdFormatPieChart({ data }: AdFormatPieChartProps) {
  // Format data for chart
  const formattedData = data.map((item, index) => ({
    name: FORMAT_LABELS[item.format] || item.format,
    value: item.count,
    revenue: item.revenue,
    fill: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Bookings:</span>{' '}
              <span className="font-semibold">{data.value}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Revenue:</span>{' '}
              <span className="font-semibold">{formatCurrency(data.payload.revenue)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if slice is too small

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-card border rounded-lg">
        <p className="text-muted-foreground">No ad format data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

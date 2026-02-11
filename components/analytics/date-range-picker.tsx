'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { DateRange, DateRangePreset } from '@/types';
import { format, subDays, startOfYear } from 'date-fns';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const presets: Array<{ label: string; value: DateRangePreset; getDates: () => DateRange }> = [
  {
    label: 'Today',
    value: 'today',
    getDates: () => ({
      startDate: new Date(),
      endDate: new Date(),
    }),
  },
  {
    label: 'Last 7 days',
    value: 'last7days',
    getDates: () => ({
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
    }),
  },
  {
    label: 'Last 30 days',
    value: 'last30days',
    getDates: () => ({
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
    }),
  },
  {
    label: 'Last 90 days',
    value: 'last90days',
    getDates: () => ({
      startDate: subDays(new Date(), 90),
      endDate: new Date(),
    }),
  },
  {
    label: 'This Year',
    value: 'thisYear',
    getDates: () => ({
      startDate: startOfYear(new Date()),
      endDate: new Date(),
    }),
  },
];

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('last30days');

  const handlePresetClick = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.value);
    setShowCustom(false);
    onChange(preset.getDates());
  };

  const handleCustomClick = () => {
    setShowCustom(true);
    setSelectedPreset('custom');
  };

  const formatDateRange = () => {
    if (!value.startDate || !value.endDate) return 'Select date range';
    return `${format(value.startDate, 'MMM d, yyyy')} - ${format(value.endDate, 'MMM d, yyyy')}`;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 px-3 py-2 border rounded-lg bg-card">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{formatDateRange()}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedPreset === preset.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {preset.label}
            </button>
          ))}
          
          <button
            onClick={handleCustomClick}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              selectedPreset === 'custom'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {showCustom && (
        <div className="absolute top-full mt-2 left-0 z-50 p-4 bg-card border rounded-lg shadow-lg">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Start Date</label>
              <input
                type="date"
                value={value.startDate ? format(value.startDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    onChange({
                      ...value,
                      startDate: new Date(e.target.value),
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">End Date</label>
              <input
                type="date"
                value={value.endDate ? format(value.endDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    onChange({
                      ...value,
                      endDate: new Date(e.target.value),
                    });
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>

            <button
              onClick={() => setShowCustom(false)}
              className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

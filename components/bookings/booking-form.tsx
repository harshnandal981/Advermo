'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface BookingFormProps {
  spaceId: string;
  spaceName: string;
  cpm: number;
  dailyFootfall: number;
}

const campaignObjectives = [
  'Brand Awareness',
  'Lead Generation',
  'Sales',
  'Product Launch',
  'Event Promotion',
  'App Downloads',
  'Other',
];

export default function BookingForm({
  spaceId,
  spaceName,
  cpm,
  dailyFootfall,
}: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    campaignObjective: '',
    targetAudience: '',
    budget: '',
    notes: '',
  });

  // Calculate duration and price
  const calculateDetails = () => {
    if (!formData.startDate || !formData.endDate) {
      return { duration: 0, totalPrice: 0, impressions: 0 };
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (duration <= 0) {
      return { duration: 0, totalPrice: 0, impressions: 0 };
    }

    const impressions = dailyFootfall * duration;
    const totalPrice = (impressions / 1000) * cpm;

    return { duration, totalPrice: Math.round(totalPrice * 100) / 100, impressions };
  };

  const { duration, totalPrice, impressions } = calculateDetails();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          campaignObjective: formData.campaignObjective,
          targetAudience: formData.targetAudience,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Redirect to booking details page
      router.push(`/bookings/${data.booking._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Get minimum date (3 days from now)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Book this Ad Space</h3>

      {error && (
        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-2">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            min={getMinDate()}
            value={formData.startDate}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-2">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            min={formData.startDate || getMinDate()}
            value={formData.endDate}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Campaign Objective */}
      <div>
        <label htmlFor="campaignObjective" className="block text-sm font-medium mb-2">
          Campaign Objective *
        </label>
        <select
          id="campaignObjective"
          name="campaignObjective"
          value={formData.campaignObjective}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select an objective</option>
          {campaignObjectives.map((objective) => (
            <option key={objective} value={objective}>
              {objective}
            </option>
          ))}
        </select>
      </div>

      {/* Target Audience */}
      <div>
        <label htmlFor="targetAudience" className="block text-sm font-medium mb-2">
          Target Audience * (min 10 characters)
        </label>
        <input
          type="text"
          id="targetAudience"
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleInputChange}
          placeholder="e.g., Young professionals aged 25-35 in tech"
          minLength={10}
          required
          className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Budget (Optional) */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium mb-2">
          Budget (Optional)
        </label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          placeholder="Enter your budget"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          maxLength={1000}
          placeholder="Any special requirements or notes"
          className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Price Calculation */}
      {duration > 0 && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{duration} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Impressions:</span>
            <span className="font-medium">{impressions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">CPM:</span>
            <span className="font-medium">₹{cpm.toFixed(2)}</span>
          </div>
          <div className="border-t border-primary/20 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold">Total Price:</span>
              <span className="text-xl font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {duration > 0 && duration < 7 && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Minimum campaign duration is 7 days
        </p>
      )}
      {duration > 365 && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Maximum campaign duration is 365 days
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || duration < 7 || duration > 365}
      >
        <Calendar className="h-4 w-4 mr-2" />
        {loading ? 'Creating Booking...' : 'Submit Booking Request'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        You won&apos;t be charged until the venue owner confirms your booking
      </p>
    </form>
  );
}

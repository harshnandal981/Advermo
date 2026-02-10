'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

interface BookedDate {
  startDate: string | Date;
  endDate: string | Date;
  status: string;
}

interface BookingsCalendarProps {
  spaceId: string;
}

export default function BookingsCalendar({ spaceId }: BookingsCalendarProps) {
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await fetch(`/api/bookings/calendar/${spaceId}`);
        if (response.ok) {
          const data = await response.json();
          setBookedDates(data.bookedDates || []);
        }
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedDates();
  }, [spaceId]);

  if (loading) {
    return (
      <div className="p-8 rounded-xl bg-card border text-center">
        <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground animate-pulse" />
        <p className="text-muted-foreground">Loading availability...</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-card border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Availability Calendar
      </h3>
      
      {bookedDates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">
            This space is currently available
          </p>
          <p className="text-sm text-muted-foreground">
            No confirmed bookings at this time
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">
            The following dates are already booked:
          </p>
          {bookedDates.map((booking, index) => {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' - '}
                    {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 capitalize">
                  {booking.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <p>💡 Tip: Choose dates that don&apos;t overlap with existing bookings to avoid conflicts.</p>
      </div>
    </div>
  );
}

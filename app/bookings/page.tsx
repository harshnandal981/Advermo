'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types';
import BookingCard from '@/components/bookings/booking-card';
import { Calendar, Loader2 } from 'lucide-react';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const statusParam = activeTab !== 'all' ? `&status=${activeTab}` : '';
      const response = await fetch(`/api/bookings?${statusParam}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your ad space booking requests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-accent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'all'
                ? "You haven't made any booking requests yet"
                : `No ${activeTab} bookings`}
            </p>
            <button
              onClick={() => router.push('/spaces')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Browse Ad Spaces
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                userRole={session.user.role}
                onUpdate={fetchBookings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

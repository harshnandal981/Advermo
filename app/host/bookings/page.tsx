'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types';
import BookingCard from '@/components/bookings/booking-card';
import { Calendar, Loader2, TrendingUp, DollarSign } from 'lucide-react';

const tabs = [
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'all', label: 'All' },
];

interface Stats {
  totalBookings: number;
  pendingCount: number;
  activeCount: number;
  confirmedCount: number;
  completedCount: number;
  totalRevenue: number;
}

export default function HostBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'venue') {
        router.push('/');
      } else {
        fetchBookings();
        fetchStats();
      }
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/bookings/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
          <h1 className="text-3xl font-bold mb-2">Manage Bookings</h1>
          <p className="text-muted-foreground">
            Review and manage booking requests for your ad spaces
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Pending</p>
                <Calendar className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{stats.pendingCount}</p>
            </div>
            
            <div className="bg-card border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Active</p>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{stats.activeCount}</p>
            </div>
            
            <div className="bg-card border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Completed</p>
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              <p className="text-2xl font-bold">{stats.completedCount}</p>
            </div>
            
            <div className="bg-card border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        )}

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
              {tab.id === 'pending' && stats && stats.pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500 text-yellow-900 text-xs">
                  {stats.pendingCount}
                </span>
              )}
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
            <p className="text-muted-foreground">
              {activeTab === 'all'
                ? "You haven't received any booking requests yet"
                : `No ${activeTab} bookings`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                userRole="venue"
                onUpdate={fetchBookings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

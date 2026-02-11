'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { VenueOwnerAnalytics, DateRange } from '@/types';
import { subDays } from 'date-fns';

// Components
import StatsCard from '@/components/analytics/stats-card';
import DateRangePicker from '@/components/analytics/date-range-picker';
import RevenueChart from '@/components/analytics/revenue-chart';
import BookingsChart from '@/components/analytics/bookings-chart';
import AdFormatPieChart from '@/components/analytics/ad-format-pie';
import TopSpacesTable from '@/components/analytics/top-spaces-table';
import ExportButton from '@/components/analytics/export-button';

// Export utilities
import { 
  exportRevenueToCSV, 
  exportBookingsToCSV, 
  exportSpacesPerformanceToCSV,
  exportAllAnalyticsToCSV
} from '@/lib/analytics/export-csv';
import { printPageToPDF } from '@/lib/analytics/export-pdf';

export default function VenueOwnerAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<VenueOwnerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'venue') {
        router.push('/');
      } else {
        fetchAnalytics();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });

      const response = await fetch(`/api/analytics/venue-owner?${params}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setAnalytics(result.data);
      } else {
        console.error('Failed to fetch analytics:', result.error);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const handleExportCSV = () => {
    if (!analytics) return;
    
    // For now, export all analytics data
    // In a real app, you'd fetch the raw booking data
    exportAllAnalyticsToCSV([], [], 'venue-analytics');
  };

  const handleExportPDF = () => {
    printPageToPDF('Venue Analytics Report');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 no-print">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your revenue, bookings, and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <ExportButton
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="no-print">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={analytics.revenue.total}
          icon={DollarSign}
          isCurrency
        />
        <StatsCard
          title="This Month Revenue"
          value={analytics.revenue.thisMonth}
          change={analytics.revenue.growth}
          trend={analytics.revenue.growth > 0 ? 'up' : analytics.revenue.growth < 0 ? 'down' : 'neutral'}
          icon={TrendingUp}
          isCurrency
        />
        <StatsCard
          title="Active Bookings"
          value={analytics.bookings.active + analytics.bookings.confirmed}
          icon={Calendar}
        />
        <StatsCard
          title="Average Booking Value"
          value={analytics.metrics.averageBookingValue}
          icon={BarChart3}
          isCurrency
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
        <RevenueChart data={analytics.revenue.chartData} showArea />
      </div>

      {/* Bookings & Ad Formats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Trend */}
        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Bookings Trend</h2>
          <BookingsChart data={analytics.bookings.chartData} />
        </div>

        {/* Ad Format Distribution */}
        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Ad Format Distribution</h2>
          <AdFormatPieChart data={analytics.adFormats.distribution} />
        </div>
      </div>

      {/* Booking Stats */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{analytics.bookings.total}</p>
            <p className="text-sm text-muted-foreground mt-1">Total</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {analytics.bookings.pending}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Pending</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analytics.bookings.confirmed}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Confirmed</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {analytics.bookings.active}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Active</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {analytics.bookings.completed}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Completed</p>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {analytics.bookings.cancelled}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Cancelled</p>
          </div>
        </div>
      </div>

      {/* Top Performing Spaces */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Top Performing Spaces</h2>
        <TopSpacesTable spaces={analytics.spaces.topPerforming} />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Spaces</p>
          <p className="text-2xl font-bold">{analytics.spaces.total}</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
          <p className="text-2xl font-bold">
            {analytics.spaces.averageRating.toFixed(1)} ★
          </p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Occupancy Rate</p>
          <p className="text-2xl font-bold">{analytics.occupancy.rate.toFixed(1)}%</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Avg Duration</p>
          <p className="text-2xl font-bold">
            {Math.round(analytics.metrics.averageDuration)} days
          </p>
        </div>
      </div>
    </div>
  );
}

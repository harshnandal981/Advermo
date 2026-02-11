'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Eye,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { BrandAnalytics, DateRange } from '@/types';
import { subDays } from 'date-fns';

// Components
import StatsCard from '@/components/analytics/stats-card';
import DateRangePicker from '@/components/analytics/date-range-picker';
import RevenueChart from '@/components/analytics/revenue-chart';
import BookingsChart from '@/components/analytics/bookings-chart';
import ExportButton from '@/components/analytics/export-button';

// Export utilities
import { exportAllAnalyticsToCSV } from '@/lib/analytics/export-csv';
import { printPageToPDF } from '@/lib/analytics/export-pdf';
import { formatCurrency } from '@/lib/analytics/helpers';

export default function BrandAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<BrandAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });

      const response = await fetch(`/api/analytics/brand?${params}`);
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
  }, [dateRange]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'brand') {
        router.push('/');
      } else {
        fetchAnalytics();
      }
    }
  }, [status, session, router, fetchAnalytics]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const handleExportCSV = () => {
    if (!analytics) return;
    exportAllAnalyticsToCSV([], [], 'brand-analytics');
  };

  const handleExportPDF = () => {
    printPageToPDF('Brand Analytics Report');
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Campaign Analytics</h1>
          <p className="text-muted-foreground">
            Track your campaigns, spending, and performance
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
      <DateRangePicker value={dateRange} onChange={setDateRange} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Campaigns"
          value={analytics.campaigns.total}
          icon={Target}
        />
        <StatsCard
          title="Active Campaigns"
          value={analytics.campaigns.active}
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Spent"
          value={analytics.spending.total}
          icon={DollarSign}
          isCurrency
        />
        <StatsCard
          title="Average CPM"
          value={analytics.performance.averageCPM}
          icon={Eye}
          isCurrency
        />
      </div>

      {/* Spending Chart */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Spending Over Time</h2>
        <RevenueChart data={analytics.spending.chartData} showArea />
      </div>

      {/* Campaign Stats & Spending by Venue Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Trends */}
        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Campaign Trends</h2>
          <BookingsChart data={analytics.campaigns.chartData} />
        </div>

        {/* Spending by Venue Type */}
        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Spending by Venue Type</h2>
          <div className="space-y-3">
            {analytics.spending.byVenueType.length > 0 ? (
              analytics.spending.byVenueType.map((item, index) => {
                const percentage = (item.amount / analytics.spending.total) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.type}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(item.amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No spending data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Campaign Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{analytics.campaigns.total}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Campaigns</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {analytics.campaigns.active}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Active</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analytics.campaigns.completed}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Completed</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(analytics.campaigns.totalSpent)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Top Performing Venues */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Top Performing Venues</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Venue</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Spent</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Impressions</th>
                <th className="px-4 py-3 text-left text-sm font-medium">CPM</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analytics.performance.topVenues.length > 0 ? (
                analytics.performance.topVenues.map((venue, index) => {
                  const cpm = venue.impressions > 0 
                    ? (venue.spent / venue.impressions) * 1000 
                    : 0;
                  return (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{venue.space.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {venue.space.venueType}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary">
                          {formatCurrency(venue.spent)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">
                          {venue.impressions.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">
                          {formatCurrency(cpm)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No venue data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Impressions</p>
          <p className="text-2xl font-bold">
            {analytics.performance.totalImpressions.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">This Month Spending</p>
          <p className="text-2xl font-bold">
            {formatCurrency(analytics.spending.thisMonth)}
          </p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Average CPM</p>
          <p className="text-2xl font-bold">
            {formatCurrency(analytics.performance.averageCPM)}
          </p>
        </div>
      </div>
    </div>
  );
}

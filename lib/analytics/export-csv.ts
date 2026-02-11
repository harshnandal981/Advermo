import Papa from 'papaparse';
import { Booking, AdSpace } from '@/types';
import { format } from 'date-fns';

/**
 * Export revenue data to CSV
 */
export function exportRevenueToCSV(
  bookings: Booking[],
  filename: string = 'revenue-report'
) {
  const data = bookings
    .filter(b => b.isPaid)
    .map(booking => ({
      'Booking ID': booking._id,
      'Space Name': booking.spaceName,
      'Brand Name': booking.brandName,
      'Start Date': format(new Date(booking.startDate), 'yyyy-MM-dd'),
      'End Date': format(new Date(booking.endDate), 'yyyy-MM-dd'),
      'Duration (days)': booking.duration,
      'Amount': booking.totalPrice,
      'Paid Date': booking.paidAt ? format(new Date(booking.paidAt), 'yyyy-MM-dd HH:mm:ss') : 'N/A',
      'Status': booking.status,
    }));

  downloadCSV(data, filename);
}

/**
 * Export bookings data to CSV
 */
export function exportBookingsToCSV(
  bookings: Booking[],
  filename: string = 'bookings-report'
) {
  const data = bookings.map(booking => ({
    'Booking ID': booking._id,
    'Space Name': booking.spaceName,
    'Brand Name': booking.brandName,
    'Brand Email': booking.brandEmail,
    'Start Date': format(new Date(booking.startDate), 'yyyy-MM-dd'),
    'End Date': format(new Date(booking.endDate), 'yyyy-MM-dd'),
    'Duration (days)': booking.duration,
    'Campaign Objective': booking.campaignObjective,
    'Target Audience': booking.targetAudience,
    'Total Price': booking.totalPrice,
    'Status': booking.status,
    'Payment Status': booking.paymentStatus,
    'Is Paid': booking.isPaid ? 'Yes' : 'No',
    'Created At': format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm:ss'),
  }));

  downloadCSV(data, filename);
}

/**
 * Export spaces performance data to CSV
 */
export function exportSpacesPerformanceToCSV(
  spacesData: Array<{
    space: AdSpace;
    revenue: number;
    bookingCount: number;
    occupancyRate: number;
    averageRating: number;
  }>,
  filename: string = 'spaces-performance'
) {
  const data = spacesData.map(item => ({
    'Space Name': item.space.name,
    'Venue Type': item.space.venueType,
    'Location': item.space.location,
    'Ad Type': item.space.type,
    'Total Revenue': item.revenue,
    'Total Bookings': item.bookingCount,
    'Occupancy Rate (%)': item.occupancyRate.toFixed(2),
    'Average Rating': item.averageRating.toFixed(1),
    'Price': item.space.price,
    'Price Unit': item.space.priceUnit,
    'Daily Footfall': item.space.dailyFootfall,
    'Monthly Impressions': item.space.monthlyImpressions,
  }));

  downloadCSV(data, filename);
}

/**
 * Export all analytics data to CSV
 */
export function exportAllAnalyticsToCSV(
  bookings: Booking[],
  spaces: AdSpace[],
  filename: string = 'analytics-complete-report'
) {
  // Create comprehensive analytics data
  const data = bookings.map(booking => {
    const space = spaces.find(s => s.id === booking.spaceId);
    
    return {
      // Booking Details
      'Booking ID': booking._id,
      'Created At': format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      'Status': booking.status,
      
      // Space Details
      'Space Name': booking.spaceName,
      'Venue Type': space?.venueType || 'N/A',
      'Location': space?.location || 'N/A',
      'Ad Format': space?.type || 'N/A',
      
      // Brand Details
      'Brand Name': booking.brandName,
      'Brand Email': booking.brandEmail,
      
      // Campaign Details
      'Start Date': format(new Date(booking.startDate), 'yyyy-MM-dd'),
      'End Date': format(new Date(booking.endDate), 'yyyy-MM-dd'),
      'Duration (days)': booking.duration,
      'Campaign Objective': booking.campaignObjective,
      'Target Audience': booking.targetAudience,
      
      // Financial Details
      'Total Price': booking.totalPrice,
      'Payment Status': booking.paymentStatus,
      'Is Paid': booking.isPaid ? 'Yes' : 'No',
      'Paid Date': booking.paidAt ? format(new Date(booking.paidAt), 'yyyy-MM-dd HH:mm:ss') : 'N/A',
      
      // Space Metrics (if available)
      'Daily Footfall': space?.dailyFootfall || 'N/A',
      'Monthly Impressions': space?.monthlyImpressions || 'N/A',
      'Space Rating': space?.rating || 'N/A',
    };
  });

  downloadCSV(data, filename);
}

/**
 * Helper function to trigger CSV download
 */
function downloadCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Export chart data to CSV
 */
export function exportChartDataToCSV(
  data: Array<{ date: string; value: number; label?: string }>,
  filename: string = 'chart-data'
) {
  const formattedData = data.map(item => ({
    Date: item.date,
    Value: item.value,
    Label: item.label || '',
  }));

  downloadCSV(formattedData, filename);
}

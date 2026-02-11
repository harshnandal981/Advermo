'use client';

import { useState } from 'react';
import { TopSpace } from '@/types';
import { formatCurrency } from '@/lib/analytics/helpers';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

interface TopSpacesTableProps {
  spaces: TopSpace[];
  sortBy?: 'revenue' | 'bookings' | 'rating' | 'occupancy';
}

type SortKey = 'revenue' | 'bookingCount' | 'averageRating' | 'occupancyRate';

export default function TopSpacesTable({ 
  spaces: initialSpaces, 
  sortBy: initialSortBy = 'revenue' 
}: TopSpacesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>(
    initialSortBy === 'bookings' ? 'bookingCount' : 
    initialSortBy === 'rating' ? 'averageRating' : 
    initialSortBy === 'occupancy' ? 'occupancyRate' : 'revenue'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedSpaces = [...initialSpaces].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    return (aValue - bValue) * modifier;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  if (!initialSpaces || initialSpaces.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-card border rounded-lg">
        <p className="text-muted-foreground">No space data available</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Space Name
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center gap-2">
                  Revenue
                  <SortIcon columnKey="revenue" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('bookingCount')}
              >
                <div className="flex items-center gap-2">
                  Bookings
                  <SortIcon columnKey="bookingCount" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('averageRating')}
              >
                <div className="flex items-center gap-2">
                  Rating
                  <SortIcon columnKey="averageRating" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('occupancyRate')}
              >
                <div className="flex items-center gap-2">
                  Occupancy
                  <SortIcon columnKey="occupancyRate" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedSpaces.map((item) => (
              <tr 
                key={item.space.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link 
                    href={`/spaces/${item.space.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    <div>
                      <p className="font-medium">{item.space.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.space.venueType} • {item.space.location}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-primary">
                    {formatCurrency(item.revenue)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{item.bookingCount}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{item.averageRating.toFixed(1)}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{item.occupancyRate.toFixed(1)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

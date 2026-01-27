"use client";

import { Button } from "@/components/ui/button";
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Plus,
  Eye,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Listings", value: "5", icon: Building2, trend: "+1 this month" },
  { label: "Total Earnings", value: "₹1,25,000", icon: DollarSign, trend: "+15% vs last month" },
  { label: "Bookings", value: "23", icon: Calendar, trend: "12 pending" },
  { label: "Views", value: "1,240", icon: Eye, trend: "+8% this week" },
];

const recentListings = [
  { id: "1", name: "Modern Creative Studio", status: "Active", bookings: 12, revenue: "₹45,000" },
  { id: "2", name: "Rooftop Event Space", status: "Active", bookings: 8, revenue: "₹60,000" },
  { id: "3", name: "Music Recording Studio", status: "Active", bookings: 3, revenue: "₹20,000" },
];

const bookingRequests = [
  { id: "1", space: "Modern Creative Studio", guest: "Rahul Sharma", date: "Feb 15, 2026", amount: "₹5,000" },
  { id: "2", space: "Rooftop Event Space", guest: "Priya Patel", date: "Feb 20, 2026", amount: "₹75,000" },
  { id: "3", space: "Music Recording Studio", guest: "DJ Arjun", date: "Feb 18, 2026", amount: "₹8,000" },
];

export default function HostDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Host Dashboard</h1>
              <p className="text-muted-foreground">Manage your listings and bookings</p>
            </div>
            <Link href="/host/new">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add New Space
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
              <div className="text-xs text-green-600 dark:text-green-400">{stat.trend}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Listings</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>

            <div className="space-y-4">
              {recentListings.map((listing) => (
                <div key={listing.id} className="p-6 rounded-xl bg-card border hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{listing.name}</h3>
                      <span className="inline-block px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                        {listing.status}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Total Bookings</div>
                      <div className="font-semibold">{listing.bookings}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Revenue Generated</div>
                      <div className="font-semibold text-primary">{listing.revenue}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Requests */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Booking Requests</h2>
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {bookingRequests.length} Pending
              </span>
            </div>

            <div className="space-y-4">
              {bookingRequests.map((request) => (
                <div key={request.id} className="p-4 rounded-xl bg-card border">
                  <div className="font-medium mb-2">{request.space}</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    <div>Guest: {request.guest}</div>
                    <div>Date: {request.date}</div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">{request.amount}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">Accept</Button>
                    <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              View All Messages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

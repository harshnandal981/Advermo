import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import BookingDetails from '@/components/bookings/booking-details';

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/');
  }

  const { id } = await params;

  await connectDB();

  const booking = await Booking.findById(id).lean() as any;

  if (!booking) {
    notFound();
  }

  // Verify user has access (is brand or venue owner of this booking)
  const hasAccess =
    booking.brandId === session.user.id ||
    booking.venueOwnerId === session.user.id;

  if (!hasAccess) {
    notFound();
  }

  // Convert dates to strings for serialization
  const bookingData = {
    ...booking,
    _id: booking._id.toString(),
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };

  return <BookingDetails booking={bookingData} userRole={session.user.role} />;
}

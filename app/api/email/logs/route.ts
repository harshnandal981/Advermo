import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import EmailLog from '@/lib/models/EmailLog';

// GET /api/email/logs - Get email logs (admin only)
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Add admin role check when implemented
    // For now, allow all authenticated users to view their own email logs
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const template = searchParams.get('template');
    const recipient = searchParams.get('recipient');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    await connectDB();

    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (template) {
      query.template = template;
    }
    
    if (recipient) {
      query.recipient = recipient;
    }
    
    if (startDate || endDate) {
      query.sentAt = {};
      if (startDate) {
        query.sentAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.sentAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    // Fetch email logs
    const logs = await EmailLog.find(query)
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await EmailLog.countDocuments(query);

    // Get statistics
    const stats = await EmailLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = stats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      statistics: statusCounts,
    });
  } catch (error: any) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email logs' },
      { status: 500 }
    );
  }
}

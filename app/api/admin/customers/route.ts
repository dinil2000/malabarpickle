import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [users, orders] = await Promise.all([
      db.getUsers(),
      db.getOrders()
    ]);

    // Map users with their order statistics
    const usersWithStats = users.map(user => {
      const userOrders = orders.filter(
        o => o.userId === user.id || (user.email && o.customerEmail.toLowerCase() === user.email.toLowerCase())
      );
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'customer',
        address: user.address,
        password: user.password || '••••••••',
        createdAt: user.createdAt,
        totalOrdersCount: userOrders.length,
        totalSpent: userOrders.reduce((sum, o) => sum + o.totalAmount, 0)
      };
    });

    // Sort newest first
    usersWithStats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      count: usersWithStats.length,
      customers: usersWithStats
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer directory' },
      { status: 500 }
    );
  }
}

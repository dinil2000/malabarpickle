import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.getUsers();
    const customers = users
      .filter(u => u.role === 'customer')
      .map(({ password, ...c }) => c);

    return NextResponse.json({ success: true, count: customers.length, customers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer directory' },
      { status: 500 }
    );
  }
}

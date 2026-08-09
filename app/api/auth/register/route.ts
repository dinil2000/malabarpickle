import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, address } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, password, and phone number are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = db.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Create user in Vercel serverless storage
    const newUser = db.createUser({
      name,
      email,
      password,
      phone,
      role: 'customer',
      address
    });

    const { password: _, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: safeUser
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

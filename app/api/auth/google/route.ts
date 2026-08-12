import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, picture, googleId } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Gmail email address is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user already exists in MongoDB Atlas
    let user = await db.findUserByEmail(cleanEmail);

    if (!user) {
      // 2. Automatically register new user with Gmail details
      user = await db.createUser({
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: 'Google Verified',
        password: `google_oauth_${googleId || Date.now()}`,
        role: 'customer'
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        picture: picture || undefined,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to authenticate with Google' },
      { status: 500 }
    );
  }
}

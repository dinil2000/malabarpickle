import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyStoredOTP } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, name, phone, password, address } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Verify OTP code & expiration
    const verification = verifyStoredOTP(cleanEmail, otp);
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.reason || 'Invalid OTP code.' },
        { status: 400 }
      );
    }

    // 2. Double check email uniqueness in MongoDB
    const existingUser = await db.findUserByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Account already registered. Please login.' },
        { status: 400 }
      );
    }

    // 3. Save new verified user to MongoDB Atlas
    const newUser = await db.createUser({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      address,
      role: 'customer'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        address: newUser.address,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify account creation. Please try again.' },
      { status: 500 }
    );
  }
}

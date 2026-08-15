import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { storeOTP } from '@/lib/otpStore';
import { sendOTPEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if email is already registered in MongoDB Atlas
    const existingUser = await db.findUserByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this Email ID is already registered. Please login instead.' },
        { status: 400 }
      );
    }

    // 2. Generate 6-digit numeric OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in memory with 10-minute expiry
    storeOTP(cleanEmail, otp);

    // 4. Send Email via Nodemailer to the user's real email inbox
    const emailResult = await sendOTPEmail(cleanEmail, otp, name || 'Customer');

    if (!emailResult.sent && emailResult.message?.includes('SMTP credentials')) {
      return NextResponse.json({
        success: false,
        error: 'Email service is not connected yet. Please configure GMAIL_USER and GMAIL_APP_PASSWORD in Vercel to receive real OTP emails.'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Real 6-digit verification code sent to ${cleanEmail}`
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP code to email. Please try again.' },
      { status: 500 }
    );
  }
}

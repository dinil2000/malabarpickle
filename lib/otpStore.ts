// In-memory OTP Store with 10-minute expiration for email verification

interface OTPRecord {
  otp: string;
  expiresAt: number;
}

const otpStore = new Map<string, OTPRecord>();

export function storeOTP(email: string, otp: string) {
  const cleanEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes valid
  otpStore.set(cleanEmail, { otp, expiresAt });
}

export function verifyStoredOTP(email: string, inputOtp: string): { valid: boolean; reason?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return { valid: false, reason: 'No OTP requested for this email. Please click Resend OTP.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return { valid: false, reason: 'OTP code has expired. Please request a new OTP.' };
  }

  if (record.otp !== inputOtp.trim()) {
    return { valid: false, reason: 'Invalid OTP code. Please check your email and try again.' };
  }

  // Clear OTP after successful verification
  otpStore.delete(cleanEmail);
  return { valid: true };
}

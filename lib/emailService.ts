import nodemailer from 'nodemailer';

export async function sendOTPEmail(email: string, otp: string, userName: string): Promise<{ sent: boolean; message?: string }> {
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');

  if (!smtpUser || !smtpPass) {
    console.log(`📧 [Demo Mode] OTP for ${email}: ${otp}`);
    return { sent: false, message: 'SMTP credentials not configured yet. Test mode enabled.' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #fcd34d; border-radius: 16px; padding: 24px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="background-color: #990000; color: white; width: 48px; height: 48px; border-radius: 12px; line-height: 48px; font-size: 24px; margin: 0 auto;">🫙</div>
          <h2 style="color: #451a03; margin-top: 12px; font-family: Georgia, serif;">Malabar Pickle Verification</h2>
        </div>
        <p style="font-size: 14px; color: #4b5563;">Hello <strong>${userName}</strong>,</p>
        <p style="font-size: 14px; color: #4b5563;">Thank you for registering with Malabar Pickle. Your 6-digit email verification code is:</p>
        <div style="background-color: #fef3c7; border: 1px border #f59e0b; border-radius: 12px; text-align: center; padding: 16px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #990000;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #6b7280; text-align: center;">This code is valid for 10 minutes. Please do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center;">Authentic Taste of Kerala • Malabar Pickle Store</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Malabar Pickle" <${smtpUser}>`,
      to: email,
      subject: `${otp} is your Malabar Pickle Account Verification Code`,
      html: htmlContent
    });

    return { sent: true };
  } catch (err: any) {
    console.error('Failed to send OTP email via Nodemailer:', err);
    return { sent: false, message: err?.message || 'Failed to send email' };
  }
}

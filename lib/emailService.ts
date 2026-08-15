import nodemailer from 'nodemailer';

export async function sendOTPEmail(email: string, otp: string, userName: string): Promise<{ sent: boolean; message?: string }> {
  // 1. Support Resend API (Free 3,000 emails/month)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Malabar Pickle <onboarding@resend.dev>',
          to: [email],
          subject: `${otp} is your Malabar Pickle Verification Code`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #fcd34d; border-radius: 16px; padding: 24px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="background-color: #990000; color: white; width: 48px; height: 48px; border-radius: 12px; line-height: 48px; font-size: 24px; margin: 0 auto;">🫙</div>
                <h2 style="color: #451a03; margin-top: 12px; font-family: Georgia, serif;">Malabar Pickle Verification</h2>
              </div>
              <p style="font-size: 14px; color: #4b5563;">Hello <strong>${userName}</strong>,</p>
              <p style="font-size: 14px; color: #4b5563;">Your 6-digit email verification code is:</p>
              <div style="background-color: #fef3c7; border: 1px border #f59e0b; border-radius: 12px; text-align: center; padding: 16px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #990000;">${otp}</span>
              </div>
              <p style="font-size: 12px; color: #6b7280; text-align: center;">This code is valid for 10 minutes.</p>
            </div>
          `
        })
      });

      const resData = await res.json();
      if (res.ok) {
        return { sent: true };
      } else {
        console.error('Resend API Error:', resData);
      }
    } catch (e) {
      console.error('Resend Exception:', e);
    }
  }

  // 2. Support Gmail / SMTP Transport
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');

  if (!smtpUser || !smtpPass) {
    console.log(`📧 Real OTP generated for ${email}: ${otp}`);
    return { sent: false, message: 'SMTP_USER and GMAIL_APP_PASSWORD (or RESEND_API_KEY) not configured in Vercel yet.' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass.replace(/\s+/g, '') // remove spaces from app password
      }
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #fcd34d; border-radius: 16px; padding: 24px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="background-color: #990000; color: white; width: 48px; height: 48px; border-radius: 12px; line-height: 48px; font-size: 24px; margin: 0 auto;">🫙</div>
          <h2 style="color: #451a03; margin-top: 12px; font-family: Georgia, serif;">Malabar Pickle Verification</h2>
        </div>
        <p style="font-size: 14px; color: #4b5563;">Hello <strong>${userName}</strong>,</p>
        <p style="font-size: 14px; color: #4b5563;">Your 6-digit email verification code is:</p>
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
      subject: `${otp} is your Malabar Pickle Verification Code`,
      html: htmlContent
    });

    return { sent: true };
  } catch (err: any) {
    console.error('Failed to send OTP email via Nodemailer:', err);
    return { sent: false, message: err?.message || 'Failed to send email' };
  }
}

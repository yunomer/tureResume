import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: Replace with your actual domain or an environment variable
const appDomain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface SendPasswordResetEmailParams {
  to: string;
  token: string;
}

export async function sendPasswordResetEmail({ to, token }: SendPasswordResetEmailParams): Promise<void> {
  const resetLink = `${appDomain}/reset-password?token=${token}`;

  const emailHtml = `
    <div>
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Ture account.</p>
      <p>Click the link below to reset your password. This link will expire in 1 hour:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thanks,</p>
      <p>The Ture Team</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ture Password Reset <noreply@ture.ai>', // Replace with your desired 'from' email, ensure domain is verified with Resend
      to: [to],
      subject: 'Reset Your Ture Password',
      html: emailHtml,
    });

    if (error) {
      console.error(`Error sending password reset email to ${to}:`, error);
      throw new Error('Failed to send password reset email.');
    }

    console.log(`Password reset email sent successfully to ${to}:`, data);
  } catch (err) {
    console.error('Exception in sendPasswordResetEmail:', err);
    // Re-throw the error so the caller can handle it or log it further
    // In a production app, you might want more sophisticated error handling/reporting here
    throw err;
  }
}

import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma'; // Use shared Prisma client
import crypto from 'crypto';
import { sendPasswordResetEmail } from 'lib/email'; // Import email utility

const TOKEN_EXPIRATION_MINUTES = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Invalid email address.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Generate a raw token (this is what's sent to the user)
      const rawToken = crypto.randomBytes(32).toString('hex');
      // Hash the token for storage in the database
      const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');

      const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 1000); // Token expires in 60 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetTokenExpiresAt: expiresAt,
        },
      });
      
      try {
        await sendPasswordResetEmail({ to: user.email, token: rawToken });
      } catch (emailError) {
        console.error(`Failed to send password reset email to ${user.email}:`, emailError);
        // Even if email fails, don't leak info to client. Log error and proceed with generic success.
        // Depending on policy, you might choose to return an error here if email is critical.
      }
    }

    // Always return a generic success message to prevent email enumeration
    return NextResponse.json(
      { message: 'If an account with this email exists, a password reset link has been sent.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Request password reset error:', error);
    // Generic error for the client
    return NextResponse.json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}

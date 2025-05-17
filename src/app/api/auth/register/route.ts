import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Assuming prisma client is exported from here
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
      },
    });

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    // Check if it's a Prisma known error or a generic error
    if (error instanceof Error) {
        // Specific Prisma error for unique constraint violation (though we check above, good to have a catch-all)
        // if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        //    return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        // }
        return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

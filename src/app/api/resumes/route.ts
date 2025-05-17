import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; 
import { prisma } from '../../lib/prisma'; 

// POST /api/resumes - Create a new resume
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const { content, ...otherData } = body; 

    if (!content) {
      return NextResponse.json({ message: 'Resume content is required' }, { status: 400 });
    }

    const newResume = await prisma.resume.create({
      data: {
        userId: userId,
        content: content, 
        // title: otherData.title || 'Untitled Resume',
      },
    });

    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    if (error instanceof SyntaxError) { 
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/resumes - Get all resumes for the authenticated user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const resumes = await prisma.resume.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(resumes, { status: 200 });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

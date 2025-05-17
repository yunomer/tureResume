import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route'; // Relative path from [resumeId] folder
import { prisma } from '../../../lib/prisma'; // Relative path from [resumeId] folder

interface RouteParams {
  params: {
    resumeId: string;
  };
}

// Helper function to verify ownership and retrieve resume
async function verifyResumeOwnership(resumeId: string, userId: string) {
  const resume = await prisma.resume.findUnique({
    where: {
      id: resumeId,
    },
  });

  if (!resume) {
    return { error: 'Resume not found', status: 404, data: null };
  }

  if (resume.userId !== userId) {
    // Important: Do not reveal if the resume exists but belongs to someone else for security.
    // Treat it as 'not found' for this user.
    return { error: 'Resume not found', status: 404, data: null }; 
  }

  return { data: resume, error: null, status: 200 };
}

// GET /api/resumes/[resumeId] - Get a specific resume
export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { resumeId } = params;

  if (!resumeId) {
    return NextResponse.json({ message: 'Resume ID is required' }, { status: 400 });
  }

  try {
    const { data: resume, error, status } = await verifyResumeOwnership(resumeId, userId);
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }
    return NextResponse.json(resume, { status: 200 });
  } catch (e) {
    console.error(`Error fetching resume ${resumeId}:`, e);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/resumes/[resumeId] - Update a specific resume
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { resumeId } = params;

  if (!resumeId) {
    return NextResponse.json({ message: 'Resume ID is required' }, { status: 400 });
  }

  try {
    const { error: ownerError, status: ownerStatus } = await verifyResumeOwnership(resumeId, userId);
    if (ownerError) {
      return NextResponse.json({ message: ownerError }, { status: ownerStatus });
    }

    const body = await req.json();
    const { content, ...otherData } = body;

    if (content === undefined) { // Check for undefined specifically, as null might be a valid state for content for some reason
      return NextResponse.json({ message: 'Resume content is required for update' }, { status: 400 });
    }

    const updatedResume = await prisma.resume.update({
      where: {
        id: resumeId,
        // userId: userId, // Ownership already verified by verifyResumeOwnership
      },
      data: {
        content: content, // Ensure content is not undefined before assigning
        // title: otherData.title, // Example: if you add title or other updatable fields
        updatedAt: new Date(), // Explicitly set updatedAt to track changes
      },
    });

    return NextResponse.json(updatedResume, { status: 200 });
  } catch (e) {
    console.error(`Error updating resume ${resumeId}:`, e);
    if (e instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/resumes/[resumeId] - Delete a specific resume
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { resumeId } = params;

  if (!resumeId) {
    return NextResponse.json({ message: 'Resume ID is required' }, { status: 400 });
  }

  try {
    const { error: ownerError, status: ownerStatus } = await verifyResumeOwnership(resumeId, userId);
    if (ownerError) {
      return NextResponse.json({ message: ownerError }, { status: ownerStatus });
    }

    await prisma.resume.delete({
      where: {
        id: resumeId,
        // userId: userId, // Ownership already verified
      },
    });

    return NextResponse.json({ message: 'Resume deleted successfully' }, { status: 200 }); // Or return 204 with no content
  } catch (e) {
    console.error(`Error deleting resume ${resumeId}:`, e);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

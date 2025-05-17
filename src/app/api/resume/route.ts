import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../lib/prisma';

/**
 * @swagger
 * /api/resume:
 *   get:
 *     summary: Retrieves the authenticated user's resume (DEPRECATED)
 *     description: This endpoint is deprecated. Use /api/resumes or /api/resumes/[resumeId] instead.
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       410:
 *         description: Gone - Endpoint deprecated.
 *   post:
 *     summary: Creates or updates the authenticated user's resume (DEPRECATED)
 *     description: This endpoint is deprecated. Use /api/resumes or /api/resumes/[resumeId] instead.
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: object # Prisma JSON type
 *                 description: The JSON content of the resume.
 *             required:
 *               - content
 *     responses:
 *       410:
 *         description: Gone - Endpoint deprecated.
 */

// GET /api/resume - DEPRECATED
export async function GET(req: NextRequest) {
  // This endpoint is deprecated. Users can have multiple resumes.
  // Use GET /api/resumes to get all resumes for a user
  // or GET /api/resumes/[resumeId] to get a specific resume.
  return NextResponse.json(
    { message: 'This endpoint (GET /api/resume) is deprecated. Please use /api/resumes.' },
    { status: 410 } // 410 Gone
  );
  /*
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // OLD LOGIC - Causes error because userId is not unique
    const resume = await prisma.resume.findUnique({
      where: { userId: session.user.id },
    });

    if (!resume) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(resume, { status: 200 });
  } catch (error) {
    console.error('Error in deprecated GET /api/resume:', error);
    return NextResponse.json({ message: 'Internal server error in deprecated endpoint' }, { status: 500 });
  }
  */
}

// POST /api/resume - DEPRECATED
export async function POST(req: NextRequest) {
  // This endpoint is deprecated. Users can have multiple resumes.
  // Use POST /api/resumes to create a new resume
  // or PUT /api/resumes/[resumeId] to update a specific resume.
  return NextResponse.json(
    { message: 'This endpoint (POST /api/resume) is deprecated. Please use /api/resumes or /api/resumes/[resumeId].' },
    { status: 410 } // 410 Gone
  );
  /*
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ message: 'Bad Request: Missing content' }, { status: 400 });
    }

    const userId = session.user.id;

    // OLD LOGIC - Causes error/unexpected behavior because userId is not unique for upsert's where
    const existingResume = await prisma.resume.findUnique({
      where: { userId },
    });

    const resume = await prisma.resume.upsert({
      where: { userId }, // This where clause is problematic for multiple resumes
      update: {
        content,
      },
      create: {
        userId,
        content,
      },
    });

    const status = existingResume ? 200 : 201;
    return NextResponse.json(resume, { status });

  } catch (error) {
    console.error('Error in deprecated POST /api/resume:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Bad Request: Invalid JSON format in deprecated endpoint' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error in deprecated endpoint' }, { status: 500 });
  }
  */
}

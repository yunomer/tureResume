import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../lib/prisma';

/**
 * @swagger
 * /api/resume:
 *   get:
 *     summary: Retrieves the authenticated user's resume
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved resume data. Can be null if no resume exists for the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *               nullable: true
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       500:
 *         description: Internal server error.
 *   post:
 *     summary: Creates or updates the authenticated user's resume
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
 *       200:
 *         description: Successfully updated resume data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       201:
 *         description: Successfully created resume data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resume'
 *       400:
 *         description: Bad Request - Missing content in request body.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       500:
 *         description: Internal server error.
 */

// GET /api/resume - Fetches the authenticated user's resume
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resume = await prisma.resume.findUnique({
      where: { userId: session.user.id },
    });

    if (!resume) {
      // Return 200 OK with null body if no resume is found for the user
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(resume, { status: 200 });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/resume - Creates or updates the authenticated user's resume
export async function POST(req: NextRequest) {
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

    // Validate content structure if necessary (e.g., using Zod)
    // For now, we assume content is a valid JSON object as expected by Prisma

    const userId = session.user.id;

    const existingResume = await prisma.resume.findUnique({
      where: { userId },
    });

    const resume = await prisma.resume.upsert({
      where: { userId },
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
    console.error('Error saving resume:', error);
    if (error instanceof SyntaxError) { // Handle cases where req.json() fails
        return NextResponse.json({ message: 'Bad Request: Invalid JSON format' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

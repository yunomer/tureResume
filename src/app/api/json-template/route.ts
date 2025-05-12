import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'AI_Resume.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    console.error('Error reading JSON template:', error);
    return NextResponse.json({ error: 'Failed to load JSON template' }, { status: 500 });
  }
}
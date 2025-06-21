import { duplicateResume } from '@/app/api/actions/resume';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

// Handle POST /api/resumes/:id/duplicate
export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const result = await duplicateResume(id);

    if (result.success) {
      return NextResponse.json(result);
    }
    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error('Erreur lors de la duplication du CV:', error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la duplication du CV",
      },
      { status: 500 }
    );
  }
}

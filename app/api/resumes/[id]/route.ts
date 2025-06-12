import { getResumeById } from '@/app/api/actions/resume';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const id = params.id;
    const result = await getResumeById(id);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du CV:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Une erreur est survenue lors de la récupération du CV',
      },
      { status: 500 }
    );
  }
}

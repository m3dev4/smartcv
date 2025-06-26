import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resumeData = await request.json();

    return NextResponse.json({
      resume: resumeData
    });
  } catch (error) {
    console.error('Erreur lors de la prévisualisation du PDF:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur', 
      details: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}

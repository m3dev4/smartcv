import { NextRequest, NextResponse } from 'next/server';
import { fetchResumeById } from '@/lib/prisma';

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    console.log('Requête PDF GET reçue pour l\'ID:', params.id);

    // Récupérer les détails du CV depuis la base de données
    const resume = await fetchResumeById(params.id);

    if (!resume) {
      console.error('CV non trouvé pour l\'ID:', params.id);
      return NextResponse.json({ error: 'CV non trouvé' }, { status: 404 });
    }

    // Utiliser une URL complète avec le domaine local
    const fullUrl = `http://localhost:3000/cv/${resume.id}?pdf=true`;

    // Envoyer les détails du CV au serveur Puppeteer
    const pdfResponse = await fetch('http://localhost:3001/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        resumeId: resume.id,
        url: fullUrl,
        fileName: `${resume.title || `${resume.personalInfo?.firstName || 'Resume'}`}.pdf`
      })
    });

    if (!pdfResponse.ok) {
      const errorData = await pdfResponse.json();
      console.error('Erreur de génération PDF:', errorData);
      return NextResponse.json({ 
        error: 'Erreur de génération PDF', 
        details: errorData 
      }, { status: 500 });
    }

    const pdfBlob = await pdfResponse.blob();

    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.title || `${resume.personalInfo?.firstName || 'Resume'}`}.pdf"`
      }
    });

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur', 
      details: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    console.log('Requête PDF POST reçue pour l\'ID:', params.id);

    // Récupérer les données du CV depuis le body de la requête
    const resumeData = await request.json();
    
    console.log('Données du CV reçues pour génération PDF:', {
      id: resumeData.id,
      template: resumeData.template?.name,
      personalInfo: resumeData.personalInfo?.firstName
    });

    if (!resumeData) {
      return NextResponse.json({ error: 'Données du CV manquantes' }, { status: 400 });
    }

    // Créer une URL de prévisualisation pour les données en direct
    const tempUrl = `http://localhost:3000/cv/preview/${params.id}`;

    // Envoyer les données du CV au serveur Puppeteer avec les données en direct
    const pdfResponse = await fetch('http://localhost:3001/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        resumeId: resumeData.id,
        url: tempUrl,
        resumeData: resumeData, // Passer les données directement
        fileName: `${resumeData.title || `${resumeData.personalInfo?.firstName || 'Resume'}`}.pdf`
      })
    });

    if (!pdfResponse.ok) {
      const errorData = await pdfResponse.json();
      console.error('Erreur de génération PDF:', errorData);
      return NextResponse.json({ 
        error: 'Erreur de génération PDF', 
        details: errorData 
      }, { status: 500 });
    }

    const pdfBlob = await pdfResponse.blob();

    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resumeData.title || `${resumeData.personalInfo?.firstName || 'Resume'}`}.pdf"`
      }
    });

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur', 
      details: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('myFile') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier uploadé' }, { status: 400 });
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const filename = `photo-${timestamp}${ext}`;

    // Chemin de destination
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, filename);

    // Créer le dossier s'il n'existe pas
    const fs = await import('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      fileName: filename,
      message: 'Fichier uploadé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { 
        error: 'Échec de l\'upload du fichier', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      }, 
      { status: 500 }
    );
  }
}

// Désactiver le parsing du body
export const config = {
  api: {
    bodyParser: false,
  },
};
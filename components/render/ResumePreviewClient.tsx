'use client';

import ResumePreview from './resumePreview';
import { useState, useEffect } from 'react';
import { useResume } from '@/context/resume-context';
import { useDownloadResume } from '@/hooks/useDownloadResume';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ResumePreviewClient({ 
  resume, 
  isPdfMode = false
}: { 
  resume: any, 
  isPdfMode?: boolean
}) {
  const { downloadResume, isDownloading, error } = useDownloadResume();
  const { saveResume, isSaving } = useResume();

  useEffect(() => {
    console.log('Resume data in client:', JSON.stringify(resume, null, 2));
  }, [resume]);

  const handleDownload = async () => {
    try {
      await saveResume(); // Assure que le template est enregistré
      downloadResume(resume.id);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde avant téléchargement', err);
    }
  };

  if (!resume) {
    return <div className="text-red-500">Aucune donnée de CV disponible</div>;
  }

  if (isPdfMode) {
    return <ResumePreview resume={resume} scale={1.0} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center space-x-4">
        <Button 
          onClick={handleDownload} 
          disabled={isDownloading || isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Download className="h-4 w-4 animate-spin" />
              Sauvegarde...
            </>
          ) : isDownloading ? (
            <>
              <Download className="h-4 w-4 animate-spin" />
              Téléchargement...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Télécharger PDF
            </>
          )}
        </Button>
        
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}
      </div>
      
      
      <ResumePreview 
        resume={resume} 
        className="p-4 bg-white"
      />
    </div>
  );
}
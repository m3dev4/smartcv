'use client';

import ResumePreview from './resumePreview';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log('Resume data in client:', JSON.stringify(resume, null, 2));
  }, [resume]);

  const handleDownload = () => {
    downloadResume(resume.id);
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
          disabled={isDownloading}
          className="flex items-center gap-2"
        >
          {isDownloading ? (
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
      
      {(!resume.personalInfo || Object.keys(resume.personalInfo).length === 0) && (
        <div className="bg-yellow-100 p-4 rounded">
          <p>Aucune information personnelle trouvée</p>
          <pre>{JSON.stringify(resume, null, 2)}</pre>
        </div>
      )}

      <ResumePreview 
        resume={resume} 
        className="p-4 bg-white"
      />
    </div>
  );
}
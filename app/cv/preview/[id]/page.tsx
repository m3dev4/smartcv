'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResumePreview from '@/components/render/resumePreview';

export default function CVPreviewPage() {
  const params = useParams();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        // Cette requête sera interceptée par Puppeteer avec les données en direct
        const response = await fetch(`/api/pdf/preview/${params.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}) // Le body sera remplacé par Puppeteer
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du CV');
        }

        const data = await response.json();
        setResume(data.resume);
      } catch (err) {
        console.error('Erreur lors du chargement du CV:', err);
        setError('Une erreur est survenue lors de la récupération du CV');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchResumeData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du CV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>CV non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ResumePreview 
        resume={resume} 
        scale={1.0} 
        className="w-full h-full"
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function useDownloadResume() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadResume = async (resumeId: string) => {
    try {
      setIsDownloading(true);
      setError(null);

      const response = await fetch(`/api/pdf/${resumeId}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Erreur lors du téléchargement du CV';
        
        // Utiliser toast pour afficher l'erreur
        toast.error(errorMessage);
        
        throw new Error(errorMessage);
      }

      // Créer un blob à partir de la réponse
      const blob = await response.blob();
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${resumeId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      link.remove();
      window.URL.revokeObjectURL(url);

      // Notification de succès
      toast.success('CV téléchargé avec succès');

    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur est survenue lors du téléchargement';
      
      // Afficher l'erreur dans le state et via toast
      setError(errorMessage);
      toast.error(errorMessage);
      
      console.error('Erreur de téléchargement:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadResume, isDownloading, error };
} 
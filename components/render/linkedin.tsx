'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Loader2, LinkedinIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useResume } from '@/context/resume-context';

interface LinkedInImportProps {
  onSuccess?: (resume: any) => void;
  onError?: (error: string) => void;
}

export function LinkedInImport({ onSuccess, onError }: LinkedInImportProps) {
  const { createFromLinkedIn, isCreatingFromLinkedIn } = useResume();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);

  const handleImport = async () => {
    if (!username.trim()) {
      setMessage({ type: 'error', content: 'Veuillez entrer un nom d\'utilisateur LinkedIn' });
      return;
    }

    try {
      setMessage(null);
      console.log('🚀 Début de l\'import LinkedIn avec le username:', username);
      
      const result = await createFromLinkedIn(username.trim());
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          content: result.message || 'CV créé avec succès depuis LinkedIn!' 
        });
        
        // Réinitialiser le formulaire
        setUsername('');
        
        // Callback de succès
        if (onSuccess) {
          onSuccess(result.resume);
        }
      } else {
        const errorMessage = result.message || 'Erreur lors de la création du CV depuis LinkedIn';
        setMessage({ type: 'error', content: errorMessage });
        
        // Callback d'erreur
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'import LinkedIn:', error);
      const errorMessage = error.message || 'Une erreur inattendue est survenue';
      setMessage({ type: 'error', content: errorMessage });
      
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const extractUsernameFromUrl = (input: string): string => {
    // Si c'est une URL LinkedIn complète
    if (input.includes('linkedin.com/in/')) {
      const match = input.match(/linkedin\.com\/in\/([^\/\?]+)/);
      return match ? match[1] : input;
    }
    
    // Si c'est juste le username
    return input.replace(/^@/, ''); // Supprimer le @ s'il y en a un
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedUsername = extractUsernameFromUrl(value);
    setUsername(cleanedUsername);
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <LinkedinIcon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Importer depuis LinkedIn</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Créez votre CV automatiquement à partir de votre profil LinkedIn public.
      </p>

      <div className="space-y-2">
        <Label htmlFor="linkedin-username">
          Nom d'utilisateur LinkedIn ou URL du profil
        </Label>
        <Input
          id="linkedin-username"
          type="text"
          placeholder="ex: john-doe ou https://linkedin.com/in/john-doe"
          value={username}
          onChange={handleInputChange}
          disabled={isCreatingFromLinkedIn}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Entrez votre nom d'utilisateur LinkedIn ou collez l'URL complète de votre profil
        </p>
      </div>


      <Button 
        onClick={handleImport}
        disabled={isCreatingFromLinkedIn || !username.trim()}
        className="w-full"
      >
        {isCreatingFromLinkedIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création du CV en cours...
          </>
        ) : (
          <>
            <LinkedinIcon className="mr-2 h-4 w-4" />
            Créer le CV depuis LinkedIn
          </>
        )}
      </Button>

      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Note:</strong> Votre profil LinkedIn doit être public pour que l'import fonctionne.</p>
        <p>Les données importées incluent : informations personnelles, expériences, éducation, compétences et certifications.</p>
      </div>
    </div>
  );
}
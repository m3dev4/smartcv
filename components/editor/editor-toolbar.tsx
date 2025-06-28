'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Download,
  Eye,
  Loader2,
  MenuIcon,
  Redo,
  Save,
  SidebarClose,
  Undo,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useResume } from '@/context/resume-context';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { downloadResume } from '@/utils/download-resume';
import { DownloadProgressModal } from '../ui/download-progress-modal';
import { useDownloadResume } from '@/hooks/useDownloadResume';
import { ProgressBar } from '../ui/progress-bar';

interface EditorToolbarProps {
  onTogglePropertiesPanel: () => void;
  proprietiesPanelOpen: boolean;
  onToggleMobileSidebar: () => void; // Added prop for mobile sidebar
}
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onTogglePropertiesPanel,
  proprietiesPanelOpen,
  onToggleMobileSidebar, // Destructure the new prop
}) => {
  const {
    resume,
    undo,
    redo,
    canUndo,
    canRedo,
    zoomIn,
    zoomOut,
    zoomLevel,
    isPreviewMode,
    togglePreviewMode,
    saveResume,
    isSaving,
    lastSaved,
  } = useResume();

  const [resumeIsSaving, setResumeIsSaving] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  
  // Hook pour le téléchargement PDF avec Puppeteer
  const { downloadResume: downloadPDF, isDownloading, error } = useDownloadResume();

  // Téléchargement PDF avec barre de progression
  const handleDownloadPdf = async () => {
    if (!resume?.id) return;
    setShowProgressBar(true);
    setDownloadProgress(0);
    try {
      setResumeIsSaving(true);
      await saveResume();
      // Téléchargement PDF avec suivi de progression
      const response = await fetch(`/api/pdf/${resume.id}`);
      if (!response.body) throw new Error('Pas de flux de données');
      const contentLength = response.headers.get('Content-Length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;
      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          loaded += value.length;
          if (total) {
            setDownloadProgress(Math.round((loaded / total) * 100));
          }
        }
      }
      // Fusionner les chunks et déclencher le téléchargement
      const blob = new Blob(chunks, { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.title || 'cv'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDownloadProgress(100);
    } catch (e) {
      setDownloadProgress(0);
    } finally {
      setTimeout(() => setShowProgressBar(false), 1000);
      setResumeIsSaving(false);
    }
  };

  const handleSave = async () => {
    setResumeIsSaving(true);
    try {
      await saveResume();
      toast.success('Le CV a été sauvegardé avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde du CV:', error);
      // Afficher un message d'erreur plus spécifique si disponible
      if (error.message && error.message.includes('CV introuvable')) {
        toast.error('Impossible de sauvegarder : CV introuvable. Veuillez rafraîchir la page.');
      } else {
        toast.error('Une erreur est survenue lors de la sauvegarde du CV');
      }
    } finally {
      setResumeIsSaving(false);
    }
  };

 

  /**
   *  Cette hook gére les evenement clavier pour les boutons undo et redo
   */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && canUndo) {
        e.preventDefault();
        undo();
      }

      if (e.ctrlKey && e.key === 'y' && canRedo) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  // Une seule vérification après tous les hooks
  if (!resume) {
    return null;
  }

  return (
    <>
    <div className="border-b border-slate-200 dark:border-neutral-800 px-2 sm:px-4 py-2 sm:py-3">
      <Toaster position="top-right" offset={20} />
      <div className="flex items-center justify-between gap-1 sm:gap-2">
      </div>
      {showProgressBar && (
  <div
    className="fixed top-4 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 flex flex-col items-center drop-shadow-lg"
    style={{ pointerEvents: 'none' }}
  >
    <div className="flex items-center gap-3 bg-white/90 dark:bg-neutral-900/95 rounded-2xl px-6 py-4 border border-violet-300 dark:border-violet-700 shadow-xl animate-fade-in">
      <svg className="w-7 h-7 text-violet-600 animate-spin-slow" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <div className="flex flex-col">
        <span className="font-semibold text-violet-700 dark:text-violet-300 text-base mb-1">
          Téléchargement du CV en cours...
        </span>
        <ProgressBar value={downloadProgress} className="h-3 bg-violet-100" />
        <span className="text-xs text-gray-500 mt-1">{downloadProgress}%</span>
      </div>
    </div>
  </div>
)}
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {/* left section */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Sidebar Toggle Button - visible only on small screens */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle sections sidebar"
          >
            <MenuIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Separator className="h-4 sm:h-6 lg:hidden" orientation="vertical" />

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={!canUndo}
              onClick={undo}
              title="Annuler (Ctrl+Z)"
              className="cursor-pointer h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
            >
              <Undo className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:ml-2 sm:inline">Annuler</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!canRedo}
              onClick={redo}
              title="Rétablir (Ctrl+Y)"
              className="cursor-pointer h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
            >
              <Redo className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:ml-2 sm:inline">Rétablir</span>
            </Button>
          </div>

          <Separator className="h-4 sm:h-6" orientation="vertical" />

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={zoomLevel <= 50}
              onClick={zoomOut}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm min-w-[40px] sm:min-w-[60px] text-center px-1">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={zoomLevel >= 200}
              onClick={zoomIn}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* center section - hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-2 flex-1 justify-center">
          <Badge variant="secondary" className="text-xs max-w-[200px] md:max-w-none">
            {lastSaved ? (
              <span className="truncate">
                Dernière sauvegarde:{' '}
                <span className="hidden md:inline">
                  {formatDistanceToNow(lastSaved, { addSuffix: true, locale: fr })}
                </span>
                <span className="md:hidden">{formatDistanceToNow(lastSaved, { locale: fr })}</span>
              </span>
            ) : (
              <span>Aucune sauvegarde</span>
            )}
          </Badge>
        </div>

        {/* right section */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant={isPreviewMode ? 'secondary' : 'ghost'}
            size="sm"
            onClick={togglePreviewMode}
            className="cursor-pointer h-8 sm:h-9 px-2 sm:px-3"
          >
            <Eye className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isPreviewMode ? 'text-green-500' : ''}`} />
            <span className="hidden md:ml-2 md:inline">
              {isPreviewMode ? "Quitter l'aperçu" : 'Aperçu'}
            </span>
          </Button>

          <Separator className="h-4 sm:h-6" orientation="vertical" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 sm:h-9 px-2 sm:px-3">
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden md:ml-2 md:inline">Télécharger</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={handleDownloadPdf}
                  disabled={isDownloading || resumeIsSaving}
                >
                  {isDownloading || resumeIsSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isDownloading || resumeIsSaving ? 'Génération en cours...' : 'Télécharger en PDF'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => resume && downloadResume(resume, 'json')}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger en JSON
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator className="h-4 sm:h-6" orientation="vertical" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={resumeIsSaving}
            className="cursor-pointer h-8 sm:h-9 px-2 sm:px-3"
          >
            {resumeIsSaving ? (
              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden md:ml-2 md:inline">Enregistrer</span>
              </>
            )}
          </Button>

          <Separator className="h-4 sm:h-6" orientation="vertical" />

          <Button
            onClick={onTogglePropertiesPanel}
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
            aria-label="Toggle properties panel"
          >
            <SidebarClose
              className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${
                proprietiesPanelOpen ? '' : 'rotate-180'
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
    <DownloadProgressModal
      isOpen={showProgressModal}
      progress={downloadProgress}
      onClose={() => {
        if (!isDownloading) {
          setShowProgressModal(false);
        }
      }}
      fileName={resume.title || resume.personalInfo?.firstName || 'Resume'}
    />
    </>
  );
};

export default EditorToolbar;

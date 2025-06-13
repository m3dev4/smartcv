import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Download,
  Eye,
  Loader2,
  Maximize,
  Menu as MenuIcon, // Added MenuIcon for mobile sidebar toggle
  Redo,
  Save,
  Share,
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

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-3">
      <Toaster position="top-right" offset={20} />
      <div className="flex items-center justify-between">
        {/* left section */}
        <div className="flex items-center gap-2">
          {/* Mobile Sidebar Toggle Button - visible only on small screens */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle sections sidebar"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
          <Separator className="h-6 lg:hidden" orientation="vertical" />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={!canUndo}
              onClick={undo}
              title="Annuler (Ctrl+Z)"
              className="cursor-pointer"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!canRedo}
              onClick={redo}
              title="Rétablir (Ctrl+Y)"
              className="cursor-pointer"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="h-6" orientation="vertical" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled={zoomLevel <= 50} onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w[60px] text-center">{zoomLevel}%</span>
            <Button variant="ghost" size="sm" disabled={zoomLevel >= 200} onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* center section */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {lastSaved ? (
              <>
               <span>
                Dernière sauvegarde: {formatDistanceToNow
                 (lastSaved, { addSuffix: true, locale: fr })
                }
               </span>
              </>
            ): (
              <>
                <span>
                  Aucune sauvegarde
                </span>
              </>
            )}
          </Badge>
        </div>

        {/* right section */}
        <div className="flex items-center gap-2">
          <Button
            variant={isPreviewMode ? 'secondary' : 'ghost'}
            size="sm"
            onClick={togglePreviewMode}
            className="cursor-pointer"
          >
            <Eye className={`h-4 w-4 mr-2 ${isPreviewMode ? 'text-green-500' : ''}`} />
            {isPreviewMode ? "Quitter l'aperçu" : 'Aperçu'}
          </Button>

          <Separator className="h-6" orientation="vertical" />

          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Partager
          </Button>

          <Separator className="h-6" orientation="vertical" />

          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>

          <Separator className="h-6" orientation="vertical" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={resumeIsSaving}
            className="cursor-pointer"
          >
            {resumeIsSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>

          <Separator className="h-6" orientation="vertical" />

          <Button
            onClick={onTogglePropertiesPanel}
            variant="ghost"
            size="icon"
            className="p-2"
            aria-label="Toggle properties panel"
          >
            <SidebarClose
              className={`h-5 w-5 transition-transform ${proprietiesPanelOpen ? '' : 'rotate-180'}`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;

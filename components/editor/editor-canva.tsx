import { useResume } from '@/context/resume-context';
import { Loader2 } from 'lucide-react';
import React from 'react';
import ResumePreview from './resume-preview';

interface EditorCanvaProps {
  selectedSection: string | null;
  onselectedSection: (section: string | null) => void;
}
const EditorCanva: React.FC<EditorCanvaProps> = ({ selectedSection, onselectedSection }) => {
  const { resume, isLoading, zoomLevel, isPreviewMode } = useResume();
  
  console.log("EditorCanva - isPreviewMode:", isPreviewMode);
  
  if (isLoading || !resume) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Chargement du CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-auto h-full flex items-start justify-center ${isPreviewMode ? 'bg-green-50 p-0' : 'p-8 bg-slate-100 dark:bg-slate-900'}`}>
      <div
        className={`w-full max-w-4xl mx-auto h-auto relative ${isPreviewMode ? 'pt-0' : 'pt-4'}`}
        style={{ 
          transform: `scale(${zoomLevel / 100})`, 
          transformOrigin: 'top center',
        }}
      >
        {/* Effet de papier avec ombre - masqué en mode aperçu */}
        {!isPreviewMode && (
          <>
            <div className="absolute inset-0 rounded-lg shadow-2xl transform rotate-1 opacity-20"></div>
            <div className="absolute inset-0 rounded-lg shadow-2xl transform -rotate-1 opacity-20"></div>
          </>
        )}

        {/* Conteneur principal du CV */}
        <div
          className={`relative ${isPreviewMode ? '' : 'shadow-2xl rounded-lg'} overflow-auto ${isPreviewMode ? 'border-0' : 'border border-slate-200 dark:border-slate-700'}`}
        >
          <ResumePreview
            resume={resume}
            selectedSection={isPreviewMode ? null : selectedSection}
            onSelectedSection={isPreviewMode ? () => {} : onselectedSection}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorCanva;

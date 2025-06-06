import { useResume } from '@/context/resume-context';
import { Loader2 } from 'lucide-react';
import React from 'react';
import ResumePreview from './resume-preview';

interface EditorCanvaProps {
  selectedSection: string | null;
  onselectedSection: (section: string | null) => void;
}
const EditorCanva: React.FC<EditorCanvaProps> = ({ selectedSection, onselectedSection }) => {
  const { resume, isLoading } = useResume();

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
    <div className="flex-1 p-8 overflow-auto h-full flex items-start justify-center">
      <div className="w-full max-w-4xl mx-auto h-auto relative pt-4">
        {/* Effet de papier avec ombre */}
        <div className="absolute inset-0 rounded-lg shadow-2xl transform rotate-1 opacity-20"></div>
        <div className="absolute inset-0 rounded-lg shadow-2xl transform -rotate-1 opacity-20"></div>
        
        {/* Conteneur principal du CV */}
        <div className="relative shadow-2xl rounded-lg overflow-auto border border-slate-200 dark:border-slate-700">
          <ResumePreview 
           resume={resume}
           selectedSection={selectedSection}
           onSelectedSection={onselectedSection}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorCanva;

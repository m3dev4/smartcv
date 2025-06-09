'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';
import { useResume } from '@/context/resume-context';
import { RenderPersonalInfoEditor } from '../render/renderPersonalInfo';
import { RenderExperienceEditor } from '../render/renderExperience';
import { RenderEducationEditor } from '../render/renderFormation';
import { RenderSkillsEditor } from '../render/renderSkill';
import { RenderLanguagesEditor } from '../render/renderLanguage';
import { RenderCertificationsEditor } from '../render/renderCertification';
import { X } from 'lucide-react';
import { RenderThemeEditor } from '../render/renderTheme';
import { RenderTypographyEditor } from '../render/renderTypography';

interface EditorPropertiesPanelProps {
  selectedSection: string | null;
  onClose: () => void;
}

export function EditorPropertiesPanel({ selectedSection, onClose }: EditorPropertiesPanelProps) {
  const { resume } = useResume();

  if (!selectedSection || !resume) {
    return (
      <div className="w-80 border-l border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Propriétés</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Sélectionnez une section pour modifier ses propriétés.
        </p>
      </div>
    );
  }

  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      personal: 'Informations personnelles',
      experience: 'Expériences',
      education: 'Formation',
      skills: 'Compétences',
      languages: 'Langues',
      projects: 'Projets',
      achievements: 'Réalisations',
      theme: 'Thème',
      template: 'Template',
      font: 'Police',
    };
    return titles[selectedSection] || 'Propriétés';
  };

  const renderSectionEditor = () => {
    switch (selectedSection) {
      case 'personal':
        return <RenderPersonalInfoEditor />;
      case 'experience':
        return <RenderExperienceEditor />;
      case 'education':
        return <RenderEducationEditor />;
      case 'skills':
        return <RenderSkillsEditor />;
      case 'languages':
        return <RenderLanguagesEditor />;
      case 'certifications':
        return <RenderCertificationsEditor />;
      case 'theme':
        return <RenderThemeEditor />;
        case 'font':
        return <RenderTypographyEditor />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              Éditeur pour cette section en cours de développement
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold">{getSectionTitle()}</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4">{renderSectionEditor()}</div>
      </ScrollArea>
    </div>
  );
}

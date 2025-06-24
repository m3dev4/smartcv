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
import { LinkedInImport } from '../render/linkedin';
import RenderTemplate from '../render/renderTemplate';
import { RenderHobbiesEditor } from '../render/renderHobby';

interface EditorPropertiesPanelProps {
  selectedSection: string | null;
  onClose: () => void;
  isMobileView?: boolean;
}

export function EditorPropertiesPanel({
  selectedSection,
  onClose,
  isMobileView = false,
}: EditorPropertiesPanelProps) {
  const { resume } = useResume();

  if (!selectedSection || !resume) {
    return (
      <div className={`w-full p-6 dark:bg-neutral-900 h-full ${!isMobileView ? 'lg:border-l border-neutral-800' : ''}`}>
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
      personalInfo: 'Informations personnelles',
      experiences: 'Expériences',
      educations: 'Formation',
      skills: 'Compétences',
      languages: 'Langues',
      projects: 'Projets',
      achievements: 'Réalisations',
      hobbies: 'Loisirs & Centres d\'intérêt',
      theme: 'Thème',
      template: 'Template',
      font: 'Police',
      linkedin: 'Créer depuis LinkedIn',
    };
    
    // Si c'est une custom section, extraire le titre du contenu
    if (selectedSection.startsWith('custom-')) {
      const customSection = resume.customSections?.find(cs => cs.id === selectedSection);
      if (customSection) {
        try {
          const content = JSON.parse(customSection.content);
          return titles[content.type] || customSection.title;
        } catch {
          return customSection.title;
        }
      }
    }
    
    return titles[selectedSection] || 'Propriétés';
  };

  const renderSectionEditor = () => {
    // Gérer les custom sections
    if (selectedSection.startsWith('custom-')) {
      const customSection = resume.customSections?.find(cs => cs.id === selectedSection);
      if (customSection) {
        try {
          const content = JSON.parse(customSection.content);
          switch (content.type) {
            case 'hobbies':
              return <RenderHobbiesEditor />;
            case 'awards':
              // return <RenderAwardsEditor />;
            case 'publications':
              // return <RenderPublicationsEditor />;
            case 'references':
              // return <RenderReferencesEditor />;
            case 'volunteering':
              // return <RenderVolunteeringEditor />;
            default:
              return (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    Éditeur pour cette section en cours de développement
                  </p>
                </div>
              );
          }
        } catch {
          return (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                Erreur lors du chargement de la section
              </p>
            </div>
          );
        }
      }
    }

    // Sections normales
    switch (selectedSection) {
      case 'personalInfo':
        return <RenderPersonalInfoEditor />;
      case 'experiences':
        return <RenderExperienceEditor />;
      case 'educations':
        return <RenderEducationEditor />;
      case 'skills':
        return <RenderSkillsEditor />;
      case 'languages':
        return <RenderLanguagesEditor />;
      case 'certifications':
        return <RenderCertificationsEditor />;
      case 'hobbies':
        return <RenderHobbiesEditor />;
      case 'template':
        return <RenderTemplate />;
      case 'theme':
        return <RenderThemeEditor />;
      case 'font':
        return <RenderTypographyEditor />;
      case 'linkedin':
        return <LinkedInImport />;
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
    <div className={`w-full ${!isMobileView ? 'lg:border-l border-gray-200' : ''} flex flex-col h-full bg-white dark:bg-black/90`}>
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
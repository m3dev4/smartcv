import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '../ui/button';
import {
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Languages,
  Layout,
  Linkedin,
  Palette,
  Trophy,
  Type,
  User,
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { AddSectionDialog } from './add-section';

interface EditorSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedSection: string | null;
  onSelectSection: (section: string) => void;
  isMobileView?: boolean;
}

const sections = [
  { id: 'personal', label: 'Informations personnelles', icon: User, color: 'bg-blue-500' },
  { id: 'experience', label: 'Expériences', icon: Briefcase, color: 'bg-green-500' },
  { id: 'education', label: 'Formation', icon: GraduationCap, color: 'bg-purple-500' },
  { id: 'skills', label: 'Compétences', icon: Award, color: 'bg-orange-500' },
  { id: 'languages', label: 'Langues', icon: Languages, color: 'bg-pink-500' },
  { id: 'certifications', label: 'Certifications', icon: Award, color: 'bg-cyan-500' },
  { id: 'achievements', label: 'Réalisations', icon: Trophy, color: 'bg-yellow-500' },
];

const designTools = [
  { id: 'template', label: 'Template', icon: Layout },
  { id: 'theme', label: 'Thème', icon: Palette },
  { id: 'font', label: 'Police', icon: Type },
];

const linkedinExtract = [{ id: 'linkedin', label: 'Créer depuis LinkedIn', icon: Linkedin }];

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  collapsed,
  onSelectSection,
  selectedSection,
  onToggleCollapse,
  isMobileView = false,
}) => {
  const handleSectionAdded = (sectionId: string) => {
    // Sélectionner automatiquement la nouvelle section ajoutée
    onSelectSection(sectionId);
  };

  return (
    <div
      className={cn(
        'border-r border-slate-200 dark:border-slate-700 flex flex-col h-full w-full bg-white dark:bg-black/90'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        {!collapsed && <h2 className="font-semibold">{isMobileView ? 'Menu' : 'Editeur CV'}</h2>}
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          aria-label={
            isMobileView ? 'Close menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'
          }
        >
          {isMobileView ? (
            <ChevronLeft className="h-4 w-4" />
          ) : collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className={cn('space-y-2', collapsed ? 'p-2' : 'p-4')}>
          <div>
            {!collapsed && <h3>Sections</h3>}
            <div className="space-y-2">
              {sections.map(section => (
                <Button
                  key={section.id}
                  variant={selectedSection === section.id ? 'secondary' : 'ghost'}
                  className={cn('w-full h-10', collapsed ? 'justify-center' : 'justify-start px-3')}
                  onClick={() => onSelectSection(section.id)}
                >
                  {collapsed ? (
                    <div className="flex items-center">
                      <div className={cn('w-2 h-2 rounded-full shrink-0', section.color)} />
                      <section.icon className="h-4 w-4 ml-2 shrink-0" />
                    </div>
                  ) : (
                    <>
                      <div className={cn('w-2 h-2 rounded-full mr-3 shrink-0', section.color)} />
                      <section.icon className="h-4 w-4 mr-3 shrink-0" />
                      <span className="text-sm">{section.label}</span>
                    </>
                  )}
                </Button>
              ))}

              {!collapsed && <AddSectionDialog onSectionAdded={handleSectionAdded} />}
            </div>
          </div>
          {!collapsed && <Separator />}

          <div>
            {!collapsed && <h3 className="text-sm font-medium text-gray-500 mb-3">DESIGN</h3>}
            <div className="space-y-2">
              {designTools.map(tool => (
                <Button
                  key={tool.id}
                  variant={selectedSection === tool.id ? 'secondary' : 'ghost'}
                  className={cn('w-full h-10', collapsed ? 'justify-center' : 'justify-start px-3')}
                  onClick={() => onSelectSection(tool.id)}
                >
                  {collapsed ? (
                    <tool.icon className="h-4 w-4 shrink-0" />
                  ) : (
                    <>
                      <tool.icon className="h-4 w-4 mr-3 shrink-0" />
                      <span className="text-sm">{tool.label}</span>
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div>
            {!collapsed && (
              <h3 className="text-sm font-medium text-gray-500 mb-3">Créer depuis LinkedIn</h3>
            )}
            <div className="space-y-2">
              {linkedinExtract.map(tool => (
                <Button
                  key={tool.id}
                  variant={selectedSection === tool.id ? 'secondary' : 'ghost'}
                  className={cn('w-full h-10', collapsed ? 'justify-center' : 'justify-start px-3')}
                  onClick={() => onSelectSection(tool.id)}
                >
                  {collapsed ? (
                    <tool.icon className="h-4 w-4 shrink-0" />
                  ) : (
                    <>
                      <tool.icon className="h-4 w-4 mr-3 shrink-0" />
                      <span className="text-sm">{tool.label}</span>
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditorSidebar;

import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '../ui/button';
import {
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  GraduationCap,
  Languages,
  Layout,
  Palette,
  Trophy,
  Type,
  User,
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface EditorSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedSection: string | null;
  onSelectSection: (section: string) => void;
}

const sections = [
  { id: 'personal', label: 'Informations personnelles', icon: User, color: 'bg-blue-500' },
  { id: 'experience', label: 'Expériences', icon: Briefcase, color: 'bg-green-500' },
  { id: 'education', label: 'Formation', icon: GraduationCap, color: 'bg-purple-500' },
  { id: 'skills', label: 'Compétences', icon: Award, color: 'bg-orange-500' },
  { id: 'languages', label: 'Langues', icon: Languages, color: 'bg-pink-500' },
  { id: 'projects', label: 'Projets', icon: FolderOpen, color: 'bg-cyan-500' },
  { id: 'achievements', label: 'Réalisations', icon: Trophy, color: 'bg-yellow-500' },
];

const designTools = [
  { id: 'template', label: 'Template', icon: Layout },
  { id: 'theme', label: 'Thème', icon: Palette },
  { id: 'font', label: 'Police', icon: Type },
];

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  collapsed,
  onSelectSection,
  selectedSection,
  onToggleCollapse,
}) => {
  return (
    <div
      className={cn(
        'border-r border-slate-200 dark:border-slate-700 fixed transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-80'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        {!collapsed && <h2 className="font-semibold">Editeur CV</h2>}
        <Button variant="ghost" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-6">
          <div>
            {!collapsed && <h3>Sections</h3>}
            <div className="space-y-2">
              {sections.map(section => (
                <Button
                  key={section.id}
                  variant={selectedSection === section.id ? 'secondary' : 'ghost'}
                  className={cn('w-full justify-start h-10', collapsed ? 'px-2' : 'px-3')}
                  onClick={() => onSelectSection(section.id)}
                >
                  <div className={cn('w-2 h-2 rounded-full mr-3', section.color)} />
                  <section.icon className="h-4 w-4 mr-3" />
                  {!collapsed && <span className="text-sm">{section.label}</span>}
                </Button>
              ))}

              {!collapsed && (
                <Button variant="outline" className="w-full justify-start h-10 border-dashed">
                  <FolderOpen className="h-4 w-4 mr-3" />
                  <span className="text-sm">Ajouter une section</span>
                </Button>
              )}
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
                  className={cn('w-full justify-start h-10', collapsed ? 'px-2' : 'px-3')}
                  onClick={() => onSelectSection(tool.id)}
                >
                  <tool.icon className="h-4 w-4 mr-3" />
                  {!collapsed && <span className="text-sm">{tool.label}</span>}
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

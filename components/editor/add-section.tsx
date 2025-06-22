'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, Contact, FolderOpen, Heart, Plus, Trophy, Users } from 'lucide-react';
import { useResume } from '@/context/resume-context';

interface SectionOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const sectionOptions: SectionOption[] = [
  {
    id: 'hobbies',
    title: "Loisirs & Centres d'intérêt",
    description: "Ajoutez vos passe-temps et centres d'intérêt personnels",
    icon: Heart,
    color: 'bg-pink-500',
  },
  {
    id: 'awards',
    title: 'Prix & Récompenses',
    description: 'Mettez en avant vos distinctions et reconnaissances',
    icon: Trophy,
    color: 'bg-yellow-500',
  },
  {
    id: 'publications',
    title: 'Publications',
    description: 'Listez vos articles, livres ou autres publications',
    icon: BookOpen,
    color: 'bg-blue-500',
  },
  {
    id: 'references',
    title: 'Références',
    description: 'Ajoutez des contacts de référence professionnels',
    icon: Contact,
    color: 'bg-green-500',
  },
  {
    id: 'volunteering',
    title: 'Bénévolat',
    description: 'Partagez vos expériences de volontariat et engagement social',
    icon: Users,
    color: 'bg-purple-500',
  },
];

interface AddSectionDialogProps {
  trigger?: React.ReactNode;
  onSectionAdded?: (sectionId: string) => void;
}

export function AddSectionDialog({ trigger, onSectionAdded }: AddSectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { resume, updateResume } = useResume();

  const handleAddSection = (sectionId: string) => {
    if (!resume) return;

    // Générer un ID unique pour la custom section
    const customSectionId = `custom-${sectionId}-${Date.now()}`;

    // Trouver la section correspondante
    const sectionOption = sectionOptions.find(option => option.id === sectionId);
    if (!sectionOption) return;

    // Créer une nouvelle custom section
    const newCustomSection = {
      id: customSectionId,
      title: sectionOption.title,
      content: JSON.stringify({
        type: sectionId,
        data: [],
        config: {
          showIcon: true,
          color: sectionOption.color,
        },
      }),
      order: (resume.customSections?.length || 0) + 1,
    };

    // Mettre à jour le CV avec la nouvelle section
    const updatedCustomSections = [...(resume.customSections || []), newCustomSection];

    updateResume({
      customSections: updatedCustomSections,
    });

    // Fermer le dialog et notifier le parent
    setOpen(false);
    onSectionAdded?.(customSectionId);
  };

  const defaultTrigger = (
    <Button variant="outline" className="w-full justify-start h-10 border-dashed">
      <FolderOpen className="h-4 w-4 mr-3" />
      <span className="text-sm">Ajouter une section</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter une nouvelle section
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {sectionOptions.map(section => {
            const IconComponent = section.icon;
            const isAlreadyAdded = resume?.customSections?.some(customSection => {
              try {
                const content = JSON.parse(customSection.content);
                return content.type === section.id;
              } catch {
                return false;
              }
            });

            return (
              <Card
                key={section.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedSection === section.id ? 'ring-2 ring-blue-500' : ''
                } ${isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!isAlreadyAdded) {
                    setSelectedSection(section.id);
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${section.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium">
                        {section.title}
                        {isAlreadyAdded && (
                          <span className="ml-2 text-xs text-muted-foreground">(Déjà ajoutée)</span>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs">{section.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={() => selectedSection && handleAddSection(selectedSection)}
            disabled={
              !selectedSection ||
              resume?.customSections?.some(customSection => {
                try {
                  const content = JSON.parse(customSection.content);
                  return content.type === selectedSection;
                } catch {
                  return false;
                }
              })
            }
          >
            Ajouter la section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

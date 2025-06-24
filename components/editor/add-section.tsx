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
import { toast } from 'sonner';
import { useResume } from '@/context/resume-context';

interface SectionOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// Sections actuellement non disponibles
const disabledSections = ['awards', 'publications', 'references', 'volunteering'] as const;

type DisabledSectionId = typeof disabledSections[number];

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
    // Sécurité supplémentaire : empêcher l'ajout si la section est désactivée
    if ((disabledSections as readonly string[]).includes(sectionId)) {
      toast.warning('Cette section est en cours de développement.');
      return;
    }
    if (!resume) return;

    // Pour les loisirs, on redirige directement vers l'éditeur sans créer de custom section
    if (sectionId === 'hobbies') {
      // Fermer le dialog et rediriger vers l'éditeur hobbies
      setOpen(false);
      onSectionAdded?.('hobbies'); // Utilise l'ID de section standard
      return;
    }

    // Pour les autres sections, créer une custom section
    const customSectionId = `custom-${sectionId}-${Date.now()}`;
    const sectionOption = sectionOptions.find(option => option.id === sectionId);
    if (!sectionOption) return;

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
            const isDisabled = (disabledSections as readonly string[]).includes(section.id);

            const IconComponent = section.icon;

            return (
              <Card
                key={section.id}
                className={`transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'} ${
                  selectedSection === section.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  if (isDisabled) {
                    toast.warning('Cette section est en cours de développement.');
                    return;
                  }
                  setSelectedSection(section.id);
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
            disabled={!selectedSection}
          >
            Ajouter la section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
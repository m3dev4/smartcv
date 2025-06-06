import { useResume } from '@/context/resume-context';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input, Textarea } from '@headlessui/react';

export const RenderExperienceEditor = () => {
  const { resume, updateResume } = useResume();

  if (!resume) {
    return null;
  }

  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);

  const experiences = resume.experiences || [];

  // Fonction pour ajouter une nouvelle expérience
  const addExperience = () => {
    const newExperience = {
      id: `experience-${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      desctiption: '',
      location: '',
      order: experiences.length,
    };

    updateResume({
      experiences: [...experiences, newExperience],
    });
    setSelectedExperienceIndex(experiences.length);
  };

  // Fonction pour supprimer une expérience
  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const updatedExperiences = experiences.filter((_, i) => i !== index);
      updateResume({
        experiences: updatedExperiences,
      });

      if (selectedExperienceIndex >= updatedExperiences.length) {
        setSelectedExperienceIndex(Math.max(0, updatedExperiences.length - 1));
      }
    }
  };

  // Fonction pour mettre à jour une expérience spécifique
  const updateExperience = (index: number, field: string, value: string | boolean) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );

    updateResume({
      experiences: updatedExperiences,
    });
  };

  const currentExperience = experiences[selectedExperienceIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Header avec sélection et actions */}
      <div className="flex items-center flex-col justify-between border-b pb-3 overflow-y-scroll">
        <div className="flex items-center gap-2 ">
          <select
            value={selectedExperienceIndex}
            onChange={e => setSelectedExperienceIndex(Number(e.target.value))}
            className="border border-muted rounded px-2 py-1"
          >
            {experiences.map((exp, index) => (
              <option key={index} value={index}>
                {exp.position || `Expérience ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex  gap-2">
          <Button size="sm" variant="outline" onClick={addExperience} className="text-xs">
            + Ajouter
          </Button>
          {experiences.length > 1 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeExperience(selectedExperienceIndex)}
              className="text-xs"
            >
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Formulaire pour l'expérience sélectionnée */}
      {currentExperience && (
        <div className="flex flex-col gap-2 w-full space-y-2">
          <div className="py-2">
            <Label className="mb-2">Poste</Label>
            <Input
              id="position"
              value={currentExperience.position || ''}
              className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateExperience(selectedExperienceIndex, 'position', e.target.value)
              }
            />
          </div>

          <div className="py-2">
            <Label className="mb-2">Entreprise</Label>
            <Input
              id="company"
              value={currentExperience.company || ''}
              className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateExperience(selectedExperienceIndex, 'company', e.target.value)
              }
            />
          </div>

          <div className="py-2">
            <Label className="mb-2">Lieu</Label>
            <Input
              id="location"
              value={currentExperience.location || ''}
              className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateExperience(selectedExperienceIndex, 'location', e.target.value)
              }
            />
          </div>

          <div className="flex gap-2">
            <div className="py-2 flex-1">
              <Label className="mb-2">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={currentExperience.startDate || ''}
                className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateExperience(selectedExperienceIndex, 'startDate', e.target.value)
                }
              />
            </div>

            <div className="py-2 flex-1">
              <Label className="mb-2">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={currentExperience.endDate || ''}
                disabled={currentExperience.current}
                className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateExperience(selectedExperienceIndex, 'endDate', e.target.value)
                }
              />
            </div>
          </div>

          <div className="py-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="current"
                checked={currentExperience.current || false}
                className="rounded border border-muted"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateExperience(selectedExperienceIndex, 'current', e.target.checked);
                  if (e.target.checked) {
                    updateExperience(selectedExperienceIndex, 'endDate', '');
                  }
                }}
              />
              <Label htmlFor="current">Poste actuel</Label>
            </div>
          </div>

          <div className="py-2">
            <Label className="mb-2">Description</Label>
            <Textarea
              id="description"
              value={currentExperience.desctiption || ''}
              placeholder="Décrivez vos responsabilités et réalisations..."
              className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg min-h-[100px]"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateExperience(selectedExperienceIndex, 'desctiption', e.target.value)
              }
            />
          </div>
        </div>
      )}

      {/* Message si aucune expérience */}
      {experiences.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">Aucune expérience ajoutée</p>
          <Button onClick={addExperience} variant="outline">
            Ajouter votre première expérience
          </Button>
        </div>
      )}
    </div>
  );
};

import { useResume } from '@/context/resume-context';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input, Textarea } from '@headlessui/react';

export const RenderEducationEditor = () => {
  const { resume, updateResume } = useResume();

  const [selectedEducationIndex, setSelectedEducationIndex] = useState(0);

  if (!resume) {
    return null;
  }
  const educations = resume.educations || [];

  // Fonction pour ajouter une nouvelle formation
  const addEducation = () => {
    const newEducation = {
      id: `education-${Date.now()}`,
      institutions: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: '',
      location: '',
      order: educations.length,
    };

    updateResume({
      educations: [...educations, newEducation],
    });
    setSelectedEducationIndex(educations.length);
  };

  // Fonction pour supprimer une formation
  const removeEducation = (index: number) => {
    if (educations.length > 1) {
      const updatedEducations = educations.filter((_, i) => i !== index);
      updateResume({
        educations: updatedEducations,
      });

      if (selectedEducationIndex >= updatedEducations.length) {
        setSelectedEducationIndex(Math.max(0, updatedEducations.length - 1));
      }
    }
  };

  // Fonction pour mettre à jour une formation spécifique
  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducations = educations.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );

    updateResume({
      educations: updatedEducations,
    });
  };

  const currentEducation = educations[selectedEducationIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Header avec sélection et actions */}
      <div className="flex items-center flex-col justify-between border-b pb-3">
        <div className="flex items-center py-2 gap-2">
          <select
            value={selectedEducationIndex}
            onChange={e => setSelectedEducationIndex(Number(e.target.value))}
            className="border border-muted rounded px-2 py-1"
          >
            {educations.map((edu, index) => (
              <option key={index} value={index}>
                {edu.institutions || `Formation ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={addEducation} className="text-xs">
            + Ajouter
          </Button>
          {educations.length > 1 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeEducation(selectedEducationIndex)}
              className="text-xs"
            >
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Formulaire pour la formation sélectionnée */}
      {currentEducation && (
        <div className="flex flex-col gap-2">
          <div className="py-2">
            <Label className="mb-2">Institution</Label>
            <Input
              id="institution"
              value={currentEducation.institutions || ''}
              className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateEducation(selectedEducationIndex, 'institutions', e.target.value)
              }
            />
          </div>

          <div className="py-2">
            <Label className="mb-2">Diplôme</Label>
            <Input
              id="degree"
              value={currentEducation.degree || ''}
              className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateEducation(selectedEducationIndex, 'degree', e.target.value)
              }
            />
          </div>

          <div className="py-2">
            <Label className="mb-2">Domaine d'étude</Label>
            <Input
              id="fieldOfStudy"
              value={currentEducation.fieldOfStudy || ''}
              className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateEducation(selectedEducationIndex, 'fieldOfStudy', e.target.value)
              }
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="py-2 flex-1">
              <Label className="mb-2">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={currentEducation.startDate || ''}
                className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateEducation(selectedEducationIndex, 'startDate', e.target.value)
                }
              />
            </div>

            <div className="py-2 flex-1">
              <Label className="mb-2">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={currentEducation.endDate || ''}
                className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateEducation(selectedEducationIndex, 'endDate', e.target.value)
                }
              />
            </div>
          </div>

          <div className="py-2">
            <Label className="mb-2">Emplacement</Label>
            <Input
              id="location"
              value={currentEducation.location || ''}
              className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateEducation(selectedEducationIndex, 'location', e.target.value)
              }
            />
          </div>

          <div className="py-2">
            <Label className="mb-2">Description</Label>
            <Textarea
              id="description"
              value={currentEducation.description || ''}
              className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg min-h-[80px]"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateEducation(selectedEducationIndex, 'description', e.target.value)
              }
            />
          </div>
        </div>
      )}

      {/* Message si aucune formation */}
      {educations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">Aucune formation ajoutée</p>
          <Button onClick={addEducation} variant="outline">
            Ajouter votre première formation
          </Button>
        </div>
      )}
    </div>
  );
};

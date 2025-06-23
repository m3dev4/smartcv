
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useResume } from '@/context/resume-context';

interface Hobby {
  id: string;
  name: string;
  icon?: string;
  order?: number;
}

const iconOptions = [
  { value: '❤️', label: '❤️ Général' },
  { value: '🎵', label: '🎵 Musique' },
  { value: '📷', label: '📷 Photographie' },
  { value: '📚', label: '📚 Lecture' },
  { value: '🎮', label: '🎮 Jeux vidéo' },
  { value: '✈️', label: '✈️ Voyage' },
  { value: '🎨', label: '🎨 Art' },
  { value: '💪', label: '💪 Sport' },
  { value: '☕', label: '☕ Café' },
  { value: '🏔️', label: '🏔️ Randonnée' },
  { value: '🚴', label: '🚴 Cyclisme' },
  { value: '🌲', label: '🌲 Nature' },
  { value: '🚗', label: '🚗 Automobile' },
  { value: '🍴', label: '🍴 Cuisine' },
  { value: '🎬', label: '🎬 Cinéma' },
  { value: '🎧', label: '🎧 Musique' },
  { value: '🎨', label: '🎨 Design' },
  { value: '💻', label: '💻 Programmation' },
  { value: '🌍', label: '🌍 Langues' },
  { value: '👥', label: '👥 Social' },
];

export function RenderHobbiesEditor() {
  const { resume, updateResume } = useResume();
  const [localHobbies, setLocalHobbies] = useState<Hobby[]>([]);

  useEffect(() => {
    if (resume?.hobbies) {
      setLocalHobbies([...resume.hobbies].sort((a, b) => (a.order || 0) - (b.order || 0)));
    }
  }, [resume?.hobbies]);

  const handleAddHobby = () => {
    const newHobby: Hobby = {
      id: `hobby-${Date.now()}`,
      name: '',
      icon: 'heart',
      order: localHobbies.length,
    };
    setLocalHobbies([...localHobbies, newHobby]);
  };

  const handleUpdateHobby = (index: number, field: keyof Hobby, value: string | number) => {
    const updated = [...localHobbies];
    updated[index] = { ...updated[index], [field]: value };
    setLocalHobbies(updated);
  };

  const handleDeleteHobby = (index: number) => {
    const updated = localHobbies.filter((_, i) => i !== index);
    setLocalHobbies(updated);
  };

  const handleSave = () => {
    const validHobbies = localHobbies
      .filter(hobby => hobby.name.trim() !== '')
      .map((hobby, index) => ({ ...hobby, order: index }));

    updateResume({ hobbies: validHobbies });
  };

  const handleCancel = () => {
    if (resume?.hobbies) {
      setLocalHobbies([...resume.hobbies].sort((a, b) => (a.order || 0) - (b.order || 0)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Loisirs & Centres d'intérêt</h3>
      </div>

      <div className="space-y-4">
        {localHobbies.map((hobby, index) => (
          <Card key={hobby.id} className="p-4">
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />

              <div className="flex-1 grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor={`hobby-name-${index}`}>Nom du loisir</Label>
                  <Input
                    id={`hobby-name-${index}`}
                    value={hobby.name}
                    onChange={(e) => handleUpdateHobby(index, 'name', e.target.value)}
                    placeholder="Ex: Photographie, Cuisine, Sport..."
                  />
                </div>

                <div>
                  <Label htmlFor={`hobby-icon-${index}`}>Icône</Label>
                  <Select
                    value={hobby.icon}
                    onValueChange={(value) => handleUpdateHobby(index, 'icon', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une icône" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteHobby(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={handleAddHobby}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un loisir
        </Button>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
}
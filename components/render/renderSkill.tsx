import { Input } from '@headlessui/react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useResume } from '@/context/resume-context';

export const RenderSkillsEditor = () => {
  const { resume, updateResume } = useResume();

  if (!resume) {
    return null;
  }

  const skills = resume.skills || [];

  // Fonction pour ajouter une compétence
  const addSkill = () => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: '',
      level: '50', // Niveau par défaut à 50%
      category: '',
      order: skills.length,
    };

    updateResume({
      skills: [...skills, newSkill],
    });
  };

  // Fonction pour supprimer une compétence
  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    updateResume({
      skills: updatedSkills,
    });
  };

  // Fonction pour mettre à jour une compétence spécifique
  const updateSkill = (index: number, field: string, value: string) => {
    const updatedSkills = skills.map((skill, i) =>
      i === index ? { ...skill, [field]: value } : skill
    );

    updateResume({
      skills: updatedSkills,
    });
  };

  // Fonction pour mise à jour le niveau d'une compétence
  const updateSkillLevel = (index: number, level: string) => {
    // S'assurer que la valeur est entre 0 et 100
    const numLevel = Math.max(0, Math.min(100, Number.parseInt(level) || 0));
    updateSkill(index, 'level', numLevel.toString());
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header avec actions */}
      <div className="flex items-center justify-between border-b pb-3">
        <h4 className="font-medium">Compétences ({skills.length})</h4>
        <Button size="sm" variant="outline" onClick={addSkill} className="text-xs">
          + Ajouter une compétence
        </Button>
      </div>

      {/* Liste des compétences */}
      <div className="space-y-3">
        {skills.map((skill, index) => {
          const levelValue = Number.parseInt(skill.level || '0');

          return (
            <div key={skill.id} className="border border-muted rounded-lg p-3 space-y-3">
              {/* Header de la compétence */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Compétence {index + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeSkill(index)}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Supprimer
                </Button>
              </div>

              {/* Nom de la compétence */}
              <div>
                <Label className="text-xs mb-1">Nom de la compétence</Label>
                <Input
                  value={skill.name || ''}
                  placeholder="Ex: JavaScript, Photoshop, Gestion de projet..."
                  className="w-full border border-muted shadow-sm rounded px-2 py-1"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSkill(index, 'name', e.target.value)
                  }
                />
              </div>

              {/* Catégorie */}
              <div>
                <Label className="text-xs mb-1">Catégorie</Label>
                <Input
                  value={skill.category || ''}
                  placeholder="Ex: Programmation, Design, Langues..."
                  className="w-full border border-muted shadow-sm rounded px-2 py-1"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSkill(index, 'category', e.target.value)
                  }
                />
              </div>

              {/* Niveau en pourcentage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Niveau de maîtrise</Label>
                  <span className="text-sm font-medium text-blue-600">{levelValue}%</span>
                </div>

                {/* Slider pour le niveau */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={levelValue}
                    onChange={e => updateSkillLevel(index, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${levelValue}%, #e5e7eb ${levelValue}%, #e5e7eb 100%)`,
                    }}
                  />

                  {/* Input numérique pour saisie précise */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={levelValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateSkillLevel(index, e.target.value)
                      }
                      className="w-20 text-center border border-muted shadow-sm rounded px-2 py-1"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>

                {/* Barre de progression visuelle */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${levelValue}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Débutant</span>
                    <span>Intermédiaire</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucune compétence */}
      {skills.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">Aucune compétence ajoutée</p>
          <Button onClick={addSkill} variant="outline">
            Ajouter votre première compétence
          </Button>
        </div>
      )}

      {/* Conseils */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-1">
          💡 Conseils pour évaluer vos compétences
        </h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>
            • <strong>0-25%</strong> : Notions de base, apprentissage en cours
          </li>
          <li>
            • <strong>26-50%</strong> : Compétences intermédiaires, utilisation régulière
          </li>
          <li>
            • <strong>51-75%</strong> : Bon niveau, capable de résoudre des problèmes complexes
          </li>
          <li>
            • <strong>76-100%</strong> : Expert, capable de former et guider d'autres personnes
          </li>
        </ul>
      </div>
    </div>
  );
};

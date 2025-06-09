import { Input } from '@headlessui/react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useResume } from '@/context/resume-context';

export const RenderLanguagesEditor = () => {
  const { resume, updateResume } = useResume();

  if (!resume) {
    return null;
  }
  const languages = resume.languages || [];

  // Fonction pour ajouter une langue
  const addLanguage = () => {
    const newLanguage = {
      id: `language-${Date.now()}`,
      name: '',
      level: 'Intermédiaire',
      order: languages.length,
    };

    updateResume({
      languages: [...languages, newLanguage],
    });
  };

  // Fonction pour supprimer une langue
  const removeLanguage = (index: number) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    updateResume({
      languages: updatedLanguages,
    });
  };

  // Fonction pour mettre à jour une langue spécifique
  const updateLanguage = (index: number, field: string, value: string) => {
    const updatedLanguages = languages.map((language, i) =>
      i === index ? { ...language, [field]: value } : language
    );

    updateResume({
      languages: updatedLanguages,
    });
  };

  // Fonction pour obtenir le nombre de points selon le niveau
  const getLevelDots = (level: string) => {
    const levelMap = {
      Débutant: 1,
      Élémentaire: 2,
      Intermédiaire: 3,
      Avancé: 4,
      Courant: 5,
      Natif: 6,
    };
    return levelMap[level as keyof typeof levelMap] || 3;
  };

  // Niveaux de langue disponibles
  const languageLevels = ['Débutant', 'Élémentaire', 'Intermédiaire', 'Avancé', 'Courant', 'Natif'];

  return (
    <div className="flex flex-col gap-4 text">
      {/* Header avec actions */}
      <div className="flex items-center justify-between border-b pb-3">
        <h4 className="font-medium">Langues ({languages.length})</h4>
        <Button size="sm" variant="outline" onClick={addLanguage} className="text-xs">
          + Ajouter une langue
        </Button>
      </div>

      {/* Liste des langues */}
      <div className="space-y-3">
        {languages.map((language, index) => {
          const dotsCount = getLevelDots(language.level);

          return (
            <div key={language.id} className="border border-muted rounded-lg p-3 space-y-3">
              {/* Header de la langue */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Langue {index + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLanguage(index)}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Supprimer
                </Button>
              </div>

              {/* Nom de la langue */}
              <div>
                <Label className="text-xs mb-1">Langue</Label>
                <Input
                  value={language.name || ''}
                  placeholder="Ex: Français, Anglais, Espagnol..."
                  className="w-full border border-muted shadow-sm rounded px-2 py-1"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateLanguage(index, 'name', e.target.value)
                  }
                />
              </div>

              {/* Niveau de la langue */}
              <div>
                <Label className="text-xs mb-1">Niveau de maîtrise</Label>
                <select
                  value={language.level || 'Intermédiaire'}
                  onChange={e => updateLanguage(index, 'level', e.target.value)}
                  className="w-full border border-muted rounded px-2 py-1"
                >
                  {languageLevels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Indicateur visuel du niveau avec des points */}
              <div className="flex items-center justify-between p-2 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{language.name || 'Langue'}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6].map(dot => (
                    <div
                      key={dot}
                      className={`w-2 h-2 rounded-full ${
                        dot <= dotsCount ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Description du niveau */}
              <div className="text-xs text-muted-foreground p-2 rounded">
                {language.level === 'Débutant' && 'Notions de base, vocabulaire limité'}
                {language.level === 'Élémentaire' &&
                  'Peut comprendre et utiliser des expressions familières'}
                {language.level === 'Intermédiaire' &&
                  'Peut communiquer dans la plupart des situations'}
                {language.level === 'Avancé' && "Maîtrise solide, peut s'exprimer spontanément"}
                {language.level === 'Courant' && 'Très bonne maîtrise, proche du niveau natif'}
                {language.level === 'Natif' && 'Langue maternelle ou niveau équivalent'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucune langue */}
      {languages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm mb-4">Aucune langue ajoutée</p>
          <Button onClick={addLanguage} variant="outline">
            Ajouter votre première langue
          </Button>
        </div>
      )}

      {/* Langues suggérées */}
      <div className="mt-4 p-3 rounded-lg">
        <h5 className="text-sm font-medium text-green-900 mb-2">🌍 Langues populaires</h5>
        <div className="flex flex-wrap gap-2">
          {[
            'Français',
            'Anglais',
            'Espagnol',
            'Allemand',
            'Italien',
            'Portugais',
            'Chinois',
            'Japonais',
            'Arabe',
          ].map(lang => (
            <Button
              key={lang}
              size="sm"
              variant="outline"
              className="text-xs h-6 px-2"
              onClick={() => {
                const newLanguage = {
                  id: `language-${Date.now()}`,
                  name: lang,
                  level: 'Intermédiaire',
                  order: languages.length,
                };
                updateResume({
                  languages: [...languages, newLanguage],
                });
              }}
            >
              + {lang}
            </Button>
          ))}
        </div>
      </div>

      {/* Conseils */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-1">
          💡 Conseils pour évaluer votre niveau
        </h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>
            • Basez-vous sur le <strong>Cadre Européen (CECR)</strong> : A1-A2 (Débutant), B1-B2
            (Intermédiaire), C1-C2 (Avancé)
          </li>
          <li>
            • Mentionnez vos <strong>certifications</strong> (TOEFL, DELE, DELF, etc.) dans la
            description
          </li>
          <li>• Soyez honnête sur votre niveau réel de communication</li>
          <li>• Priorisez les langues pertinentes pour votre secteur d'activité</li>
        </ul>
      </div>
    </div>
  );
};

'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Award, Calendar, ExternalLink, Menu, Strikethrough, UnderlineIcon, X } from 'lucide-react';

import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input, Textarea } from '@headlessui/react';
import { useResume } from '@/context/resume-context';
import Image from 'next/image';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState, useEffect } from 'react';

interface EditorPropertiesPanelProps {
  selectedSection: string | null;
  onClose: () => void;
}

export function EditorPropertiesPanel({ selectedSection, onClose }: EditorPropertiesPanelProps) {
  const { resume, updateResume } = useResume();

  // Déplacer TOUS les hooks au niveau supérieur du composant
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(0);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: resume?.personalInfo?.description || '<p>Commencez à parlez de vous...</p>',
    editorProps: {
      attributes: {
        class:
          'w-full min-h-[300px]  placeholder:text-gray-500 focus:outline-none text-base leading-relaxed p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      updateResume({
        personalInfo: {
          ...resume?.personalInfo,
          description: content,
          email: resume?.personalInfo?.email || '',
        },
      });
    },
  });

  // Synchroniser le contenu de l'éditeur avec les données du CV
  useEffect(() => {
    if (editor && resume?.personalInfo?.description) {
      const currentContent = editor.getText();
      if (currentContent !== resume.personalInfo.description) {
        editor.commands.setContent(resume.personalInfo.description);
      }
    }
  }, [editor, resume?.personalInfo?.description]);

  if (!editor) {
    return null;
  }

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };
  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  const toggleStrike = () => {
    editor.chain().focus().toggleStrike().run();
  };

  const toggleUnderline = () => {
    editor.chain().focus().toggleUnderline().run();
  };

  const toggleHeading = (level: any) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const isActive = (type: string, option = {}) => {
    return editor.isActive(type, option);
  };

  if (!selectedSection || !resume) {
    return (
      <div className="w-80 border-l border-gray-200 p-6">
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

  /**
   * @description
   * Renders the editor for the personal information section of the resume.
   * @returns A JSX element containing the editor.
   */
  const renderPersonalInfoEditor = () => (
    <div className="space-y-4 flex flex-col items-center justify-center h-full w-full">
      <div className="flex items-center gap-2 ">
        <Avatar className="w-20 h-20">
          <AvatarImage src={resume.personalInfo?.photoUrl || ''} className="object-cover" />
          <AvatarFallback>{resume.personalInfo?.firstName?.charAt(0) || ''}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <Label htmlFor="Photo Url">Photo</Label>
          <Input
            id="PhotoUrl"
            value={resume.personalInfo?.photoUrl || ''}
            className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                personalInfo: {
                  ...resume.personalInfo,
                  photoUrl: e.target.value,
                  email: resume.personalInfo?.email || '',
                },
              })
            }
          />
        </div>
      </div>

      <div className=" flex items-center gap-2 my-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={resume.personalInfo?.firstName || ''}
            className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                personalInfo: {
                  ...resume.personalInfo,
                  firstName: e.target.value,
                  email: resume.personalInfo?.email || '',
                },
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={resume.personalInfo?.lastName || ''}
            className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                personalInfo: {
                  ...resume.personalInfo,
                  lastName: e.target.value,
                  email: resume.personalInfo?.email || '',
                },
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-2 my-2">
        <div className="flex flex-col gap-2">
          <Label>Titre</Label>
          <Input
            value={resume.personalInfo?.title || ''}
            className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                personalInfo: {
                  ...resume.personalInfo,
                  title: e.target.value,
                  email: resume.personalInfo?.email || '',
                },
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            value={resume.personalInfo?.email || ''}
            className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                personalInfo: {
                  ...resume.personalInfo,
                  email: e.target.value || '',
                },
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-2 my-2">
        <div className="flex flex-col gap-2">
          <Label>Phone</Label>
          <Input
            value={resume.personalInfo?.phone || ''}
            className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                personalInfo: {
                  ...resume.personalInfo,
                  phone: e.target.value,
                  email: resume.personalInfo?.email || '',
                },
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Emplacement</Label>
          <Input
            value={resume.personalInfo?.location || ''}
            className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                personalInfo: {
                  ...resume.personalInfo,
                  location: e.target.value,
                  email: resume.personalInfo?.email || '',
                },
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-2 my-2">
        <Label>Website</Label>
        <Input
          id="website"
          value={resume.personalInfo?.website || ''}
          className="w-full border border-muted shadow-sm rounded px-2 py-1 rounded-lg"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateResume({
              personalInfo: {
                ...resume.personalInfo,
                website: e.target.value,
                email: resume.personalInfo?.email || '',
              },
            })
          }
        />
      </div>

      {/* Summary or Description section */}
      <div className="w-full max-4xl mx-auto">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Summary</h1>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="border-b border-gray-700 p-3 space-y-2">
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                isActive('bold') ? 'bg-gray-900 text-white' : 'text-muted-foreground'
              }`}
              title="Bold"
              onClick={toggleBold}
            >
              <span className="text-xs font-bold">B</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                isActive('italic') ? 'bg-gray-900 text-white' : 'text-muted-foreground'
              }`}
              title="Italic"
              onClick={toggleItalic}
            >
              <span className="text-xs font-bold">I</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                isActive('strike') ? 'bg-gray-900 text-white' : 'text-muted-foreground'
              }`}
              onClick={toggleStrike}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                isActive('underline') ? 'bg-gray-900 text-white' : 'text-muted-foreground'
              }`}
              onClick={toggleUnderline}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 border border-accent">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );

  /**
   * Render the experience editor component
   * @param resume the resume to edit
   * @param selectedExperienceIndex the index of the selected experience
   * @param setSelectedExperienceIndex the function to update the selected experience index
   * @returns the experience editor component
   */
  const renderExperienceEditor = () => {
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

  /**
   * Rendu du panneau d'édition des formations
   *
   * Fonctionne de la même manière que renderExperienceEditor, mais pour les
   * formations.
   *
   * @returns Un JSX Element
   */
  const renderEducationEditor = () => {
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

  const renderSkillsEditor = () => {
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

  const renderLanguagesEditor = () => {
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
    const languageLevels = [
      'Débutant',
      'Élémentaire',
      'Intermédiaire',
      'Avancé',
      'Courant',
      'Natif',
    ];

    return (
      <div className="flex flex-col gap-4">
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
                    className="w-full border border-muted rounded px-2 py-1 bg-white"
                  >
                    {languageLevels.map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Indicateur visuel du niveau avec des points */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
                <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
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
            <p className="text-sm text-gray-500 mb-4">Aucune langue ajoutée</p>
            <Button onClick={addLanguage} variant="outline">
              Ajouter votre première langue
            </Button>
          </div>
        )}

        {/* Langues suggérées */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
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

  const renderCertificationsEditor = () => {
    const certifications = resume.certfications || []; // Note: suivre la faute de frappe de l'interface

    // Fonction pour ajouter une certification
    const addCertification = () => {
      const newCertification = {
        id: `certification-${Date.now()}`,
        name: '',
        issuer: '',
        issueDate: new Date(),
        expiryDate: new Date(),
        credentialId: '',
        credentialUrl: '',
        order: certifications.length,
      };

      updateResume({
        certfications: [...certifications, newCertification],
      });
    };

    // Fonction pour supprimer une certification
    const removeCertification = (index: number) => {
      const updatedCertifications = certifications.filter((_, i) => i !== index);
      updateResume({
        certfications: updatedCertifications,
      });
    };

    // Fonction pour mettre à jour une certification spécifique
    const updateCertification = (index: number, field: string, value: string | Date) => {
      const updatedCertifications = certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert
      );

      updateResume({
        certfications: updatedCertifications,
      });
    };

    // Fonction pour formater une date en string pour l'input
    const formatDateForInput = (date: Date) => {
      if (!date) return '';
      return new Date(date).toISOString().split('T')[0];
    };

    // Fonction pour vérifier si une certification est expirée
    const isExpired = (expiryDate: Date) => {
      return new Date(expiryDate) < new Date();
    };

    return (
      <div className="flex flex-col gap-4">
        {/* Header avec actions */}
        <div className="flex items-center justify-between border-b pb-3">
          <h4 className="font-medium">Certifications ({certifications.length})</h4>
          <Button size="sm" variant="outline" onClick={addCertification} className="text-xs">
            + Ajouter une certification
          </Button>
        </div>

        {/* Liste des certifications */}
        <div className="space-y-4">
          {certifications.map((certification, index) => {
            const expired = isExpired(certification.expiryDate);

            return (
              <div key={certification.id} className="border border-muted rounded-lg p-4 space-y-3">
                {/* Header de la certification */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Certification {index + 1}
                    </span>
                    {expired && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Expirée
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCertification(index)}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Supprimer
                  </Button>
                </div>

                {/* Nom de la certification */}
                <div>
                  <Label className="text-xs mb-1">Nom de la certification</Label>
                  <Input
                    value={certification.name || ''}
                    placeholder="Ex: AWS Certified Solutions Architect, PMP, Google Analytics..."
                    className="w-full border border-muted shadow-sm rounded px-2 py-1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCertification(index, 'name', e.target.value)
                    }
                  />
                </div>

                {/* Organisme émetteur */}
                <div>
                  <Label className="text-xs mb-1">Organisme émetteur</Label>
                  <Input
                    value={certification.issuer || ''}
                    placeholder="Ex: Amazon Web Services, PMI, Google..."
                    className="w-full border border-muted shadow-sm rounded px-2 py-1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCertification(index, 'issuer', e.target.value)
                    }
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Date d'obtention
                    </Label>
                    <Input
                      type="date"
                      value={formatDateForInput(certification.issueDate)}
                      className="w-full border border-muted shadow-sm rounded px-2 py-1"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateCertification(index, 'issueDate', new Date(e.target.value))
                      }
                    />
                  </div>

                  {/* <div>
                  <Label className="text-xs mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Date d'expiration
                  </Label>
                  <Input
                    type="date"
                    value={formatDateForInput(certification.expiryDate)}
                    className={`w-full border shadow-sm rounded px-2 py-1 ${
                      expired ? "border-red-300 bg-red-50" : "border-muted"
                    }`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCertification(index, "expiryDate", new Date(e.target.value))
                    }
                  />
                </div> */}
                </div>

                {/* ID de certification */}
                <div>
                  <Label className="text-xs mb-1">ID de certification (optionnel)</Label>
                  <Input
                    value={certification.credentialId || ''}
                    placeholder="Ex: AWS-ASA-12345, PMI-67890..."
                    className="w-full border border-muted shadow-sm rounded px-2 py-1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCertification(index, 'credentialId', e.target.value)
                    }
                  />
                </div>

                {/* URL de vérification */}
                <div>
                  <Label className="text-xs mb-1 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    URL de vérification (optionnel)
                  </Label>
                  <Input
                    type="url"
                    value={certification.credentialUrl || ''}
                    placeholder="https://www.credly.com/badges/..."
                    className="w-full border border-muted shadow-sm rounded px-2 py-1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCertification(index, 'credentialUrl', e.target.value)
                    }
                  />
                  {certification.credentialUrl && (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Vérifier la certification
                    </a>
                  )}
                </div>

                {/* Aperçu de la certification */}
                {certification.name && certification.issuer && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h6 className="font-medium text-blue-900">{certification.name}</h6>
                        <p className="text-sm text-blue-700">{certification.issuer}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Obtenue le {new Date(certification.issueDate).toLocaleDateString('fr-FR')}
                          {/* {certification.expiryDate && (
                          <>
                            {" • "}
                            {expired ? "Expirée" : "Expire"} le{" "}
                            {new Date(certification.expiryDate).toLocaleDateString("fr-FR")}
                          </>
                        )} */}
                        </p>
                      </div>
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Message si aucune certification */}
        {certifications.length === 0 && (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-4">Aucune certification ajoutée</p>
            <Button onClick={addCertification} variant="outline">
              Ajouter votre première certification
            </Button>
          </div>
        )}

        {/* Certifications populaires */}
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <h5 className="text-sm font-medium text-purple-900 mb-2">🏆 Certifications populaires</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services' },
              { name: 'PMP', issuer: 'Project Management Institute' },
              { name: 'Google Analytics', issuer: 'Google' },
              { name: 'Scrum Master', issuer: 'Scrum Alliance' },
              { name: 'Microsoft Azure', issuer: 'Microsoft' },
              { name: 'Salesforce Admin', issuer: 'Salesforce' },
            ].map(cert => (
              <Button
                key={cert.name}
                size="sm"
                variant="outline"
                className="text-xs h-auto p-2 text-left justify-start"
                onClick={() => {
                  const newCertification = {
                    id: `certification-${Date.now()}`,
                    name: cert.name,
                    issuer: cert.issuer,
                    issueDate: new Date(),
                    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
                    credentialId: '',
                    credentialUrl: '',
                    order: certifications.length,
                  };
                  updateResume({
                    certfications: [...certifications, newCertification],
                  });
                }}
              >
                <div>
                  <div className="font-medium">{cert.name}</div>
                  <div className="text-muted-foreground">{cert.issuer}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Conseils */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h5 className="text-sm font-medium text-blue-900 mb-1">
            💡 Conseils pour vos certifications
          </h5>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Ajoutez l'URL de vérification pour prouver l'authenticité</li>
            <li>• Mentionnez l'ID de certification si disponible</li>
            <li>• Surveillez les dates d'expiration et renouvelez à temps</li>
            <li>• Priorisez les certifications pertinentes pour votre secteur</li>
            <li>• Utilisez des plateformes comme Credly ou Badgr pour la vérification</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderThemeEditor = () => (
    <div className="space-y-4">
      <div>
        <Label>Couleur principale</Label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="color"
            value={resume.theme?.primary || '#3b82f6'}
            className="w-8 h-8 rounded border"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                theme: { ...resume.theme!, primary: e.target.value },
              })
            }
          />
          <Input
            value={resume.theme?.primary || '#3b82f6'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                theme: { ...resume.theme!, primary: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div>
        <Label>Couleur secondaire</Label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="color"
            value={resume.theme?.secondary || '#64748b'}
            className="w-8 h-8 rounded border"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                theme: { ...resume.theme!, secondary: e.target.value },
              })
            }
          />
          <Input
            value={resume.theme?.secondary || '#64748b'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                theme: { ...resume.theme!, secondary: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div>
        <Label>Couleur d'accent</Label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="color"
            value={resume.theme?.accent || '#06b6d4'}
            className="w-8 h-8 rounded border"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                theme: { ...resume.theme!, accent: e.target.value },
              })
            }
          />
          <Input
            value={resume.theme?.accent || '#06b6d4'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                theme: { ...resume.theme!, accent: e.target.value },
              })
            }
          />
        </div>
      </div>
    </div>
  );

  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      personal: 'Informations personnelles',
      experience: 'Expériences',
      education: 'Formation',
      skills: 'Compétences',
      languages: 'Langues',
      projects: 'Projets',
      achievements: 'Réalisations',
      theme: 'Thème',
      template: 'Template',
      font: 'Police',
    };
    return titles[selectedSection] || 'Propriétés';
  };

  const renderSectionEditor = () => {
    switch (selectedSection) {
      case 'personal':
        return renderPersonalInfoEditor();
      case 'experience':
        return renderExperienceEditor();
      case 'education':
        return renderEducationEditor();
      case 'skills':
        return renderSkillsEditor();
      case 'languages':
        return renderLanguagesEditor();
      case 'certifications':
        return renderCertificationsEditor();
      case 'theme':
        return renderThemeEditor();
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
    <div className="w-80 border-l border-gray-200 flex flex-col">
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

import { useResume } from '@/context/resume-context';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Label } from '../ui/label';
import { Input } from '@headlessui/react';
import { Button } from '../ui/button';
import { Menu, Strikethrough, UnderlineIcon } from 'lucide-react';

export const RenderPersonalInfoEditor = () => {
  const { resume, updateResume } = useResume();

  // Vérification précoce si resume est null
  if (!resume) {
    return <div>Chargement...</div>;
  }

  // Déplacer TOUS les hooks au niveau supérieur du composant
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedEducationIndex, setSelectedEducationIndex] = useState(0);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: resume.personalInfo?.description || '<p>Commencez à parlez de vous...</p>',
    editorProps: {
      attributes: {
        class:
          'w-full min-h-[300px] placeholder:text-gray-500 focus:outline-none text-base leading-relaxed p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      updateResume({
        personalInfo: {
          ...resume.personalInfo,
          description: content,
          email: resume.personalInfo?.email || '',
        },
      });
    },
  });

  // Synchroniser le contenu de l'éditeur avec les données du CV
  useEffect(() => {
    if (editor && resume.personalInfo?.description) {
      const currentContent = editor.getText();
      if (currentContent !== resume.personalInfo.description) {
        editor.commands.setContent(resume.personalInfo.description);
      }
    }
  }, [editor, resume.personalInfo?.description]);

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

  return (
    <div className="space-y-4 flex flex-col items-center justify-center h-full w-full">
      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2 my-2">
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
};

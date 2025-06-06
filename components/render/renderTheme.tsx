import { Input } from '@headlessui/react';
import { Label } from '../ui/label';
import { useResume } from '@/context/resume-context';

export const RenderThemeEditor = () => {
  const { resume, updateResume } = useResume();
  if (!resume) return null;

  return (
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
};

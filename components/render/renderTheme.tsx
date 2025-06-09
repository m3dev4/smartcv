
import { Label } from '@/components/ui/label';
import { useResume } from '@/context/resume-context';
import { Input } from '@headlessui/react';

export const RenderThemeEditor = () => {
  const { resume, updateResume } = useResume();
  if (!resume) return null;

  return (
    <div className="space-y-6 p-1">
      <div className="space-y-1.5">
        <Label htmlFor="primaryColorInput">Couleur principale</Label>
        <div className="flex items-center space-x-3">
          <input
            id="primaryColorPicker"
            type="color"
            value={resume.theme?.primary || '#3b82f6'}
            className="p-0 w-10 h-10 rounded-md border cursor-pointer focus:ring-2 focus:ring-ring focus:outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                theme: { ...resume.theme!, primary: e.target.value },
              })
            }
          />
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">#</span>
            <Input
              id="primaryColorInput"
              value={(resume.theme?.primary || '#3b82f6').replace('#', '')}
              className="pl-7 pr-2 py-2 h-10 text-sm"
              maxLength={6}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                if (value.length > 6) value = value.substring(0, 6);
                updateResume({
                  theme: { ...resume.theme!, primary: `#${value}` },
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="secondaryColorInput">Couleur secondaire</Label>
        <div className="flex items-center space-x-3">
          <input
            id="secondaryColorPicker"
            type="color"
            value={resume.theme?.secondary || '#64748b'}
            className="p-0 w-10 h-10 rounded-md border cursor-pointer focus:ring-2 focus:ring-ring focus:outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                theme: { ...resume.theme!, secondary: e.target.value },
              })
            }
          />
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">#</span>
            <Input
              id="secondaryColorInput"
              value={(resume.theme?.secondary || '#64748b').replace('#', '')}
              className="pl-7 pr-2 py-2 h-10 text-sm"
              maxLength={6}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                if (value.length > 6) value = value.substring(0, 6);
                updateResume({
                  theme: { ...resume.theme!, secondary: `#${value}` },
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="accentColorInput">Couleur d'accent</Label>
        <div className="flex items-center space-x-3">
          <input
            id="accentColorPicker"
            type="color"
            value={resume.theme?.accent || '#06b6d4'}
            className="p-0 w-10 h-10 rounded-md border cursor-pointer focus:ring-2 focus:ring-ring focus:outline-none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateResume({
                theme: { ...resume.theme!, accent: e.target.value },
              })
            }
          />
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">#</span>
            <Input
              id="accentColorInput"
              value={(resume.theme?.accent || '#06b6d4').replace('#', '')}
              className="pl-7 pr-2 py-2 h-10 text-sm"
              maxLength={6}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                if (value.length > 6) value = value.substring(0, 6);
                updateResume({
                  theme: { ...resume.theme!, accent: `#${value}` },
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

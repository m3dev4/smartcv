'use client';

import { useResume } from '@/context/resume-context';
import { useState } from 'react';
import { Check, Palette, Sparkles, Copy, RefreshCw, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Palettes de couleurs prédéfinies
const colorPalettes = [
  {
    name: 'Bleu Professionnel',
    primary: '#1a56db',
    secondary: '#64748b',
    accent: '#06b6d4',
    text: '#1a1a1a',
  },
  {
    name: 'Vert Nature',
    primary: '#16a34a',
    secondary: '#334155',
    accent: '#84cc16',
    text: '#1a1a1a',
  },
  {
    name: 'Violet Créatif',
    primary: '#7c3aed',
    secondary: '#475569',
    accent: '#ec4899',
    text: '#1a1a1a',
  },
  {
    name: 'Rouge Dynamique',
    primary: '#dc2626',
    secondary: '#1e293b',
    accent: '#f59e0b',
    text: '#1a1a1a',
  },
  {
    name: 'Minimaliste',
    primary: '#18181b',
    secondary: '#71717a',
    accent: '#0ea5e9',
    text: '#1a1a1a',
  },
  {
    name: 'Mode Sombre',
    primary: '#3b82f6',
    secondary: '#475569',
    accent: '#06b6d4',
    text: '#f8fafc',
  },
];

export const RenderThemeEditor = () => {
  const { resume, updateResume } = useResume();
  const [activeTab, setActiveTab] = useState('couleurs');
  const [copied, setCopied] = useState<string | null>(null);
  const [previewHover, setPreviewHover] = useState<string | null>(null);

  // Valeurs par défaut avec vérifications de type
  const theme = {
    primary: resume?.theme?.primary || '#3b82f6',
    secondary: resume?.theme?.secondary || '#64748b',
    accent: resume?.theme?.accent || '#06b6d4',
    text: resume?.theme?.text || '#1a1a1a',
    id: resume?.theme?.id || '',
    name: resume?.theme?.name || '',
  };

  if (!resume) return null;

  // Fonction pour mettre à jour une couleur
  const updateColor = (colorType: 'primary' | 'secondary' | 'accent' | 'text', value: string) => {
    updateResume({
      ...resume,
      theme: {
        ...theme,
        [colorType]: value,
      },
    });
  };

  // Fonction pour appliquer une palette complète
  const applyPalette = (palette: (typeof colorPalettes)[0]) => {
    updateResume({
      ...resume,
      theme: {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        text: palette.text,
        id: theme.id,
        name: theme.name,
      },
    });
  };

  // Fonction pour générer une palette aléatoire harmonieuse
  const generateRandomPalette = () => {
    // Génère une couleur primaire aléatoire
    const hue = Math.floor(Math.random() * 360);
    const primary = hslToHex(hue, 65, 45);

    // Couleur secondaire (complémentaire ajustée)
    const secondaryHue = (hue + 210) % 360;
    const secondary = hslToHex(secondaryHue, 30, 35);

    // Couleur d'accent (triadique ajustée)
    const accentHue = (hue + 120) % 360;
    const accent = hslToHex(accentHue, 70, 55);

    // Couleur de texte (noir ou blanc selon la luminosité du fond)
    const isDark = getLuminance(primary) < 0.5;
    const text = isDark ? '#f8fafc' : '#1a1a1a';

    updateResume({
      ...resume,
      theme: {
        primary,
        secondary,
        accent,
        text,
        id: theme.id,
        name: theme.name,
      },
    });
  };

  // Calculer la luminance d'une couleur
  const getLuminance = (hexColor: string) => {
    // Convertir hex en RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = Number.parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = Number.parseInt(hexColor.slice(5, 7), 16) / 255;

    // Calculer la luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Convertir HSL en HEX
  function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  // Fonction pour copier une couleur
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 2000);
  };

  // Fonction pour obtenir une couleur de texte contrastante
  const getContrastColor = (hexColor: string) => {
    // Convertir hex en RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16);
    const g = Number.parseInt(hexColor.slice(3, 5), 16);
    const b = Number.parseInt(hexColor.slice(5, 7), 16);

    // Calculer la luminosité
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Retourner blanc ou noir selon la luminosité
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* En-tête avec gradient */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#ffffff10,#ffffff90)]" />
        <div className="relative flex items-center space-x-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Thème</h2>
            <p className="text-white/80 text-sm">Personnalisez les couleurs de votre CV</p>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="couleurs"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="px-4 border-b">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="couleurs" className="rounded-none">
              <Palette className="w-4 h-4 mr-2" />
              Couleurs
            </TabsTrigger>
            <TabsTrigger value="palettes" className="rounded-none">
              <Sparkles className="w-4 h-4 mr-2" />
              Palettes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="couleurs" className="p-6 space-y-6">
          {/* Couleur principale */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="primaryColorInput" className="text-sm font-medium">
                Couleur principale
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(theme.primary)}
                    >
                      {copied === theme.primary ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copier la couleur</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-14 h-14 rounded-xl shadow-inner border border-gray-200 cursor-pointer relative overflow-hidden group"
                style={{ backgroundColor: theme.primary }}
                onClick={() => document.getElementById('primaryColorPicker')?.click()}
              >
                <input
                  id="primaryColorPicker"
                  type="color"
                  value={theme.primary}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  onChange={e => updateColor('primary', e.target.value)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              </div>
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  #
                </div>
                <Input
                  id="primaryColorInput"
                  value={theme.primary.replace('#', '')}
                  className="pl-7 font-mono"
                  maxLength={6}
                  onChange={e => {
                    let value = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                    if (value.length > 6) value = value.substring(0, 6);
                    updateColor('primary', `#${value}`);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Couleur secondaire */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="secondaryColorInput" className="text-sm font-medium">
                Couleur secondaire
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(theme.secondary)}
                    >
                      {copied === theme.secondary ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copier la couleur</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-14 h-14 rounded-xl shadow-inner border border-gray-200 cursor-pointer relative overflow-hidden group"
                style={{ backgroundColor: theme.secondary }}
                onClick={() => document.getElementById('secondaryColorPicker')?.click()}
              >
                <input
                  id="secondaryColorPicker"
                  type="color"
                  value={theme.secondary}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  onChange={e => updateColor('secondary', e.target.value)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              </div>
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  #
                </div>
                <Input
                  id="secondaryColorInput"
                  value={theme.secondary.replace('#', '')}
                  className="pl-7 font-mono"
                  maxLength={6}
                  onChange={e => {
                    let value = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                    if (value.length > 6) value = value.substring(0, 6);
                    updateColor('secondary', `#${value}`);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Couleur d'accent */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="accentColorInput" className="text-sm font-medium">
                Couleur d'accent
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(theme.accent)}
                    >
                      {copied === theme.accent ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copier la couleur</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-14 h-14 rounded-xl shadow-inner border border-gray-200 cursor-pointer relative overflow-hidden group"
                style={{ backgroundColor: theme.accent }}
                onClick={() => document.getElementById('accentColorPicker')?.click()}
              >
                <input
                  id="accentColorPicker"
                  type="color"
                  value={theme.accent}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  onChange={e => updateColor('accent', e.target.value)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              </div>
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  #
                </div>
                <Input
                  id="accentColorInput"
                  value={theme.accent.replace('#', '')}
                  className="pl-7 font-mono"
                  maxLength={6}
                  onChange={e => {
                    let value = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                    if (value.length > 6) value = value.substring(0, 6);
                    updateColor('accent', `#${value}`);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Couleur du texte */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="textColorInput" className="text-sm font-medium">
                Couleur du texte
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(theme.text)}
                    >
                      {copied === theme.text ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copier la couleur</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-14 h-14 rounded-xl shadow-inner border border-gray-200 cursor-pointer relative overflow-hidden group"
                style={{ backgroundColor: theme.text }}
                onClick={() => document.getElementById('textColorPicker')?.click()}
              >
                <input
                  id="textColorPicker"
                  type="color"
                  value={theme.text}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  onChange={e => updateColor('text', e.target.value)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                <Type
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6"
                  style={{ color: getContrastColor(theme.text) }}
                />
              </div>
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  #
                </div>
                <Input
                  id="textColorInput"
                  value={theme.text.replace('#', '')}
                  className="pl-7 font-mono"
                  maxLength={6}
                  onChange={e => {
                    let value = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                    if (value.length > 6) value = value.substring(0, 6);
                    updateColor('text', `#${value}`);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bouton pour générer une palette aléatoire */}
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={generateRandomPalette}
            >
              <RefreshCw className="h-4 w-4" />
              Générer des couleurs aléatoires
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="palettes" className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {colorPalettes.map((palette, index) => (
              <Card
                key={index}
                className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex h-16">
                  <div className="w-1/3 h-full" style={{ backgroundColor: palette.primary }}></div>
                  <div
                    className="w-1/3 h-full"
                    style={{ backgroundColor: palette.secondary }}
                  ></div>
                  <div className="w-1/3 h-full" style={{ backgroundColor: palette.accent }}></div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{palette.name}</h3>
                      <div className="flex items-center mt-1">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: palette.text }}
                        ></div>
                        <span className="text-xs text-gray-500">Texte: {palette.text}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyPalette(palette)}
                      className="text-xs h-8"
                    >
                      Appliquer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Aperçu */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Aperçu</h3>
        <div
          className="bg-white rounded-lg border border-gray-200 p-4 space-y-4"
          style={{ color: theme.text }}
        >
          {/* En-tête */}
          <div
            className="rounded-md p-3 flex items-center justify-between"
            style={{
              backgroundColor: theme.primary,
              color: getContrastColor(theme.primary),
            }}
            onMouseEnter={() => setPreviewHover('primary')}
            onMouseLeave={() => setPreviewHover(null)}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                JD
              </div>
              <div>
                <div className="font-bold">John Doe</div>
                <div className="text-xs opacity-80">Développeur Full Stack</div>
              </div>
            </div>
            {previewHover === 'primary' && (
              <div className="text-xs bg-black/20 px-2 py-1 rounded">Couleur principale</div>
            )}
          </div>

          {/* Contenu */}
          <div className="flex gap-3">
            <div
              className="w-1/3 rounded-md p-3"
              style={{
                backgroundColor: theme.secondary,
                color: getContrastColor(theme.secondary),
              }}
              onMouseEnter={() => setPreviewHover('secondary')}
              onMouseLeave={() => setPreviewHover(null)}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">Compétences</div>
                {previewHover === 'secondary' && (
                  <div className="text-xs bg-black/20 px-2 py-1 rounded">Couleur secondaire</div>
                )}
              </div>
              <div className="text-xs mt-2 opacity-80">React, Next.js, TypeScript</div>
            </div>
            <div className="w-2/3 space-y-3">
              <div
                className="text-sm font-medium"
                onMouseEnter={() => setPreviewHover('text')}
                onMouseLeave={() => setPreviewHover(null)}
              >
                Expérience
                {previewHover === 'text' && (
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded ml-2">
                    Couleur du texte
                  </span>
                )}
              </div>
              <div
                className="rounded-md p-3 text-xs"
                style={{
                  backgroundColor: theme.accent,
                  color: getContrastColor(theme.accent),
                }}
                onMouseEnter={() => setPreviewHover('accent')}
                onMouseLeave={() => setPreviewHover(null)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">Développeur Frontend</div>
                  {previewHover === 'accent' && (
                    <div className="text-xs bg-black/20 px-2 py-1 rounded">Couleur d'accent</div>
                  )}
                </div>
                <div className="opacity-80 mt-1">
                  Création d'interfaces utilisateur modernes et réactives
                </div>
              </div>
            </div>
          </div>

          {/* Paragraphe de texte pour démontrer la couleur du texte */}
          <div className="border-t border-gray-200 pt-3 mt-3">
            <p className="text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

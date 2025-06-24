'use client';

import { useResume } from '@/context/resume-context';
import { Type, Palette, Settings } from 'lucide-react';
import { useState } from 'react';
import { fontSizes, lineHeights, getTypographyStyles } from '@/utils/fonts/google-fonts';

import { useFonts, type Font as FontType } from '@/utils/fonts/useFonts';

// Interface pour les paramètres de police
export interface FontSettings {
  name?: string;
  subset?: string;
  variants?: string[];
  size?: number;
  lineHeight?: number;
  hideIcons?: boolean;
  underlineLinks?: boolean;
}

export const RenderTypographyEditor = () => {
  const { resume, updateResume } = useResume();
  const [activeTab, setActiveTab] = useState<'fonts' | 'sizes' | 'spacing'>('fonts');
  const [hideIcons, setHideIcons] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);

  // Valeurs par défaut avec id requis
  const { fonts, loading, error } = useFonts();
  const currentFont = resume?.font || { id: 'default-font-id', name: 'Arial' };
  const currentFontId = currentFont.id || 'default-font-id';
  const currentFontName = currentFont.name || 'Arial';

  const handleFontChange = (font: FontType) => {
    if (!resume) return;
    updateResume({
      ...resume,
      font: {
        id: font.id,
        name: font.name,
        category: font.category?.toUpperCase() || 'SANS_SERIF',
        url: font.url || `https://fonts.google.com/specimen/${font.name.replace(/\s+/g, '+')}`,
        size: resume.font?.size || 16,
        lineHeight: resume.font?.lineHeight || 1.5,
      },
    });
  };

  const handleFontSizeChange = (size: number) => {
    if (!resume) return;

    updateResume({
      ...resume,
      font: {
        ...resume.font,
        id: resume.font?.id || 'default-font-id',
        name: resume.font?.name || 'Arial',
        size,
      },
    });
  };

  const handleLineHeightChange = (lineHeight: number) => {
    if (!resume) return;

    updateResume({
      ...resume,
      font: {
        ...resume.font,
        id: resume.font?.id || 'default-font-id',
        name: resume.font?.name || 'Arial',
        lineHeight,
      },
    });
  };

  if (!resume) return null;

  const tabs = [
    { id: 'fonts', label: 'Polices', icon: Type },
    { id: 'sizes', label: 'Tailles', icon: Settings },
    { id: 'spacing', label: 'Espacement', icon: Palette },
  ];

  return (
    <div className="rounded-lg border  overflow-hidden max-w-md mx-auto">
      {/* En-tête simple */}
      <div className="bg-gray-900 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Type className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Typographie</h2>
            <p className="text-gray-300 text-sm">Personnalisez l'apparence de votre CV</p>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b ">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors flex-1 justify-center
                  ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Onglet Polices */}
        {activeTab === 'fonts' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-neutral-300">
              Choisissez la famille de police pour votre CV
            </div>
            {loading ? (
              <div className="text-center py-4 text-gray-500 dark:text-neutral-300">Chargement des polices...</div>
            ) : error ? (
              <div className="text-red-600 text-sm">{error}</div>
            ) : (
              <div className="space-y-2">
                {fonts.map(font => (
                  <button
                    key={font.id}
                    onClick={() => handleFontChange(font)}
                    className={`
                      w-full text-left p-3 rounded-lg border transition-colors
                      ${
                        currentFontId === font.id
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : ' hover:border-gray-300 hover:bg-gray-50 dark:hover:border-neutral-800 dark:hover:bg-neutral-800'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{font.name}</span>
                      {currentFontId === font.id && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                          Sélectionné
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onglet Tailles */}
        {activeTab === 'sizes' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-neutral-300">Taille de police</div>
            <div className="space-y-2">
              {Object.entries(fontSizes).map(([key, size]) => (
                <button
                  key={key}
                  onClick={() => handleFontSizeChange(size.value)}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-colors
                    ${
                      resume.font?.size === size.value
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : ' hover:border-gray-300 hover:bg-gray-50 dark:hover:border-neutral-800 dark:hover:bg-neutral-800'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{size.label}</span>
                    <span className="text-sm text-gray-500">{size.value}px</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Onglet Espacement */}
        {activeTab === 'spacing' && (
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-600 mb-3">Hauteur de ligne</div>
              <div className="space-y-2">
                {Object.entries(lineHeights).map(([key, height]) => (
                  <button
                    key={key}
                    onClick={() => handleLineHeightChange(height.value)}
                    className={`
                      w-full text-left p-3 rounded-lg border transition-colors
                      ${
                        resume.font?.lineHeight === height.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : ' hover:border-gray-300 hover:bg-gray-50 dark:hover:border-neutral-800 dark:hover:bg-neutral-800'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{height.label}</span>
                      <span className="text-sm text-gray-500">{height.value}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options supplémentaires */}
            <div className="space-y-4 pt-4 border-t ">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Masquer les icônes</label>
                <button
                  onClick={() => setHideIcons(!hideIcons)}
                  className={`
                    relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                    ${hideIcons ? 'bg-purple-600' : 'bg-neutral-900'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-3 w-3 transform rounded-full transition-transform
                      ${hideIcons ? 'translate-x-5' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Souligner les liens</label>
                <button
                  onClick={() => setUnderlineLinks(!underlineLinks)}
                  className={`
                    relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                    ${underlineLinks ? 'bg-purple-600' : 'bg-gray-300 dark:bg-neutral-900'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-3 w-3 transform rounded-full transition-transform
                      ${underlineLinks ? 'translate-x-5' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Aperçu */}
      <div className="bg-gray-50 dark:bg-neutral-900 p-4 border-t  dark:border-neutral-800">
        <div className="text-sm text-gray-600 dark:text-neutral-300 mb-3">Aperçu</div>
        <div
          className="p-4 rounded border  dark:border-neutral-800"
          style={getTypographyStyles(currentFontName, resume.font?.size, resume.font?.lineHeight)}
        >
          <h3 className="font-bold text-lg mb-1">Jean Dupont</h3>
          <p className="text-sm mb-3">Chef de projet</p>
          <p className="text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
};

import { fontFamilies } from '@/constants';
import { useResume } from '@/context/resume-context';
import { Type, Palette, Settings } from 'lucide-react';
import React, { useState } from 'react';

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
  
  // Valeurs par défaut avec id requis
  const currentFont = resume?.font || { id: 'default-font-id', name: 'Arial' };
  const currentFontName = currentFont.name || 'Arial';

  const handleFontNameChange = (name: string) => {
    updateResume({
      ...resume,
      font: {
        id: currentFont.id || 'default-font-id', // S'assurer que l'id est toujours présent
        name: name,
        category: currentFont.category,
        url: currentFont.url,
      },
    });
  };

  if (!resume) return null;

  const tabs = [
    { id: 'fonts', label: 'Polices', icon: Type },
    { id: 'sizes', label: 'Tailles', icon: Settings },
    { id: 'spacing', label: 'Espacement', icon: Palette },
  ];

  const fontSizes = [
    { label: 'Très petit', value: 12 },
    { label: 'Petit', value: 14 },
    { label: 'Normal', value: 16 },
    { label: 'Grand', value: 18 },
    { label: 'Très grand', value: 20 },
  ];

  const lineHeights = [
    { label: 'Serré', value: 1.2 },
    { label: 'Normal', value: 1.5 },
    { label: 'Aéré', value: 1.8 },
    { label: 'Très aéré', value: 2.0 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-md mx-auto">
      {/* En-tête avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Typographie</h2>
            <p className="text-blue-100 text-sm">Personnalisez l'apparence de votre CV</p>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-gray-50 px-6 pt-4">
        <div className="flex space-x-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
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
      <div className="p-6">
        {/* Onglet Polices */}
        {activeTab === 'fonts' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Choisissez la famille de police pour votre CV
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fontFamilies.map(font => (
                <button
                  key={font}
                  onClick={() => handleFontNameChange(font)}
                  className={`
                    group relative p-4 rounded-xl text-sm font-medium transition-all duration-200
                    border-2 hover:scale-[1.02] active:scale-[0.98]
                    ${currentFontName === font
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                  style={{ fontFamily: font }}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="font-semibold">{font}</span>
                    <span className="text-xs opacity-70">Exemple</span>
                  </div>
                  
                  {currentFontName === font && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Onglet Tailles */}
        {activeTab === 'sizes' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Taille de police
              </label>
              <div className="grid grid-cols-1 gap-2">
                {fontSizes.map(size => (
                  <button
                    key={size.value}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-150"
                  >
                    <span className="text-gray-700">{size.label}</span>
                    <span className="text-sm text-gray-500">{size.value}px</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Espacement */}
        {activeTab === 'spacing' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hauteur de ligne
              </label>
              <div className="grid grid-cols-1 gap-2">
                {lineHeights.map(height => (
                  <button
                    key={height.value}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-150"
                  >
                    <span className="text-gray-700">{height.label}</span>
                    <span className="text-sm text-gray-500">{height.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Masquer les icônes
                </label>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    id="hide-icons"
                  />
                  <label
                    htmlFor="hide-icons"
                    className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-400"
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 translate-x-0.5 mt-0.5"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Souligner les liens
              </label>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  id="underline-links"
                />
                <label
                  htmlFor="underline-links"
                  className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-400"
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 translate-x-0.5 mt-0.5"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Aperçu */}
      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-3">Aperçu</div>
        <div 
          className="p-4 bg-white rounded-lg border border-gray-200"
          style={{ fontFamily: currentFontName }}
        >
          <h3 className="font-bold text-lg text-gray-800 mb-2">John Doe</h3>
          <p className="text-gray-600 text-sm mb-3">Développeur Full Stack</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
};
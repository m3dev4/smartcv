'use client';

import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SimpleFormatToolbarProps {
  onFormatChange: (format: {
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
  }) => void;
}

const FONT_SIZES = [
  { label: 'Très petit', value: 12 },
  { label: 'Petit', value: 14 },
  { label: 'Normal', value: 16 },
  { label: 'Grand', value: 18 },
];

export const SimpleFormatToolbar = ({ onFormatChange }: SimpleFormatToolbarProps) => {
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [activeTab, setActiveTab] = useState<'fonts' | 'sizes'>('fonts');

  // Surveiller la sélection de texte
  useEffect(() => {
    const handleSelectionChange = () => {
      const newSelection = window.getSelection();
      setSelection(newSelection);

      if (newSelection && newSelection.toString().length > 0) {
        try {
          const range = newSelection.getRangeAt(0);
          const span = document.createElement('span');
          range.surroundContents(span);

          const computedStyle = window.getComputedStyle(span);
          setFontSize(parseInt(computedStyle.fontSize));
          setIsBold(
            computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 600
          );
          setIsItalic(computedStyle.fontStyle === 'italic');
          setIsUnderline(computedStyle.textDecoration.includes('underline'));

          // Restaurer la sélection
          range.extractContents();
          range.insertNode(span.firstChild!);
        } catch (error) {
          // Ignorer les erreurs de sélection
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const handleFormatChange = (changes: {
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
  }) => {
    const newFormat = {
      fontSize: changes.fontSize ?? fontSize,
      isBold: changes.isBold ?? isBold,
      isItalic: changes.isItalic ?? isItalic,
      isUnderline: changes.isUnderline ?? isUnderline,
    };

    setFontSize(newFormat.fontSize);
    setIsBold(newFormat.isBold);
    setIsItalic(newFormat.isItalic);
    setIsUnderline(newFormat.isUnderline);

    onFormatChange(newFormat);
  };

  const hasSelection = selection && selection.toString().length > 0;

  return (
    <div
      className={`
      fixed bottom-4 left-1/2 -translate-x-1/2 
      w-80 bg-white border rounded-lg shadow-lg
      transition-opacity duration-200
      format-toolbar
      ${hasSelection ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}
    >
      {/* Onglets */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-tl-lg ${
            activeTab === 'fonts'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Polices
        </button>
        <button
          onClick={() => setActiveTab('sizes')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-tr-lg ${
            activeTab === 'sizes'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Tailles
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'fonts' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">Espacement</div>

            {/* Boutons de style */}
            <div className="flex items-center gap-2">
              <Button
                variant={isBold ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormatChange({ isBold: !isBold })}
              >
                <Bold className="h-4 w-4" />
                <span className="sr-only">Gras</span>
              </Button>

              <Button
                variant={isItalic ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormatChange({ isItalic: !isItalic })}
              >
                <Italic className="h-4 w-4" />
                <span className="sr-only">Italique</span>
              </Button>

              <Button
                variant={isUnderline ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleFormatChange({ isUnderline: !isUnderline })}
              >
                <Underline className="h-4 w-4" />
                <span className="sr-only">Souligné</span>
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'sizes' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">Taille de police</div>

            <div className="space-y-2">
              {FONT_SIZES.map(size => (
                <button
                  key={size.value}
                  onClick={() => handleFormatChange({ fontSize: size.value })}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-md text-sm
                    transition-colors duration-200
                    ${
                      fontSize === size.value
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }
                  `}
                >
                  <span>{size.label}</span>
                  <span className="text-xs text-blue-500">{size.value}px</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

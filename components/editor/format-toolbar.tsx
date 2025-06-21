'use client';

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Bold, Italic, Underline, Type, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FormatToolbarProps {
  onFormatChange: (format: {
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
  }) => void;
}

export const FormatToolbar = ({ onFormatChange }: FormatToolbarProps) => {
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);

  // Surveiller la sélection de texte
  useEffect(() => {
    const handleSelectionChange = () => {
      const newSelection = window.getSelection();
      setSelection(newSelection);

      if (newSelection && newSelection.toString().length > 0) {
        // Récupérer le style du texte sélectionné
        const range = newSelection.getRangeAt(0);
        const span = document.createElement('span');
        range.surroundContents(span);
        
        const computedStyle = window.getComputedStyle(span);
        setFontSize(parseInt(computedStyle.fontSize));
        setIsBold(computedStyle.fontWeight === 'bold');
        setIsItalic(computedStyle.fontStyle === 'italic');
        setIsUnderline(computedStyle.textDecoration.includes('underline'));
        
        // Restaurer la sélection
        range.extractContents();
        range.insertNode(span.firstChild!);
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
    <div className={`
      fixed bottom-4 left-1/2 -translate-x-1/2 
      flex items-center gap-2 p-2 rounded-lg shadow-lg bg-white border
      transition-opacity duration-200
      format-toolbar
      ${hasSelection ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Type className="h-4 w-4" />
            <span className="sr-only">Taille de police</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleFormatChange({ fontSize: fontSize - 1 })}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Slider
              value={[fontSize]}
              min={8}
              max={72}
              step={1}
              className="flex-1"
              onValueChange={([value]) => handleFormatChange({ fontSize: value })}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleFormatChange({ fontSize: fontSize + 1 })}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="w-12 text-center">
              {fontSize}px
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="h-6 w-px bg-gray-200" />

      <Button
        variant={isBold ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => handleFormatChange({ isBold: !isBold })}
      >
        <Bold className="h-4 w-4" />
        <span className="sr-only">Gras</span>
      </Button>

      <Button
        variant={isItalic ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => handleFormatChange({ isItalic: !isItalic })}
      >
        <Italic className="h-4 w-4" />
        <span className="sr-only">Italique</span>
      </Button>

      <Button
        variant={isUnderline ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => handleFormatChange({ isUnderline: !isUnderline })}
      >
        <Underline className="h-4 w-4" />
        <span className="sr-only">Souligné</span>
      </Button>
    </div>
  );
};

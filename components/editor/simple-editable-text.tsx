'use client';

import { SimpleFormatToolbar } from './simple-format-toolbar';
import { useState, useRef, useEffect } from 'react';

interface SimpleEditableTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
  onUpdate?: (content: string) => void;
}

export const SimpleEditableText = ({ content, className = '', style = {}, onUpdate }: SimpleEditableTextProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = content;
    }
  }, [content]);

  const handleFormatChange = (format: {
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
  }) => {
    if (!contentRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    try {
      // Pour la taille de police, utiliser une approche directe
      if (format.fontSize !== undefined) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = `${format.fontSize}px`;
        
        try {
          range.surroundContents(span);
        } catch {
          // Si surroundContents échoue, utiliser extractContents
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      }

      // Pour les autres styles, utiliser execCommand
      if (format.isBold !== undefined) {
        document.execCommand('bold', false);
      }

      if (format.isItalic !== undefined) {
        document.execCommand('italic', false);
      }

      if (format.isUnderline !== undefined) {
        document.execCommand('underline', false);
      }

      // Sauvegarder le contenu
      if (onUpdate) {
        onUpdate(contentRef.current.innerHTML);
      }

      // Maintenir le focus
      contentRef.current.focus();
    } catch (error) {
      console.error('Erreur lors du formatage:', error);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (contentRef.current && onUpdate) {
      onUpdate(contentRef.current.innerHTML);
    }
  };

  return (
    <>
      <div
        ref={contentRef}
        contentEditable
        className={`outline-none ${className}`}
        style={style}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        suppressContentEditableWarning
      />
      {isEditing && <SimpleFormatToolbar onFormatChange={handleFormatChange} />}
    </>
  );
};

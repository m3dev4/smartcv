'use client';

import { SimpleFormatToolbar } from './simple-format-toolbar';
import { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
  onUpdate?: (content: string) => void;
}

export const EditableText = ({ content, className = '', style = {}, onUpdate }: EditableTextProps) => {
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

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText.length === 0) return;

    try {
      // Extraire le contenu sélectionné
      const fragment = range.extractContents();
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(fragment);

      // Créer un span avec les styles appropriés
      const span = document.createElement('span');
      
      // Récupérer les styles existants
      const existingStyles = {
        fontSize: '',
        fontWeight: '',
        fontStyle: '',
        textDecoration: ''
      };

      const existingSpans = tempDiv.getElementsByTagName('span');
      if (existingSpans.length > 0) {
        const computedStyle = window.getComputedStyle(existingSpans[0]);
        existingStyles.fontSize = computedStyle.fontSize;
        existingStyles.fontWeight = computedStyle.fontWeight;
        existingStyles.fontStyle = computedStyle.fontStyle;
        existingStyles.textDecoration = computedStyle.textDecoration;
      }

      // Appliquer les styles en préservant les styles existants
      if (format.fontSize) {
        span.style.fontSize = `${format.fontSize}px`;
      } else if (existingStyles.fontSize) {
        span.style.fontSize = existingStyles.fontSize;
      }

      if (format.isBold !== undefined) {
        span.style.fontWeight = format.isBold ? 'bold' : 'normal';
      } else if (existingStyles.fontWeight) {
        span.style.fontWeight = existingStyles.fontWeight;
      }

      if (format.isItalic !== undefined) {
        span.style.fontStyle = format.isItalic ? 'italic' : 'normal';
      } else if (existingStyles.fontStyle) {
        span.style.fontStyle = existingStyles.fontStyle;
      }

      if (format.isUnderline !== undefined) {
        span.style.textDecoration = format.isUnderline ? 'underline' : 'none';
      } else if (existingStyles.textDecoration) {
        span.style.textDecoration = existingStyles.textDecoration;
      }

      // Ajouter le contenu au span
      while (tempDiv.firstChild) {
        span.appendChild(tempDiv.firstChild);
      }
      
      // Insérer le span à la place de la sélection
      range.insertNode(span);
      
      // Créer une nouvelle sélection sur le span
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // Nettoyer les spans imbriqués
      const cleanup = (element: HTMLElement) => {
        const spans = element.getElementsByTagName('span');
        for (let i = spans.length - 1; i >= 0; i--) {
          const currentSpan = spans[i] as HTMLSpanElement;
          const parent = currentSpan.parentElement;
          
          if (parent && parent.tagName === 'SPAN' && 
              currentSpan.style.cssText === parent.style.cssText) {
            while (currentSpan.firstChild) {
              parent.insertBefore(currentSpan.firstChild, currentSpan);
            }
            currentSpan.remove();
          }
        }
      };

      cleanup(span);

      // Sauvegarder le contenu mis à jour
      if (onUpdate) {
        onUpdate(contentRef.current.innerHTML);
      }
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

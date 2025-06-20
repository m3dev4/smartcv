"use client"

import React, { useState, useRef, useEffect, ElementType } from 'react'
import { useResume } from '@/context/resume-context'

interface EditableTextProps {
  value: string
  onChange: (newValue: string) => void
  className?: string
  style?: React.CSSProperties
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span'
  multiline?: boolean
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className = '',
  style = {},
  as = 'p',
  multiline = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const { isPreviewMode } = useResume()

  // Basculer en mode édition lorsque l'utilisateur clique sur le texte
  const handleClick = () => {
    if (!isPreviewMode) {
      setIsEditing(true)
    }
  }

  // Mettre à jour la valeur lorsque l'utilisateur tape
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  // Sauvegarder la valeur lorsque l'utilisateur quitte le champ
  const handleBlur = () => {
    setIsEditing(false)
    if (inputValue !== value) {
      onChange(inputValue)
    }
  }

  // Sauvegarder la valeur lorsque l'utilisateur appuie sur Entrée (sauf pour les champs multilignes)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      setIsEditing(false)
      if (inputValue !== value) {
        onChange(inputValue)
      }
    }
  }

  // Focus sur l'input lorsqu'on passe en mode édition
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Si la valeur change de l'extérieur, mettre à jour la valeur de l'input
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Rendu du composant selon le mode (édition ou affichage)
  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full p-1 border border-gray-300 rounded ${className}`}
          style={style}
          rows={3}
          autoFocus
        />
      )
    } else {
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full p-1 border border-gray-300 rounded ${className}`}
          style={style}
          autoFocus
        />
      )
    }
  }

  // Rendu des différents types d'éléments en mode affichage
  const Component = as as ElementType
  return (
    <Component
      className={`${className} ${!isPreviewMode ? 'cursor-text hover:bg-gray-50' : ''}`}
      style={style}
      onClick={handleClick}
    >
      {value || (isPreviewMode ? '' : <span className="text-gray-400 italic">Cliquez pour éditer</span>)}
    </Component>
  )
}
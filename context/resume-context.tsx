'use client';

import { ResumeTemplateProps } from '@/types/resumeTypes';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockResume } from '@/constants';
import { ResumeTemplateType } from '@/enums/resumeEnum';
import prisma from '@/lib/prisma';

interface ResumeContextType {
  resume: ResumeTemplateProps['resume'] | null;
  updateResume: (updates: Partial<ResumeTemplateProps['resume']>) => void;
  isLoading: boolean | null;
  templateType: string | null;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

/**
 * Renvoie le contexte du CV, y compris les données du CV, une fonction de mise à jour du CV et un booléen indiquant si le CV est en cours de chargement.
 * @throws {Error} si utilisé en dehors d'un fournisseur de CV
 */
export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

interface ResumeProviderProps {
  children: React.ReactNode;
  resumeId?: string;
  templateType?: string;
}

/**
 * Fournit le contexte du CV à ses composants enfants.
 * Ce fournisseur gère l'état d'un CV, y compris son état de chargement et le type de modèle.
 * Il initialise le CV avec des données fictives et autorise les mises à jour via la fonction updateResume.
 *
 * @param {React.ReactNode} children - Composants enfants pouvant accéder au contexte du CV.
 * @param {string} [resumeId] - ID du CV à gérer (facultatif).
 * @param {string} [templateType] - Type de modèle à utiliser pour le CV (facultatif).
 */

export function ResumeProvider({ children, resumeId, templateType }: ResumeProviderProps) {
  const [resume, setResume] = useState<ResumeTemplateProps['resume'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<Array<ResumeTemplateProps['resume'] | null>>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [zoomLevel, setZoomLevel] = useState(100); // init le zoom a 100%
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const zoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10);
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 10);
    }
  };

  const togglePreviewMode = () => {
    console.log("Toggle Preview Mode appelé, valeur actuelle:", isPreviewMode)
    setIsPreviewMode(!isPreviewMode); // Au lieu de prev => !prev
    console.log("Nouvelle valeur après toggle:", !isPreviewMode) // Ajouter ce log
  }

  useEffect(() => {
    // Convertir le templateType (qui est une chaîne) en ResumeTemplateType enum
    let template = ResumeTemplateType.MODERN; // Valeur par défaut

    if (templateType) {
      // Vérifier si le templateType correspond à une valeur de l'enum
      const isValidTemplate = Object.values(ResumeTemplateType).includes(
        templateType as ResumeTemplateType
      );
      if (isValidTemplate) {
        template = templateType as ResumeTemplateType;
      }
    }

    const resumeData: ResumeTemplateProps['resume'] = {
      ...mockResume,
      templateId: template,
    };

    setTimeout(() => {
      setResume(resumeData);
      setHistory([resumeData]);
      setCurrentIndex(0);
      setIsLoading(false);
    }, 500);
  }, [resumeId, templateType]); // Ajout de templateType comme dépendance

  /**
   * Mettre à jour le CV avec les mises à jour partielles fournies.
   * @param updates - Mises à jour partielles du CV.
   * Si le CV est nul, il sera défini sur les mises à jour.
   * Si le CV est non nul, les mises à jour seront fusionnées avec le CV existant.
   */
  const updateResume = (updates: Partial<ResumeTemplateProps['resume']>) => {
    setResume(prev => {
      const newResume = prev ? { ...prev, ...updates } : null;

      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(newResume);
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
      return newResume;
    });
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setResume(history[currentIndex - 1]);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setResume(history[currentIndex + 1]);
    }
  };

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  useEffect(() => {
    console.log("État isPreviewMode mis à jour:", isPreviewMode);
  }, [isPreviewMode]);

  return (
    <ResumeContext.Provider
      value={{
        resume,
        updateResume,
        isLoading,
        templateType: templateType ?? null,
        canRedo,
        canUndo,
        undo,
        redo,
        zoomIn,
        zoomOut,
        zoomLevel,
        isPreviewMode,
        togglePreviewMode
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

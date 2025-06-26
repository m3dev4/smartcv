'use client';

import React from 'react';
import { ProgressBar } from './progress-bar';
import { X, Download } from 'lucide-react';

interface DownloadProgressModalProps {
  isOpen: boolean;
  progress: number;
  onClose: () => void;
  fileName?: string;
}

export const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({
  isOpen,
  progress,
  onClose,
  fileName = 'CV'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Génération du PDF
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {fileName}.pdf
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              {progress < 100 ? 'Génération en cours...' : 'Téléchargement terminé !'}
            </span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {Math.round(progress)}%
            </span>
          </div>
          
          <ProgressBar 
            value={progress} 
            className="h-3"
          />
          
          {progress < 100 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Veuillez patienter pendant la génération de votre CV...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

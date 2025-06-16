import { ResumeTemplateProps } from '@/types/resumeTypes';
import React, { useState } from 'react';
import { ModernTemplate } from '../resumes/templates/moderns';
import { ClassicTemplate } from '../resumes/templates/classic';
import { PerformanceTemplate } from '../resumes/templates/performance';
import { ContemporaryTemplate } from '../resumes/templates/contemporain';
import { MintGreenTemplate } from '../resumes/templates/mint';
import { CompactModernTemplate } from '../resumes/templates/compact';
import { CleanProfessionalTemplate } from '../resumes/templates/clean';
import { StylishTemplate } from '../resumes/templates/stylish';
import { TimelineTemplate } from '../resumes/templates/timeline';
import { MinimalistTemplate } from '../resumes/templates/minimalist';
import { ElegantTemplate } from '../resumes/templates/elegant';
import { ExecutiveTemplate } from '../resumes/templates/executive';
import { ResumeTemplateType } from '@/enums/resumeEnum';
import { useResume } from '@/context/resume-context';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';

const RenderTemplate: React.FC = () => {
  const { resume, updateResume } = useResume();
  
  if (!resume) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          Chargement des templates...
        </p>
      </div>
    );
  }

  // Liste de tous les templates disponibles
  const templates = [
    { type: ResumeTemplateType.MODERN, name: 'Modern', description: 'Design moderne et épuré' },
    { type: ResumeTemplateType.CLASSIC, name: 'Classic', description: 'Style classique et professionnel' },
    { type: ResumeTemplateType.PERFORMANCE, name: 'Performance', description: 'Axé sur les performances' },
    { type: ResumeTemplateType.CONTEMPORAIN, name: 'Contemporain', description: 'Design contemporain' },
    { type: ResumeTemplateType.MINT, name: 'Mint', description: 'Couleurs fraîches et modernes' },
    { type: ResumeTemplateType.COMPACT, name: 'Compact', description: 'Format compact et efficace' },
    { type: ResumeTemplateType.CLEAN, name: 'Clean', description: 'Design propre et minimaliste' },
    { type: ResumeTemplateType.STYLISH, name: 'Stylish', description: 'Style élégant et sophistiqué' },
    { type: ResumeTemplateType.TIMELINE, name: 'Timeline', description: 'Présentation chronologique' },
    { type: ResumeTemplateType.MINIMALIST, name: 'Minimalist', description: 'Approche minimaliste' },
    { type: ResumeTemplateType.ELEGANT, name: 'Elegant', description: 'Design élégant et raffiné' },
    { type: ResumeTemplateType.EXECUTIVE, name: 'Executive', description: 'Pour les postes de direction' },
  ];

  const renderTemplatePreview = (templateType: ResumeTemplateType) => {
    const props: ResumeTemplateProps = {
      resume,
      isEditable: false,
      onEditSection: () => {},
      className: 'pointer-events-none',
    };

    switch (templateType) {
      case ResumeTemplateType.MODERN:
        return <ModernTemplate {...props} />;
      case ResumeTemplateType.CLASSIC:
        return <ClassicTemplate {...props} />;
      case ResumeTemplateType.PERFORMANCE:
        return <PerformanceTemplate {...props} />;
      case ResumeTemplateType.CONTEMPORAIN:
        return <ContemporaryTemplate {...props} />;
      case ResumeTemplateType.MINT:
        return <MintGreenTemplate {...props} />;
      case ResumeTemplateType.COMPACT:
        return <CompactModernTemplate {...props} />;
      case ResumeTemplateType.CLEAN:
        return <CleanProfessionalTemplate {...props} />;
      case ResumeTemplateType.STYLISH:
        return <StylishTemplate {...props} />;
      case ResumeTemplateType.TIMELINE:
        return <TimelineTemplate {...props} />;
      case ResumeTemplateType.MINIMALIST:
        return <MinimalistTemplate {...props} />;
      case ResumeTemplateType.ELEGANT:
        return <ElegantTemplate {...props} />;
      case ResumeTemplateType.EXECUTIVE:
        return <ExecutiveTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  const handleTemplateSelect = (templateType: ResumeTemplateType) => {
    updateResume({
      templateId: templateType
    });
  };

  const currentTemplate = resume.templateId as ResumeTemplateType;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Choisir un Template</h3>
        <p className="text-sm text-gray-600">
          Sélectionnez le template qui correspond le mieux à votre style
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto p-4">
        {templates.map((template) => (
          <div
            key={template.type}
            className={`group relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
              currentTemplate === template.type
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:ring-2 hover:ring-gray-200'
            }`}
            onClick={() => handleTemplateSelect(template.type)}
          >
            {/* Aperçu du template */}
            <div className="aspect-[3/4] overflow-hidden bg-white">
              <div className="transform scale-[0.18] origin-top-left w-[550%] h-[550%]">
                {renderTemplatePreview(template.type)}
              </div>
            </div>

            {/* Overlay avec gradient au survol */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Informations du template qui apparaissent au survol */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h4 className="font-medium text-lg mb-1">{template.name}</h4>
              <p className="text-sm text-gray-200">{template.description}</p>
            </div>

            {/* Indicateur de sélection */}
            {currentTemplate === template.type && (
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white shadow-lg">
                  <Check className="h-4 w-4" />
                  Sélectionné
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderTemplate;

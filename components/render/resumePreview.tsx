'use client';

import React, { useState, useEffect } from 'react';
import { ResumeProvider } from '@/context/resume-context';
import { ResumeTemplateProps } from '@/types/resumeTypes';
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
import { FileText } from 'lucide-react';

interface ResumePreviewProps {
  resume: any;
  className?: string;
  scale?: number;
}

// Helper insensible à la casse pour savoir si la valeur appartient à ResumeTemplateType
const isValidTemplateType = (value: any): value is ResumeTemplateType => {
  if (!value) return false;
  return Object.values(ResumeTemplateType).includes((String(value).toLowerCase()) as ResumeTemplateType);
};

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  className = '',
  scale = 0.18, // Default scale for web preview
}) => {
  if (!resume) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  let templateType: ResumeTemplateType;
  if (isValidTemplateType(resume.templateId)) {
    templateType = (resume.templateId as string).toLowerCase() as ResumeTemplateType;
  } else if (resume.template?.name && isValidTemplateType(resume.template.name)) {
    templateType = resume.template.name.toLowerCase() as ResumeTemplateType;
  } else {
    templateType = ResumeTemplateType.MODERN;
  }

  const renderTemplate = () => {
    const props: ResumeTemplateProps = {
      resume,
      isEditable: false,
      onEditSection: () => {},
      className: 'pointer-events-none',
    };

    switch (templateType) {
      case ResumeTemplateType.MODERN: return <ModernTemplate {...props} />;
      case ResumeTemplateType.CLASSIC: return <ClassicTemplate {...props} />;
      case ResumeTemplateType.PERFORMANCE: return <PerformanceTemplate {...props} />;
      case ResumeTemplateType.CONTEMPORAIN: return <ContemporaryTemplate {...props} />;
      case ResumeTemplateType.MINT: return <MintGreenTemplate {...props} />;
      case ResumeTemplateType.COMPACT: return <CompactModernTemplate {...props} />;
      case ResumeTemplateType.CLEAN: return <CleanProfessionalTemplate {...props} />;
      case ResumeTemplateType.STYLISH: return <StylishTemplate {...props} />;
      case ResumeTemplateType.TIMELINE: return <TimelineTemplate {...props} />;
      case ResumeTemplateType.MINIMALIST: return <MinimalistTemplate {...props} />;
      case ResumeTemplateType.ELEGANT: return <ElegantTemplate {...props} />;
      case ResumeTemplateType.EXECUTIVE: return <ExecutiveTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  const isPdfMode = scale === 1.0;
  const containerSize = 100 / scale;

  return (
    <ResumeProvider resumeId={resume.id} templateType={templateType}>
      <div
        id="resume-container"
        className={`bg-white ${isPdfMode ? 'pdf-mode' : `aspect-[3/4] overflow-hidden ${className}`}`}
        style={{
          width: isPdfMode ? '210mm' : '100%',
          minHeight: isPdfMode ? '297mm' : 'auto',
          padding: isPdfMode ? '15mm' : '0',
          margin: '0 auto',
          boxSizing: 'border-box',
          fontSize: isPdfMode ? '11pt' : 'inherit',
          lineHeight: isPdfMode ? '1.3' : 'inherit',
          fontFamily: isPdfMode ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'inherit'
        }}
      >
        <div
          className={isPdfMode ? 'pdf-content' : 'origin-top-left'}
          style={!isPdfMode ? {
            transform: `scale(${scale})`,
            width: `${containerSize}%`,
            height: `${containerSize}%`,
          } : {}}
        >
          {renderTemplate()}
        </div>
      </div>
    </ResumeProvider>
  );
};

export default ResumePreview;

import { cn } from '@/lib/utils';
import { ResumeTemplateProps } from '@/types/resumeTypes';
import React from 'react';
import ResumeTemplateWrapper from '../resumes/templates/resumeTemplateWrapper';
import { ResumeTemplateType } from '@/enums/resumeEnum';

interface ResumePreviewProps {
  resume: ResumeTemplateProps['resume'];
  selectedSection: string | null;
  onSelectedSection: (section: string) => void;
}

const ResumePreview = ({ resume, selectedSection, onSelectedSection }: ResumePreviewProps) => {
  // Utiliser le template spécifié dans le resume
  const templateType = resume.templateId as ResumeTemplateType;

  return (
    <div className="p-4 h-full flex items-start justify-center overflow-auto">
      <ResumeTemplateWrapper
        type={templateType}
        resume={resume}
        isEditable={true}
        children
        onEditSection={onSelectedSection}
        className="w-full h-auto min-h-full max-w-4xl mx-auto shadow-xl print:shadow-none transition-all duration-300 hover:scale-[1.005]"
      />
    </div>
  );
};

export default ResumePreview;

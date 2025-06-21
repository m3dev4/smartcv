'use client';
import ResumeTemplateWrapper from '@/components/resumes/templates/resumeTemplateWrapper';
import { mockResume } from '@/constants';
import { ResumeProvider } from '@/context/resume-context';
import { ResumeTemplateType } from '@/enums/resumeEnum';
import React from 'react';

const TemplatePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div style={{ transform: 'scale(0.8)', transformOrigin: 'top' }}>
        <ResumeProvider resumeId={mockResume.id} templateType={mockResume.templateId}>
          <ResumeTemplateWrapper
            type={ResumeTemplateType.CLEAN}
            resume={mockResume as any}
            isEditable={true}
            onEditSection={() => {}}
            className="shadow-xl mt-10"
            children={undefined}
          />
        </ResumeProvider>
      </div>
    </div>
  );
};

export default TemplatePage;

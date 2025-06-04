'use client';
import ResumeTemplateWrapper from '@/components/resumes/templates/resumeTemplateWrapper';
import { mockResume } from '@/constants';
import { ResumeTemplateType } from '@/enums/resumeEnum';
import React from 'react';

const TemplatePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div style={{ transform: 'scale(0.74)', transformOrigin: 'top' }}>
        <ResumeTemplateWrapper
          type={ResumeTemplateType.PERFORMANCE}
          resume={mockResume as any}
          isEditable={true}
          onEditSection={() => {}}
          className="shadow-xl mt-10"
          children={undefined}
        />
      </div>
    </div>
  );
};

export default TemplatePage;

'use client';
import ResumeTemplateWrapper from '@/components/resumes/templates/resumeTemplateWrapper';
import { mockResume } from '@/constants';
import { ResumeTemplateType } from '@/enums/resumeEnum';
import React from 'react';

const TemplatePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ResumeTemplateWrapper
        type={ResumeTemplateType.CLASSIC}
        resume={mockResume as any}
        isEditable={true}
        onEditSection={() => {}}
        className={''}
        children={undefined}
      />
    </div>
  );
};

export default TemplatePage;

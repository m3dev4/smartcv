import { ResumeTemplateType } from '@/enums/resumeEnum';
import { ResumeTemplateProps, ResumeWrapperTemplateProps } from '@/types/resumeTypes';
import React from 'react';
import { ModernTemplate } from './moderns';
import { ClassicTemplate } from './classic';
import { PerformanceTemplate } from './performance';

const ResumeTemplateWrapper: React.FC<ResumeWrapperTemplateProps> = ({
  type,
  resume,
  isEditable,
  onEditSection,
  className,
  children,
}) => {
  const renderTemplate = () => {
    const props: ResumeTemplateProps = {
      resume,
      isEditable,
      onEditSection,
      className,
    };

    switch (type) {
      case ResumeTemplateType.MODERN:
        return <ModernTemplate {...props} />;
      case ResumeTemplateType.CLASSIC:
        return <ClassicTemplate {...props} />;
      case ResumeTemplateType.PERFORMANCE:
        return <PerformanceTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  return (
    <div className={className}>
      {renderTemplate()}
      {children}
    </div>
  );
};

export default ResumeTemplateWrapper;

import { ResumeTemplateType } from '@/enums/resumeEnum';
import { ResumeTemplateProps, ResumeWrapperTemplateProps } from '@/types/resumeTypes';
import React from 'react';
import { ModernTemplate } from './moderns';
import { ClassicTemplate } from './classic';
import { PerformanceTemplate } from './performance';
import { ContemporaryTemplate } from './contemporain';
import { MintGreenTemplate } from './mint';
import { CompactModernTemplate } from './compact';
import { CleanProfessionalTemplate } from './clean';
import { StylishTemplate } from './stylish';
import { TimelineTemplate } from './timeline';
import { MinimalistTemplate } from './minimalist';
import { ElegantTemplate } from './elegant';
import { ExecutiveTemplate } from './executive';

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

  return (
    <div className={className}>
      {renderTemplate()}
      {children}
    </div>
  );
};

export default ResumeTemplateWrapper;

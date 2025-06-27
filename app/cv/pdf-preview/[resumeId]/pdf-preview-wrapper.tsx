'use client';

import ResumePreview from '@/components/render/resumePreview';

interface PDFPreviewWrapperProps {
  resume: any;
}

export default function PDFPreviewWrapper({ resume }: PDFPreviewWrapperProps) {
  return (
    <div className="min-h-screen bg-white">
      <ResumePreview resume={resume} scale={1.0} />
    </div>
  );
}

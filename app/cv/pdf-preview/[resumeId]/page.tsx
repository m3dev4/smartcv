import { getResumeByIdForPdf } from '@/app/api/actions/resume-public';
import ResumePreview from '@/components/render/resumePreview';

export default async function PDFPreviewPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params;
  
  const resumeData = await getResumeByIdForPdf(resumeId);
  
  if (!resumeData?.success || !resumeData?.resume) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Erreur</h1>
        <p>Le CV demandé n'a pas pu être trouvé.</p>
        <p>ID: {resumeId}</p>
      </div>
    );
  }

  const resume = resumeData.resume;
  
  // Log pour debug
  console.log('Resume template info:', {
    templateId: resume.templateId,
    templateName: resume.template?.name,
    template: resume.template
  });

  return (
    <div id="resume-pdf-preview">
      <ResumePreview resume={resume} scale={1.0} />
    </div>
  );
}

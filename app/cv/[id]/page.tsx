import { fetchResumeById } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ResumePreviewClient from '@/components/render/ResumePreviewClient';

export default async function ResumePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  const resume = await fetchResumeById(id);

  if (!resume) {
    console.error('Resume not found for ID:', params.id);
    return notFound();
  }

  const isPdfMode = searchParams?.pdf === 'true';

  return (
    <div id="resume-preview" className="container mx-auto p-4 bg-white print:p-0 print:m-0">
      <div className="print:scale-100">
        <ResumePreviewClient resume={resume} isPdfMode={isPdfMode} />
      </div>
    </div>
  );
}
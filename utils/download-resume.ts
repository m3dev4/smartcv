import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { toPng } from 'html-to-image';
type Resume = ResumeTemplateProps['resume'];

export async function downloadResume(resume: Resume, format: 'pdf' | 'json' | 'docx') {
  switch (format) {
    case 'json':
      saveAs(
        new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' }),
        'resume.json'
      );
      break;

    case 'docx':
      await exportDocx(resume);
      break;

    case 'pdf':
    default:
      await exportPdf();
  }
}

async function exportPdf() {
    const node = document.getElementById('resume-preview');
    if (!node) return;
  
    const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
  
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = img.height / img.width;
    pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageWidth * ratio);
    pdf.save('resume.pdf');
  }

async function exportDocx(resume: Resume) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${resume.personalInfo?.firstName} ${resume.personalInfo?.lastName}`,
                bold: true,
                size: 31,
              }),
            ],
          }),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'resume.docx');
}

import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

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

// Helper function to convert OKLCH to a safe RGB value.
function oklchToRgb(cssValue: string): string {
  // A dictionary of common OKLCH colors to their RGB equivalents.
  const oklchToRgbMap: Record<string, string> = {
    'oklch(0.6 0.3 0)': 'rgb(224, 60, 49)',
    'oklch(0.7 0.15 142)': 'rgb(46, 160, 67)',
    'oklch(0.8 0.12 64)': 'rgb(218, 165, 32)',
    'oklch(0.5 0.2 264)': 'rgb(70, 130, 180)',
    'oklch(0.9 0.05 180)': 'rgb(220, 220, 220)',
    'oklch(0.2 0.02 0)': 'rgb(40, 40, 40)',
    'oklch(0.98 0.008 106)': 'rgb(248, 248, 248)',
    'oklch(0.15 0.01 0)': 'rgb(30, 30, 30)',
  };

  // Replace known OKLCH values from the map or use a fallback for unknown values.
  return cssValue.replace(/oklch\([^)]+\)/g, match => {
    if (oklchToRgbMap[match]) {
      return oklchToRgbMap[match];
    }
    const values = match.match(/oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/);
    if (values) {
      const l = parseFloat(values[1]);
      if (l > 0.9) return 'rgb(245, 245, 245)';
      if (l > 0.8) return 'rgb(220, 220, 220)';
      if (l > 0.6) return 'rgb(160, 160, 160)';
      if (l > 0.4) return 'rgb(100, 100, 100)';
      if (l > 0.2) return 'rgb(60, 60, 60)';
      return 'rgb(30, 30, 30)';
    }
    return 'rgb(128, 128, 128)'; // Final fallback
  });
}

// Clones a node and its computed styles, converting OKLCH colors on the fly.
async function cloneNodeWithInlineStyles(node: HTMLElement): Promise<HTMLElement> {
  const cloned = node.cloneNode(true) as HTMLElement;
  const copyStyles = (original: Element, clone: Element) => {
    const cloneElement = clone as HTMLElement;
    const computedStyles = window.getComputedStyle(original);
    for (let i = 0; i < computedStyles.length; i++) {
      const propName = computedStyles[i];
      let propValue = computedStyles.getPropertyValue(propName);
      const propPriority = computedStyles.getPropertyPriority(propName);

      if (propValue.includes('oklch')) {
        propValue = oklchToRgb(propValue);
      }

      cloneElement.style.setProperty(propName, propValue, propPriority);
    }
    for (let i = 0; i < original.children.length; i++) {
      copyStyles(original.children[i], clone.children[i]);
    }
  };
  copyStyles(node, cloned);
  return cloned;
}

async function exportPdf() {
  const node = document.getElementById('resume-preview');
  if (!node) {
    console.error('Élément resume-preview non trouvé');
    return;
  }

  try {
    // 1. Create a high-fidelity clone with styles and converted colors.
    const clone = await cloneNodeWithInlineStyles(node);

    // 2. Render the clone in an off-screen container.
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${node.offsetWidth}px`;
    container.style.background = 'white';
    document.body.appendChild(container);
    container.appendChild(clone);

    await new Promise(resolve => setTimeout(resolve, 300));

    // 3. Generate a canvas using html2canvas-pro directly.
    const canvas = await html2canvas(clone, {
      scale: 2, // High resolution for crisp text
      useCORS: true,
      allowTaint: true,
      width: node.offsetWidth,
      height: node.offsetHeight,

      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: false,
    });

    // 4. Create the PDF with manual pagination.
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / imgWidth;
    const pageHeightInCanvasPixels = pdfHeight / ratio;

    let position = 0;
    while (position < imgHeight) {
      if (position > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, -position * ratio, imgWidth * ratio, imgHeight * ratio);
      position += pageHeightInCanvasPixels;
    }

    pdf.save('resume.pdf');

    // 5. Clean up the temporary container.
    document.body.removeChild(container);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Une erreur est survenue lors de la génération du PDF.');
    const container = document.querySelector('div[style*="left: -9999px"]');
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

async function exportDocx(resume: Resume) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${resume.personalInfo?.firstName || ''} ${
                  resume.personalInfo?.lastName || ''
                }`,
                bold: true,
                size: 31,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resume.personalInfo?.email || '',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resume.personalInfo?.phone || '',
                size: 22,
              }),
            ],
          }),
        ],
      },
    ],
  });

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'resume.docx');
  } catch (error) {
    console.error("Erreur lors de l'export DOCX:", error);
    alert('Erreur lors de la génération du fichier DOCX.');
  }
}
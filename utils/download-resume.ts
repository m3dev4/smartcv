import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
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

// Fonction simple pour remplacer les couleurs OKLCH par des équivalents RGB
function replaceOklchColors(cssText: string): string {
  // Dictionnaire de couleurs OKLCH communes vers RGB
  const oklchToRgb: Record<string, string> = {
    'oklch(0.6 0.3 0)': 'rgb(224, 60, 49)',
    'oklch(0.7 0.15 142)': 'rgb(46, 160, 67)',
    'oklch(0.8 0.12 64)': 'rgb(218, 165, 32)',
    'oklch(0.5 0.2 264)': 'rgb(70, 130, 180)',
    'oklch(0.9 0.05 180)': 'rgb(220, 220, 220)',
    'oklch(0.2 0.02 0)': 'rgb(40, 40, 40)',
    'oklch(0.98 0.008 106)': 'rgb(248, 248, 248)',
    'oklch(0.15 0.01 0)': 'rgb(30, 30, 30)',
    // Ajoutez d'autres correspondances selon vos besoins
  };

  let result = cssText;

  // Remplacer les correspondances exactes
  Object.keys(oklchToRgb).forEach(oklch => {
    const regex = new RegExp(oklch.replace(/[()]/g, '\\$&'), 'g');
    result = result.replace(regex, oklchToRgb[oklch]);
  });

  // Remplacer les patterns OKLCH génériques par des couleurs sûres
  result = result.replace(/oklch\([^)]+\)/g, match => {
    // Extraire les valeurs L, C, H
    const values = match.match(/oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/);
    if (values) {
      const l = parseFloat(values[1]);
      const c = parseFloat(values[2]);
      const h = parseFloat(values[3]);

      // Conversion approximative basée sur la luminosité
      if (l > 0.9) return 'rgb(245, 245, 245)'; // Très clair
      if (l > 0.8) return 'rgb(220, 220, 220)'; // Clair
      if (l > 0.6) return 'rgb(160, 160, 160)'; // Moyen clair
      if (l > 0.4) return 'rgb(100, 100, 100)'; // Moyen foncé
      if (l > 0.2) return 'rgb(60, 60, 60)'; // Foncé
      return 'rgb(30, 30, 30)'; // Très foncé
    }

    // Fallback pour les patterns non reconnus
    return 'rgb(128, 128, 128)';
  });

  return result;
}

// Fonction pour créer une feuille de style compatible
function createCompatibleStyleSheet(): HTMLStyleElement {
  const style = document.createElement('style');
  style.type = 'text/css';

  // CSS pour remplacer les couleurs OKLCH par des équivalents RGB
  const css = `
    /* Remplacement des couleurs OKLCH courantes */
    * {
      color: revert !important;
      background-color: revert !important;
      border-color: revert !important;
    }
    
    /* Styles de base sûrs pour l'export PDF */
    .resume-container * {
      color: rgb(33, 33, 33) !important;
      background-color: rgb(255, 255, 255) !important;
    }
    
    .resume-header {
      background-color: rgb(248, 249, 250) !important;
      color: rgb(33, 33, 33) !important;
    }
    
    .resume-section {
      border-color: rgb(229, 231, 235) !important;
    }
    
    .resume-title {
      color: rgb(17, 24, 39) !important;
    }
    
    .resume-subtitle {
      color: rgb(107, 114, 128) !important;
    }
    
    .resume-accent {
      color: rgb(59, 130, 246) !important;
    }
  `;

  style.innerHTML = css;
  return style;
}

async function exportPdf() {
  const node = document.getElementById('resume-preview');
  if (!node) {
    console.error('Élément resume-preview non trouvé');
    return;
  }

  try {
    // Créer un conteneur temporaire
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 width
    container.style.background = 'white';
    document.body.appendChild(container);

    // Cloner le noeud
    const clone = node.cloneNode(true) as HTMLElement;
    container.appendChild(clone);

    // Ajouter la feuille de style compatible
    const compatibleStyle = createCompatibleStyleSheet();
    container.appendChild(compatibleStyle);

    // Fonction pour forcer les styles RGB
    const forceRgbStyles = (element: HTMLElement) => {
      const computedStyle = getComputedStyle(element);

      // Propriétés à traiter
      const properties = [
        'color',
        'backgroundColor',
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor',
      ];

      properties.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && value.includes('oklch')) {
          // Utiliser une couleur par défaut sûre
          switch (prop) {
            case 'color':
              element.style.setProperty(prop, 'rgb(33, 33, 33)', 'important');
              break;
            case 'backgroundColor':
              element.style.setProperty(prop, 'rgb(255, 255, 255)', 'important');
              break;
            default:
              element.style.setProperty(prop, 'rgb(229, 231, 235)', 'important');
          }
        }
      });

      // Traiter les enfants
      Array.from(element.children).forEach(child => {
        if (child instanceof HTMLElement) {
          forceRgbStyles(child);
        }
      });
    };

    // Appliquer les styles RGB
    forceRgbStyles(clone);

    // Attendre que les styles soient appliqués
    await new Promise(resolve => setTimeout(resolve, 200));

    // Utiliser html2canvas avec des options optimisées
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: false,
    });

    // Créer le PDF
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
    const pageHeightPx = pdfHeight / ratio;

    let position = 0;

    while (position < imgHeight) {
      pdf.addImage(imgData, 'PNG', 0, -position * ratio, imgWidth * ratio, imgHeight * ratio);
      position += pageHeightPx;
      if (position < imgHeight) {
        pdf.addPage();
      }
    }

    pdf.save('resume.pdf');

    // Nettoyer
    document.body.removeChild(container);
  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);

    // Fallback ultra-simple
    try {
      const canvas = await html2canvas(node, {
        scale: 1,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
    } catch (fallbackError) {
      console.error('Erreur du fallback:', fallbackError);
      alert(
        'Erreur lors de la génération du PDF. Veuillez vérifier que votre CV ne contient pas de couleurs OKLCH non supportées.'
      );
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

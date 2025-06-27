// Solution alternative: Utiliser l'API Print du navigateur
export const downloadResumeAsPDF = (resumeId: string, fileName: string) => {
  // Ouvrir la page de preview dans une nouvelle fenêtre
  const printWindow = window.open(
    `/cv/preview/${resumeId}?print=true`, 
    '_blank',
    'width=800,height=600'
  );
  
  if (printWindow) {
    printWindow.onload = () => {
      // Attendre que le contenu soit chargé
      setTimeout(() => {
        // Déclencher l'impression
        printWindow.print();
        
        // Fermer la fenêtre après impression
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 1000);
    };
  }
};

// Alternative avec html2canvas + jsPDF
export const downloadResumeWithJsPDF = async (resumeId: string, fileName: string) => {
  try {
    console.log('🎯 Début génération PDF pour:', fileName);
    
    // Dynamically import libraries
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).jsPDF;
    
    const element = document.getElementById('resume-container');
    if (!element) {
      console.error('❌ Element resume-container non trouvé');
      throw new Error('Resume container not found');
    }
    
    console.log('📸 Capture de l\'élément...');
    
    // Capture l'élément comme image avec des options optimisées
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null, // Garder la couleur de fond originale
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    });
    
    console.log('✅ Capture réussie, dimensions:', canvas.width, 'x', canvas.height);
    
    // Créer le PDF
    const imgData = canvas.toDataURL('image/png', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    console.log('📄 Dimensions PDF:', imgWidth, 'x', imgHeight);
    
    // Si l'image est plus haute qu'une page A4, on la redimensionne
    if (imgHeight > pdfHeight) {
      const ratio = pdfHeight / imgHeight;
      const finalWidth = imgWidth * ratio;
      const finalHeight = pdfHeight;
      pdf.addImage(imgData, 'PNG', (pdfWidth - finalWidth) / 2, 0, finalWidth, finalHeight);
    } else {
      // Centrer l'image sur la page
      const yOffset = (pdfHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
    }
    
    // Télécharger le PDF
    console.log('💾 Téléchargement du PDF...');
    pdf.save(fileName);
    
    console.log('✅ PDF téléchargé avec succès !');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la génération PDF:', error);
    return false;
  }
};

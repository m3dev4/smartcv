import { getResumeByIdForPdf } from '@/app/api/actions/resume-public';
import chrome from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';

export async function GET(
  _request: Request,
  { params }: { params: { resumeId: string } }
) {
  let browser;
  
  try {
    // 1. Attendre les paramètres (Next.js 15)
    const { resumeId } = params;
    
    // 2. Récupérer les données du CV pour vérifier qu'il existe
    const resumeData = await getResumeByIdForPdf(resumeId);
    if (!resumeData.success || !resumeData.resume) {
      return Response.json({ error: 'CV non trouvé' }, { status: 404 });
    }

    console.log('Détails de la requête PDF :', {
      resumeId,
      hasResumeData: !!resumeData.resume
    });

    // 3. Configuration de l'URL de preview
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const previewUrl = `${baseUrl}/cv/pdf-preview/${resumeId}`;
    console.log('PDF generation previewUrl:', previewUrl);

    // 4. Configuration avancée de Puppeteer (reprenant la logique Express)
    if (process.env.NODE_ENV === 'production') {
      const executablePath = await chrome.executablePath();
      browser = await puppeteerCore.launch({
        args: [
          ...chrome.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--allow-file-access-from-files'
        ],
        executablePath: executablePath,
        headless: true,
        timeout: 60000
      });
    } else {
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--allow-file-access-from-files'
        ],
        timeout: 60000
      });
    }

    const page = await browser.newPage();

    // Configuration du User Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Configuration de l'interception des requêtes (optionnel pour Next.js)
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      const allowedTypes = ['document', 'script', 'xhr', 'fetch', 'stylesheet', 'font', 'image'];
      
      if (allowedTypes.includes(resourceType)) {
        request.continue();
      } else {
        request.abort();
      }
    });

    // Gestion des événements de la page
    page.on('console', (msg) => console.log('Page console:', msg.text()));
    page.on('pageerror', (err) => console.error('Page error:', err));
    page.on('requestfailed', (request) => 
      console.log('Request failed:', request.url(), request.failure()?.errorText || 'Unknown error')
    );

    // Navigation avec attente complète du chargement
    try {
      await page.goto(previewUrl, { 
        waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
        timeout: 60000 
      });

      // Attendre que les polices soient chargées avec timeout
      await page.evaluate(() => {
        return Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 5000)) // Timeout de 5 secondes
        ]);
      });

      // Forcer le chargement des polices Google Fonts si présentes
      await page.evaluate(() => {
        const links = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        return Promise.all(
          Array.from(links).map(link => {
            return new Promise(resolve => {
              if (link.sheet) {
                resolve();
              } else {
                link.onload = resolve;
                link.onerror = resolve;
                setTimeout(resolve, 3000); // Timeout de sécurité
              }
            });
          })
        );
      });

      // Attendre que toutes les images soient chargées
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.onload = img.onerror = resolve;
              setTimeout(resolve, 2000); // Timeout de sécurité
            }))
        );
      });

      // Attendre un délai supplémentaire pour s'assurer que les polices sont appliquées
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (navigationError) {
      console.error('Erreur de navigation :', navigationError);
      throw new Error('Impossible de charger la page correctement');
    }

    // Configurer la page pour l'impression
    await page.emulateMediaType('print');
    
    // Précharger les polices (reprenant la logique Express)
    await page.evaluate((fontName) => {
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
      const fontUrls = [
        fontUrl,
        'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
        'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap',
        'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap',
        'https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap',
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap'
      ];

      return Promise.all(
        fontUrls.map(url => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = url;
          document.head.appendChild(link);
          return new Promise((resolve) => {
            link.onload = resolve;
            link.onerror = resolve;
            setTimeout(resolve, 3000); // Timeout de sécurité
          });
        })
      );
    }, resumeData.resume.font?.name || 'Inter');

    // Injecter les styles d'impression optimisés
    await page.addStyleTag({
      content: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');

        @page {
          size: A4;
          margin: 0;
        }

        /* Assurer que les polices sont disponibles sans forcer leur utilisation */
        body {
          font-family: inherit;
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          #resume-pdf-preview, #resume-container {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            background: white !important;
          }

          /* Préserver les styles de pagination */
          .page-break {
            break-after: page !important;
            page-break-after: always !important;
          }

          .page {
            height: 297mm !important;
            width: 210mm !important;
            padding: 15mm !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            background: white !important;
            position: relative !important;
            overflow: hidden !important;
          }
          
          /* Optimiser les images */
          img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* Éviter les sauts de page non désirés dans les sections importantes */
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `
    });

    // Attendre que le conteneur du CV soit prêt (adapter selon votre sélecteur)
    const containerSelector = '#resume-pdf-preview, #resume-container';
    await page.waitForSelector(containerSelector, { timeout: 15000 });
    
    // Vérifier et forcer l'application des polices
    await page.evaluate(() => {
      // Détecter la police principale utilisée dans le document
      const bodyStyle = window.getComputedStyle(document.body);
      const mainFont = bodyStyle.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      
      // Forcer le rechargement de la police détectée
      if (mainFont && mainFont !== 'inherit') {
        document.fonts.load(`400 16px ${mainFont}`);
        document.fonts.load(`500 16px ${mainFont}`);
        document.fonts.load(`600 16px ${mainFont}`);
        document.fonts.load(`700 16px ${mainFont}`);
      }
      
      // Forcer le rechargement des polices communes
      const commonFonts = ['Inter', 'Roboto', 'Poppins', 'Open Sans', 'Lato', 'Montserrat', 'Verdana', 'Arial'];
      commonFonts.forEach(font => {
        document.fonts.load(`400 16px ${font}`);
        document.fonts.load(`500 16px ${font}`);
        document.fonts.load(`600 16px ${font}`);
        document.fonts.load(`700 16px ${font}`);
      });
      
      // Forcer le re-rendu de tous les éléments avec du texte
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.textContent && el.textContent.trim()) {
          // Forcer le re-rendu en modifiant temporairement le style
          const originalDisplay = el.style.display;
          el.style.display = 'none';
          el.offsetHeight; // Force reflow
          el.style.display = originalDisplay;
        }
      });
    });
    
    // Attendre un délai supplémentaire pour s'assurer que tous les styles et polices sont appliqués
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Optimiser le conteneur pour l'impression
    await page.evaluate(() => {
      const container = document.querySelector('#resume-pdf-preview') || document.querySelector('#resume-container');
      if (container) {
        // Sauvegarder la police utilisée avant de nettoyer le DOM
        const computedStyle = window.getComputedStyle(container);
        const originalFont = computedStyle.fontFamily;
        
        // Nettoyer le DOM pour ne garder que le CV
        document.body.innerHTML = container.outerHTML;
        
        // Appliquer les styles de base
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.background = 'white';
        
        // Optimiser le conteneur principal et réappliquer la police d'origine
        const newContainer = document.querySelector('#resume-pdf-preview') || document.querySelector('#resume-container');
        if (newContainer) {
          // Réappliquer la police d'origine
          newContainer.style.fontFamily = originalFont;
          
          // Optimiser les dimensions
          newContainer.style.width = '210mm';
          newContainer.style.margin = '0';
          newContainer.style.padding = '0';
          newContainer.style.boxSizing = 'border-box';
          newContainer.style.background = 'white';
          
          // Préserver la structure de pagination existante
          const pages = newContainer.querySelectorAll('.page, [class*="page"]');
          if (pages.length > 0) {
            pages.forEach((page, index) => {
              page.style.width = '210mm';
              page.style.minHeight = '297mm';
              page.style.padding = '15mm';
              page.style.margin = '0';
              page.style.boxSizing = 'border-box';
              page.style.background = 'white';
              page.style.position = 'relative';
              
              // Ajouter un saut de page sauf pour la dernière page
              if (index < pages.length - 1) {
                page.style.pageBreakAfter = 'always';
                page.style.breakAfter = 'page';
              }
            });
          } else {
            // Si pas de structure de page, créer une page unique
            newContainer.style.minHeight = '297mm';
            newContainer.style.padding = '15mm';
          }
        }
      } else {
        throw new Error('Element #resume-pdf-preview ou #resume-container not found');
      }
    });

    // Générer le PDF avec les mêmes paramètres que l'ancien serveur Express
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: { 
        top: '0mm', 
        right: '0mm', 
        bottom: '0mm', 
        left: '0mm' 
      },
      preferCSSPageSize: true,
      scale: 1,
      pageRanges: '-', // Imprimer toutes les pages
      width: '210mm',
      height: '297mm'
    });

    await browser.close();

    // Générer le nom de fichier
    const first = resumeData.resume.personalInfo?.firstName?.trim();
    const last = resumeData.resume.personalInfo?.lastName?.trim();
    const baseName = [first, last].filter(Boolean).join('_') || resumeData.resume.title?.replace(/\s+/g, '_') || 'Resume';
    const fileName = `CV_${baseName}.pdf`;

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Erreur lors de la fermeture du navigateur :', closeError);
      }
    }

    return Response.json(
      { 
        error: 'Impossible de générer le PDF', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
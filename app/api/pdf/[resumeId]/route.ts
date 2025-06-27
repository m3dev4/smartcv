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
      hasResumeData: !!resumeData.resume,
      environment: process.env.NODE_ENV,
      platform: process.platform
    });

    // 3. Configuration de l'URL de preview
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const previewUrl = `${baseUrl}/cv/pdf-preview/${resumeId}`;
    console.log('PDF generation previewUrl:', previewUrl);

    // 4. Configuration AMÉLIORÉE de Puppeteer pour la production
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = process.env.VERCEL === '1';
    const isRailway = !!process.env.RAILWAY_ENVIRONMENT;
    const isRender = !!process.env.RENDER;

    if (isProduction) {
      try {
        // Configuration spécifique selon la plateforme
        let executablePath: string;
        let args: string[] = [];

        if (isVercel) {
          // Vercel configuration
          executablePath = await chrome.executablePath();
          args = [
            ...chrome.args,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--allow-file-access-from-files',
            '--disable-features=VizDisplayCompositor',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--single-process' // Important pour Vercel
          ];
        } else if (isRailway || isRender) {
          // Railway/Render configuration
          executablePath = await chrome.executablePath();
          args = [
            ...chrome.args,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--allow-file-access-from-files',
            '--disable-features=VizDisplayCompositor'
          ];
        } else {
          // Configuration générique pour autres plateformes
          try {
            executablePath = await chrome.executablePath();
          } catch (chromeError) {
            console.warn('Chrome non trouvé, tentative avec des chemins alternatifs:', chromeError);
            
            // Chemins alternatifs communs
            const possiblePaths = [
              '/usr/bin/google-chrome',
              '/usr/bin/chromium-browser',
              '/usr/bin/chromium',
              '/snap/bin/chromium',
              'google-chrome-stable',
              'chromium-browser'
            ];
            
            executablePath = possiblePaths[0]; // Fallback
          }
          
          args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--allow-file-access-from-files'
          ];
        }

        console.log('Tentative de lancement avec executablePath:', executablePath);

        browser = await puppeteerCore.launch({
          args,
          executablePath,
          headless: true,
          timeout: 60000,
          // Options supplémentaires pour la stabilité
          ignoreDefaultArgs: ['--disable-extensions'],
          defaultViewport: { width: 1280, height: 720 }
        });

      } catch (productionError) {
        console.error('Erreur de lancement en production:', productionError);
        
        // Fallback: essayer avec puppeteer standard si available
        console.log('Tentative de fallback avec puppeteer standard...');
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
    } else {
      // Configuration locale (développement)
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
    
    // Configuration de l'interception des requêtes
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

    // Gestion des événements de la page avec plus de détails
    page.on('console', (msg) => console.log('Page console:', msg.text()));
    page.on('pageerror', (err) => console.error('Page error:', err));
    page.on('requestfailed', (request) => 
      console.log('Request failed:', request.url(), request.failure()?.errorText || 'Unknown error')
    );

    // Navigation avec gestion d'erreur améliorée
    try {
      console.log('Navigation vers:', previewUrl);
      
      await page.goto(previewUrl, { 
        waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
        timeout: 60000 
      });

      console.log('Navigation réussie, attente des polices...');

      // Attendre que les polices soient chargées avec timeout
      await page.evaluate(() => {
        return Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 5000))
        ]);
      });

      // Forcer le chargement des polices Google Fonts si présentes
      await page.evaluate(() => {
        const links = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        return Promise.all(
          Array.from(links).map(link => {
            return new Promise(resolve => {
              if (link.sheet) {
                resolve(true);
              } else {
                link.onload = () => resolve(true);
                link.onerror = () => resolve(false);
                setTimeout(() => resolve(false), 3000);
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
              setTimeout(resolve, 2000);
            }))
        );
      });

      // Attendre un délai supplémentaire
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (navigationError) {
      console.error('Erreur de navigation détaillée:', navigationError);
      throw new Error(`Impossible de charger la page: ${navigationError.message}`);
    }

    // Configurer la page pour l'impression
    await page.emulateMediaType('print');
    
    // Précharger les polices
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
            setTimeout(resolve, 3000);
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
          
          img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `
    });

    // Attendre que le conteneur du CV soit prêt
    const containerSelector = '#resume-pdf-preview, #resume-container';
    await page.waitForSelector(containerSelector, { timeout: 15000 });
    
    // Vérifier et forcer l'application des polices
    await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      const mainFont = bodyStyle.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      
      if (mainFont && mainFont !== 'inherit') {
        document.fonts.load(`400 16px ${mainFont}`);
        document.fonts.load(`500 16px ${mainFont}`);
        document.fonts.load(`600 16px ${mainFont}`);
        document.fonts.load(`700 16px ${mainFont}`);
      }
      
      const commonFonts = ['Inter', 'Roboto', 'Poppins', 'Open Sans', 'Lato', 'Montserrat', 'Verdana', 'Arial'];
      commonFonts.forEach(font => {
        document.fonts.load(`400 16px ${font}`);
        document.fonts.load(`500 16px ${font}`);
        document.fonts.load(`600 16px ${font}`);
        document.fonts.load(`700 16px ${font}`);
      });
      
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.textContent && el.textContent.trim()) {
          const originalDisplay = el.style.display;
          el.style.display = 'none';
          el.offsetHeight;
          el.style.display = originalDisplay;
        }
      });
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Optimiser le conteneur pour l'impression
    await page.evaluate(() => {
      const container = document.querySelector('#resume-pdf-preview') || document.querySelector('#resume-container');
      if (container) {
        const computedStyle = window.getComputedStyle(container);
        const originalFont = computedStyle.fontFamily;
        
        document.body.innerHTML = container.outerHTML;
        
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.background = 'white';
        
        const newContainer = document.querySelector('#resume-pdf-preview') || document.querySelector('#resume-container');
        if (newContainer) {
          newContainer.style.fontFamily = originalFont;
          newContainer.style.width = '210mm';
          newContainer.style.margin = '0';
          newContainer.style.padding = '0';
          newContainer.style.boxSizing = 'border-box';
          newContainer.style.background = 'white';
          
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
              
              if (index < pages.length - 1) {
                page.style.pageBreakAfter = 'always';
                page.style.breakAfter = 'page';
              }
            });
          } else {
            newContainer.style.minHeight = '297mm';
            newContainer.style.padding = '15mm';
          }
        }
      } else {
        throw new Error('Element #resume-pdf-preview ou #resume-container not found');
      }
    });

    console.log('Génération du PDF...');

    // Générer le PDF
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
      pageRanges: '-',
      width: '210mm',
      height: '297mm'
    });

    await browser.close();
    console.log('PDF généré avec succès');

    // Générer le nom de fichier
    const first = resumeData.resume.personalInfo?.firstName?.trim();
    const last = resumeData.resume.personalInfo?.lastName?.trim();
    const baseName = [first, last].filter(Boolean).join('_') || resumeData.resume.title?.replace(/\s+/g, '_') || 'Resume';
    const fileName = `CV_${baseName}.pdf`;

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
        'Content-Length': pdf.length.toString()
      }
    });

  } catch (error) {
    console.error('Erreur détaillée lors de la génération du PDF:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Erreur lors de la fermeture du navigateur:', closeError);
      }
    }

    return Response.json(
      { 
        error: 'Impossible de générer le PDF', 
        details: error.message,
        environment: process.env.NODE_ENV,
        platform: process.platform
      },
      { status: 500 }
    );
  }
}
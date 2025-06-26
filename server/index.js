const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));

// Health check endpoint pour Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'PDF Server is running' });
});

app.post('/generate-pdf', async (req, res) => {
  let browser;
  try {
    const { url, fileName, resumeId, resumeData } = req.body;

    console.log('Détails de la requête PDF :', {
      url,
      fileName,
      resumeId,
      hasResumeData: !!resumeData
    });

    if (!url) {
      return res.status(400).json({ 
        error: 'URL manquante', 
        details: 'Aucune URL fournie pour générer le PDF' 
      });
    }

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

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Configuration des interceptions de requêtes
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      const allowedTypes = ['document', 'script', 'xhr', 'fetch', 'stylesheet', 'font', 'image'];
      
      // Si nous avons des données de CV en direct, intercepter les requêtes API
      if (resumeData && (request.url().includes('/api/pdf/preview/') || request.url().includes('/api/resume/'))) {
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ resume: resumeData })
        });
        return;
      }
      
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

    // Navigation vers l'URL avec attente complète du chargement
    try {
      await page.goto(url, { 
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
    
    // Précharger les polices
    await page.evaluate(() => {
      const fontUrls = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900',
        'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900',
        'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900',
        'https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900',
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900'
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
    });

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
          
          #resume-container {
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

    // Attendre que le conteneur du CV soit prêt
    await page.waitForSelector('#resume-container', { timeout: 15000 });
    
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
      const container = document.querySelector('#resume-container');
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
        const newContainer = document.querySelector('#resume-container');
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
        throw new Error('Element #resume-container not found in page.evaluate');
      }
    });

    // Générer le PDF avec format A4 standard et options optimisées
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

    res.contentType('application/pdf');
    res.send(pdf);

  } catch (error) {
    console.error('Erreur de génération PDF :', error);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Erreur lors de la fermeture du navigateur :', closeError);
      }
    }

    res.status(500).json({ 
      error: 'Impossible de générer le PDF', 
      details: error.message 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur Puppeteer démarré sur le port ${PORT}`);
});

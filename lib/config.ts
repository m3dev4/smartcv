// Configuration des URLs pour les environnements
export const config = {
  // URLs de production
  FRONTEND_URL: process.env.NODE_ENV === 'production' 
    ? 'https://smart-cv-sn.netlify.app' 
    : 'http://localhost:3000',
    
  PDF_SERVER_URL: process.env.NODE_ENV === 'production' 
    ? 'https://smartcv-xdm9.onrender.com' 
    : 'http://localhost:3001',
    
  // Variables d'environnement
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

// Helper functions
export const getFullUrl = (path: string) => {
  return `${config.FRONTEND_URL}${path}`;
};

export const getPdfServerUrl = (endpoint: string = '') => {
  return `${config.PDF_SERVER_URL}${endpoint}`;
};

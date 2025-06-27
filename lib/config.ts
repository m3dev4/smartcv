export function getFullUrl(path: string): string {
  // Force localhost pour le développement local
  const baseUrl = 'http://localhost:3000';
  return `${baseUrl}${path}`;
}

export function getPdfServerUrl(path: string): string {
  // Force localhost pour le développement local
  const pdfServerUrl = 'http://localhost:3001';
  return `${pdfServerUrl}${path}`;
}

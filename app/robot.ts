import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/template'],
      disallow: ['/admin', '/dashboard/resumes', '/settings'],
    },
    sitemap: 'https://smart-cv-sn.netlify.app/sitemap.xml',
    host: 'smart-cv-sn.netlify.app',
  };
}

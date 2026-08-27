import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'], // Üyeye özel veya gizli alanlar varsa buraya yazabilirsiniz
    },
    sitemap: 'https://www.wordimoakademi.com/sitemap.xml',
  };
}
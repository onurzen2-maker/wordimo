import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.wordimoacademy.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // İleride açacağımız herkese açık kelime listesi sayfalarını buraya ekleyeceğiz
  ];
}
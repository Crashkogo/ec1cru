import { MetadataRoute } from 'next';

const BASE_URL = 'https://ec-1c.ru';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Static slugs for /implementation/[slug] pages (from industriesData.ts)
const IMPLEMENTATION_SLUGS = [
  'proizvodstvo',
  'roznichnaya',
  'optovaya',
  'selskoe-hozyajstvo',
  'obshchepit',
  'zhkkh',
  'uslugi',
];

interface SlugItem {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

async function fetchSlugs(endpoint: string): Promise<SlugItem[]> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/team`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/events`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/1c-courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/ready-solutions`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/implementation`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/support`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/tech-maintenance`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/zabbix`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/1c-programs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/1c-services`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/equipment`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/otzyvy`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/life`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/promotions`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    // Static implementation industry pages
    ...IMPLEMENTATION_SLUGS.map((slug) => ({
      url: `${BASE_URL}/implementation/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const [news, events, courses, solutions, life, promotions, equipment, otzyvy] =
    await Promise.all([
      fetchSlugs('/api/posts/news?limit=1000'),
      fetchSlugs('/api/posts/events?limit=1000'),
      fetchSlugs('/api/courses?limit=1000'),
      fetchSlugs('/api/posts/ready-solutions?limit=1000'),
      fetchSlugs('/api/posts/company-life?limit=1000'),
      fetchSlugs('/api/posts/promotions?limit=1000'),
      fetchSlugs('/api/equipment?limit=1000'),
      fetchSlugs('/api/posts/testimonials?limit=1000'),
    ]);

  const dynamicPages: MetadataRoute.Sitemap = [
    ...news.map((item) => ({
      url: `${BASE_URL}/news/${item.slug}`,
      lastModified: item.updatedAt || item.createdAt || now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...events.map((item) => ({
      url: `${BASE_URL}/events/${item.slug}`,
      lastModified: item.updatedAt || item.createdAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...courses.map((item) => ({
      url: `${BASE_URL}/1c-courses/${item.slug}`,
      lastModified: item.updatedAt || item.createdAt || now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...solutions.map((item) => ({
      url: `${BASE_URL}/ready-solutions/${item.slug}`,
      lastModified: item.updatedAt || item.createdAt || now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...life.map((item) => ({
      url: `${BASE_URL}/life/${item.slug}`,
      lastModified: item.updatedAt || item.createdAt || now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...promotions.map((item) => ({
      url: `${BASE_URL}/promotions/${item.slug}`,
      lastModified: item.updatedAt || item.createdAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...equipment.map((item) => ({
      url: `${BASE_URL}/equipment/${item.slug}`,
      lastModified: item.updatedAt || item.createdAt || now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...otzyvy.map((item) => ({
      url: `${BASE_URL}/otzyvy/${item.slug}`,
      lastModified: item.updatedAt || item.createdAt || now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticPages, ...dynamicPages];
}

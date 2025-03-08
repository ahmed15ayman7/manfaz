import { MetadataRoute } from 'next'

const baseUrl = 'https://manfaz.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // يمكنك جلب البيانات الديناميكية هنا من قاعدة البيانات
  // مثل المتاجر والخدمات والفئات

  const routes = [
    '',
    '/about',
    '/services',
    '/stores',
    '/contact',
    '/blog',
    '/faq',
    '/terms',
    '/privacy',
  ]

  const staticPages = routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const serviceCategories = [
    'delivery',
    'home-services',
    'car-maintenance',
    'cleaning',
    'electrical',
    'plumbing',
    'grocery',
    'restaurants',
  ]

  const categoryPages = serviceCategories.map(category => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const cities = [
    'riyadh',
    'jeddah',
    'dammam',
    'mecca',
    'medina',
    'khobar',
    'tabuk',
    'abha',
  ]

  const cityPages = cities.map(city => ({
    url: `${baseUrl}/cities/${city}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const blogCategories = [
    'news',
    'tips',
    'guides',
    'updates',
  ]

  const blogPages = blogCategories.map(category => ({
    url: `${baseUrl}/blog/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...cityPages,
    ...blogPages,
  ]
} 
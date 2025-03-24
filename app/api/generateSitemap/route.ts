import { NextResponse } from 'next/server';
import API_ENDPOINTS from '@/lib/apis';
import axiosInstance from '@/lib/axios';

const baseUrl = 'https://www.almanafth.com';

export async function GET() {
  try {
    // جلب البيانات من API
    const [servicesRes, storesRes, citiesRes, postsRes] = await Promise.all([
      axiosInstance.get(API_ENDPOINTS.services.getAll({lang:"en"},false)),
      axiosInstance.get(API_ENDPOINTS.stores.getAll({lang:"en"},false)),
      axiosInstance.get(API_ENDPOINTS.categories.getAll({lang:"en"},false)),
      axiosInstance.get(API_ENDPOINTS.stores.getAll({lang:"en"},false)),
    ]);

    const services = await servicesRes.data.data;
    const stores = await storesRes.data.data.stores;
    const cities = await citiesRes.data.data.categories;
    const posts = await postsRes.data.data.stores;
    console.log("services", services);
    console.log("stores", stores);
    console.log("cities", cities);
    console.log("posts", posts);
    // إنشاء XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <!-- الصفحة الرئيسية -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${baseUrl}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en"/>
    <xhtml:link rel="alternate" hreflang="ur" href="${baseUrl}/ur"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/"/>
  </url>

  <!-- الصفحات الثابتة -->
  ${[
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/services', priority: 0.9, changefreq: 'weekly' },
    { url: '/stores', priority: 0.8, changefreq: 'daily' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    { url: '/blog', priority: 0.8, changefreq: 'daily' },
    { url: '/faq', priority: 0.7, changefreq: 'monthly' },
    { url: '/how-it-works', priority: 0.7, changefreq: 'monthly' },
    { url: '/become-a-provider', priority: 0.7, changefreq: 'monthly' },
    { url: '/customer-support', priority: 0.7, changefreq: 'monthly' },
  ].map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}

  <!-- الخدمات -->
  ${services.map((service: { id: string; slug: string; updatedAt: string }) => `
  <url>
    <loc>${baseUrl}/services/${service.slug}</loc>
    <lastmod>${service.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- المتاجر -->
  ${stores.map((store: { id: string; slug: string; updatedAt: string }) => `
  <url>
    <loc>${baseUrl}/stores/${store.slug}</loc>
    <lastmod>${store.updatedAt}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- المدن -->
  ${cities.map((city: { id: string; slug: string; updatedAt: string }) => `
  <url>
    <loc>${baseUrl}/categories/${city.id}</loc>
    <lastmod>${city.updatedAt}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- المقالات -->
  ${posts.map((post: { id: string; slug: string; updatedAt: string }) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
} 
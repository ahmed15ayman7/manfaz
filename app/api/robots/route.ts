import { NextResponse } from 'next/server';

const baseUrl = 'https://www.almanafth.com';

export async function GET() {
  try {
    const robotsTxt = `# *
User-agent: *
Allow: /
Allow: /services/
Allow: /stores/
Allow: /blog/
Allow: /categories/
Allow: /cities/
Allow: /about/
Allow: /contact/
Allow: /faq/
Allow: /how-it-works/
Allow: /become-a-provider/
Allow: /customer-support/

# Host
Host: ${baseUrl}

# Sitemaps
Sitemap: ${baseUrl}/api/generateSitemap
Sitemap: ${baseUrl}/ar/api/generateSitemap
Sitemap: ${baseUrl}/en/api/generateSitemap
Sitemap: ${baseUrl}/ur/api/generateSitemap

# Disallow
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /dashboard/
Disallow: /auth/
Disallow: /_next/
Disallow: /static/
Disallow: /*?*
Disallow: /*?
Disallow: /*&
Disallow: /*#
Disallow: /*/search
Disallow: /*/login
Disallow: /*/register
Disallow: /*/reset-password
Disallow: /*/verify-email

# Crawl-delay
Crawl-delay: 10`;

    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return new NextResponse('Error generating robots.txt', { status: 500 });
  }
} 
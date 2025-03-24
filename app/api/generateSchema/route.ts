import { NextResponse } from 'next/server';
import API_ENDPOINTS from '@/lib/apis';
import axiosInstance from '@/lib/axios';

const baseUrl = 'https://www.almanafth.com';

export async function GET() {
  try {
    // جلب إحصائيات الموقع من API
    const [servicesRes, storesRes, citiesRes, postsRes] = await Promise.all([
      axiosInstance.get(API_ENDPOINTS.services.getAll({lang:"ar"},false)),
      axiosInstance.get(API_ENDPOINTS.stores.getAll({lang:"ar"},false)),
      axiosInstance.get(API_ENDPOINTS.categories.getAll({lang:"ar"},false)),
      axiosInstance.get(API_ENDPOINTS.posts.getAll({lang:"ar"},false)),
    ]);

    const services = await servicesRes.data;
    const stores = await storesRes.data;
    const cities = await citiesRes.data;
    const posts = await postsRes.data;

    const servicesCount = services.data.length;
    const storesCount = stores.data.length;
    const citiesCount = cities.data.length;
    const postsCount = posts.data.length;

    // إنشاء Schema.org
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "المنفذ",
      "url": baseUrl,
      "description": "منصة خدمات المنازل الاحترافية في المملكة العربية السعودية",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "inLanguage": ["ar", "en", "ur"],
      "alternateName": ["Al Manafth", "المنفذ"],
      "sameAs": [
        "https://twitter.com/almanafth",
        "https://facebook.com/almanafth",
        "https://instagram.com/almanafth"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "SAR"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Saudi Arabia"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+966-50-000-0000",
        "contactType": "customer service",
        "areaServed": "SA",
        "availableLanguage": ["Arabic", "English", "Urdu"]
      },
      "about": {
        "@type": "Thing",
        "name": "خدمات المنازل",
        "description": "منصة خدمات المنازل الاحترافية في المملكة العربية السعودية",
        "numberOfItems": servicesCount
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1000+"
      },
      "statistics": {
        "@type": "StatisticalPopulation",
        "populationType": "خدمات",
        "numConstraints": servicesCount,
        "numStores": storesCount,
        "numCities": citiesCount,
        "numPosts": postsCount
      }
    };

    return NextResponse.json(schema);
  } catch (error) {
    console.error('Error generating schema:', error);
    return new NextResponse('Error generating schema', { status: 500 });
  }
} 
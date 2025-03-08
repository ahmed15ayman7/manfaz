import { Metadata } from 'next'

const defaultKeywords = [
  'منفذ',
  'خدمات توصيل',
  'خدمات منزلية',
  'صيانة سيارات',
  'سباكة',
  'كهرباء',
  'توصيل طلبات',
  'متاجر',
  'مواد غذائية',
  'خدمات مهنية',
  'صيانة منزلية',
  'خدمات في السعودية',
  'تطبيق توصيل',
  'حجز فني',
  'طلب خدمة',
  'delivery services',
  'home services',
  'car maintenance',
  'plumbing',
  'electrical services',
  'food delivery',
  'grocery stores',
  'professional services',
  'home maintenance',
  'Saudi Arabia services'
]

const defaultDescription = `منفذ - المنصة الرائدة في المملكة العربية السعودية للخدمات المتكاملة. نوفر خدمات التوصيل، الصيانة المنزلية، صيانة السيارات، والمتاجر. اطلب خدمتك الآن بكل سهولة وأمان.`

export const defaultMetadata: Metadata = {
  title: {
    default: 'منفذ - منصة الخدمات المتكاملة في السعودية',
    template: '%s | منفذ'
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: 'منفذ', url: 'https://almanafth.com' }],
  creator: 'منفذ',
  publisher: 'منفذ',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: ['en_US', 'ur_PK'],
    url: 'https://manfaz.com',
    siteName: 'منفذ',
    title: 'منفذ - منصة الخدمات المتكاملة في السعودية',
    description: defaultDescription,
    images: [
      {
        url: 'https://manfaz.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'منفذ - منصة الخدمات المتكاملة',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'منفذ - منصة الخدمات المتكاملة في السعودية',
    description: defaultDescription,
    creator: '@manfaz',
    creatorId: '1467726470533754880',
    images: ['https://manfaz.com/twitter-image.jpg'],
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_ID',
    yandex: 'YOUR_YANDEX_VERIFICATION_ID',
    yahoo: 'YOUR_YAHOO_VERIFICATION_ID',
  },
  category: 'services',
  classification: 'business',
  metadataBase: new URL('https://manfaz.com'),
}

export const generateMetadata = ({ 
  title,
  description,
  keywords = [],
  images = [],
  noIndex = false
}: {
  title?: string
  description?: string
  keywords?: string[]
  images?: string[]
  noIndex?: boolean
}) => {
  return {
    ...defaultMetadata,
    title: title,
    description: description || defaultMetadata.description,
    keywords: [...defaultKeywords, ...keywords],
    robots: noIndex ? {
      index: false,
      follow: false,
    } : defaultMetadata.robots,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title,
      description: description || defaultMetadata.description,
      images: images.length > 0 ? images.map(url => ({
        url,
        width: 1200,
        height: 630,
        alt: title,
      })) : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title,
      description: description || defaultMetadata.description,
      images: images.length > 0 ? images : defaultMetadata.twitter?.images,
    },
  }
} 
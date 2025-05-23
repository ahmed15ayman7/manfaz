"use client"
import "./globals.css";
import LocaleProvider from "@/components/providers/IntlProvider";
import useStore from '@/store/useLanguageStore';
import { ToastContainer } from 'react-toastify';
import { SnackbarProvider } from '@/hooks/useSnackbar';
import Script from 'next/script';

import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from '@/components/providers/SocketProvider';
import { Toaster, toast } from 'sonner';
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, isClient } = useStore();

  useEffect(() => {
    document.documentElement.dir = locale === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = locale;
  }, [locale]);

  // Only render content when we're sure we're on the client
  const content = isClient ? (
    <>
      <SessionProvider>
        <SocketProvider>
          <SnackbarProvider>
            <LocaleProvider>
              {children}
              <LanguageToggle />
            </LocaleProvider>
          </SnackbarProvider>
        </SocketProvider>
      </SessionProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Toaster
        position={locale === 'en' ? 'top-right' : 'top-right'}
        dir={locale === 'en' ? 'ltr' : 'rtl'}
        richColors
        closeButton
      />
    </>
  ) : null;

  return (
    <html suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'startTime':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N8D9652V');
          `}
        </Script>
        {/* <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N8D9652V"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
          <div style={{ display: 'none' }}>
            <img src="https://www.googletagmanager.com/ns.html?id=GTM-N8D9652V" alt="" />
          </div>
        </noscript> */}
        {/* End Google Tag Manager */}

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-9L0JCKTEEG" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9L0JCKTEEG', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9L0JCKTEEG"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-9L0JCKTEEG');
      `,
          }}
        />

        <title>{locale === 'en' ? "Al Manafth - Professional Home Services Platform" : locale === 'ur' ? "المنفذ - پلیٹ فارم برائے پیشہ ورانہ گھریلو خدمات" : "المنفذ - منصة خدمات المنازل الاحترافية"}</title>
        <meta name="description" content={locale === 'en' ? "Al Manafth is your trusted platform for professional home services. Connect with verified service providers for plumbing, electrical, cleaning, and more." : locale === 'ur' ? "المنفذ آپ کا معتبر پلیٹ فارم ہے جو پیشہ ورانہ گھریلو خدمات فراہم کرتا ہے. سباكة، برقی، صفائی اور مزید خدمات کے لیے تصدیق شدہ سروس فراہم کرنے والوں سے رابطہ کریں." : "المنفذ هي منصتك الموثوقة للخدمات المنزلية الاحترافية. تواصل مع مزودي الخدمات المعتمدين للسباكة والكهرباء والتنظيف والمزيد."} />
        <meta name="keywords" content={locale === 'en' ? "home services, professional services, plumbing, electrical, cleaning, maintenance, Saudi Arabia" : locale === 'ur' ? "گھریلو خدمات, پیشہ ورانہ خدمات, سباكة, برقی, صفائی, دیکھ بھال, سعودی عرب" : "خدمات المنازل، خدمات احترافية، سباكة، كهرباء، تنظيف، صيانة، المملكة العربية السعودية"} />
        <meta name="language" content={locale} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={locale === 'en' ? "Al Manafth - Professional Home Services Platform" : "المنفذ - منصة خدمات المنازل الاحترافية"} />
        <meta property="og:description" content={locale === 'en' ? "Al Manafth is your trusted platform for professional home services. Connect with verified service providers for plumbing, electrical, cleaning, and more." : "المنفذ هي منصتك الموثوقة للخدمات المنزلية الاحترافية. تواصل مع مزودي الخدمات المعتمدين للسباكة والكهرباء والتنظيف والمزيد."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.almanafth.com" />
        <meta property="og:image" content="https://www.almanafth.com/og-image.jpg" />
        <meta property="og:site_name" content="Al Manafth" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={locale === 'en' ? "Al Manafth - Professional Home Services Platform" : "المنفذ - منصة خدمات المنازل الاحترافية"} />
        <meta name="twitter:description" content={locale === 'en' ? "Al Manafth is your trusted platform for professional home services. Connect with verified service providers for plumbing, electrical, cleaning, and more." : "المنفذ هي منصتك الموثوقة للخدمات المنزلية الاحترافية. تواصل مع مزودي الخدمات المعتمدين للسباكة والكهرباء والتنظيف والمزيد."} />
        <meta name="twitter:image" content="https://www.almanafth.com/twitter-image.jpg" />
        <link rel="canonical" href="https://www.almanafth.com" />
        <link rel="alternate" href="https://www.almanafth.com" hrefLang="ar" />
        <link rel="alternate" href="https://www.almanafth.com/en" hrefLang="en" />
        <link rel="alternate" href="https://www.almanafth.com/ur" hrefLang="ur" />
        <link rel="alternate" href="https://www.almanafth.com" hrefLang="x-default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="5_m7GHPgvw_t1tOVkandnhYaqt5FVEBl8_faVIxqi4c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Al Manafth" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      </head>
      <body className="antialiased">
        {content}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N8D9652V"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}

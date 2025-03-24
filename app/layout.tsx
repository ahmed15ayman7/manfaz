"use client"
import "./globals.css";
import LocaleProvider from "@/components/providers/IntlProvider";
import useStore from '@/store/useLanguageStore';
import { ToastContainer } from 'react-toastify';
import { SnackbarProvider } from '@/hooks/useSnackbar';

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
        <meta name="google-site-verification" content="google62bbac5407f85471" />
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
      </body>
    </html>
  );
}

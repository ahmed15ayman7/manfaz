"use client"
import "./globals.css";
import LocaleProvider from "@/components/providers/IntlProvider";
import useStore from '@/store/useLanguageStore';
import { ToastContainer } from 'react-toastify';
import { SnackbarProvider } from '@/hooks/useSnackbar';

import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from '@/components/providers/SocketProvider';
import { Toaster } from 'sonner';
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
      <ToastContainer/>
      <Toaster
        position={locale === 'en' ? 'bottom-right' : 'bottom-left'}
        dir={locale === 'en' ? 'ltr' : 'rtl'}
        richColors
        closeButton
      />
    </>
  ) : null;

  return (
    <html suppressHydrationWarning>
      <head>
        <title>{locale === 'en' ? "Manfaz - Home Services Connection Platform" : locale === 'ur' ? "منفز - گھر کی خدمات کا پلیٹ فارم" : "منفز - منصة ربط خدمات المنازل"}</title>
        <meta name="description" content={locale === 'en' ? "Manfaz is an innovative digital platform designed to connect customers with home service providers." : locale === 'ur' ? "منصہ منفز ایک جدید ڈیجیٹل پلیٹ فارم ہے جو صارفین کو گھریلو خدمات فراہم کرنے والوں سے جوڑتا ہے." : "منصة منفز الرقمية تهدف إلى ربط العملاء بمقدمي خدمات المنازل."} />
        <meta name="keywords" content={locale === 'en' ? "home services, plumbing, carpentry" : locale === 'ur' ? "گھریلو خدمات, پلمبنگ, لکڑی کا کام" : "خدمات المنازل, سباكة, نجارة"} />
        <meta name="language" content={locale} />
        <meta name="robots" content="index, follow" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={locale === 'en' ? "Manfaz - Home Services Connection Platform" : "منفز - منصة ربط خدمات المنازل"} />
        <meta property="og:description" content={locale === 'en' ? "Manfaz is an innovative digital platform designed to connect customers with home service providers." : "منصة منفز الرقمية تهدف إلى ربط العملاء بمقدمي خدمات المنازل."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:image" content="https://yourwebsite.com/image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={locale === 'en' ? "Manfaz - Home Services Connection Platform" : "منفز - منصة ربط خدمات المنازل"} />
        <meta name="twitter:description" content={locale === 'en' ? "Manfaz is an innovative digital platform designed to connect customers with home service providers." : "منصة منفز الرقمية تهدف إلى ربط العملاء بمقدمي خدمات المنازل."} />
        <meta name="twitter:image" content="https://yourwebsite.com/image.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {content}
      </body>
    </html>
  );
}

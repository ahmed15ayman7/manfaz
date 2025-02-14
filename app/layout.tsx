"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LocaleProvider from "@/components/providers/IntlProvider";
import  useStore  from '@/store/useLanguageStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
let { locale } =  useStore();
  return (
      <html lang={locale}>
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
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com"  />
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        dir={locale === 'en' ? 'ltr' : 'rtl'}
      >

        <LocaleProvider>
          {children}
        </LocaleProvider>
        <ToastContainer />
      </body>
    </html>
  );
}

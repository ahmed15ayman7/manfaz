"use client"
import "./globals.css";
import { Inter } from "next/font/google";
import { SocketProvider } from "@/contexts/SocketContext";
import {SnackbarProvider} from "@/hooks/useSnackbar"
import  LocaleProvider  from "@/components/providers/IntlProvider";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>منفز - منصة ربط خدمات المنازل</title>
        <meta name="description" content="منصة منفز الرقمية تهدف إلى ربط العملاء بمقدمي خدمات المنازل." />
        <meta name="keywords" content="خدمات المنازل, سباكة, نجارة" />
        <meta name="language" content="ar" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="منفز - منصة ربط خدمات المنازل" />
        <meta property="og:description" content="منصة منفز الرقمية تهدف إلى ربط العملاء بمقدمي خدمات المنازل." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:image" content="https://yourwebsite.com/image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="منفز - منصة ربط خدمات المنازل" />
        <meta name="twitter:description" content="منصة منفز الرقمية تهدف إلى ربط العملاء بمقدمي خدمات المنازل." />
        <meta name="twitter:image" content="https://yourwebsite.com/image.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <SocketProvider>
            <SnackbarProvider>

            <LocaleProvider>
            
                {children}
                <LanguageToggle />
                <ToastContainer />
                <Toaster position="bottom-right" richColors closeButton />
           
            </LocaleProvider>
            </SnackbarProvider>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

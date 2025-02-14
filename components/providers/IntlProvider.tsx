"use client"
import React, { ReactNode } from 'react';
import { IntlProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useStore from '@/store/useLanguageStore';
const messages = {
    en: require('@/messages/en.json'),
    ar: require('@/messages/ar.json'),
    ur: require('@/messages/ur.json'),
  };
  interface LayoutProps {
    children: ReactNode;
  }
const LocaleProvider = ({ children }:LayoutProps) => {
  const { locale } = useStore();
  const queryClient = new QueryClient();
  return(
    //@ts-ignore
    <IntlProvider messages={messages[locale]} locale={locale}>
      <QueryClientProvider client={queryClient}>
      {children}
      </QueryClientProvider>
    </IntlProvider>
  );
};

export default LocaleProvider;
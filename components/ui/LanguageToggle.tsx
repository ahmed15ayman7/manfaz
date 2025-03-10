"use client";

import React, { useState } from 'react';
import useLanguageStore from '@/store/useLanguageStore';
import { useTranslations } from 'next-intl';

const LanguageToggle: React.FC = () => {
  const { locale, setLocale } = useLanguageStore();
  const t = useTranslations('');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '/imgs/en.svg' },
    { code: 'ar', label: 'العربية', flag: '/imgs/ar.svg' },
    { code: 'ur', label: 'اردو', flag: '/imgs/urdu.svg' },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lang: string) => {
    setLocale(lang);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-10 w-12 h-10 right-10 z-50 inline-block text-left" >
      <div className="w-full h-full">
        <button onClick={toggleDropdown} className=" text-center w-full h-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          <img src={languages.find(lang => lang.code === locale)?.flag} alt={languages.find(lang => lang.code === locale)?.label} className=" w-full h-full" />
        </button>
      </div>

      {isOpen && (
        <div className={`absolute ${locale === 'ar' ? 'left-0' : 'right-0'} z-10  w-32 max-sm:w-12 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out -translate-y-[120%] -translate-x-1/2  max-sm:translate-x-0 top-0`}>
          <div className="py-1 flex flex-col gap-1 items-center" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="flex gap-3 items-center w-full px-4 py-2 max-sm:px-1 max-sm:py-1 max-sm:justify-center text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <img src={lang.flag} alt={lang.label} className="max-sm:m-0 mr-2 w-6 h-6" />
                <span className={`max-sm:hidden`}>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
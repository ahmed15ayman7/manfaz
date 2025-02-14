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
    <div className="relative inline-block text-left">
      <div>
        <button onClick={toggleDropdown} className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          {/* {languages.find(lang => lang.code === locale)?.label} */}
          <img src={languages.find(lang => lang.code === locale)?.flag} alt={languages.find(lang => lang.code === locale)?.label} className="mr-2 w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <img src={lang.flag} alt={lang.label} className="mr-2 w-5 h-5" />
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
import { create } from 'zustand';

interface LanguageState {
  locale: string;
  setLocale: (locale: string) => void;
}

const useLanguageStore = create<LanguageState>((set) => {
  // Get the locale from localStorage or default to 'en'
  const initialLocale = localStorage.getItem('locale') || 'en';

  return {
    locale: initialLocale,
    setLocale: (locale) => {
      set({ locale });
      if (typeof window !== 'undefined') { 
      localStorage.setItem('locale', locale);
    } // Set the locale in localStorage
    },
  };
});

export default useLanguageStore;

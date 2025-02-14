import { create } from 'zustand';

interface LanguageState {
  locale: string;
  setLocale: (locale: string) => void;
}

const useLanguageStore = create<LanguageState>((set) => {
  // Get the locale from localStorage or default to 'en'
  const initialLocale = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en';

  return {
    locale: initialLocale,
    setLocale: (locale) => {
      set({ locale });
      if (typeof window !== 'undefined') { 
        localStorage.setItem('locale', locale);
      } 
    },
  };
});

export default useLanguageStore;

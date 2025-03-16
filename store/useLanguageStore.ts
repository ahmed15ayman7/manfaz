import { create } from 'zustand';
import Cookies from 'js-cookie';

interface LanguageState {
  locale: string;
  setLocale: (locale: string) => void;
}

const useLanguageStore = create<LanguageState>((set) => ({
  locale: Cookies.get('locale') || 'en',
  setLocale: (locale) => {
    set({ locale });
    Cookies.set('locale', locale, { expires: 365 });
    document.documentElement.dir = locale === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = locale;
  },
}));

export default useLanguageStore;

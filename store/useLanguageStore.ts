import { create } from 'zustand';
import Cookies from 'js-cookie';

interface LanguageState {
  locale: string;
  setLocale: (locale: string) => void;
  isClient: boolean;
}

const getDefaultLocale = () => {
  if (typeof window === 'undefined') return 'en';
  return Cookies.get('locale') || 'en';
};

const useLanguageStore = create<LanguageState>((set) => ({
  locale: getDefaultLocale(),
  isClient: false,
  setLocale: (locale) => {
    set({ locale });
    if (typeof window !== 'undefined') {
      Cookies.set('locale', locale, { expires: 365 });
      document.documentElement.dir = locale === 'en' ? 'ltr' : 'rtl';
      document.documentElement.lang = locale;
    }
  },
}));

// Initialize client state
if (typeof window !== 'undefined') {
  useLanguageStore.setState({ isClient: true });
}

export default useLanguageStore;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'ar', // Default language
    fallbackLng: 'en',
    resources: {
      en: en,
      ar: ar,
    },
    interpolation: {
      escapeValue: false // React already safes from xss
    }
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi) // Loads translations from your server
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    supportedLngs: ['en', 'hi'], // Add all supported languages here
    fallbackLng: 'en', // Default language if detection fails
    debug: true, // Set to false in production
    
    // Options for language detector
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },

    // Where to find translation files
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
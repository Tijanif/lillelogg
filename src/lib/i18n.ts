import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend) // Used to load translations from your public/locales folder
    .use(LanguageDetector) // Detects user language
    .use(initReactI18next) // Passes i18n instance to react-i18next

    .init({
        fallbackLng: 'en', // Fallback language if detected language is not available
        debug: true, // Enable debug logs (useful during development)

        // Configuration for i18next-http-backend
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to your translation files
            // {{lng}} will be replaced by 'en' or 'no'
            // {{ns}} will be replaced by 'common'
        },

        // Configuration for namespaces
        ns: ['common'], // List of all namespaces (your common.json is a namespace)
        defaultNS: 'common', // Default namespace to use if not specified in t() calls

        // Configuration for language detection
        detection: {
            order: ['path', 'cookie', 'htmlTag', 'localStorage', 'sessionStorage', 'navigator'],
            caches: ['cookie'], // Cache detected language in a cookie
        },

        // React specific options
        react: {
            useSuspense: false, // Set to true if you are using React.Suspense for data fetching
        },

        // Important for React, as React already escapes strings by default
        // Prevents double-escaping issues
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
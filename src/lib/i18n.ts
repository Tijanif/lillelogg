import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

if (typeof window !== 'undefined') {
    i18n
        .use(Backend)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            debug: true,
            supportedLngs: ['en', 'no'],
            fallbackLng: 'en',
            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json',
            },
            ns: ['common'],
            defaultNS: 'common',
            detection: {
                order: ['path', 'cookie', 'htmlTag'],
                caches: ['cookie'],
            },
            react: {
                useSuspense: false,
            },
            interpolation: {
                escapeValue: false,
            },
        });
}

export default i18n;
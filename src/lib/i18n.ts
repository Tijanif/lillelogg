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
            ns: ['common', 'analytics'],
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
                format: (value, formatName, lng) => {
                    if (formatName === 'numberWithOneDecimal' && typeof value === 'number') {
                        return new Intl.NumberFormat(lng, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                        }).format(value);
                    }
                    if (formatName === 'numberWithTwoDecimals' && typeof value === 'number') {
                        return new Intl.NumberFormat(lng, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(value);
                    }
                    return value;
                },
            },
        });
}

export default i18n;
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';



const locales = ['en', 'no'];
const defaultNS = 'common';

export async function createTranslation(locale: string, ns: string | string[] = defaultNS) {
    const i18nInstance = createInstance();
    await i18nInstance
        .use(initReactI18next)
        .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
        .init({
            lng: locale,
            fallbackLng: 'en',
            supportedLngs: locales,
            ns: ns,
            defaultNS: defaultNS,
            debug: false,
            react: {
                useSuspense: false,
            },
        });

    return {
        t: i18nInstance.getFixedT(locale, ns, defaultNS),
        i18n: i18nInstance,
    };
}


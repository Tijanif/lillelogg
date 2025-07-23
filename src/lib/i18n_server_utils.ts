import fs from 'fs';
import path from 'path';
import { createInstance } from 'i18next';

const locales = ['en', 'no'];
const defaultNS = 'common';

export async function createTranslation(locale: string, ns: string | string[] = defaultNS) {
    const i18nInstance = createInstance();
    const namespaces = Array.isArray(ns) ? ns : [ns];

    const resources: Record<string, any> = { [locale]: {} };

    for (const namespace of namespaces) {
        const filePath = path.join(process.cwd(), `public/locales/${locale}/${namespace}.json`);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        resources[locale][namespace] = JSON.parse(fileContent);
    }

    await i18nInstance.init({
        lng: locale,
        fallbackLng: 'en',
        supportedLngs: locales,
        ns: namespaces,
        defaultNS,
        resources,
        interpolation: {
            escapeValue: false,
        },
    });

    return {
        t: i18nInstance.getFixedT(locale, namespaces),
    };
}

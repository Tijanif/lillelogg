import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";

interface LocaleLayoutProps {
    children: ReactNode;
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({params}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: `Lillelogg - ${lang === 'no' ? 'Baby Dagbok' : 'Baby Tracker'}`,
        description: "The little log for your big emotional journey.",
    };
}

export default async function LocaleLayout({children, params,}: LocaleLayoutProps) {
    const { lang } = await params;
    return (
        <AppLayout locale={lang}>
            {children}
        </AppLayout>
    );
}
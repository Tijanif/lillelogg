'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FaRegStar, FaChartLine, FaUsers } from 'react-icons/fa';


export default function LandingPage() {
    const { t } = useTranslation('common');

    return (
        <div className="bg-light-background min-h-screen text-dark-text">
            {/* Header */}
            <header className="border-b border-border-light shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href={`/${t('common:locale')}`} className="flex items-center group"> {/* Link logo to home */}
                            <img
                                src="/images/lillelogg_logo.svg"
                                alt={t('appTitle')}
                                className="h-8 mr-2 group-hover:scale-105 transition-transform duration-200"
                            />
                            <h1 className="text-xl font-bold text-dark-text group-hover:text-primary-blue transition-colors">
                                {t('appTitle')}
                            </h1>
                        </Link>
                        <div className="flex space-x-4">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                            >
                                <Link href={`/${t('common:locale')}/signin`}>
                                    {t('buttons.login')}
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="primary"
                                size="sm"
                            >
                                <Link href={`/${t('common:locale')}/signup`}>
                                    {t('buttons.signup')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-text mb-6 leading-tight"> {/* Larger text, tighter line height */}
                                {t('landingPage.heroHeadline')}
                            </h2>
                            <p className="text-lg text-muted-text mb-2">
                                {t('landingPage.heroSubHeadline1')}
                            </p>
                            <p className="text-lg text-muted-text mb-8">
                                {t('landingPage.heroSubHeadline2')}
                            </p>
                            <Button
                                asChild
                                variant="primary"
                                size="xl"
                                className="mt-4"
                            >
                                <Link href={`/${t('common:locale')}/signup`}>
                                    {t('landingPage.getStartedButton')}
                                </Link>
                            </Button>
                        </div>
                        <div className="relative flex justify-center md:justify-end">
                            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-xl bg-card-background border border-border-light p-2 sm:p-4"> {/* Minimalistic device frame */}
                                <img
                                    src="/images/lillelogg_app_homepreview.webp"
                                    alt={t('landingPage.appPreviewAlt')}
                                    className="w-full h-auto object-contain rounded-2xl border border-border-light"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="bg-card-background py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-dark-text text-center mb-12">
                            {t('landingPage.featuresHeadline')}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-card-background p-6 rounded-2xl shadow-sm text-center border border-border-light">
                                <div className="w-16 h-16 bg-secondary-pink rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaRegStar className="text-3xl text-dark-text" />
                                </div>
                                <h3 className="text-xl font-medium text-dark-text mb-2">
                                    {t('landingPage.feature1Title')}
                                </h3>
                                <p className="text-muted-text text-base">
                                    {t('landingPage.feature1Description')}
                                </p>
                            </div>
                            <div className="bg-card-background p-6 rounded-2xl shadow-sm text-center border border-border-light">
                                <div className="w-16 h-16 bg-secondary-blue-accent rounded-full flex items-center justify-center mx-auto mb-4"> //
                                    <FaChartLine className="text-3xl text-dark-text" />
                                </div>
                                <h3 className="text-xl font-medium text-dark-text mb-2">
                                    {t('landingPage.feature2Title')}
                                </h3>
                                <p className="text-muted-text text-base">
                                    {t('landingPage.feature2Description')}
                                </p>
                            </div>
                            <div className="bg-card-background p-6 rounded-2xl shadow-sm text-center border border-border-light">
                                <div className="w-16 h-16 bg-secondary-blue-accent rounded-full flex items-center justify-center mx-auto mb-4"> //
                                    <FaUsers className="text-3xl text-dark-text" />
                                </div>
                                <h3 className="text-xl font-medium text-dark-text mb-2">
                                    {t('landingPage.feature3Title')}
                                </h3>
                                <p className="text-muted-text text-base">
                                    {t('landingPage.feature3Description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-card-background border-t border-border-light py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <img
                                src="/images/lillelogg_logo.svg"
                                alt={t('appTitle')}
                                className="h-6 mr-2"
                            />
                            <span className="text-muted-text text-sm">
                                © {new Date().getFullYear()} {t('appTitle')}
                            </span>
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <Link href={`/${t('common:locale')}/privacy`} className="text-muted-text hover:text-dark-text transition-colors">
                                {t('footer.privacy')}
                            </Link>
                            <Link href={`/${t('common:locale')}/terms`} className="text-muted-text hover:text-dark-text transition-colors">
                                {t('footer.terms')}
                            </Link>
                            <Link href={`/${t('common:locale')}/support`} className="text-muted-text hover:text-dark-text transition-colors">
                                {t('footer.support')}
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
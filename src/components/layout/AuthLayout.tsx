'use client';

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

import { SidebarNav } from './SidebarNav';
import { BottomNavBar } from './BottomNavBar';

interface AuthLayoutProps {
    children: ReactNode;
    lang: string;
}

export default function AuthLayout({ children, lang }: AuthLayoutProps) {
    const { t } = useTranslation('common');
    const pathname = usePathname();

    const navItems = [
        { href: `/${lang}/dashboard`, label: t('nav.dashboard'), icon: 'FaHome' }, // Placeholder icons
        { href: `/${lang}/log`, label: t('nav.logActivity'), icon: 'FaPencilAlt' },
        { href: `/${lang}/milestones`, label: t('nav.milestones'), icon: 'FaStar' },
        { href: `/${lang}/routines`, label: t('nav.routines'), icon: 'FaCalendarAlt' },
        { href: `/${lang}/insights`, label: t('nav.insights'), icon: 'FaChartLine' },
        { href: `/${lang}/settings`, label: t('nav.settings'), icon: 'FaCog' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-light-background">
            {/* Desktop Sidebar Navigation */}
            <SidebarNav navItems={navItems} pathname={pathname} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col md:ml-64 pb-16 md:pb-0">
                {/* Header (optional, can be integrated here or in specific pages) */}
                <header className="p-4 bg-card-background border-b border-border-light md:hidden"> {/* Only visible on mobile */}
                    <h1 className="text-xl font-bold text-dark-text">{t('appTitle')}</h1>
                    {/* More complex header (baby selector etc.) will come later */}
                </header>

                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <BottomNavBar navItems={navItems} pathname={pathname} />
        </div>
    );
}
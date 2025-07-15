'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import {Button} from "@/components/ui/Button";
import { signOut } from 'next-auth/react';


interface NavItem {
    href: string;
    label: string;
    icon: string;
}

interface SidebarNavProps {
    navItems: NavItem[];
    pathname: string;
}

export function SidebarNav({ navItems, pathname }: SidebarNavProps) {
    const { t } = useTranslation('common');

    const getIcon = (iconName: string): IconType | null => {
        // @ts-ignore - This is a safe dynamic import pattern for React Icons
        if (FaIcons[iconName]) return FaIcons[iconName] as IconType;
        return null;
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-card-background p-4 hidden md:flex flex-col border-r border-border-light shadow-md">
            {/* App Logo/Title at the top of the sidebar */}
            <div className="flex items-center justify-center h-16 mb-8 mt-4">
                <img src="/images/lillelogg_logo.svg" alt={t('appTitle')} className="h-10 mr-2" />
                <span className="text-2xl font-bold text-dark-text">{t('appTitle')}</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const IconComponent = getIcon(item.icon);
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className={`
                            flex items-center p-3 rounded-lg text-dark-text font-medium transition-colors
                            ${isActive ? 'bg-primary-blue text-white shadow-sm' : 'hover:bg-border-light'}
                        `}>
                            {IconComponent && <IconComponent className={`text-xl mr-3 ${isActive ? 'text-white' : 'text-primary-blue'}`} />}
                            <span className={isActive ? 'text-white' : 'text-dark-text'}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button (or user info later) at the bottom of the sidebar */}
            <div className="mt-auto pt-4 border-t border-border-light">
                <Button
                    onClick={() => signOut({ callbackUrl: `/${t('common:locale')}/` })}
                    variant="ghost"
                    fullWidth
                    className="flex items-center justify-start text-dark-text"
                    size="md"
                >
                    <FaIcons.FaSignOutAlt className="text-xl mr-3 text-muted-text" />
                    <span>{t('buttons.logout')}</span>
                </Button>
            </div>
        </aside>
    );
}
'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import * as FaIcons from 'react-icons/fa';

interface NavItem {
    href: string;
    label: string;
    icon: string;
}

interface BottomNavBarProps {
    navItems: NavItem[];
    pathname: string;
}

export function BottomNavBar({ navItems, pathname }: BottomNavBarProps) {
    const { t } = useTranslation('common');

    const getIcon = (iconName: string): IconType | null => {
        // @ts-ignore
        if (FaIcons[iconName]) return FaIcons[iconName] as IconType;
        return null;
    };

    const mobileNavItems = navItems.filter(item => ['FaHome', 'FaPencilAlt', 'FaStar', 'FaCog'].includes(item.icon));
    // We might want to explicitly define a subset of icons for mobile for simplicity.
    // For now, filtering to common ones. We can adjust this list.


    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card-background border-t border-border-light shadow-lg md:hidden">
            <div className="flex justify-around items-center h-16 px-2">
                {mobileNavItems.map((item) => {
                    const IconComponent = getIcon(item.icon);
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className={`
                            flex flex-col items-center justify-center text-center text-xs font-medium w-full h-full
                            ${isActive ? 'text-primary-blue' : 'text-muted-text'}
                            transition-colors
                        `}>
                            {IconComponent && <IconComponent className={`text-xl mb-1 ${isActive ? 'text-primary-blue' : 'text-dark-text'}`} />}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
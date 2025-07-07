// src/app/layout.tsx (The new, minimal root layout)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Assuming Inter is chosen or remove if not needed
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: "Lillelogg - Baby Tracker", // Generic title
    description: "The little log for your big emotional journey.",
    // Add PWA manifest link here later: <link rel="manifest" href="/manifest.json" />
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html lang="en" className={inter.variable}>
        <body>
        {children}
        </body>
        </html>
    );
}
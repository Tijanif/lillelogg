import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

interface MainLayoutProps {
    children: ReactNode;
    params: { lang: string };
}

export default async function MainLayout({ children, params }: MainLayoutProps) {
    const { lang } =  await params;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        throw redirect(`/${lang}/signin?callbackUrl=/${lang}/dashboard`);
    }

    return (
        <>
            {/*
                TODO (Story 7.2): Replace this div with your AuthLayout component
                which will contain the responsive sidebar/bottom navigation.
            */}
            <div className="flex min-h-screen">
                <aside className="w-64 bg-card-background p-4 hidden md:block border-r border-border-light">
                    <h2 className="text-xl font-bold mb-4 text-dark-text">Sidebar Nav Placeholder</h2>
                    <ul className="space-y-2">
                        <li><a href={`/${lang}/dashboard`} className="text-primary-blue hover:underline">Dashboard</a></li>
                        <li><a href="#" className="text-primary-blue hover:underline">Log Activity (Future)</a></li>
                    </ul>
                </aside>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </>
    );
}
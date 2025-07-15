import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AuthLayout from "@/components/layout/AuthLayout";

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
            <AuthLayout lang={lang}>
                {children}
            </AuthLayout>
        </>
    );
}
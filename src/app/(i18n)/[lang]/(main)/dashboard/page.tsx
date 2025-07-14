import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import DashboardContent from './dashboard-content';

interface DashboardPageProps {
    params: { lang: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
    const { lang } = params;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Redundancy for robustness: Authentication check (MainLayout also does this)
    if (!userId) {
        throw redirect(`/${lang}/signin?callbackUrl=/${lang}/dashboard`);
    }

    const babyCount = await prisma.baby.count({
        where: { userId: userId },
    });

    if (babyCount === 0) {
        throw redirect(`/${lang}/onboarding/baby`);
    }

    return <DashboardContent session={session} lang={lang} />;
}
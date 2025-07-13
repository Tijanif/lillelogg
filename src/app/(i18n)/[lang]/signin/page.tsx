'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await signIn('credentials', {
            redirect: false,
            username: email,
            password: password,
            callbackUrl: new URLSearchParams(window.location.search).get('callbackUrl') || `/${t('common:locale')}/dashboard`,
        });

        setIsLoading(false);

        if (result?.error) {

            console.error("Sign in error:", result.error);
            setError(t(`auth.errors.${result.error}`) || t('auth.errors.default'));
        } else if (result?.ok) {
            router.push(result.url || `/${t('common:locale')}/dashboard`);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-light-background text-dark-text">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-border-light">
                <h1 className="text-3xl font-bold text-dark-text text-center mb-6">
                    {t('buttons.login')}
                </h1>

                {error && (
                    <div className="bg-error text-white p-3 rounded-md mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('inputs.emailLabel')}
                        placeholder={t('inputs.emailPlaceholder')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label={t('inputs.passwordLabel')}
                        placeholder={t('inputs.passwordPlaceholder')}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        isLoading={isLoading}
                    >
                        {t('buttons.login')}
                    </Button>
                </form>

                <div className="mt-6 text-center text-muted-text">
                    {t('auth.noAccountYet')} <Link href={`/${t('common:locale')}/signup`} className="text-primary-blue hover:underline">
                    {t('buttons.signup')}
                </Link>
                </div>

                {/* Example Google Sign-in button */}
                <div className="mt-6 border-t border-border-light pt-6">
                    <Button
                        asChild
                        fullWidth
                        size="lg"
                        variant="secondary-outline"
                        onClick={() => signIn('google', { callbackUrl: `/${t('common:locale')}/dashboard` })}
                        className="flex items-center justify-center"
                    >
                        {/* Google icon here */}
                        {t('auth.signInWithGoogle')}
                    </Button>
                </div>
            </div>
        </main>
    );
}
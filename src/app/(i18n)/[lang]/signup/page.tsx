'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {signIn} from "next-auth/react";
import {FaGoogle} from "react-icons/fa";

export default function SignUpPage() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError(t('auth.errors.passwordsMismatch'));
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    setError(t('auth.errors.userExists'));
                } else if (response.status === 400 && data.errors && data.errors.length > 0) {
                    setError(data.errors.map((err: any) => err.message).join('. ') + '.');
                } else {
                    setError(data.message || t('auth.errors.default'));
                }
            } else {
                setSuccessMessage(t('auth.registrationSuccess'));
                    router.push(`/${t('common:locale')}/signin`);
            }
        } catch (err) {
            console.error("Sign up fetch error:", err);
            setError(t('auth.errors.networkError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-light-background text-dark-text">
            <div className="bg-card-background p-8 rounded-2xl shadow-xl max-w-md w-full border border-border-light">
                <h1 className="text-3xl font-bold text-dark-text text-center mb-6">
                    {t('buttons.signup')}
                </h1>

                {error && (
                    <div className="bg-error text-white p-3 rounded-md mb-4 text-center">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-success text-white p-3 rounded-md mb-4 text-center">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('inputs.nameLabel')}
                        placeholder={t('inputs.namePlaceholder')}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                    <Input
                        label={t('inputs.confirmPasswordLabel')}
                        placeholder={t('inputs.confirmPasswordPlaceholder')}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        isLoading={isLoading}
                    >
                        {t('buttons.signup')}
                    </Button>
                </form>

                <div className="mt-6 text-center text-muted-text">
                    {t('auth.alreadyHaveAccount')} <Link href={`/${t('common:locale')}/signin`} className="text-primary-blue hover:underline">
                    {t('buttons.login')}
                </Link>
                </div>
                <div className="mt-6 border-t border-border-light pt-6">
                    <Button
                        fullWidth
                        size="lg"
                        variant="secondary-outline"
                        onClick={() => signIn('google', { callbackUrl: `/${t('common:locale')}/dashboard` })}
                        className="flex items-center justify-center"
                    >
                        <FaGoogle className="mr-2  text-xl"/>
                        {t('auth.signInWithGoogle')}
                    </Button>
                </div>
            </div>
        </main>
    );
}
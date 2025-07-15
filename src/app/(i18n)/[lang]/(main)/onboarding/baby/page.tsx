'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';

export default function BabySetupPage() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { data: session, status } = useSession();

    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [timezone, setTimezone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    useEffect(() => {
        const checkIfAlreadyOnboarded = async () => {
            if (status === 'authenticated' && session?.user?.id) {
                try {
                    const userId = session.user.id;
                    const response = await fetch(`/api/baby/count?userId=${userId}`);
                    const data = await response.json();
                    const count = data.count;

                    if (count > 0) {
                        router.replace(`/${t('common:locale')}/dashboard`);
                    }
                } catch (error) {
                    console.error("[BabySetupPage Client] Error checking existing babies:", error);

                }
            } else if (status === 'unauthenticated') {
                router.replace(`/${t('common:locale')}/signin`);
            }
        };

        if (status !== 'loading') {
            checkIfAlreadyOnboarded();
        }
    }, [session, status, router, t]);

    if (status === 'loading') {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-light-background text-dark-text">
                <p>{t('common:loading')}</p>
            </main>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            let dobISOString = dateOfBirth;
            if (dateOfBirth && !dateOfBirth.includes('T')) {
                dobISOString = `${dateOfBirth}T00:00:00Z`;
            }
            const dobDate = new Date(dobISOString);
            if (isNaN(dobDate.getTime())) {
                setError(t('babySetup.errors.invalidDate'));
                setIsLoading(false);
                return;
            }

            const payload = {
                name,
                dateOfBirth: dobDate.toISOString(),
                gender: gender || 'UNDISCLOSED',
                timezone,
            };

            const response = await fetch('/api/baby', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400 && data.errors && data.errors.length > 0) {
                    setError(data.errors.map((err: any) => err.message).join('. ') + '.');
                } else {
                    setError(data.message || t('babySetup.errors.default'));
                }
            } else {
                setSuccessMessage(t('babySetup.success'));
                router.push(`/${t('common:locale')}/dashboard`);
            }
        } catch (err) {
            console.error("Baby setup fetch error:", err);
            setError(t('babySetup.errors.networkError'));
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'authenticated') {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-light-background text-dark-text">
                <div className="bg-card-background p-8 rounded-2xl shadow-xl max-w-md w-full border border-border-light">
                    <h1 className="text-3xl font-bold text-dark-text text-center mb-6">
                        {t('babySetup.headline')}
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
                            label={t('inputs.babyNameLabel')}
                            placeholder={t('inputs.babyNamePlaceholder')}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            label={t('inputs.dateOfBirthLabel')}
                            placeholder={t('inputs.dateOfBirthPlaceholder')}
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required
                        />
                        <div>
                            <label className="block text-dark-text text-sm font-medium mb-1">
                                {t('inputs.genderLabel')}
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center text-muted-text">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="BOY"
                                        checked={gender === 'BOY'}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="mr-2 accent-primary-blue"
                                    />
                                    {t('inputs.genderBoy')}
                                </label>
                                <label className="flex items-center text-muted-text">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="GIRL"
                                        checked={gender === 'GIRL'}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="mr-2 accent-primary-blue"
                                    />
                                    {t('inputs.genderGirl')}
                                </label>
                                <label className="flex items-center text-muted-text">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="UNDISCLOSED"
                                        checked={gender === 'UNDISCLOSED' || !gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="mr-2 accent-primary-blue"
                                    />
                                    {t('inputs.genderUndisclosed')}
                                </label>
                            </div>
                        </div>
                        <Input
                            label={t('inputs.timezoneLabel')}
                            placeholder={t('inputs.timezonePlaceholder')}
                            type="text"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                        >
                            {t('babySetup.saveButton')}
                        </Button>
                    </form>
                </div>
            </main>
        );
    }

    return null;
}
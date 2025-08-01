'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { logSleepSchema } from '@/lib/validations';
import { z } from 'zod';
import { SleepLocation } from "@prisma/client";

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import {useTranslation} from "react-i18next";
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/SegmentedControl'

type FormData = z.input<typeof logSleepSchema>;


function getLocalDateTimeString(date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
    )}:${pad(date.getMinutes())}`;
}

export function SleepForm() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(logSleepSchema),
        defaultValues: {
            startTime: new Date(),
            endTime: new Date(),
            location: SleepLocation.BED,
            notes: '',
        },
        mode: 'onBlur',
    });

    const watchedStartTime = watch('startTime') as Date;
    const watchedEndTime = watch('endTime') as Date;
    const watchedLocation = watch('location') as SleepLocation | undefined;

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('startTime', new Date(e.target.value), { shouldValidate: true });
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('endTime', new Date(e.target.value), { shouldValidate: true });
    };

    const handleSetToNow = (field: 'startTime' | 'endTime') => {
        setValue(field, new Date(), { shouldValidate: true });
    };

    const handleLocationChange = (value: string) => {
        if (Object.values(SleepLocation).includes(value as SleepLocation)) {
            setValue('location', value as SleepLocation, { shouldValidate: true });
        } else {
            setValue('location', undefined, { shouldValidate: true }); // Set to undefined if "Other" or not found
        }
    };

    const onSubmit = async (data: FormData) => {
        setApiError(null);
        try {
            const response = await fetch('/api/sleep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    startTime: (data.startTime as Date).toISOString(),
                    endTime: (data.endTime as Date).toISOString(),
                    location: data.location ?? null,
                    notes: data.notes ?? null,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                let errorMessage = t('activityLogging.logError');
                try {
                    const parsedError = JSON.parse(errorBody);
                    errorMessage = Array.isArray(parsedError) && parsedError.length > 0
                        ? parsedError.map(err => err.message).join('. ')
                        : parsedError.message || errorMessage;
                } catch {
                    errorMessage = errorBody || errorMessage;
                }
                throw new Error(errorMessage);
            }

            router.push('/dashboard');
            router.refresh();
        } catch (error: any) {
            console.error('Failed to log sleep:', error);
            setApiError(error.message || t('activityLogging.logError'));
        }
    };

    const onErrors = (errors: any) => {
        console.error('--- Form validation errors (onErrors callback) ---', errors);
        setApiError(t('activityLogging.logError'));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onErrors)} className="space-y-6"  method="POST">
            <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-secondary-blue-accent rounded-full flex items-center justify-center">
                    {/* Sleep icon placeholder */}
                </div>
            </div>

            <div className="flex gap-4 items-end">
                <Input
                    label={t('activityLogging.startTime')}
                    type="datetime-local"
                    value={getLocalDateTimeString(watchedStartTime)}
                    onChange={handleStartTimeChange}
                    error={errors.startTime?.message}
                />
                <Button
                    type="button"
                    variant="secondary-outline"
                    size="sm"
                    onClick={() => handleSetToNow('startTime')}
                >
                    {t('activityLogging.setToNow') ?? 'Now'}
                </Button>
            </div>

            <div className="flex gap-4 items-end">
                <Input
                    label={t('activityLogging.endTime')}
                    type="datetime-local"
                    value={getLocalDateTimeString(watchedEndTime)}
                    onChange={handleEndTimeChange}
                    error={errors.endTime?.message}
                />
                <Button
                    type="button"
                    variant="secondary-outline"
                    size="sm"
                    onClick={() => handleSetToNow('endTime')}
                >
                    {t('activityLogging.setToNow') ?? 'Now'}
                </Button>
            </div>
            <h3 className="text-sm font-medium text-dark-text">{t('activityLogging.sleepLocation')}</h3>
            <SegmentedControl
                value={watchedLocation ?? ''} // Provide a fallback for uncontrolled component
                onValueChange={handleLocationChange}
                type="single"
            >
                {Object.values(SleepLocation).map((loc) => (
                    <SegmentedControlItem key={loc} value={loc}>
                        {t(`activityLogging.sleepLocation${loc}`)}
                    </SegmentedControlItem>
                ))}
            </SegmentedControl>

            <Textarea
                label={t('activityLogging.notes')}
                placeholder={t('activityLogging.notes_placeholder')}
                {...register('notes')}
                error={errors.notes?.message}
            />

            <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} className="mt-8">
                {t('activityLogging.save')}
            </Button>

            {apiError && <p className="text-center text-error mt-4">{apiError}</p>}
        </form>
    );
}
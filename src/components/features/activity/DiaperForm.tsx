'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { logDiaperSchema } from '@/lib/validations';
import { DiaperType, DiaperColor, DiaperConsistency } from '@prisma/client';
import { z } from 'zod';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/SegmentedControl';
import { Textarea } from '@/components/ui/Textarea';
import {useTranslation} from "react-i18next";

type FormData = z.input<typeof logDiaperSchema>;


function getLocalDateTimeString(date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
    )}:${pad(date.getMinutes())}`;
}

export function DiaperForm() {
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
        resolver: zodResolver(logDiaperSchema),
        defaultValues: {
            startTime: new Date(),
            type: DiaperType.WET,
            color: undefined,
            consistency: undefined,
            notes: '',
        },
        mode: 'onBlur',
    });

    const watchedStartTime = watch('startTime') as Date;
    const watchedColor = watch('color') as DiaperColor | undefined;
    const watchedConsistency = watch('consistency') as DiaperConsistency | undefined;

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('startTime', new Date(e.target.value), { shouldValidate: true });
    };

    const handleSetToNow = () => {
        setValue('startTime', new Date(), { shouldValidate: true });
    };

    const handleTypeChange = (value: string) => {
        if (Object.values(DiaperType).includes(value as DiaperType)) {
            setValue('type', value as DiaperType, { shouldValidate: true });
        }
    };

    const handleColorChange = (value: string) => {
        if (Object.values(DiaperColor).includes(value as DiaperColor)) {
            setValue('color', value as DiaperColor, { shouldValidate: true });
        } else {
            setValue('color', undefined, { shouldValidate: true });
        }
    };

    const handleConsistencyChange = (value: string) => {
        if (Object.values(DiaperConsistency).includes(value as DiaperConsistency)) {
            setValue('consistency', value as DiaperConsistency, { shouldValidate: true });
        } else {
            setValue('consistency', undefined, { shouldValidate: true });
        }
    };

    const onSubmit = async (data: FormData) => {
        setApiError(null);
        try {
            const response = await fetch('/api/diaper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    startTime: (data.startTime as Date).toISOString(),
                    color: data.color ?? null,
                    consistency: data.consistency ?? null,
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
            console.error('Failed to log diaper:', error);
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
                <div className="w-24 h-24 bg-secondary-gray-accent rounded-full flex items-center justify-center">
                    {/* Diaper icon placeholder */}
                </div>
            </div>

            <SegmentedControl
                value={watch('type')}
                onValueChange={handleTypeChange}
                type="single"
            >
                <SegmentedControlItem value={DiaperType.WET}>
                    {t('activityLogging.diaperTypeWet')}
                </SegmentedControlItem>
                <SegmentedControlItem value={DiaperType.DIRTY}>
                    {t('activityLogging.diaperTypeDirty')}
                </SegmentedControlItem>
                <SegmentedControlItem value={DiaperType.MIXED}>
                    {t('activityLogging.diaperTypeMixed')}
                </SegmentedControlItem>
            </SegmentedControl>
            <h3 className="text-sm font-medium text-dark-text mt-4">{t('activityLogging.diaperColor')}</h3>
            <SegmentedControl
                value={watchedColor ?? ''}
                onValueChange={handleColorChange}
                type="single"
            >
                {Object.values(DiaperColor).map((color) => (
                    <SegmentedControlItem key={color} value={color}>
                        {t(`activityLogging.diaperColor${color}`)}
                    </SegmentedControlItem>
                ))}
            </SegmentedControl>

            {/* FIX: Add SegmentedControl for Diaper Consistency */}
            <h3 className="text-sm font-medium text-dark-text mt-4">{t('activityLogging.diaperConsistency')}</h3>
            <SegmentedControl
                value={watchedConsistency ?? ''}
                onValueChange={handleConsistencyChange}
                type="single"
            >
                {Object.values(DiaperConsistency).map((consistency) => (
                    <SegmentedControlItem key={consistency} value={consistency}>
                        {t(`activityLogging.diaperConsistency${consistency}`)}
                    </SegmentedControlItem>
                ))}
            </SegmentedControl>


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
                    onClick={handleSetToNow}
                >
                    {t('activityLogging.setToNow') ?? 'Now'}
                </Button>
            </div>

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
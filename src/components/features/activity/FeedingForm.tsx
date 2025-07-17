'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { logFeedingSchema } from '@/lib/validations';
import { FeedingType } from '@prisma/client';
import { z } from 'zod';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/SegmentedControl';
import { Textarea } from '@/components/ui/Textarea';

type FormData = z.input<typeof logFeedingSchema>;

interface FeedingFormProps {
    tAction: (key: string, options?: Record<string, any>) => string;
}

function coerceToDate(value: unknown): Date {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') return new Date(value);
    return new Date(); // fallback
}

function getLocalDateTimeString(date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
    )}:${pad(date.getMinutes())}`;
}

export function FeedingForm({ tAction }: FeedingFormProps) {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(logFeedingSchema),
        defaultValues: {
            babyId: '',
            userId: '',
            startTime: new Date(),
            type: FeedingType.BREAST_LEFT,
            duration: undefined,
            amount: undefined,
            notes: '',
        },
        mode: 'onBlur',
    });

    const watchedStartTime = coerceToDate(watch('startTime'));

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('startTime', e.target.value, { shouldValidate: true });
    };

    const handleSetToNow = () => {
        setValue('startTime', getLocalDateTimeString(), { shouldValidate: true });
    };

    const handleTypeChange = (value: string) => {
        if (Object.values(FeedingType).includes(value as FeedingType)) {
            setValue('type', value as FeedingType, { shouldValidate: true });
        }
    };

    const onSubmit = async (data: FormData) => {
        setApiError(null);

        try {
            const startTimeForApi = data.startTime as string | Date;
            const utcDate = new Date(startTimeForApi);
            const response = await fetch('/api/feeding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    startTime: utcDate.toISOString(), // Store in UTC
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                let errorMessage = tAction('activityLogging.logError');
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
            console.error('Failed to log activity:', error);
            setApiError(error.message || tAction('activityLogging.logError'));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-secondary-pink rounded-full flex items-center justify-center">
                    {/* Baby avatar/icon placeholder */}
                </div>
            </div>

            <SegmentedControl
                value={watch('type')}
                onValueChange={handleTypeChange}
                type="single"
            >
                <SegmentedControlItem value={FeedingType.BREAST_LEFT}>
                    {tAction('activityLogging.breast')}
                </SegmentedControlItem>
                <SegmentedControlItem value={FeedingType.BOTTLE_FORMULA}>
                    {tAction('activityLogging.bottle')}
                </SegmentedControlItem>
            </SegmentedControl>

            <div className="flex gap-4 items-end">
                <Input
                    label={tAction('activityLogging.startTime')}
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
                    {tAction('activityLogging.setToNow') ?? 'Now'}
                </Button>
            </div>

            <Input
                label={tAction('activityLogging.duration')}
                type="number"
                {...register('duration', { valueAsNumber: true })}
                error={errors.duration?.message}
            />
            <Input
                label={tAction('activityLogging.amount')}
                type="number"
                step="0.1"
                {...register('amount', { valueAsNumber: true })}
                error={errors.amount?.message}
            />
            <Textarea
                label={tAction('activityLogging.notes')}
                placeholder={tAction('activityLogging.notes_placeholder')}
                {...register('notes')}
                error={errors.notes?.message}
            />
            <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} className="mt-8">
                {tAction('activityLogging.save')}
            </Button>

            {apiError && <p className="text-center text-error mt-4">{apiError}</p>}
        </form>
    );
}

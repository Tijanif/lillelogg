'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { createGrowthEntrySchema, CreateGrowthFormInput, CreateGrowthEntryOutput } from '@/lib/validations';
import { MeasurementUnit } from '@prisma/client';

function getLocalDateString(date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function GrowthForm() {
    const { t } = useTranslation('activityLogging');
    const { t: tCommon } = useTranslation('common');


    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateGrowthFormInput, void, CreateGrowthEntryOutput>({
        resolver: zodResolver(createGrowthEntrySchema),
        defaultValues: {
            babyId: 'cmdd81qvm0004v340etzde0zj',
            date: getLocalDateString(new Date()),
            weight: '',
            height: '',
            headCircumference: '',
            weightUnit: MeasurementUnit.KG,
            heightUnit: MeasurementUnit.CM,
            headCircUnit: MeasurementUnit.CM,
        },
        mode: 'onBlur',
    });

    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const watchedDate = watch('date') ;
    const watchedWeight = watch('weight');
    const watchedHeight = watch('height');
    const watchedHeadCircumference = watch('headCircumference');

    const isAnyMeasurementProvided =
        (typeof watchedWeight === 'string' && watchedWeight.trim() !== '' && !isNaN(parseFloat(watchedWeight)) && parseFloat(watchedWeight) > 0) ||
        (typeof watchedHeight === 'string' && watchedHeight.trim() !== '' && !isNaN(parseFloat(watchedHeight)) && parseFloat(watchedHeight) > 0) ||
        (typeof watchedHeadCircumference === 'string' && watchedHeadCircumference.trim() !== '' && !isNaN(parseFloat(watchedHeadCircumference)) && parseFloat(watchedHeadCircumference) > 0);

    const babyId = 'cmdd81qvm0004v340etzde0zj';

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('date', e.target.value, { shouldValidate: true });
    };

    // Manually handle changes for number inputs.
    const handleNumberChange = (fieldName: 'weight' | 'height' | 'headCircumference') => (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(fieldName, e.target.value, { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<CreateGrowthEntryOutput> = async (data) => {
        setFormSuccess(null);
        setFormError(null);

        if (!babyId) {
            setFormError(tCommon('babyIdMissingError'));
            return;
        }

        try {
            const response = await fetch('/api/growth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    babyId: data.babyId,
                    date: data.date.toISOString(),
                    weight: data.weight ?? null,
                    height: data.height ?? null,
                    headCircumference: data.headCircumference ?? null,
                    weightUnit: data.weightUnit ?? null,
                    heightUnit: data.heightUnit ?? null,
                    headCircUnit: data.headCircUnit ?? null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || tCommon('logError');
                setFormError(errorMessage);
                console.error('Growth logging failed:', errorData);
                return;
            }

            const result = await response.json();
            setFormSuccess(tCommon('logSuccess'));
            reset({
                babyId: babyId,
                date: getLocalDateString(new Date()),
                weight: '',
                weightUnit: MeasurementUnit.KG,
                height: undefined,
                heightUnit: MeasurementUnit.CM,
                headCircumference: undefined,
                headCircUnit: MeasurementUnit.CM,
            });
            console.log('Growth entry successful:', result.entry);
        } catch (error) {
            setFormError(tCommon('networkError'));
            console.error('Network or unexpected error:', error);
        }
    };

    const onErrors = (errors: any) => {
        console.error('--- Form validation errors (onErrors callback) ---', errors);
        setFormError(tCommon('logError'));
    };

    const weightUnitOptions = [
        { value: MeasurementUnit.KG, label: t('weightUnitKG') },
        { value: MeasurementUnit.LBS, label: t('weightUnitLBS') },
    ];

    const heightUnitOptions = [
        { value: MeasurementUnit.CM, label: t('heightUnitCM') },
        { value: MeasurementUnit.IN, label: t('heightUnitIN') },
    ];

    const headCircUnitOptions = [
        { value: MeasurementUnit.CM, label: t('headCircUnitCM') },
        { value: MeasurementUnit.IN, label: t('headCircUnitIN') },
    ];

    return (
        <Card className="p-4 sm:p-6 max-w-lg mx-auto space-y-4">
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="space-y-4">
                {/* Date Input */}
                <Input
                    label={t('growthDateLabel')}
                    type="date"
                    {...register('date')}
                    value={typeof watchedDate === 'string' ? watchedDate : watchedDate instanceof Date ? getLocalDateString(watchedDate) : getLocalDateString()} // Ensure value is string for HTML input
                    onChange={handleDateChange}
                    error={errors.date?.message}
                />

                {/* Weight Section */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={t('weightLabel')}
                        type="number"
                        step="0.01"
                        {...register('weight')}
                        value={watchedWeight === undefined ? '' : String(watchedWeight)}
                        onChange={handleNumberChange('weight')}
                        placeholder={t('weightPlaceholder')}
                        error={errors.weight?.message}
                    />
                    <Select
                        label={t('unitLabel')}
                        options={weightUnitOptions}
                        {...register('weightUnit')}
                        error={errors.weightUnit?.message}
                        className="self-end"
                    />
                </div>

                {/* Height Section */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={t('heightLabel')}
                        type="number"
                        step="0.01"
                        {...register('height')}
                        value={watchedHeight === undefined ? '' : String(watchedHeight)}
                        onChange={handleNumberChange('height')}
                        placeholder={t('heightPlaceholder')}
                        error={errors.height?.message}
                    />
                    <Select
                        label={t('unitLabel')}
                        options={heightUnitOptions}
                        {...register('heightUnit')}
                        error={errors.heightUnit?.message}
                        className="self-end"
                    />
                </div>

                {/* Head Circumference Section */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={t('headCircLabel')}
                        type="number"
                        step="0.01"
                        {...register('headCircumference')}
                        value={watchedHeadCircumference === undefined ? '' : String(watchedHeadCircumference)}
                        onChange={handleNumberChange('headCircumference')}
                        placeholder={t('headCircPlaceholder')}
                        error={errors.headCircumference?.message}
                    />
                    <Select
                        label={t('unitLabel')}
                        options={headCircUnitOptions}
                        {...register('headCircUnit')}
                        error={errors.headCircUnit?.message}
                        className="self-end"
                    />
                </div>

                {/* Success/Error Messages */}
                {formSuccess && (
                    <p className="text-success text-center mt-2">{formSuccess}</p>
                )}
                {formError && (
                    <p className="text-error text-center mt-2">{formError}</p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`
            w-full px-4 py-3 rounded-2xl text-white font-semibold transition-colors duration-200
            ${isSubmitting || !isAnyMeasurementProvided ? 'bg-primary-blue-light cursor-not-allowed' : 'bg-primary-blue hover:bg-primary-blue-light'}
          `}
                    disabled={isSubmitting || !isAnyMeasurementProvided}
                >
                    {isSubmitting ? tCommon('loading') : tCommon('save')}
                </button>
            </form>
        </Card>
    );
}
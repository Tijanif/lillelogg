import { z } from 'zod';
import { FeedingType, DiaperType, SleepLocation, DiaperColor, DiaperConsistency, MeasurementUnit } from "@prisma/client";

const FeedingTypeEnum = Object.values(FeedingType) as [string, ...string[]];
// const DiaperTypeEnum = Object.values(DiaperType) as [string, ...string[]];


// --- User Registration Validation Schema ---
export const registerSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    name: z.string().optional(),
});

// --- Baby Profile Creation Validation Schema ---
export const createBabySchema = z.object({
    name: z.string().min(1, 'Baby name is required'),
    dateOfBirth: z.string().datetime({ message: 'Invalid date format' }),
    gender: z.enum(['BOY', 'GIRL', 'UNDISCLOSED']).optional(),
    avatarUrl: z.string().url('Invalid avatar URL').optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    timezone: z.string().optional(),
});

//--- logFeeding Validation schema ---
export const logFeedingSchema = z.object({
    startTime: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date and time",
    }),
    type: z.enum(FeedingTypeEnum),
    duration: z.coerce.number().int().positive("Duration cannot be negative").optional(),
    amount: z.coerce.number().positive("Amount cannot be negative").optional(),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const apiLogFeedingSchema = logFeedingSchema.extend({
    babyId: z.string().cuid(),
    userId: z.string().cuid(),
});


// --- Sleep Log Validation Schema ---
export const logSleepSchema = z.object({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    location: z.nativeEnum(SleepLocation).optional(),
    notes: z.string().max(500).optional(),
});
export const apiLogSleepSchema = logSleepSchema.extend({
    babyId: z.string().cuid(),
    userId: z.string().cuid(),
});

// --- Diaper Change Log Validation Schema ---
export const logDiaperSchema = z.object({
    startTime: z.coerce.date(),
    type: z.nativeEnum(DiaperType),
    color: z.nativeEnum(DiaperColor).optional(),
    consistency: z.nativeEnum(DiaperConsistency).optional(),
    notes: z.string().max(500).optional(),
});

export const apiLogDiaperSchema = logDiaperSchema.extend({
    babyId: z.string().cuid(),
    userId: z.string().cuid(),
});

// --- Analysis Query Validation Schema ---
export const analyticsQueryParamsSchema = z.object({
    babyId: z.string().cuid('Invalid baby ID format.'),
    days: z.coerce.number().int().positive().max(365, 'Days cannot exceed 365.').optional().default(7),
});

// --- Growth Entry Validation Schema ---
export const createGrowthEntrySchema = z.object({
    babyId: z.string().cuid('Invalid baby ID format. Must be a valid CUID.'),

    date: z.coerce.date().refine((val) => !isNaN(val.getTime()), {
        message: "Please enter a valid date.",
    }),

    weight: z.coerce.number().optional().refine(val => val === undefined || val > 0, {
        message: "Weight must be a positive number.",
    }),
    weightUnit: z.nativeEnum(MeasurementUnit).optional(),

    height: z.coerce.number().optional().refine(val => val === undefined || val > 0, {
        message: "Height must be a positive number.",
    }),
    heightUnit: z.nativeEnum(MeasurementUnit).optional(),

    headCircumference: z.coerce.number().optional().refine(val => val === undefined || val > 0, {
        message: "Head circumference must be a positive number.",
    }),
    headCircUnit: z.nativeEnum(MeasurementUnit).optional(),
}).refine(data => {
    return data.weight !== undefined || data.height !== undefined || data.headCircumference !== undefined;
}, {
    message: "At least one measurement (weight, height, or head circumference) is required.",
    path: ['weight']
});

// TypeScript type for the raw input values (what useForm initially deals with)
// This will be `string` for inputs like type="date", type="number"
export type CreateGrowthFormInput = z.input<typeof createGrowthEntrySchema>;

// TypeScript type for the final, parsed output (what onSubmit receives and API expects)
export type CreateGrowthEntryOutput = z.infer<typeof createGrowthEntrySchema>;
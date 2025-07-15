import { z } from 'zod';
import {FeedingType, DiaperType} from "@prisma/client";

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

//--- user logFeeding Validation schema ---
export const logFeedingSchema = z.object({
    babyId: z.string().cuid(),
    startTime: z.string().datetime(),
    type: z.enum(FeedingType),
    duration: z.coerce.number().int().positive().optional(), // In minutes
    amount: z.coerce.number().positive().optional(), // In oz or ml
    notes: z.string().max(500).optional(),
});

// --- Sleep Log Validation Schema ---
export const logSleepSchema = z.object({
    babyId: z.string().cuid(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    notes: z.string().max(500).optional(),
});

// --- Diaper Change Log Validation Schema ---
export const logDiaperSchema = z.object({
    babyId: z.string().cuid(),
    startTime: z.string().datetime(),
    type: z.enum(DiaperType),
    notes: z.string().max(500).optional(),
});

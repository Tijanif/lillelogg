import { z } from 'zod';

// --- User Registration Validation Schema ---
export const registerSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    name: z.string().optional(),
});

// --- Baby Profile Creation Validation Schema ---
// Make sure 'BOY', 'GIRL', 'UNDISCLOSED' match your BabyGender enum in schema.prisma
export const createBabySchema = z.object({
    name: z.string().min(1, 'Baby name is required'),
    dateOfBirth: z.string().datetime({ message: 'Invalid date format' }),
    gender: z.enum(['BOY', 'GIRL', 'UNDISCLOSED']).optional(),
    avatarUrl: z.string().url('Invalid avatar URL').optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    timezone: z.string().optional(),
});
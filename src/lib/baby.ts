import prisma from '@/lib/prisma';

/**
 * Fetches the first baby associated with a user.
 * MVP assumption: the first baby is the primary/active one.
 * @param userId - The ID of the user.
 * @returns The baby record or null if not found.
 */
export const getPrimaryBaby = async (userId: string) => {
    if (!userId) return null;

    const baby = await prisma.baby.findFirst({
        where: {
            memberships: {
                some: {
                    userId: userId,
                },
            },
            isDeleted: false,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    return baby;
};
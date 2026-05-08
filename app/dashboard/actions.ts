'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { updateLink, deleteLink } from '@/data/links';

const createLinkSchema = z.object({
  url: z
    .string()
    .url('Please enter a valid URL')
    .refine(
      (url) => url.startsWith('http://') || url.startsWith('https://'),
      'Only http and https URLs are allowed',
    ),
  shortCode: z
    .string()
    .min(3, 'Short code must be at least 3 characters')
    .max(10, 'Short code must be at most 10 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Short code can only contain letters, numbers, underscores, and hyphens',
    ),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<{ success: true; data?: { id: string } } | { error: string }> {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message).join(', ');
    return { error: errors };
  }

  try {
    // Check if short code already exists
    const existing = await db.query.links.findFirst({
      where: (links, { eq }) => eq(links.shortCode, parsed.data.shortCode),
    });

    if (existing) {
      return { error: 'This short code is already taken' };
    }

    const newLink = await db
      .insert(links)
      .values({
        id: uuidv4(),
        userId,
        url: parsed.data.url,
        shortCode: parsed.data.shortCode,
      })
      .returning();

    console.log(
      `[AUDIT] Link created: userId=${userId} shortCode=${parsed.data.shortCode} id=${newLink[0].id}`,
    );
    return { success: true, data: { id: newLink[0].id } };
  } catch (error) {
    console.error('Failed to create link:', error);
    return { error: 'Failed to create link. Please try again.' };
  }
}

const updateLinkSchema = z.object({
  id: z.string().min(1),
  url: z
    .string()
    .url('Please enter a valid URL')
    .refine(
      (url) => url.startsWith('http://') || url.startsWith('https://'),
      'Only http and https URLs are allowed',
    ),
  shortCode: z
    .string()
    .min(3, 'Short code must be at least 3 characters')
    .max(10, 'Short code must be at most 10 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Short code can only contain letters, numbers, underscores, and hyphens',
    ),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLinkAction(
  input: UpdateLinkInput,
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message).join(', ');
    return { error: errors };
  }

  try {
    const existing = await db.query.links.findFirst({
      where: (links, { eq, and, ne }) =>
        and(
          eq(links.shortCode, parsed.data.shortCode),
          ne(links.id, parsed.data.id),
        ),
    });

    if (existing) {
      return { error: 'This short code is already taken' };
    }

    await updateLink(parsed.data.id, userId, {
      url: parsed.data.url,
      shortCode: parsed.data.shortCode,
    });

    console.log(
      `[AUDIT] Link updated: userId=${userId} id=${parsed.data.id} shortCode=${parsed.data.shortCode}`,
    );
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to update link:', error);
    return { error: 'Failed to update link. Please try again.' };
  }
}

const deleteLinkSchema = z.object({
  id: z.string().min(1),
});

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export async function deleteLinkAction(
  input: DeleteLinkInput,
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) return { error: 'Invalid input' };

  try {
    await deleteLink(parsed.data.id, userId);
    console.log(`[AUDIT] Link deleted: userId=${userId} id=${parsed.data.id}`);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete link:', error);
    return { error: 'Failed to delete link. Please try again.' };
  }
}

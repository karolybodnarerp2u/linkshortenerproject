'use server';

import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { Link } from '@/db/schema';

export async function getUserLinks(userId: string): Promise<Link[]> {
  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, userId),
    orderBy: (links, { desc }) => [desc(links.updatedAt)],
  });

  return userLinks;
}

export async function updateLink(
  id: string,
  userId: string,
  data: { url: string; shortCode: string },
): Promise<Link> {
  const [updated] = await db
    .update(links)
    .set({ url: data.url, shortCode: data.shortCode, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return updated;
}

export async function deleteLink(id: string, userId: string): Promise<void> {
  await db.delete(links).where(and(eq(links.id, id), eq(links.userId, userId)));
}

export async function getLinkByShortCode(
  shortCode: string,
): Promise<Link | undefined> {
  return db.query.links.findFirst({
    where: eq(links.shortCode, shortCode),
  });
}

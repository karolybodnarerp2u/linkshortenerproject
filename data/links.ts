'use server';

import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Link } from '@/db/schema';

export async function getUserLinks(userId: string): Promise<Link[]> {
  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, userId),
    orderBy: (links, { desc }) => [desc(links.createdAt)],
  });

  return userLinks;
}

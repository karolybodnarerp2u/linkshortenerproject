---
description: Follow these rules when creating or modifying server actions for data mutations in this project.
applyTo: '**/actions.ts'
---

# Server Actions Standards

## Rules

- ALL data mutations MUST be done via server actions — never mutate data directly from client components or API routes
- Server actions MUST be called from client components only
- Server action files MUST be named `actions.ts` and colocated in the same directory as the component that calls them
- ALL data passed to server actions MUST have explicit TypeScript types — **never use `FormData` as a type**
- ALL input data MUST be validated using **zod** before any processing
- ALL server actions MUST verify a logged-in user (via Clerk) before performing any database operations
- Database operations MUST be done via helper functions located in the `/data` directory — **never call Drizzle queries directly inside server actions**
- Server actions MUST **never throw errors** — instead return an object with either a `{ success: true, data?: ... }` or `{ error: string }` shape

## File Structure

```
app/
  dashboard/
    some-feature/
      page.tsx          # Server component (renders client component)
      some-form.tsx     # Client component ("use client") — calls server action
      actions.ts        # Server action colocated here
data/
  links.ts              # Drizzle query helper functions
```

## Example

```typescript
// app/dashboard/links/actions.ts
'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { createLink } from '@/data/links';

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { error: 'Invalid input' };

  try {
    await createLink({ ...parsed.data, userId });
    return { success: true };
  } catch {
    return { error: 'Failed to create link' };
  }
}
```

```typescript
// data/links.ts — Drizzle query helpers used by server actions
import { db } from '@/db';
import { links } from '@/db/schema';

export async function createLink(data: {
  url: string;
  slug: string;
  userId: string;
}) {
  return await db.insert(links).values(data).returning();
}
```

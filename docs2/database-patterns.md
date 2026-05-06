# Database & Drizzle ORM Patterns

## Database Configuration

**Provider:** Neon (Serverless PostgreSQL)  
**ORM:** Drizzle ORM v0.45.2  
**Connection:** HTTP client (`@neondatabase/serverless`)

## Project Structure

```
db/
  schema.ts       # Database schema definitions
  index.ts        # Database connection and query exports
```

## Schema Definition

Define all database schemas in `db/schema.ts` using Drizzle's schema builder:

### Table Definition Pattern

```typescript
import { pgTable, text, timestamp, varchar, integer, boolean } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const links = pgTable('links', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: text('user_id').notNull(),
  originalUrl: text('original_url').notNull(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  clicks: integer('clicks').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
});

// Infer TypeScript types from schema
export type Link = InferSelectModel<typeof links>;
export type NewLink = InferInsertModel<typeof links>;
```

### Relationships

Define relationships between tables:

```typescript
import { relations } from 'drizzle-orm';

export const linksRelations = relations(links, ({ one, many }) => ({
  analytics: many(linkAnalytics),
}));

export const linkAnalytics = pgTable('link_analytics', {
  id: varchar('id', { length: 36 }).primaryKey(),
  linkId: varchar('link_id', { length: 12 }).notNull().references(() => links.id, { onDelete: 'cascade' }),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
});

export type LinkAnalytics = InferSelectModel<typeof linkAnalytics>;
```

## Database Connection

### Setup in `db/index.ts`

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

## Query Patterns

### Insert Operations

```typescript
import { db } from '@/db';
import { links, type NewLink } from '@/db/schema';

// Single insert
async function createLink(data: NewLink) {
  const [link] = await db.insert(links).values(data).returning();
  return link;
}

// Multiple inserts
async function createMultipleLinks(data: NewLink[]) {
  const newLinks = await db.insert(links).values(data).returning();
  return newLinks;
}
```

### Select Operations

```typescript
import { eq, and, desc, count } from 'drizzle-orm';

// Find one
async function getLinkByCode(shortCode: string) {
  const link = await db.query.links.findFirst({
    where: eq(links.shortCode, shortCode),
  });
  return link;
}

// Find many with conditions
async function getUserActiveLinks(userId: string) {
  return db.query.links.findMany({
    where: and(
      eq(links.userId, userId),
      eq(links.isActive, true)
    ),
    orderBy: [desc(links.createdAt)],
  });
}

// With relations
async function getLinkWithAnalytics(linkId: string) {
  return db.query.links.findFirst({
    where: eq(links.id, linkId),
    with: {
      analytics: {
        orderBy: [desc(linkAnalytics.clickedAt)],
        limit: 10,
      },
    },
  });
}
```

### Update Operations

```typescript
// Update single record
async function incrementClicks(linkId: string) {
  const [updated] = await db
    .update(links)
    .set({ clicks: sql`${links.clicks} + 1` })
    .where(eq(links.id, linkId))
    .returning();
  return updated;
}

// Update with conditions
async function deactivateExpiredLinks() {
  return db
    .update(links)
    .set({ isActive: false })
    .where(and(
      eq(links.isActive, true),
      lt(links.expiresAt, new Date())
    ));
}
```

### Delete Operations

```typescript
// Soft delete (preferred)
async function deactivateLink(linkId: string) {
  await db
    .update(links)
    .set({ isActive: false })
    .where(eq(links.id, linkId));
}

// Hard delete (use with caution)
async function deleteLink(linkId: string) {
  await db
    .delete(links)
    .where(eq(links.id, linkId));
}
```

### Aggregations

```typescript
import { count, sum, avg } from 'drizzle-orm';

// Count records
async function getUserLinkCount(userId: string): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(links)
    .where(eq(links.userId, userId));
  return result[0].count;
}

// Sum and average
async function getTotalClicks(userId: string) {
  const result = await db
    .select({
      total: sum(links.clicks),
      average: avg(links.clicks),
    })
    .from(links)
    .where(eq(links.userId, userId));
  return result[0];
}
```

## Migrations

### Generate Migrations

```bash
# After updating schema.ts
npm run drizzle-kit generate
```

### Apply Migrations

```bash
npm run drizzle-kit migrate
```

### Migration Best Practices

1. **Never modify existing migrations** - create new ones instead
2. **Test migrations locally** before deploying
3. **Include rollback strategy** for production migrations
4. **Version control all migrations**
5. **Use transactions** for complex migrations

## Transaction Patterns

```typescript
import { db } from '@/db';

async function transferOwnership(linkId: string, newUserId: string) {
  await db.transaction(async (tx) => {
    // All operations succeed or all fail
    const link = await tx.query.links.findFirst({
      where: eq(links.id, linkId),
    });
    
    if (!link) {
      throw new Error('Link not found');
    }
    
    await tx
      .update(links)
      .set({ userId: newUserId })
      .where(eq(links.id, linkId));
    
    // Other related updates...
  });
}
```

## Best Practices

1. **Always validate environment variables** on initialization
2. **Use transactions** for multi-step operations
3. **Use prepared statements** for repeated queries
4. **Index frequently queried columns** (userId, shortCode, etc.)
5. **Use `.returning()`** to get inserted/updated data
6. **Handle null values explicitly** with TypeScript
7. **Use proper column types** (don't use text for everything)
8. **Set appropriate constraints** (unique, notNull, references)
9. **Use cascade deletes** for dependent data
10. **Keep queries in server-side code** (API routes, Server Components)
11. **Use Drizzle's query builder** over raw SQL when possible
12. **Type your query results** using inferred types from schema

## Common Operators

```typescript
import {
  eq,        // equals
  ne,        // not equals
  lt,        // less than
  lte,       // less than or equal
  gt,        // greater than
  gte,       // greater than or equal
  isNull,    // is null
  isNotNull, // is not null
  like,      // SQL LIKE
  ilike,     // case-insensitive LIKE
  and,       // AND condition
  or,        // OR condition
  not,       // NOT condition
  inArray,   // IN array
  notInArray,// NOT IN array
  desc,      // descending order
  asc,       // ascending order
  sql,       // raw SQL
} from 'drizzle-orm';
```

## Error Handling

```typescript
async function safeCreateLink(data: NewLink) {
  try {
    const link = await db.insert(links).values(data).returning();
    return { success: true, data: link[0] };
  } catch (error) {
    // Handle unique constraint violations
    if (error.code === '23505') {
      return { success: false, error: 'Link code already exists' };
    }
    throw error;
  }
}
```

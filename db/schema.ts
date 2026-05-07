import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const links = pgTable('links', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID or custom string
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Infer TypeScript types from schema
export type Link = InferSelectModel<typeof links>;
export type NewLink = InferInsertModel<typeof links>;

import { pgTable, text, integer, timestamp, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const links = pgTable('links', {
  id: integer('id')..primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Infer TypeScript types from schema
export type Link = InferSelectModel<typeof links>;
export type NewLink = InferInsertModel<typeof links>;
function integer(arg0: string) {
    throw new Error('Function not implemented.');
}


import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const siteContent=sqliteTable('site_content',{
  id:text('id').primaryKey(), data:text('data').notNull(), revision:integer('revision').notNull().default(0),
  updatedAt:text('updated_at').notNull(), updatedBy:text('updated_by').notNull(),
});
export const editorRateLimits=sqliteTable('editor_rate_limits',{
  id:text('id').primaryKey(), windowStart:integer('window_start').notNull(), count:integer('count').notNull(),
});

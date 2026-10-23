import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const admins = sqliteTable('cms_admins', {
  id: text('id').primaryKey(), userId: text('user_id').notNull().unique(), email: text('email').notNull(), createdAt: text('created_at').notNull(),
});
export const state = sqliteTable('cms_state', {
  id: text('id').primaryKey(), document: text('document').notNull(), revision: integer('revision').notNull(), updatedAt: text('updated_at').notNull(),
  liveDocument: text('live_document').notNull(), liveRevision: integer('live_revision').notNull(),
});
export const publications = sqliteTable('cms_publications', {
  id: integer('id').primaryKey({autoIncrement:true}), document: text('document').notNull(), sourceRevision: integer('source_revision').notNull().unique(), publishedAt: text('published_at').notNull(), actor: text('actor').notNull(),
});
export const media = sqliteTable('cms_media', {
  key: text('key').primaryKey(), status: text('status').notNull(), contentType: text('content_type').notNull(), createdAt: text('created_at').notNull(), owner: text('owner').notNull(),
});

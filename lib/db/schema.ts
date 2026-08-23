import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  makerworldId: text('makerworld_id').notNull().unique(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  author: text('author'),
  filamentTypes: text('filament_types').notNull(), // JSON string array: ["PLA", "PETG"]
  filamentColors: text('filament_colors').notNull(), // JSON string array: ["Silk Gold"]
  printTimeMinutes: integer('print_time_minutes'),
  weightGrams: real('weight_grams'),
  status: text('status').notNull().default('DISCOVERED'), // DISCOVERED, CRAWLED, APPROVED_FOR_VIDEO, GENERATING_VIDEO, VIDEO_READY, EXPORTED
  rawImages: text('raw_images').notNull(), // JSON string array
  selectedCoverImage: text('selected_cover_image'),
  videoPrompt: text('video_prompt'),
  generatedVideoPath: text('generated_video_path'),
  exportTitle: text('export_title'),
  exportDescription: text('export_description'),
  errorMessage: text('error_message'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const searchJobs = sqliteTable('search_jobs', {
  id: text('id').primaryKey(),
  keyword: text('keyword').notNull(),
  maxResults: integer('max_results').notNull().default(10),
  status: text('status').notNull().default('PENDING'), // PENDING, RUNNING, COMPLETED, FAILED
  itemsFound: integer('items_found').default(0),
  createdAt: text('created_at').notNull(),
});

export const systemSettings = sqliteTable('system_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type SearchJob = typeof searchJobs.$inferSelect;
export type NewSearchJob = typeof searchJobs.$inferInsert;
export type SystemSetting = typeof systemSettings.$inferSelect;

import {
  mysqlTable,
  bigint,
  varchar,
  text,
  mysqlEnum,
  tinyint,
  datetime,
  int,
  date,
  decimal,
  json,
  uniqueIndex,
  foreignKey,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// ── USERS ─────────────────────────────────────────────────────────────
export const users = mysqlTable(
  'users',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    name: varchar('name', { length: 150 }).notNull(),
    email: varchar('email', { length: 150 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: mysqlEnum('role', ['admin', 'member']).default('member').notNull(),
    isActive: tinyint('is_active').default(1).notNull(),
    createdAt: datetime('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    uqUsersEmail: uniqueIndex('uq_users_email').on(t.email),
  })
);

// ── DEPARTMENTS & MINISTRIES ──────────────────────────────────────────
export const departmentsMinistries = mysqlTable('departments_ministries', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  type: mysqlEnum('type', ['department', 'ministry']).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  scriptureQuote: text('scripture_quote'),
  scriptureReference: varchar('scripture_reference', { length: 100 }),
  externalLink: varchar('external_link', { length: 255 }),
  sortOrder: int('sort_order').default(0).notNull(),
  cloudinaryPublicId: varchar('cloudinary_public_id', { length: 255 }),
  cloudinarySecureUrl: varchar('cloudinary_secure_url', { length: 500 }),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── LEADERSHIP ────────────────────────────────────────────────────────
export const leadership = mysqlTable('leadership', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 150 }).notNull(),
  position: varchar('position', { length: 150 }).notNull(),
  photoPath: varchar('photo_path', { length: 255 }),
  cloudinaryPublicId: varchar('cloudinary_public_id', { length: 255 }),
  cloudinarySecureUrl: varchar('cloudinary_secure_url', { length: 500 }),
  statement: text('statement'),
  sortOrder: int('sort_order').default(0).notNull(),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── SERMONS ───────────────────────────────────────────────────────────
export const sermons = mysqlTable('sermons', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  title: varchar('title', { length: 200 }).notNull(),
  youtubeUrl: varchar('youtube_url', { length: 255 }).notNull(),
  description: text('description'),
  isFeatured: tinyint('is_featured').default(0).notNull(),
  publishedAt: date('published_at', { mode: 'string' }),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── EVENTS ────────────────────────────────────────────────────────────
export const events = mysqlTable('events', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  title: varchar('title', { length: 200 }).notNull(),
  eventDate: date('event_date', { mode: 'string' }).notNull(),
  facilitator: varchar('facilitator', { length: 150 }),
  description: text('description'),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── WEEKLY MEETINGS ───────────────────────────────────────────────────
export const weeklyMeetings = mysqlTable('weekly_meetings', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  dayOfWeek: mysqlEnum('day_of_week', [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]).notNull(),
  timeRange: varchar('time_range', { length: 50 }).notNull(),
  programName: varchar('program_name', { length: 150 }).notNull(),
  sortOrder: int('sort_order').default(0).notNull(),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── RESOURCES ─────────────────────────────────────────────────────────
export const resources = mysqlTable('resources', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  title: varchar('title', { length: 150 }).notNull(),
  description: text('description'),
  iconPath: varchar('icon_path', { length: 255 }),
  cloudinaryPublicId: varchar('cloudinary_public_id', { length: 255 }),
  cloudinarySecureUrl: varchar('cloudinary_secure_url', { length: 500 }),
  linkUrl: varchar('link_url', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  sortOrder: int('sort_order').default(0).notNull(),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── MISSIONS ──────────────────────────────────────────────────────────
export const missions = mysqlTable('missions', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  title: varchar('title', { length: 200 }).notNull(),
  themeText: varchar('theme_text', { length: 200 }),
  themeVerse: varchar('theme_verse', { length: 100 }),
  themeSong: varchar('theme_song', { length: 100 }),
  startDate: date('start_date', { mode: 'string' }),
  endDate: date('end_date', { mode: 'string' }),
  description: text('description'),
  isUpcoming: tinyint('is_upcoming').default(0).notNull(),
  sortOrder: int('sort_order').default(0).notNull(),
  cloudinaryPublicId: varchar('cloudinary_public_id', { length: 255 }),
  cloudinarySecureUrl: varchar('cloudinary_secure_url', { length: 500 }),
  chairName: varchar('chair_name', { length: 150 }),
  chairTitle: varchar('chair_title', { length: 150 }),
  chairMessage: text('chair_message'),
  chairCloudinaryPublicId: varchar('chair_cloudinary_public_id', { length: 255 }),
  chairCloudinarySecureUrl: varchar('chair_cloudinary_secure_url', { length: 500 }),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── PAYMENTS ──────────────────────────────────────────────────────────
export const payments = mysqlTable(
  'payments',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }),
    phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    purpose: mysqlEnum('purpose', ['tithe', 'offering', 'mission_support', 'other']).notNull(),
    status: mysqlEnum('status', ['pending', 'completed', 'failed', 'cancelled'])
      .default('pending')
      .notNull(),
    mpesaReceiptNumber: varchar('mpesa_receipt_number', { length: 50 }),
    checkoutRequestId: varchar('checkout_request_id', { length: 100 }),
    merchantRequestId: varchar('merchant_request_id', { length: 100 }),
    rawCallbackPayload: json('raw_callback_payload'),
    createdAt: datetime('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    uqCheckoutRequest: uniqueIndex('uq_checkout_request').on(t.checkoutRequestId),
    fkPaymentsUser: foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
      name: 'fk_payments_user',
    }).onDelete('set null'),
  })
);

// ── AUDIT LOG ─────────────────────────────────────────────────────────
export const auditLog = mysqlTable(
  'audit_log',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    userId: bigint('user_id', { mode: 'number', unsigned: true }),
    action: varchar('action', { length: 100 }).notNull(),
    entity: varchar('entity', { length: 100 }).notNull(),
    entityId: bigint('entity_id', { mode: 'number', unsigned: true }),
    createdAt: datetime('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    fkAuditUser: foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
      name: 'fk_audit_user',
    }).onDelete('set null'),
  })
);

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────
export const announcements = mysqlTable('announcements', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  title: varchar('title', { length: 150 }).notNull(),
  content: text('content').notNull(),
  sortOrder: int('sort_order').default(0).notNull(),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── WORD OF THE DAY ───────────────────────────────────────────────────
export const wordOfTheDay = mysqlTable('word_of_the_day', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  content: text('content').notNull(),
  reference: varchar('reference', { length: 100 }).notNull(),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// ── SABBATH GALLERY ───────────────────────────────────────────────────
export const sabbathGallery = mysqlTable('sabbath_gallery', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  title: varchar('title', { length: 150 }),
  imageUrl: varchar('image_url', { length: 1000 }).notNull(),
  linkUrl: varchar('link_url', { length: 500 }),
  icon: varchar('icon', { length: 50 }),
  dateTaken: date('date_taken', { mode: 'string' }),
  sortOrder: int('sort_order').default(0).notNull(),
  createdAt: datetime('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});


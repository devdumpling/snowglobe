import {
	pgTable,
	serial,
	text,
	varchar,
	boolean,
	timestamp,
	integer,
	index
} from 'drizzle-orm/pg-core';

// Auth tables (Lucia)
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	displayName: varchar('display_name', { length: 100 }).notNull(),
	avatarId: varchar('avatar_id', { length: 50 }).notNull(),
	isGuest: boolean('is_guest').default(false).notNull()
});

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
	},
	(table) => [
		index('session_user_id_idx').on(table.userId),
		index('session_expires_at_idx').on(table.expiresAt)
	]
);

// Guestbook
export const guestbookEntry = pgTable(
	'guestbook_entry',
	{
		id: serial('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		message: text('message').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
	},
	(table) => [
		index('guestbook_user_id_idx').on(table.userId),
		index('guestbook_created_at_idx').on(table.createdAt)
	]
);

// Cookie Likes (cookie clicker mini-game)
export const cookieLike = pgTable('cookie_like', {
	eventId: text('event_id').primaryKey(),
	count: integer('count').notNull().default(0),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

// Type exports
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type GuestbookEntry = typeof guestbookEntry.$inferSelect;
export type NewGuestbookEntry = typeof guestbookEntry.$inferInsert;
export type CookieLike = typeof cookieLike.$inferSelect;
export type NewCookieLike = typeof cookieLike.$inferInsert;

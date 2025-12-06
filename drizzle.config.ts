import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: process.env.DATABASE_URL },
	verbose: true,
	strict: true,
	// Only manage our app tables, ignore Fly's monitoring views
	tablesFilter: ['user', 'session', 'guestbook_entry', 'cookie_like']
});

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Lazy initialization to avoid errors during build
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
	if (!_db) {
		if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
		const client = postgres(env.DATABASE_URL);
		_db = drizzle(client, { schema });
	}
	return _db;
}

// For backwards compatibility - will throw at runtime if DATABASE_URL not set
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
	get(_, prop) {
		return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
	}
});

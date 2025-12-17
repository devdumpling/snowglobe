import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { boolean, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { readFileSync } from 'fs';
import { join } from 'path';

// Inline schema (to avoid SvelteKit $env dependency)
const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	displayName: varchar('display_name', { length: 100 }).notNull(),
	avatarId: varchar('avatar_id', { length: 50 }).notNull(),
	isGuest: boolean('is_guest').notNull().default(false)
});

// Direct database connection
const DATABASE_URL =
	process.env.DATABASE_URL || 'postgres://root:mysecretpassword@localhost:5432/local';
const client = postgres(DATABASE_URL);
const db = drizzle(client);

// Load team config from JSON
interface TeamMemberConfig {
	id: string;
	name: string;
	title?: string;
	image: string;
	accentColor: string;
}

interface TeamConfig {
	avatars: Record<string, { id: string; name: string; image: string; accentColor: string }>;
	teamMembers: TeamMemberConfig[];
	guestAvatars: string[];
	defaultPassword: string;
}

function loadTeamConfig(): TeamConfig {
	const configPath = join(process.cwd(), 'src', 'lib', 'config', 'team.json');
	const content = readFileSync(configPath, 'utf-8');
	return JSON.parse(content);
}

interface SeedUser {
	username: string;
	displayName: string;
	avatarId: string;
}

async function seedUsers() {
	console.log('Loading team configuration...');
	const teamConfig = loadTeamConfig();

	// Generate users from team members
	const users: SeedUser[] = teamConfig.teamMembers.map((member) => ({
		username: member.name.toLowerCase().replace(/\s+/g, '_'),
		displayName: member.name,
		avatarId: member.id
	}));

	if (users.length === 0) {
		console.log('No team members found in config. Add team members to config/team.json');
		await client.end();
		process.exit(0);
	}

	console.log(`\nSeeding ${users.length} users...\n`);

	// Use the password from config
	const password = teamConfig.defaultPassword;
	console.log(`Using password from config: ${password}`);

	const passwordHash = await bcrypt.hash(password, 10);

	for (const u of users) {
		await db
			.insert(user)
			.values({
				id: crypto.randomUUID(),
				username: u.username,
				passwordHash: passwordHash,
				displayName: u.displayName,
				avatarId: u.avatarId,
				isGuest: false
			})
			.onConflictDoNothing();

		console.log(`  ✓ ${u.displayName} (${u.avatarId})`);
	}

	console.log(`\nSeeded ${users.length} users.`);
	console.log(`Password for all accounts: ${password}`);
	console.log('\n⚠️  Remember to change the default password in config/team.json!');

	await client.end();
	process.exit(0);
}

seedUsers().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});

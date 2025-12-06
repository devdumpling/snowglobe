import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module before importing auth
vi.mock('$lib/server/db', () => ({
	db: {
		insert: vi.fn().mockReturnValue({
			values: vi.fn().mockResolvedValue(undefined)
		}),
		select: vi.fn().mockReturnValue({
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([])
				})
			})
		}),
		delete: vi.fn().mockReturnValue({
			where: vi.fn().mockResolvedValue(undefined)
		}),
		update: vi.fn().mockReturnValue({
			set: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue(undefined)
			})
		})
	}
}));

// Mock the schema module
vi.mock('$lib/server/db/schema', () => ({
	session: { id: 'id', userId: 'userId', expiresAt: 'expiresAt' },
	user: {
		id: 'id',
		username: 'username',
		displayName: 'displayName',
		avatarId: 'avatarId',
		isGuest: 'isGuest'
	}
}));

import { generateSessionToken, createSession, validateSessionToken, sessionCookieName } from './auth';
import { db } from '$lib/server/db';

describe('generateSessionToken', () => {
	it('produces a string token', () => {
		const token = generateSessionToken();
		expect(typeof token).toBe('string');
	});

	it('produces tokens of consistent length', () => {
		const token = generateSessionToken();
		// Base64url encoding of 18 bytes = 24 characters
		expect(token.length).toBe(24);
	});

	it('produces base64url-safe characters only', () => {
		const token = generateSessionToken();
		// Base64url uses A-Z, a-z, 0-9, -, _
		expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
	});

	it('produces unique tokens', () => {
		const tokens = new Set<string>();
		for (let i = 0; i < 100; i++) {
			tokens.add(generateSessionToken());
		}
		expect(tokens.size).toBe(100);
	});
});

describe('createSession', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns a session object with correct userId', async () => {
		const token = 'test-token';
		const userId = 'user-123';

		const session = await createSession(token, userId);

		expect(session.userId).toBe(userId);
	});

	it('sets expiry to 30 days in the future', async () => {
		const token = 'test-token';
		const userId = 'user-123';
		const beforeCreate = Date.now();

		const session = await createSession(token, userId);

		const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
		const expectedExpiry = beforeCreate + thirtyDaysMs;

		// Allow 1 second tolerance for test execution time
		expect(session.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedExpiry - 1000);
		expect(session.expiresAt.getTime()).toBeLessThanOrEqual(expectedExpiry + 1000);
	});

	it('calls db.insert with session data', async () => {
		const token = 'test-token';
		const userId = 'user-123';

		await createSession(token, userId);

		expect(db.insert).toHaveBeenCalled();
	});

	it('hashes the token for session ID (not stored in plain text)', async () => {
		const token = 'test-token';
		const userId = 'user-123';

		const session = await createSession(token, userId);

		// Session ID should be a hex string (SHA256 = 64 hex chars)
		expect(session.id).toMatch(/^[a-f0-9]{64}$/);
		// Session ID should not equal the raw token
		expect(session.id).not.toBe(token);
	});
});

describe('validateSessionToken', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns null session and user for non-existent session', async () => {
		// Mock returns empty array (no session found)
		vi.mocked(db.select).mockReturnValue({
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([])
				})
			})
		} as any);

		const result = await validateSessionToken('invalid-token');

		expect(result.session).toBeNull();
		expect(result.user).toBeNull();
	});

	it('deletes and returns null for expired session', async () => {
		const expiredDate = new Date(Date.now() - 1000); // 1 second ago

		vi.mocked(db.select).mockReturnValue({
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([
						{
							session: { id: 'session-id', userId: 'user-123', expiresAt: expiredDate },
							user: { id: 'user-123', username: 'test', displayName: 'Test', avatarId: 'dev', isGuest: false }
						}
					])
				})
			})
		} as any);

		const result = await validateSessionToken('some-token');

		expect(result.session).toBeNull();
		expect(result.user).toBeNull();
		expect(db.delete).toHaveBeenCalled();
	});

	it('returns session and user for valid non-expired session', async () => {
		const futureDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000); // 20 days from now

		vi.mocked(db.select).mockReturnValue({
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([
						{
							session: { id: 'session-id', userId: 'user-123', expiresAt: futureDate },
							user: { id: 'user-123', username: 'test', displayName: 'Test', avatarId: 'dev', isGuest: false }
						}
					])
				})
			})
		} as any);

		const result = await validateSessionToken('some-token');

		expect(result.session).not.toBeNull();
		expect(result.user).not.toBeNull();
		expect(result.user?.id).toBe('user-123');
	});

	it('renews session when within 15 days of expiry', async () => {
		const nearExpiryDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days from now

		vi.mocked(db.select).mockReturnValue({
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([
						{
							session: { id: 'session-id', userId: 'user-123', expiresAt: nearExpiryDate },
							user: { id: 'user-123', username: 'test', displayName: 'Test', avatarId: 'dev', isGuest: false }
						}
					])
				})
			})
		} as any);

		await validateSessionToken('some-token');

		// Should have called update to renew the session
		expect(db.update).toHaveBeenCalled();
	});

	it('does not renew session when more than 15 days from expiry', async () => {
		const farExpiryDate = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000); // 25 days from now

		vi.mocked(db.select).mockReturnValue({
			from: vi.fn().mockReturnValue({
				innerJoin: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([
						{
							session: { id: 'session-id', userId: 'user-123', expiresAt: farExpiryDate },
							user: { id: 'user-123', username: 'test', displayName: 'Test', avatarId: 'dev', isGuest: false }
						}
					])
				})
			})
		} as any);

		await validateSessionToken('some-token');

		// Should NOT have called update
		expect(db.update).not.toHaveBeenCalled();
	});
});

describe('sessionCookieName', () => {
	it('is defined and non-empty', () => {
		expect(sessionCookieName).toBeDefined();
		expect(sessionCookieName.length).toBeGreaterThan(0);
	});
});

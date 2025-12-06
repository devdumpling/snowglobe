import { hash } from '@node-rs/argon2';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { getRandomGuestAvatarId } from '$lib/data/avatars';
import type { Actions, PageServerLoad } from './$types';

// Secret party code for registration (from env or fallback)
const PARTY_CODE = env.PARTY_CODE ?? 'celebrate2025';

export const load: PageServerLoad = async (event) => {
	// If already logged in, redirect to app
	if (event.locals.user) {
		return redirect(302, '/app');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const displayName = formData.get('displayName');
		const password = formData.get('password');
		const partyCode = formData.get('partyCode');

		// Validate party code first
		if (!validatePartyCode(partyCode)) {
			return fail(400, {
				message: 'Invalid party code',
				username: typeof username === 'string' ? username : '',
				displayName: typeof displayName === 'string' ? displayName : ''
			});
		}

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Username must be 3-30 characters, letters, numbers, and underscores only',
				username: typeof username === 'string' ? username : '',
				displayName: typeof displayName === 'string' ? displayName : ''
			});
		}

		if (!validateDisplayName(displayName)) {
			return fail(400, {
				message: 'Display name must be 1-50 characters',
				username,
				displayName: typeof displayName === 'string' ? displayName : ''
			});
		}

		if (!validatePassword(password)) {
			return fail(400, {
				message: 'Password must be at least 6 characters',
				username,
				displayName
			});
		}

		try {
			// Check if username already exists
			const existingUser = await db
				.select()
				.from(table.user)
				.where(eq(table.user.username, username))
				.then((r) => r.at(0));

			if (existingUser) {
				return fail(400, {
					message: 'Username already taken',
					username,
					displayName
				});
			}

			// Hash password
			const passwordHash = await hash(password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			// Create user with random guest avatar
			const userId = crypto.randomUUID();
			const avatarId = getRandomGuestAvatarId();

			await db.insert(table.user).values({
				id: userId,
				username,
				passwordHash,
				displayName,
				avatarId,
				isGuest: true
			});

			// Create session and log them in
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			return redirect(302, '/app');
		} catch (e) {
			if (isRedirect(e)) throw e;
			return fail(500, {
				message: 'Something went wrong. Please try again.',
				username,
				displayName
			});
		}
	}
};

function validatePartyCode(code: unknown): code is string {
	return typeof code === 'string' && code === PARTY_CODE;
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 30 &&
		/^[a-zA-Z0-9_]+$/.test(username)
	);
}

function validateDisplayName(displayName: unknown): displayName is string {
	return typeof displayName === 'string' && displayName.length >= 1 && displayName.length <= 50;
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

import bcrypt from 'bcryptjs';
import { fail, redirect, isRedirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

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
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Invalid username',
				username: typeof username === 'string' ? username : ''
			});
		}

		if (!validatePassword(password)) {
			return fail(400, {
				message: 'Invalid password',
				username
			});
		}

		try {
			// Find user by username
			const results = await db.select().from(table.user).where(eq(table.user.username, username));
			const existingUser = results.at(0);

			if (!existingUser) {
				return fail(400, {
					message: 'Incorrect username or password',
					username
				});
			}

			// Verify password
			const validPassword = await bcrypt.compare(password, existingUser.passwordHash);

			if (!validPassword) {
				return fail(400, {
					message: 'Incorrect username or password',
					username
				});
			}

			// Create session
			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, existingUser.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

			return redirect(302, '/app');
		} catch (e) {
			if (isRedirect(e)) throw e;
			return fail(500, {
				message: 'Something went wrong. Please try again.',
				username
			});
		}
	}
};

function validateUsername(username: unknown): username is string {
	return typeof username === 'string' && username.length >= 1 && username.length <= 50;
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 1 && password.length <= 255;
}

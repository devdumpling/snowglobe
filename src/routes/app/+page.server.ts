import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { guestbookEntry, user, cookieLike } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}

	try {
		// Load guestbook entries with user display names
		const entries = await db
			.select({
				id: guestbookEntry.id,
				message: guestbookEntry.message,
				createdAt: guestbookEntry.createdAt,
				userId: guestbookEntry.userId,
				displayName: user.displayName,
				avatarId: user.avatarId
			})
			.from(guestbookEntry)
			.leftJoin(user, eq(guestbookEntry.userId, user.id))
			.orderBy(desc(guestbookEntry.createdAt))
			.limit(50);

		// Load cookie like counts
		const cookieLikes = await db.select().from(cookieLike);
		const cookieCounts: Record<string, number> = {};
		for (const like of cookieLikes) {
			cookieCounts[like.eventId] = like.count;
		}

		return {
			user: event.locals.user,
			guestbookEntries: entries,
			cookieCounts
		};
	} catch {
		// Return minimal data on error - app still works without guestbook/cookies
		return {
			user: event.locals.user,
			guestbookEntries: [],
			cookieCounts: {}
		};
	}
};

// Shared type definitions

/**
 * Authenticated user from session
 */
export interface AppUser {
	id: string;
	username: string;
	displayName: string;
	avatarId: string;
	isGuest: boolean;
}

/**
 * Guestbook entry (used for both SSR data and realtime updates)
 * Some fields are optional to handle both DB records and realtime payloads
 */
export interface GuestbookEntry {
	id: number | string;
	message: string;
	displayName: string | null;
	avatarId?: string | null;
	userId?: string;
	createdAt?: string | Date;
}

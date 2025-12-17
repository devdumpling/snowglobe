import { writable, derived } from 'svelte/store';
import type { OnlineUser, CursorPosition, GuestbookEntry } from './types';

// Online users store
export const onlineUsers = writable<OnlineUser[]>([]);

// Cursor positions store (keyed by userId)
export const cursorPositions = writable<Record<string, CursorPosition>>({});

// New guestbook entries (append to existing list)
export const newGuestbookEntries = writable<GuestbookEntry[]>([]);

// Cookie like counts (keyed by eventId)
export const cookieLikeCounts = writable<Record<string, number>>({});

// Connection status
export const connectionStatus = writable<'connecting' | 'connected' | 'disconnected'>(
	'disconnected'
);

// Error notifications from WebSocket (auto-clears after display)
export const wsError = writable<{ code: string; message: string } | null>(null);

// Get cursors excluding self
export function getOtherCursors(myUserId: string) {
	return derived(cursorPositions, ($positions) => {
		const others: Record<string, CursorPosition & { user?: OnlineUser }> = {};
		for (const [userId, pos] of Object.entries($positions)) {
			if (userId !== myUserId) {
				others[userId] = pos;
			}
		}
		return others;
	});
}

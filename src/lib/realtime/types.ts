// Types for realtime WebSocket communication

export interface OnlineUser {
	userId: string;
	displayName: string;
	avatarId: string;
}

export interface CursorPosition {
	x: number;
	y: number;
}

export interface GuestbookEntry {
	id: number;
	userId: string;
	displayName: string;
	avatarId: string;
	message: string;
	createdAt: string;
}

// Reaction emoji options
export const REACTION_EMOJIS = ['❤️', '🎉', '🔥', '👏', '😂', '🤯'] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

// Floating reaction (for display)
export interface FloatingReaction {
	id: string;
	emoji: ReactionEmoji;
	userId: string;
	x: number; // Random horizontal position (0-100%)
	createdAt: number;
}

// Outbound messages (client → server)
export type OutboundMessage =
	| { type: 'identify'; userId: string; displayName: string; avatarId: string }
	| { type: 'cursor'; x: number; y: number }
	| { type: 'guestbook'; message: string }
	| { type: 'cookie_like'; eventId: string }
	| { type: 'reaction'; emoji: ReactionEmoji }
	| { type: 'ping' };

// Inbound messages (server → client)
export type InboundMessage =
	| { type: 'presence'; users: OnlineUser[] }
	| { type: 'cursors'; positions: Record<string, CursorPosition> }
	| { type: 'guestbook_new'; entry: GuestbookEntry }
	| { type: 'cookie_update'; eventId: string; count: number }
	| { type: 'reaction'; emoji: ReactionEmoji; userId: string }
	| { type: 'error'; code: string; message: string }
	| { type: 'pong' };

import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import {
	onlineUsers,
	cursorPositions,
	newGuestbookEntries,
	cookieLikeCounts,
	connectionStatus,
	wsError
} from './stores';
import { addReaction } from './reactions';
import type { OutboundMessage, InboundMessage, OnlineUser, ReactionEmoji } from './types';

function getWsUrl() {
	return env.PUBLIC_WS_URL || 'ws://localhost:4000/ws';
}
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000];

let ws: WebSocket | null = null;
let reconnectAttempt = 0;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;
let userInfo: { userId: string; displayName: string; avatarId: string } | null = null;

/**
 * Connect to the WebSocket server and identify the user
 */
export function connect(userId: string, displayName: string, avatarId: string = 'guest') {
	if (!browser) return;

	// If already connected or connecting, don't create duplicate connection
	if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
		return;
	}

	userInfo = { userId, displayName, avatarId };
	connectionStatus.set('connecting');

	try {
		ws = new WebSocket(getWsUrl());

		ws.onopen = () => {
			connectionStatus.set('connected');
			reconnectAttempt = 0;

			// Send identify message
			send({ type: 'identify', userId, displayName, avatarId });

			// Start ping interval (every 30s)
			pingInterval = setInterval(() => {
				send({ type: 'ping' });
			}, 30000);
		};

		ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data) as InboundMessage;
				handleMessage(message);
			} catch {
				// Ignore malformed messages
			}
		};

		ws.onclose = () => {
			connectionStatus.set('disconnected');
			cleanup();
			scheduleReconnect();
		};

		ws.onerror = () => {
			// Error will trigger onclose
		};
	} catch {
		connectionStatus.set('disconnected');
		scheduleReconnect();
	}
}

/**
 * Disconnect from the WebSocket server
 */
export function disconnect() {
	// Clear userInfo first to prevent scheduleReconnect from firing
	userInfo = null;

	if (reconnectTimeout) {
		clearTimeout(reconnectTimeout);
		reconnectTimeout = null;
	}
	cleanup();
	if (ws) {
		ws.close();
		ws = null;
	}
	connectionStatus.set('disconnected');
}

/**
 * Send a cursor position update
 */
export function sendCursor(x: number, y: number) {
	send({ type: 'cursor', x: Math.round(x), y: Math.round(y) });
}

/**
 * Send a guestbook message
 */
export function sendGuestbook(message: string) {
	send({ type: 'guestbook', message });
}

/**
 * Send a cookie like for an event
 */
export function sendCookieLike(eventId: string) {
	send({ type: 'cookie_like', eventId });
}

/**
 * Send a reaction emoji
 */
export function sendReaction(emoji: ReactionEmoji) {
	send({ type: 'reaction', emoji });
	// Also add to local store immediately for instant feedback
	if (userInfo) {
		addReaction(emoji, userInfo.userId);
	}
}

// Internal functions

function send(message: OutboundMessage) {
	if (ws?.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(message));
	}
}

function handleMessage(message: InboundMessage) {
	switch (message.type) {
		case 'presence': {
			onlineUsers.set(message.users);
			// Clean up cursors for users who are no longer online
			const onlineUserIds = new Set(message.users.map((u: OnlineUser) => u.userId));
			cursorPositions.update((current) => {
				const cleaned: typeof current = {};
				for (const userId in current) {
					if (onlineUserIds.has(userId)) {
						cleaned[userId] = current[userId];
					}
				}
				return cleaned;
			});
			break;
		}

		case 'cursors':
			// Merge delta positions into existing state (backend sends only changed cursors)
			cursorPositions.update((current) => ({
				...current,
				...message.positions
			}));
			break;

		case 'guestbook_new':
			newGuestbookEntries.update((entries) => [message.entry, ...entries]);
			break;

		case 'cookie_update':
			cookieLikeCounts.update((counts) => ({
				...counts,
				[message.eventId]: message.count
			}));
			break;

		case 'reaction':
			// Add reaction from other users (our own are added immediately in sendReaction)
			if (message.userId !== userInfo?.userId) {
				addReaction(message.emoji, message.userId);
			}
			break;

		case 'error':
			// Set error for UI to display, auto-clear after 5s
			wsError.set({ code: message.code, message: message.message });
			setTimeout(() => wsError.set(null), 5000);
			break;

		case 'pong':
			// Connection is alive
			break;
	}
}

function cleanup() {
	if (pingInterval) {
		clearInterval(pingInterval);
		pingInterval = null;
	}
}

function scheduleReconnect() {
	if (!userInfo) return;

	const delay = RECONNECT_DELAYS[Math.min(reconnectAttempt, RECONNECT_DELAYS.length - 1)];

	reconnectTimeout = setTimeout(() => {
		reconnectAttempt++;
		if (userInfo) {
			connect(userInfo.userId, userInfo.displayName, userInfo.avatarId);
		}
	}, delay);
}

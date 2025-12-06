import { writable } from 'svelte/store';
import type { FloatingReaction, ReactionEmoji } from './types';

// Store for floating reactions
export const floatingReactions = writable<FloatingReaction[]>([]);

// Auto-cleanup timing
const REACTION_LIFETIME_MS = 3000;
const CLEANUP_INTERVAL_MS = 500;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Add a new floating reaction
 */
export function addReaction(emoji: ReactionEmoji, userId: string) {
	const reaction: FloatingReaction = {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
		emoji,
		userId,
		x: 10 + Math.random() * 80, // Random position between 10-90%
		createdAt: Date.now()
	};

	floatingReactions.update((reactions) => [...reactions, reaction]);

	// Start cleanup if not running
	if (!cleanupInterval) {
		startCleanup();
	}
}

/**
 * Start the cleanup interval
 */
function startCleanup() {
	cleanupInterval = setInterval(() => {
		const now = Date.now();
		floatingReactions.update((reactions) => {
			const remaining = reactions.filter((r) => now - r.createdAt < REACTION_LIFETIME_MS);

			// Stop cleanup if no reactions left
			if (remaining.length === 0 && cleanupInterval) {
				clearInterval(cleanupInterval);
				cleanupInterval = null;
			}

			return remaining;
		});
	}, CLEANUP_INTERVAL_MS);
}

/**
 * Stop cleanup (call on unmount)
 */
export function stopReactionsCleanup() {
	if (cleanupInterval) {
		clearInterval(cleanupInterval);
		cleanupInterval = null;
	}
}

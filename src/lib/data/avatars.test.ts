import { describe, it, expect } from 'vitest';
import {
	getAvatar,
	getPixelatedAvatar,
	getRandomGuestAvatarId,
	avatars,
	GUEST_AVATAR_IDS
} from './avatars';

describe('getAvatar', () => {
	it('returns correct avatar data for valid ID', () => {
		const avatar = getAvatar('guest_1');
		expect(avatar).toBeDefined();
		expect(avatar.id).toBe('guest_1');
		expect(avatar.name).toBe('Team Member 1');
		expect(avatar.pixelated).toContain('/images/avatars/');
	});

	it('returns default avatar for invalid ID', () => {
		const avatar = getAvatar('nonexistent-id');
		expect(avatar).toBeDefined();
		expect(avatar.id).toBe('guest');
		expect(avatar.name).toBe('Guest');
	});

	it('returns default avatar for empty string', () => {
		const avatar = getAvatar('');
		expect(avatar.id).toBe('guest');
	});

	it('returns correct avatar for each known avatar ID', () => {
		Object.keys(avatars).forEach((avatarId) => {
			const avatar = getAvatar(avatarId);
			expect(avatar.id).toBe(avatarId);
		});
	});
});

describe('getPixelatedAvatar', () => {
	it('returns correct pixelated URL for valid ID', () => {
		const url = getPixelatedAvatar('guest_1');
		expect(url).toBe('/images/avatars/defaults/avatar-red.webp');
	});

	it('returns default pixelated URL for invalid ID', () => {
		const url = getPixelatedAvatar('invalid');
		expect(url).toBe('/images/avatars/defaults/avatar-sage.webp'); // Default avatar
	});

	it('all avatars have valid pixelated URLs', () => {
		Object.keys(avatars).forEach((avatarId) => {
			const url = getPixelatedAvatar(avatarId);
			expect(url).toMatch(/^\/images\/avatars\/.*\.webp$/);
		});
	});
});

describe('getRandomGuestAvatarId', () => {
	it('returns a valid guest avatar ID', () => {
		const id = getRandomGuestAvatarId();
		expect(GUEST_AVATAR_IDS).toContain(id);
	});

	it('returns different values over multiple calls (probabilistic)', () => {
		const ids = new Set<string>();
		for (let i = 0; i < 100; i++) {
			ids.add(getRandomGuestAvatarId());
		}
		// Should have more than 1 unique value after 100 calls
		expect(ids.size).toBeGreaterThan(1);
	});

	it('only returns values from GUEST_AVATAR_IDS', () => {
		for (let i = 0; i < 50; i++) {
			const id = getRandomGuestAvatarId();
			expect(GUEST_AVATAR_IDS).toContain(id);
		}
	});
});

describe('avatars data integrity', () => {
	it('all avatars have required fields', () => {
		Object.entries(avatars).forEach(([id, avatar]) => {
			expect(avatar.id).toBe(id);
			expect(avatar.name).toBeDefined();
			expect(avatar.name.length).toBeGreaterThan(0);
			expect(avatar.pixelated).toBeDefined();
			expect(avatar.accentColor).toBeDefined();
		});
	});

	it('accent colors are CSS variables', () => {
		Object.values(avatars).forEach((avatar) => {
			expect(avatar.accentColor).toMatch(/^var\(--/);
		});
	});

	it('GUEST_AVATAR_IDS contains expected values', () => {
		expect(GUEST_AVATAR_IDS.length).toBe(8);
		GUEST_AVATAR_IDS.forEach((id) => {
			expect(id).toMatch(/^guest_\d+$/);
		});
	});
});

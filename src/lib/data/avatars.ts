/**
 * Avatar system - re-exports from config with helper functions
 */
import {
	avatars as configAvatars,
	teamMembers as configTeamMembers,
	guestAvatars,
	type Avatar as ConfigAvatar,
	type TeamMember as ConfigTeamMember
} from '$lib/config';

// ============================================
// Type Definitions (compatible with existing code)
// ============================================

export interface Avatar {
	id: string;
	name: string;
	pixelated: string;
	accentColor: string;
}

export interface TeamMember extends Avatar {
	title?: string;
	isAlumni?: boolean;
	funFact?: string;
}

// ============================================
// Avatar Color Palette
// ============================================

const ACCENT_COLORS = [
	'var(--holiday-red)',
	'var(--holiday-green)',
	'var(--holiday-gold)',
	'var(--holiday-blue)',
	'var(--pastel-rose)',
	'var(--pastel-sage)',
	'var(--pastel-blue)',
	'var(--pastel-lavender)'
];

// ============================================
// Transform Config to Runtime Format
// ============================================

function configToAvatar(config: ConfigAvatar): Avatar {
	// Transform config image path to full path
	const imagePath = config.image.startsWith('defaults/')
		? `/images/avatars/${config.image}`
		: config.image.startsWith('custom/')
			? `/images/avatars/${config.image}`
			: config.image.startsWith('/')
				? config.image
				: `/images/avatars/${config.image}`;

	return {
		id: config.id,
		name: config.name,
		pixelated: imagePath,
		accentColor: config.accentColor
	};
}

function configToTeamMember(config: ConfigTeamMember, index: number): TeamMember {
	const imagePath = config.image.startsWith('defaults/')
		? `/images/avatars/${config.image}`
		: config.image.startsWith('custom/')
			? `/images/avatars/${config.image}`
			: config.image.startsWith('/')
				? config.image
				: `/images/avatars/${config.image}`;

	return {
		id: config.id,
		name: config.name,
		pixelated: imagePath,
		accentColor: config.accentColor || ACCENT_COLORS[index % ACCENT_COLORS.length],
		title: config.title,
		isAlumni: config.isAlumni,
		funFact: config.funFact
	};
}

// ============================================
// Exported Data
// ============================================

/** Avatar lookup map */
export const avatars: Record<string, Avatar> = Object.fromEntries(
	Object.entries(configAvatars).map(([key, value]) => [key, configToAvatar(value)])
);

/** Team members list */
export const teamMembers: TeamMember[] = configTeamMembers.map((m, i) => configToTeamMember(m, i));

/** Guest avatar IDs for random assignment */
export const GUEST_AVATAR_IDS = guestAvatars as readonly string[];

// ============================================
// Helper Functions
// ============================================

/** Get a random guest avatar ID */
export function getRandomGuestAvatarId(): string {
	return GUEST_AVATAR_IDS[Math.floor(Math.random() * GUEST_AVATAR_IDS.length)];
}

/** Default/fallback avatar */
const DEFAULT_AVATAR: Avatar = {
	id: 'guest',
	name: 'Guest',
	pixelated: '/images/avatars/defaults/avatar-sage.webp',
	accentColor: 'var(--pastel-charcoal)'
};

/** Get avatar data by avatarId */
export function getAvatar(avatarId: string): Avatar {
	return avatars[avatarId] ?? DEFAULT_AVATAR;
}

/** Get pixelated avatar URL by avatarId */
export function getPixelatedAvatar(avatarId: string): string {
	return getAvatar(avatarId).pixelated;
}

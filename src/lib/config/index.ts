/**
 * Config module - centralized configuration for the snowglobe template
 *
 * All customizable content is loaded from JSON files in /config/
 * and validated using Valibot schemas at build time.
 */

// Re-export everything from loader
export {
	// Full config objects
	siteConfig,
	timelineConfig,
	teamConfig,
	monthBlurbsConfig,
	photosConfig,
	// Convenience accessors
	site,
	theme,
	yearStats,
	majorEvents,
	minorEvents,
	newHires,
	avatars,
	teamMembers,
	guestAvatars,
	defaultPassword,
	monthBlurbs,
	photoClusters
} from './loader';

// Re-export types
export type {
	SiteConfig,
	TimelineConfig,
	TeamConfig,
	MonthBlurbs,
	PhotosConfig,
	YearStat,
	ThemeColors,
	TimelineEvent,
	MinorEvent,
	NewHireEvent,
	Avatar,
	TeamMember,
	EventCategory,
	Photo,
	PhotoCluster
} from './schemas';

// Re-export theme utilities
export { generateThemeCSS, getThemeColors, isCustomTheme } from './theme';

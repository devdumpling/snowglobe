/**
 * Config loader - imports and validates JSON config at build time
 */
import * as v from 'valibot';
import {
	SiteConfigSchema,
	TimelineConfigSchema,
	TeamConfigSchema,
	MonthBlurbsSchema,
	PhotosConfigSchema,
	type SiteConfig,
	type TimelineConfig,
	type TeamConfig,
	type MonthBlurbs,
	type PhotosConfig
} from './schemas';

// Import JSON files (bundled at build time)
import siteJson from './site.json';
import timelineJson from './timeline.json';
import teamJson from './team.json';
import monthBlurbsJson from './month-blurbs.json';
import photosJson from './photos.json';

/**
 * Validate and parse config with helpful error messages
 */
function loadConfig<T>(schema: v.GenericSchema<unknown, T>, data: unknown, name: string): T {
	const result = v.safeParse(schema, data);
	if (!result.success) {
		const issues = v.flatten(result.issues);
		console.error(`Config validation failed for ${name}:`, issues);
		throw new Error(`Invalid ${name} config. Check console for details.`);
	}
	return result.output;
}

// ============================================
// Validated Config Exports
// ============================================

export const siteConfig: SiteConfig = loadConfig(SiteConfigSchema, siteJson, 'site.json');
export const timelineConfig: TimelineConfig = loadConfig(
	TimelineConfigSchema,
	timelineJson,
	'timeline.json'
);
export const teamConfig: TeamConfig = loadConfig(TeamConfigSchema, teamJson, 'team.json');
export const monthBlurbsConfig: MonthBlurbs = loadConfig(
	MonthBlurbsSchema,
	monthBlurbsJson,
	'month-blurbs.json'
);
export const photosConfig: PhotosConfig = loadConfig(
	PhotosConfigSchema,
	photosJson,
	'photos.json'
);

// ============================================
// Convenience Accessors
// ============================================

/** Site metadata */
export const site = siteConfig.site;

/** Theme configuration */
export const theme = siteConfig.theme;

/** Year stats for the header */
export const yearStats = siteConfig.yearStats;

/** Major timeline events (one per month) */
export const majorEvents = timelineConfig.majorEvents;

/** Minor events (sticky notes) */
export const minorEvents = timelineConfig.minorEvents;

/** New hire events */
export const newHires = timelineConfig.newHires;

/** Avatar definitions */
export const avatars = teamConfig.avatars;

/** Team member list */
export const teamMembers = teamConfig.teamMembers;

/** Guest avatar IDs for random assignment */
export const guestAvatars = teamConfig.guestAvatars;

/** Default password for seeding */
export const defaultPassword = teamConfig.defaultPassword;

/** Monthly narrative blurbs */
export const monthBlurbs = monthBlurbsConfig;

/** Photo clusters */
export const photoClusters = photosConfig.clusters;

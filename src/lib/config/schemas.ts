/**
 * Valibot schemas for config validation
 * These ensure type-safe config loading at build time
 */
import * as v from 'valibot';

// ============================================
// Site Config Schema
// ============================================

export const YearStatSchema = v.object({
	label: v.string(),
	value: v.string(),
	emoji: v.optional(v.string())
});

export const ThemeColorsSchema = v.object({
	primary: v.string(),
	secondary: v.string(),
	accent: v.string()
});

export const ThemeSchema = v.object({
	colors: ThemeColorsSchema
});

export const SiteInfoSchema = v.object({
	title: v.string(),
	subtitle: v.string(),
	year: v.number(),
	partyCode: v.string(),
	footer: v.string()
});

export const SiteConfigSchema = v.object({
	site: SiteInfoSchema,
	theme: ThemeSchema,
	yearStats: v.array(YearStatSchema)
});

// ============================================
// Timeline Config Schema
// ============================================

export const EventCategorySchema = v.picklist([
	'launch',
	'milestone',
	'team',
	'culture',
	'achievement',
	'fun'
]);

export const EventStatSchema = v.object({
	label: v.string(),
	value: v.string(),
	emoji: v.optional(v.string())
});

export const EventDetailsSchema = v.object({
	content: v.string(),
	images: v.optional(v.array(v.string()))
});

export const TimelineEventSchema = v.object({
	id: v.string(),
	date: v.string(),
	title: v.string(),
	description: v.string(),
	category: EventCategorySchema,
	emoji: v.optional(v.string()),
	imageUrl: v.optional(v.string()),
	month: v.pipe(v.number(), v.minValue(0), v.maxValue(11)),
	details: v.optional(EventDetailsSchema),
	isMajor: v.optional(v.boolean()),
	stats: v.optional(v.array(EventStatSchema)),
	blurb: v.optional(v.string())
});

export const MinorEventSchema = v.object({
	id: v.string(),
	title: v.string(),
	emoji: v.optional(v.string()),
	afterMonth: v.pipe(v.number(), v.minValue(0), v.maxValue(11))
});

export const NewHireEventSchema = v.object({
	id: v.string(),
	name: v.string(),
	avatarId: v.string(),
	afterMonth: v.pipe(v.number(), v.minValue(0), v.maxValue(11))
});

export const TimelineConfigSchema = v.object({
	majorEvents: v.array(TimelineEventSchema),
	minorEvents: v.array(MinorEventSchema),
	newHires: v.array(NewHireEventSchema)
});

// ============================================
// Team Config Schema
// ============================================

export const AvatarSchema = v.object({
	id: v.string(),
	name: v.string(),
	image: v.string(),
	accentColor: v.string()
});

export const TeamMemberSchema = v.object({
	id: v.string(),
	name: v.string(),
	title: v.optional(v.string()),
	image: v.string(),
	accentColor: v.string(),
	isAlumni: v.optional(v.boolean()),
	funFact: v.optional(v.string())
});

export const TeamConfigSchema = v.object({
	avatars: v.record(v.string(), AvatarSchema),
	teamMembers: v.array(TeamMemberSchema),
	guestAvatars: v.array(v.string()),
	defaultPassword: v.string()
});

// ============================================
// Month Blurbs Schema
// ============================================

export const MonthBlurbsSchema = v.record(
	v.pipe(v.string(), v.regex(/^([0-9]|1[01])$/)),
	v.string()
);

// ============================================
// Photos Config Schema
// ============================================

export const PhotoSchema = v.object({
	id: v.string(),
	src: v.string()
});

export const PhotoClusterSchema = v.object({
	id: v.string(),
	month: v.pipe(v.number(), v.minValue(0), v.maxValue(11)),
	photos: v.array(PhotoSchema)
});

export const PhotosConfigSchema = v.object({
	clusters: v.array(PhotoClusterSchema)
});

// ============================================
// Type Exports
// ============================================

export type SiteConfig = v.InferOutput<typeof SiteConfigSchema>;
export type TimelineConfig = v.InferOutput<typeof TimelineConfigSchema>;
export type TeamConfig = v.InferOutput<typeof TeamConfigSchema>;
export type MonthBlurbs = v.InferOutput<typeof MonthBlurbsSchema>;
export type PhotosConfig = v.InferOutput<typeof PhotosConfigSchema>;

export type YearStat = v.InferOutput<typeof YearStatSchema>;
export type ThemeColors = v.InferOutput<typeof ThemeColorsSchema>;
export type TimelineEvent = v.InferOutput<typeof TimelineEventSchema>;
export type MinorEvent = v.InferOutput<typeof MinorEventSchema>;
export type NewHireEvent = v.InferOutput<typeof NewHireEventSchema>;
export type Avatar = v.InferOutput<typeof AvatarSchema>;
export type TeamMember = v.InferOutput<typeof TeamMemberSchema>;
export type EventCategory = v.InferOutput<typeof EventCategorySchema>;
export type Photo = v.InferOutput<typeof PhotoSchema>;
export type PhotoCluster = v.InferOutput<typeof PhotoClusterSchema>;

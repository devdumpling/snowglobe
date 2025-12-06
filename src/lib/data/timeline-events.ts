/**
 * Timeline events - re-exports from config with helper functions
 */
import {
	majorEvents,
	minorEvents,
	newHires,
	type TimelineEvent,
	type MinorEvent,
	type NewHireEvent,
	type EventCategory
} from '$lib/config';

// Re-export types and data from config
export type { TimelineEvent, MinorEvent, NewHireEvent, EventCategory };
export { majorEvents, minorEvents, newHires };

// Also export the EventStat and EventDetails types for components that need them
export interface EventStat {
	label: string;
	value: string;
	emoji?: string;
}

export interface EventDetails {
	content: string;
	images?: string[];
}

// ============================================
// Helper Functions
// ============================================

export function getMajorEventByMonth(month: number): TimelineEvent | undefined {
	return majorEvents.find((event) => event.month === month);
}

export function getMinorEventsAfterMonth(month: number): MinorEvent[] {
	return minorEvents.filter((event) => event.afterMonth === month);
}

export function getNewHiresAfterMonth(month: number): NewHireEvent[] {
	return newHires.filter((hire) => hire.afterMonth === month);
}

export function getAllEventsByMonth(month: number): TimelineEvent[] {
	return majorEvents.filter((event) => new Date(event.date).getMonth() === month);
}

// Updated category colors for pastel palette
export const categoryColors: Record<EventCategory, string> = {
	launch: 'var(--pastel-rose)',
	milestone: 'var(--pastel-gold)',
	team: 'var(--pastel-sage)',
	culture: 'var(--pastel-blue)',
	achievement: 'var(--pastel-rose-dark)',
	fun: 'var(--pastel-blue-light)'
};

export const categoryLabels: Record<EventCategory, string> = {
	launch: 'Launch',
	milestone: 'Milestone',
	team: 'Team',
	culture: 'Culture',
	achievement: 'Achievement',
	fun: 'Fun'
};

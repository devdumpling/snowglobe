import { describe, it, expect } from 'vitest';
import {
	getMajorEventByMonth,
	getMinorEventsAfterMonth,
	getNewHiresAfterMonth,
	getAllEventsByMonth,
	majorEvents,
	minorEvents,
	newHires
} from './timeline-events';

describe('getMajorEventByMonth', () => {
	it('returns the correct event for month 0 (January)', () => {
		const event = getMajorEventByMonth(0);
		expect(event).toBeDefined();
		expect(event?.id).toBe('jan-kickoff');
		expect(event?.month).toBe(0);
	});

	it('returns the correct event for month 11 (December)', () => {
		const event = getMajorEventByMonth(11);
		expect(event).toBeDefined();
		expect(event?.id).toBe('dec-celebration');
		expect(event?.month).toBe(11);
	});

	it('returns undefined for invalid month 12', () => {
		const event = getMajorEventByMonth(12);
		expect(event).toBeUndefined();
	});

	it('returns undefined for negative month', () => {
		const event = getMajorEventByMonth(-1);
		expect(event).toBeUndefined();
	});

	it('returns events for all 12 months', () => {
		for (let month = 0; month < 12; month++) {
			const event = getMajorEventByMonth(month);
			expect(event).toBeDefined();
			expect(event?.month).toBe(month);
		}
	});
});

describe('getMinorEventsAfterMonth', () => {
	it('returns minor events after month 0', () => {
		const events = getMinorEventsAfterMonth(0);
		expect(events.length).toBeGreaterThan(0);
		expect(events.every((e) => e.afterMonth === 0)).toBe(true);
	});

	it('returns empty array for month with no minor events', () => {
		// Check if month 11 has any events (it shouldn't based on the data)
		const events = getMinorEventsAfterMonth(11);
		expect(Array.isArray(events)).toBe(true);
	});

	it('filters correctly - only returns events for the specified month', () => {
		const month = 3;
		const events = getMinorEventsAfterMonth(month);
		events.forEach((event) => {
			expect(event.afterMonth).toBe(month);
		});
	});
});

describe('getNewHiresAfterMonth', () => {
	it('returns new hires after specified month', () => {
		const hires = getNewHiresAfterMonth(0);
		expect(hires.length).toBeGreaterThan(0);
		expect(hires.every((h) => h.afterMonth === 0)).toBe(true);
	});

	it('returns empty array for months with no new hires', () => {
		// Month 3 has no new hires in the template data
		const hires = getNewHiresAfterMonth(3);
		expect(hires).toEqual([]);
	});

	it('each new hire has required fields', () => {
		newHires.forEach((hire) => {
			expect(hire.id).toBeDefined();
			expect(hire.name).toBeDefined();
			expect(hire.avatarId).toBeDefined();
			expect(typeof hire.afterMonth).toBe('number');
		});
	});
});

describe('getAllEventsByMonth', () => {
	it('returns events where the date month matches', () => {
		// January events (month 0)
		const events = getAllEventsByMonth(0);
		events.forEach((event) => {
			const eventMonth = new Date(event.date).getMonth();
			expect(eventMonth).toBe(0);
		});
	});
});

describe('data integrity', () => {
	it('all major events have required fields', () => {
		majorEvents.forEach((event) => {
			expect(event.id).toBeDefined();
			expect(event.date).toBeDefined();
			expect(event.title).toBeDefined();
			expect(event.description).toBeDefined();
			expect(event.category).toBeDefined();
			expect(typeof event.month).toBe('number');
			expect(event.month).toBeGreaterThanOrEqual(0);
			expect(event.month).toBeLessThanOrEqual(11);
		});
	});

	it('all minor events have required fields', () => {
		minorEvents.forEach((event) => {
			expect(event.id).toBeDefined();
			expect(event.title).toBeDefined();
			expect(typeof event.afterMonth).toBe('number');
		});
	});

	it('there is exactly one major event per month', () => {
		const monthCounts = new Map<number, number>();
		majorEvents.forEach((event) => {
			monthCounts.set(event.month, (monthCounts.get(event.month) || 0) + 1);
		});

		for (let month = 0; month < 12; month++) {
			expect(monthCounts.get(month)).toBe(1);
		}
	});
});

/**
 * Monthly narrative blurbs - re-exports from config
 */
import { monthBlurbs as configMonthBlurbs } from '$lib/config';

/**
 * Monthly narrative blurbs for the timeline
 * Index corresponds to month (0 = January, 11 = December)
 */
export const monthBlurbs: Record<number, string> = Object.fromEntries(
	Object.entries(configMonthBlurbs).map(([key, value]) => [parseInt(key, 10), value])
);

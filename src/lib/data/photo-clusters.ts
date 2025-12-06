/**
 * Photo clusters - re-exports from config with helper functions
 */
import { photoClusters as configPhotoClusters, type Photo, type PhotoCluster } from '$lib/config';

// Re-export types
export type { Photo, PhotoCluster };

/**
 * Photo clusters for the timeline
 * Photos appear as stacked polaroids in each month section
 */
export const photoClusters: PhotoCluster[] = configPhotoClusters;

/**
 * Get photo clusters for a specific month
 */
export function getPhotoClustersForMonth(month: number): PhotoCluster[] {
	return photoClusters.filter((cluster) => cluster.month === month);
}

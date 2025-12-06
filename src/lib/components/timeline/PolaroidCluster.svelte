<script lang="ts">
	import type { PhotoCluster } from '$lib/data/photo-clusters';
	import Polaroid from './Polaroid.svelte';
	import { draggable } from '$lib/actions/draggable';

	interface Props {
		cluster: PhotoCluster;
	}

	let { cluster }: Props = $props();

	// Generate a seeded random number from string
	function seededRandom(seed: string): number {
		let hash = 0;
		for (let i = 0; i < seed.length; i++) {
			hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
		}
		// Mix the hash more thoroughly
		hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
		hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
		hash ^= hash >>> 16;
		return ((hash & 0x7fffffff) % 1000) / 1000;
	}

	// Track position and z-index for each photo
	let photoStates = $state(
		cluster.photos.map((photo, i) => {
			// Use very different seeds for each property
			const randX = seededRandom(`${photo.id}-x-${i * 7919}`);
			const randY = seededRandom(`${photo.id}-y-${i * 6271}`);
			const randRot = seededRandom(`${photo.id}-rot-${i * 3571}`);
			return {
				id: photo.id,
				x: i * 25 + (randX - 0.5) * 30, // More spread
				y: i * 20 + (randY - 0.5) * 20, // More spread
				z: i, // Initial z-index (later photos on top)
				rotation: randRot * 24 - 12 // -12 to +12 degrees
			};
		})
	);

	let maxZ = $state(cluster.photos.length);

	function bringToFront(photoId: string) {
		maxZ++;
		const idx = photoStates.findIndex((p) => p.id === photoId);
		if (idx !== -1) {
			photoStates[idx].z = maxZ;
		}
	}

	function handleDrag(photoId: string, offset: { x: number; y: number }) {
		const idx = photoStates.findIndex((p) => p.id === photoId);
		if (idx !== -1) {
			photoStates[idx].x = offset.x;
			photoStates[idx].y = offset.y;
		}
	}
</script>

<div class="polaroid-cluster absolute left-0 bottom-[18%] hidden xl:block">
	{#each cluster.photos as photo, i (photo.id)}
		{@const state = photoStates[i]}
		<div
			class="polaroid-wrapper absolute cursor-grab active:cursor-grabbing"
			style="
				transform: translate({state.x}px, {state.y}px);
				z-index: {state.z};
			"
			use:draggable={{
				initialOffset: { x: state.x, y: state.y },
				onDragStart: () => bringToFront(photo.id),
				onDrag: (offset) => handleDrag(photo.id, offset)
			}}
		>
			<Polaroid {photo} rotation={state.rotation} />
		</div>
	{/each}
</div>

<style>
	.polaroid-cluster {
		z-index: 20;
		width: 240px;
		height: 280px;
	}
</style>

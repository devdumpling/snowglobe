<script lang="ts">
	import { Spring } from 'svelte/motion';
	import { getAvatar } from '$lib/data/avatars';

	interface Props {
		x: number;
		y: number;
		avatarId: string;
		displayName: string;
	}

	let { x, y, avatarId, displayName }: Props = $props();

	// Get avatar data
	let avatar = $derived(getAvatar(avatarId));

	// Spring-animated coordinates for smooth cursor movement
	// Lower stiffness = slower response, higher damping = less oscillation
	// These values tuned for ~50-100ms update intervals to feel fluid
	const springX = Spring.of(() => x, { stiffness: 0.12, damping: 0.7 });
	const springY = Spring.of(() => y, { stiffness: 0.12, damping: 0.7 });
</script>

<div
	class="absolute pointer-events-none z-9999 will-change-transform"
	style="transform: translate({springX.current}px, {springY.current}px)"
>
	<!-- Avatar image as cursor -->
	<img
		src={avatar.pixelated}
		alt={displayName}
		class="w-16 h-16 drop-shadow-[2px_2px_0_var(--pastel-charcoal)]"
	/>

	<!-- Name tag below avatar -->
	<div
		class="absolute left-1/2 top-full -translate-x-1/2 mt-1 font-pixel text-[8px] whitespace-nowrap bg-pastel-cream px-1.5 py-0.5 border-2 border-pastel-charcoal rounded shadow-sm"
	>
		{displayName}
	</div>
</div>

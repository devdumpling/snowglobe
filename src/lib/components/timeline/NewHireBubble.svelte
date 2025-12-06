<script lang="ts">
	import type { NewHireEvent } from '$lib/data/timeline-events';
	import { getPixelatedAvatar, getAvatar } from '$lib/data/avatars';
	import * as Tooltip from '$lib/components/ui/tooltip';

	interface Props {
		hire: NewHireEvent;
		index?: number; // For staggered animation delay
	}

	let { hire, index = 0 }: Props = $props();

	const avatar = $derived(getAvatar(hire.avatarId));
	const avatarUrl = $derived(getPixelatedAvatar(hire.avatarId));
	const animationDelay = $derived(`${index * 0.2}s`);
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<div
			class="new-hire-bubble opacity-70 hover:opacity-100 w-32 h-32 rounded-sm overflow-hidden cursor-pointer hover:scale-110 transition-transform"
			style="animation-delay: {animationDelay}; --accent-color: {avatar.accentColor}"
		>
			<img
				src={avatarUrl}
				alt={hire.name}
				loading="lazy"
				decoding="async"
				class="w-full h-full object-cover"
			/>
		</div>
	</Tooltip.Trigger>
	<Tooltip.Content side="top" class="bg-pastel-charcoal text-white px-2 py-1 text-xs rounded">
		<span class="font-pixel">{hire.name}</span>
		<span class="text-pastel-cream/70 ml-1">joined!</span>
	</Tooltip.Content>
</Tooltip.Root>

<style>
	.new-hire-bubble {
		animation: float 3s ease-in-out infinite;
		will-change: transform;
		contain: layout style paint;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-6px);
		}
	}
</style>

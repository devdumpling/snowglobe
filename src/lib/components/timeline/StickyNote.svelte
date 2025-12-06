<script lang="ts">
	import type { MinorEvent } from '$lib/data/timeline-events';
	import { draggable } from '$lib/actions/draggable';

	interface Props {
		event: MinorEvent;
		variant?: 'pin' | 'tape';
		rotation?: number; // degrees, -5 to 5
	}

	let { event, variant = 'pin', rotation = 0 }: Props = $props();

	// Position state (local only, not persisted)
	let offsetX = $state(0);
	let offsetY = $state(0);
	let isDragging = $state(false);

	// Random-ish rotation based on id
	const calculatedRotation = $derived(rotation || ((event.id.charCodeAt(0) % 11) - 5));

	// Alternate colors for variety
	const noteColors = [
		'bg-pastel-gold-light',
		'bg-pastel-blue-light',
		'bg-pastel-rose-light',
		'bg-pastel-sage-light'
	];
	const colorIndex = $derived(event.id.charCodeAt(0) % noteColors.length);

	// Draggable options
	const draggableOptions = $derived({
		onDragStart: () => {
			isDragging = true;
		},
		onDrag: (offset: { x: number; y: number }) => {
			offsetX = offset.x;
			offsetY = offset.y;
		},
		onDragEnd: (offset: { x: number; y: number }) => {
			offsetX = offset.x;
			offsetY = offset.y;
			isDragging = false;
		}
	});
</script>

<div
	use:draggable={draggableOptions}
	class="sticky-note relative w-40 p-3 {noteColors[colorIndex]} border-2 border-pastel-charcoal shadow-md cursor-grab select-none"
	class:cursor-grabbing={isDragging}
	class:z-50={isDragging}
	style="transform: translate({offsetX}px, {offsetY}px) rotate({isDragging ? 0 : calculatedRotation}deg);"
	role="article"
	aria-label={event.title}
>
	<!-- Decoration: Pin or Tape -->
	{#if variant === 'pin'}
		<div
			class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-pastel-rose border-2 border-pastel-charcoal"
			aria-hidden="true"
		></div>
	{:else}
		<div
			class="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-pastel-cream/80 border border-pastel-charcoal/30"
			aria-hidden="true"
		></div>
	{/if}

	<!-- Content -->
	<div class="pt-1">
		{#if event.emoji}
			<span class="text-lg mb-1 block" aria-hidden="true">{event.emoji}</span>
		{/if}
		<p class="font-mono text-xs text-pastel-charcoal leading-relaxed">
			{event.title}
		</p>
	</div>
</div>

<style>
	.sticky-note {
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}
	.sticky-note:hover:not(.cursor-grabbing) {
		box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
	}
	.cursor-grabbing {
		cursor: grabbing;
		box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
	}
</style>

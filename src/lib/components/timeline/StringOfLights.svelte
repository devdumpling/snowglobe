<script lang="ts">
	import { MONTH_NAMES } from '$lib/data/constants';

	interface Props {
		totalMonths?: number;
		currentMonth?: number;
		onBulbClick?: (index: number) => void;
	}

	let { totalMonths = 12, currentMonth = 0, onBulbClick }: Props = $props();

	// Bulb color CSS values (using CSS custom properties)
	const bulbColors = [
		'var(--pastel-rose)',
		'var(--pastel-sage)',
		'var(--pastel-blue)',
		'var(--pastel-gold)'
	];

	// Generate bulb positions (one per section)
	const bulbs = $derived(
		Array.from({ length: totalMonths }, (_, i) => ({
			index: i,
			// Last bulb (team section) gets special gold color
			color: i === totalMonths - 1 ? 'var(--holiday-gold)' : bulbColors[i % 4],
			isTeam: i === totalMonths - 1,
			label: MONTH_NAMES[i] || 'Section'
		}))
	);

	function handleClick(index: number) {
		onBulbClick?.(index);
	}
</script>

<nav class="string-of-lights relative w-full h-8" aria-label="Timeline navigation">
	<!-- The string/wire -->
	<div
		class="absolute top-1/2 left-0 right-0 h-0.5 bg-pastel-charcoal -translate-y-1/2 pointer-events-none"
	></div>

	<!-- Scroll fade indicators (mobile only) -->
	<div
		class="md:hidden absolute left-0 top-0 bottom-0 w-6 bg-linear-to-r from-pastel-cream to-transparent pointer-events-none z-10"
	></div>
	<div
		class="md:hidden absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-pastel-cream to-transparent pointer-events-none z-10"
	></div>

	<!-- Bulbs - scrollable on mobile -->
	<div class="absolute inset-0 overflow-x-auto md:overflow-visible scrollbar-hide">
		<div
			class="flex items-center justify-between min-w-max md:min-w-0 px-4 md:px-8 h-full gap-2 md:gap-0"
		>
			{#each bulbs as bulb (bulb.index)}
				<button
					class="relative group cursor-pointer shrink-0 snap-center"
					onclick={() => handleClick(bulb.index)}
					aria-label={`Go to ${bulb.label}`}
					aria-current={currentMonth === bulb.index ? 'true' : undefined}
				>
					<!-- Socket -->
					<div class="w-2 h-3 bg-pastel-charcoal rounded-t-sm mx-auto"></div>
					<!-- Bulb (star shape for team section) -->
					{#if bulb.isTeam}
						<div
							class="bulb w-5 h-5 border-2 border-pastel-charcoal -mt-0.5 transition-[transform,box-shadow] duration-300 flex items-center justify-center text-[10px] group-hover:scale-110"
							class:scale-125={currentMonth === bulb.index}
							style="background-color: {bulb.color}; {currentMonth === bulb.index
								? `box-shadow: 0 0 12px ${bulb.color};`
								: ''}"
						>
							★
						</div>
					{:else}
						<div
							class="bulb w-4 h-5 rounded-full border-2 border-pastel-charcoal -mt-0.5 transition-[transform,box-shadow] duration-300 group-hover:scale-110"
							class:scale-125={currentMonth === bulb.index}
							style="background-color: {bulb.color}; {currentMonth === bulb.index
								? `box-shadow: 0 0 8px ${bulb.color};`
								: ''}"
						></div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</nav>

<style>
	.bulb {
		will-change: transform, box-shadow;
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onDestroy } from 'svelte';

	interface Props {
		children: Snippet;
		onScroll?: (scrollLeft: number) => void;
	}

	let { children, onScroll }: Props = $props();

	let scrollContainer: HTMLElement | undefined = $state();

	// RAF-based scroll throttling for performance
	let rafId: number | null = null;
	let pendingScrollLeft = 0;

	onDestroy(() => {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
		}
	});

	export function scrollToMonth(month: number) {
		if (!scrollContainer) return;

		// Responsive: full width on mobile, 80vw on md+
		const isMobile = window.innerWidth < 768;
		const monthWidth = isMobile ? window.innerWidth : window.innerWidth * 0.8;
		const spacerWidth = isMobile ? 0 : window.innerWidth * 0.1;
		const targetScroll = spacerWidth + month * monthWidth;

		scrollContainer.scrollTo({
			left: targetScroll,
			behavior: 'smooth'
		});
	}

	function handleScroll(e: Event) {
		const target = e.target as HTMLElement;
		pendingScrollLeft = target.scrollLeft;

		// Batch scroll updates with RAF for smoother performance
		if (rafId === null) {
			rafId = requestAnimationFrame(() => {
				onScroll?.(pendingScrollLeft);
				rafId = null;
			});
		}
	}
</script>

<div
	bind:this={scrollContainer}
	onscroll={handleScroll}
	class="timeline-scroller overflow-x-auto overflow-y-hidden h-full snap-x snap-mandatory scroll-smooth"
	style="scrollbar-width: none; -ms-overflow-style: none;"
>
	<div class="inline-flex h-full min-w-max">
		<!-- Spacer for first section centering (responsive: 0 on mobile, 10vw on md+) -->
		<div class="w-0 md:w-[10vw] h-full shrink-0" aria-hidden="true"></div>
		{@render children()}
		<!-- Spacer for last section centering -->
		<div class="w-0 md:w-[10vw] h-full shrink-0" aria-hidden="true"></div>
	</div>
</div>

<style>
	.timeline-scroller::-webkit-scrollbar {
		display: none;
	}
</style>

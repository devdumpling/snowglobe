<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import BottomBar from '$lib/components/shell/BottomBar.svelte';
	import TimelineScroller from '$lib/components/timeline/TimelineScroller.svelte';
	import MonthCard from '$lib/components/timeline/MonthCard.svelte';
	import StickyNote from '$lib/components/timeline/StickyNote.svelte';
	import StringOfLights from '$lib/components/timeline/StringOfLights.svelte';
	import GuestbookDrawer from '$lib/components/guestbook/GuestbookDrawer.svelte';
	import CursorOverlay from '$lib/components/shell/CursorOverlay.svelte';
	import { site } from '$lib/config';
	import {
		getMajorEventByMonth,
		getMinorEventsAfterMonth,
		getNewHiresAfterMonth
	} from '$lib/data/timeline-events';
	import { getPhotoClustersForMonth } from '$lib/data/photo-clusters';
	import PolaroidCluster from '$lib/components/timeline/PolaroidCluster.svelte';
	import TeamShowcase from '$lib/components/timeline/TeamShowcase.svelte';
	import { TOTAL_SECTIONS } from '$lib/data/constants';
	import NewHireBubble from '$lib/components/timeline/NewHireBubble.svelte';
	import { sendCursor } from '$lib/realtime/client';
	import { cookieLikeCounts } from '$lib/realtime/stores';
	import { preloadSounds } from '$lib/audio/sounds';
	import { createEasterEggDetector } from '$lib/actions/konami';
	import ConfettiExplosion from '$lib/components/effects/ConfettiExplosion.svelte';
	import AchievementToast from '$lib/components/ui/AchievementToast.svelte';
	import ReactionOverlay from '$lib/components/shell/ReactionOverlay.svelte';
	import YearStats from '$lib/components/timeline/YearStats.svelte';
	import EventPanel from '$lib/components/timeline/EventPanel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let currentMonth = $state(0);
	let guestbookOpen = $state(false);
	let timelineScroller: TimelineScroller | undefined = $state();
	let timelineScrollLeft = $state(0);
	let windowWidth = $state(0);

	// Easter egg state
	let showConfetti = $state(false);
	let showToast = $state(false);
	let toastTitle = $state('');
	let toastSubtitle = $state('');

	// Memoize monthWidth calculation (only recalculates on window resize)
	// Responsive: full width on mobile, 80vw on md+
	let isMobile = $derived(windowWidth < 768);
	let monthWidth = $derived(isMobile ? windowWidth : windowWidth * 0.8);

	// Easter egg trigger
	function triggerEasterEgg(type: 'konami' | '2025') {
		if (type === 'konami') {
			toastTitle = 'Secret Found!';
			toastSubtitle = 'You know the code...';
		} else {
			toastTitle = 'Happy 2025!';
			toastSubtitle = "Here's to another great year!";
		}

		showConfetti = true;
		showToast = true;

		// Hide toast after 3s
		setTimeout(() => {
			showToast = false;
		}, 3000);

		// Stop confetti after 3s
		setTimeout(() => {
			showConfetti = false;
		}, 3000);
	}

	// Easter egg detector
	let easterEggDetector: ReturnType<typeof createEasterEggDetector>;

	onMount(() => {
		// Initialize cookie counts from SSR data
		if (data.cookieCounts) {
			cookieLikeCounts.set(data.cookieCounts);
		}

		// Preload sounds for better UX
		preloadSounds();

		// Start easter egg detection
		easterEggDetector = createEasterEggDetector(triggerEasterEgg);
		easterEggDetector.start();
	});

	onDestroy(() => {
		easterEggDetector?.stop();
		if (scrollTimeoutId) {
			clearTimeout(scrollTimeoutId);
		}
	});

	// Track cursor movement (throttled)
	let lastCursorUpdate = 0;
	const CURSOR_THROTTLE_MS = 50;

	// Flag to prevent scroll handler from overwriting programmatic navigation
	let isScrollingProgrammatically = false;
	let scrollTimeoutId: ReturnType<typeof setTimeout> | null = null;

	function handleMouseMove(e: MouseEvent) {
		const now = Date.now();
		if (now - lastCursorUpdate > CURSOR_THROTTLE_MS) {
			lastCursorUpdate = now;
			// Send document-relative coordinates (viewport + scroll offset)
			sendCursor(e.clientX + timelineScrollLeft, e.clientY);
		}
	}

	function handleMonthClick(month: number) {
		currentMonth = month;
		isScrollingProgrammatically = true;

		// Cancel any pending timeout from previous navigation
		if (scrollTimeoutId) {
			clearTimeout(scrollTimeoutId);
		}

		timelineScroller?.scrollToMonth(month);
		// Clear flag after scroll animation completes (~500ms for smooth scroll)
		scrollTimeoutId = setTimeout(() => {
			isScrollingProgrammatically = false;
			scrollTimeoutId = null;
		}, 600);
	}

	function toggleGuestbook() {
		guestbookOpen = !guestbookOpen;
	}

	function handleScroll(scrollLeft: number) {
		// Track scroll position for cursor calculations
		timelineScrollLeft = scrollLeft;

		// Skip month calculation during programmatic scroll to prevent flickering
		if (isScrollingProgrammatically) return;

		// Calculate which section we're looking at based on scroll position
		// Responsive: no spacer on mobile, 10vw on md+
		const spacerWidth = isMobile ? 0 : windowWidth * 0.1;
		const adjustedScroll = Math.max(0, scrollLeft - spacerWidth);
		const newSection = Math.round(adjustedScroll / monthWidth);
		if (newSection !== currentMonth && newSection >= 0 && newSection < TOTAL_SECTIONS) {
			currentMonth = newSection;
		}
	}

	// Help popover state (controlled by BottomBar)
	let helpOpen = $state(false);

	// Keyboard navigation
	function handleKeydown(e: KeyboardEvent) {
		// Ignore if typing in an input/textarea
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

		// Ignore if modifier keys are pressed (allow browser shortcuts)
		if (e.metaKey || e.ctrlKey || e.altKey) return;

		switch (e.key.toLowerCase()) {
			case 'g':
				e.preventDefault();
				toggleGuestbook();
				break;
			case 'h':
				e.preventDefault();
				helpOpen = !helpOpen;
				break;
			case 'arrowleft':
				e.preventDefault();
				if (currentMonth > 0) handleMonthClick(currentMonth - 1);
				break;
			case 'arrowright':
				e.preventDefault();
				if (currentMonth < TOTAL_SECTIONS - 1) handleMonthClick(currentMonth + 1);
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				e.preventDefault();
				handleMonthClick(parseInt(e.key) - 1);
				break;
			case '0':
				e.preventDefault();
				handleMonthClick(9); // October (10th month, 0-indexed as 9)
				break;
		}
	}
</script>

<svelte:window
	onkeydown={handleKeydown}
	onmousemove={handleMouseMove}
	bind:innerWidth={windowWidth}
/>

<svelte:head>
	<title>{site.title} {site.year}</title>
</svelte:head>

<!-- Cursor Overlay for other users -->
<CursorOverlay myUserId={data.user.id} scrollLeft={timelineScrollLeft} />

<!-- Easter Egg Effects -->
<ConfettiExplosion active={showConfetti} />
<AchievementToast show={showToast} title={toastTitle} subtitle={toastSubtitle} />

<!-- Floating Reactions -->
<ReactionOverlay />

<div class="h-screen flex flex-col bg-pastel-cream overflow-hidden relative">
	<!-- Subtle festive gradient overlay -->
	<div
		class="absolute inset-0 bg-linear-to-br from-holiday-red/8 via-transparent to-holiday-green/8 pointer-events-none"
	></div>
	<!-- Combined Header: Year Stats + Online Users -->
	<YearStats user={data.user} />

	<!-- Main Timeline Area -->
	<main class="flex-1 relative overflow-hidden">
		<TimelineScroller bind:this={timelineScroller} {currentMonth} onScroll={handleScroll}>
			{#each Array(TOTAL_SECTIONS) as _, sectionIndex (sectionIndex)}
				<section
					class="month-section w-screen md:w-[80vw] h-full flex items-center justify-center px-4 md:px-8 py-4 snap-center relative"
				>
					{#if sectionIndex === 12}
						<!-- Team Showcase Section -->
						<TeamShowcase />
					{:else}
						<!-- Month Content: Card + Panel (two-column on xl+) -->
						<div class="flex items-start justify-center gap-8 xl:gap-12">
							<!-- Month Card -->
							<div class="relative">
								<MonthCard month={sectionIndex} event={getMajorEventByMonth(sectionIndex)} />
							</div>

							<!-- Event Panel (xl+ only) -->
							<EventPanel month={sectionIndex} event={getMajorEventByMonth(sectionIndex)} />
						</div>

						<!-- Sticky Notes Between Months (appear to the right) -->
						{#if sectionIndex < 12}
							{@const minors = getMinorEventsAfterMonth(sectionIndex)}
							{@const hires = getNewHiresAfterMonth(sectionIndex)}
							{#if minors.length > 0}
								<div class="absolute right-4 top-[5%] flex flex-col gap-4 -rotate-2">
									{#each minors as minor (minor.id)}
										<StickyNote
											event={minor}
											variant={minor.id.charCodeAt(0) % 2 === 0 ? 'pin' : 'tape'}
										/>
									{/each}
								</div>
							{/if}
							<!-- New Hire Bubbles (positioned below sticky notes) -->
							{#if hires.length > 0}
								<div class="absolute right-8 bottom-1/4 flex gap-2 rotate-1">
									{#each hires as hire, i (hire.id)}
										<NewHireBubble {hire} index={i} />
									{/each}
								</div>
							{/if}
						{/if}

						<!-- Polaroid Photo Clusters -->
						{#each getPhotoClustersForMonth(sectionIndex) as cluster (cluster.id)}
							<PolaroidCluster {cluster} />
						{/each}
					{/if}
				</section>
			{/each}
		</TimelineScroller>

		<!-- String of Lights (fixed at bottom of main area, clickable for navigation) -->
		<div class="absolute bottom-12 left-0 right-0">
			<StringOfLights totalMonths={TOTAL_SECTIONS} {currentMonth} onBulbClick={handleMonthClick} />
		</div>
	</main>

	<!-- Bottom Bar -->
	<BottomBar onGuestbookToggle={toggleGuestbook} {guestbookOpen} bind:helpOpen />

	<!-- Guestbook Drawer -->
	<GuestbookDrawer bind:open={guestbookOpen} entries={data.guestbookEntries ?? []} />
</div>

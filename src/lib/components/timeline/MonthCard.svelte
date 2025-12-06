<script lang="ts">
	import type { TimelineEvent } from '$lib/data/timeline-events';
	import { MONTH_NAMES, MONTH_ABBREV } from '$lib/data/constants';
	import { sendCookieLike } from '$lib/realtime/client';
	import { cookieLikeCounts } from '$lib/realtime/stores';
	import * as Accordion from '$lib/components/ui/accordion';
	import { playCookieSound } from '$lib/audio/sounds';

	interface Props {
		month: number; // 0-11
		event?: TimelineEvent;
	}

	let { month, event }: Props = $props();

	// Check if event has expandable details
	const hasDetails = $derived(event?.details !== undefined);

	// Get reactive cookie count for this event
	let cookieCount = $derived(event ? ($cookieLikeCounts[event.id] ?? 0) : 0);

	function handleCookieClick() {
		if (event) {
			sendCookieLike(event.id);
			playCookieSound();
		}
	}

	// Rotate through pastel colors for each month (with holiday accents for Dec)
	const monthColors = [
		'bg-pastel-rose', // Jan
		'bg-pastel-blue', // Feb
		'bg-pastel-sage', // Mar
		'bg-pastel-gold', // Apr
		'bg-pastel-rose-light', // May
		'bg-pastel-blue-light', // Jun
		'bg-pastel-sage-light', // Jul
		'bg-pastel-gold-light', // Aug
		'bg-pastel-rose', // Sep
		'bg-pastel-blue', // Oct
		'bg-pastel-sage', // Nov
		'bg-holiday-green/20' // Dec - festive!
	];

	// Special styling for December
	const isDecember = $derived(month === 11);

	// Animation class for major events based on category
	const majorAnimation = $derived(() => {
		if (!event?.isMajor) return '';
		switch (event.category) {
			case 'milestone':
			case 'achievement':
				return 'animate-shimmer';
			case 'launch':
				return 'animate-pulse-glow';
			default:
				return 'animate-shimmer';
		}
	});
</script>

<article
	class="neo-card w-72 h-96 md:w-[360px] md:h-[480px] lg:w-[420px] lg:h-[560px] xl:w-[480px] xl:h-[640px] p-5 md:p-6 lg:p-8 flex flex-col relative {monthColors[
		month
	]} {isDecember
		? 'ring-2 ring-holiday-gold ring-offset-2 ring-offset-pastel-cream'
		: ''} {majorAnimation()}"
	aria-label={`${MONTH_NAMES[month]} ${event ? `- ${event.title}` : ''}`}
>
	{#if event?.isMajor}
		<div class="major-badge">BIG!</div>
	{/if}
	<!-- Month Header -->
	<header class="flex items-start justify-between mb-4 md:mb-5 lg:mb-6">
		<h2
			class="font-pixel text-lg md:text-xl lg:text-2xl {isDecember
				? 'text-holiday-green'
				: 'text-pastel-charcoal'}"
		>
			{MONTH_ABBREV[month]}
			{#if isDecember}
				<span class="text-holiday-gold ml-1">✦</span>
			{/if}
		</h2>
		{#if event?.emoji}
			<span class="text-2xl md:text-3xl lg:text-4xl" aria-hidden="true">{event.emoji}</span>
		{/if}
	</header>

	<!-- Event Content -->
	{#if event}
		<div class="flex-1 flex flex-col overflow-hidden">
			<h3
				class="font-serif font-semibold text-pastel-charcoal text-lg md:text-xl lg:text-2xl mb-2 md:mb-3 lg:mb-4 leading-tight"
			>
				{event.title}
			</h3>

			{#if hasDetails}
				<!-- Expandable content with accordion -->
				<Accordion.Root type="single" class="flex-1 overflow-y-auto">
					<Accordion.Item value="details" class="border-none">
						<Accordion.Trigger
							class="font-serif text-pastel-charcoal/70 text-sm md:text-base lg:text-lg leading-relaxed text-left p-0 hover:no-underline [&[data-state=open]>svg]:rotate-180"
						>
							<span class="line-clamp-3 md:line-clamp-4 lg:line-clamp-5">{event.description}</span>
						</Accordion.Trigger>
						<Accordion.Content class="pt-2 pb-0">
							<div
								class="font-serif text-pastel-charcoal/60 text-xs md:text-sm lg:text-base leading-relaxed"
							>
								{event.details?.content}
							</div>
							{#if event.details?.images && event.details.images.length > 0}
								<div class="flex gap-2 mt-2 overflow-x-auto">
									{#each event.details.images as img, _index (img)}
										<img
											src={img}
											alt=""
											loading="lazy"
											decoding="async"
											class="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-cover rounded border border-pastel-charcoal/20"
										/>
									{/each}
								</div>
							{/if}
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			{:else}
				<!-- Simple description without accordion -->
				<p
					class="font-serif text-pastel-charcoal/70 text-sm md:text-base lg:text-lg leading-relaxed"
				>
					{event.description}
				</p>
			{/if}

			<!-- Stats Row -->
			{#if event.stats && event.stats.length > 0}
				<div class="flex flex-wrap gap-2 md:gap-3 mt-3 md:mt-4 lg:mt-5">
					{#each event.stats as stat (stat.label)}
						<div
							class="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-pastel-cream/60 border border-pastel-charcoal/10"
						>
							{#if stat.emoji}
								<span class="text-xs md:text-sm" aria-hidden="true">{stat.emoji}</span>
							{/if}
							<span class="font-mono text-xs md:text-sm font-semibold text-pastel-charcoal"
								>{stat.value}</span
							>
							<span class="text-xs text-pastel-charcoal/60 hidden md:inline">{stat.label}</span>
						</div>
					{/each}
				</div>
			{/if}

			<footer class="mt-auto pt-4 md:pt-5 lg:pt-6 flex items-center justify-between">
				<time class="text-xs md:text-sm text-pastel-charcoal/50" datetime={event.date}>
					{new Date(event.date).toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric'
					})}
				</time>
				<button
					onclick={handleCookieClick}
					class="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-pastel-cream/50 hover:bg-pastel-gold/30 hover:scale-110 origin-bottom-right active:scale-95 transition-all text-sm md:text-base"
					aria-label="Like this event with a cookie"
				>
					<span class="text-base md:text-lg lg:text-xl" aria-hidden="true">🍪</span>
					<span class="font-mono text-xs md:text-sm text-pastel-charcoal/70">{cookieCount}</span>
				</button>
			</footer>
		</div>
	{:else}
		<div class="flex-1 flex items-center justify-center">
			<p class="text-pastel-charcoal/40 text-sm italic">No major event</p>
		</div>
	{/if}
</article>

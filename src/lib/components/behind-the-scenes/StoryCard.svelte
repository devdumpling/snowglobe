<script lang="ts">
	import type { StoryBeat } from './story-data';

	interface Props {
		beat: StoryBeat;
		index: number;
	}

	let { beat, index }: Props = $props();

	// Rotate through pastel colors
	const colors = [
		'bg-pastel-rose-light',
		'bg-pastel-sage-light',
		'bg-pastel-blue-light',
		'bg-pastel-gold-light'
	];

	// Highlight colors for special beats
	const highlightColors: Record<string, string> = {
		dream: 'ring-2 ring-holiday-gold ring-offset-2 ring-offset-pastel-cream',
		tech: 'ring-2 ring-holiday-green ring-offset-2 ring-offset-pastel-cream',
		design: 'ring-2 ring-pastel-rose-dark ring-offset-2 ring-offset-pastel-cream',
		deploy: 'ring-2 ring-pastel-blue-dark ring-offset-2 ring-offset-pastel-cream'
	};

	let bgColor = $derived(colors[index % colors.length]);
	let highlightClass = $derived(beat.highlight ? highlightColors[beat.highlight] : '');
	let isLeft = $derived(index % 2 === 0);
</script>

<div
	class="relative flex items-start gap-4 md:gap-8 {isLeft
		? 'flex-row'
		: 'flex-row-reverse'} max-w-3xl mx-auto"
>
	<!-- Timeline dot and line -->
	<div class="flex flex-col items-center flex-shrink-0">
		<div
			class="w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-pastel-charcoal bg-pastel-cream flex items-center justify-center text-xl md:text-2xl shadow-[2px_2px_0_var(--pastel-charcoal)]"
		>
			{beat.emoji}
		</div>
		<div class="w-0.5 h-full bg-pastel-charcoal/30 min-h-[40px]"></div>
	</div>

	<!-- Card -->
	<article
		class="neo-card {bgColor} {highlightClass} p-4 md:p-6 flex-1 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--pastel-charcoal)] transition-all mb-6"
	>
		<!-- Date badge -->
		<div class="flex items-start justify-between gap-2 mb-3">
			<span class="font-mono text-xs md:text-sm text-pastel-charcoal/60">{beat.date}</span>
		</div>

		<!-- Title -->
		<h3 class="font-pixel text-sm md:text-base text-pastel-charcoal mb-3">{beat.title}</h3>

		<!-- Description -->
		<p class="font-serif text-sm md:text-base text-pastel-charcoal/80 leading-relaxed mb-3">
			{beat.description}
		</p>

		<!-- Details (if present) -->
		{#if beat.details}
			<p class="font-serif text-xs md:text-sm text-pastel-charcoal/60 italic leading-relaxed">
				{beat.details}
			</p>
		{/if}
	</article>
</div>

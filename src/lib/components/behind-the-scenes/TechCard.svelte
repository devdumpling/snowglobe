<script lang="ts">
	interface Props {
		title: string;
		emoji: string;
		bgColor: string;
		highlights: { label: string; value: string }[];
		description: string;
	}

	let { title, emoji, bgColor, highlights, description }: Props = $props();
</script>

<article
	class="neo-card {bgColor} p-5 md:p-6 flex flex-col h-full hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--pastel-charcoal)] transition-all"
>
	<!-- Header -->
	<div class="flex items-start justify-between mb-4">
		<h3 class="font-pixel text-sm md:text-base text-pastel-charcoal">{title}</h3>
		<span class="text-2xl">{emoji}</span>
	</div>

	<!-- Description -->
	<p class="font-serif text-sm text-pastel-charcoal/80 leading-relaxed mb-4 flex-1">
		{description}
	</p>

	<!-- Highlights -->
	<div class="flex flex-wrap gap-2">
		{#each highlights as highlight}
			<div
				class="px-2 py-1 rounded-full bg-pastel-cream/60 border border-pastel-charcoal/20 flex items-center gap-1"
			>
				<span class="font-mono text-xs font-semibold text-pastel-charcoal">{highlight.value}</span>
				<span class="text-xs text-pastel-charcoal/60">{highlight.label}</span>
			</div>
		{/each}
	</div>
</article>

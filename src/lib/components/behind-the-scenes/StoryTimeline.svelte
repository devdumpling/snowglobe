<script lang="ts">
	import { storyBeats } from './story-data';
	import StoryCard from './StoryCard.svelte';
</script>

<section class="py-12 md:py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Section header -->
		<div class="text-center mb-10 md:mb-12">
			<h2 class="font-pixel text-lg md:text-xl text-pastel-charcoal mb-3">The Story</h2>
			<p class="font-serif text-pastel-charcoal/70">From dream to deployment in 5 days</p>
		</div>

		<!-- Timeline -->
		<div class="relative">
			<!-- Center line (visible on larger screens) -->
			<div
				class="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-pastel-charcoal/20 -translate-x-1/2"
			></div>

			<!-- Story beats -->
			{#each storyBeats as beat, index (beat.id)}
				<StoryCard {beat} {index} />
			{/each}

			<!-- End marker -->
			<div class="flex justify-center">
				<div
					class="w-12 h-12 rounded-full border-3 border-pastel-charcoal bg-holiday-gold flex items-center justify-center text-2xl shadow-[2px_2px_0_var(--pastel-charcoal)]"
				>
					✨
				</div>
			</div>

			<!-- Open source note -->
			<div class="mt-8 neo-card bg-pastel-snow p-4 text-center">
				<p class="font-serif text-sm text-pastel-charcoal/70 leading-relaxed">
					<span class="text-lg">📦</span>
					<strong>Much later...</strong> I redacted all the team-specific code and references and open
					sourced this repo! What you're viewing is that version on a demo branch, deployed to Fly.io,
					Neon, and Cloudflare Workers.
				</p>
			</div>
		</div>
	</div>
</section>

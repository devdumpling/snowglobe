<script lang="ts">
	import { getAvatar } from '$lib/data/avatars';

	const devAvatar = getAvatar('dev');
</script>

<section class="relative py-12 md:py-16 lg:py-20">
	<!-- Hero content -->
	<div class="max-w-4xl mx-auto text-center px-4">
		<!-- Dev's avatar -->
		<div class="mb-6 md:mb-8">
			<div
				class="inline-block p-3 neo-card bg-pastel-gold-light hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--pastel-charcoal)] transition-all"
			>
				<img
					src={devAvatar.pixelated}
					alt="Dev"
					class="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
					style="image-rendering: pixelated;"
				/>
			</div>
		</div>

		<!-- Title -->
		<h1
			class="font-pixel text-xl md:text-2xl lg:text-3xl text-pastel-charcoal mb-4 leading-relaxed"
		>
			Behind the Scenes
		</h1>

		<!-- Subtitle -->
		<p class="font-serif text-lg md:text-xl lg:text-2xl text-pastel-charcoal/80 italic mb-8">
			"It started with a dream..."
		</p>

		<!-- Quick stats bar -->
		<div class="flex flex-wrap justify-center gap-3 md:gap-4">
			<div
				class="neo-card px-4 py-2 bg-pastel-rose-light text-sm md:text-base font-mono flex items-center gap-2"
			>
				<span class="text-lg">⚡</span>
				<span class="text-pastel-charcoal font-semibold">2 days</span>
				<span class="text-pastel-charcoal/60 hidden sm:inline">to build</span>
			</div>
			<div
				class="neo-card px-4 py-2 bg-pastel-sage-light text-sm md:text-base font-mono flex items-center gap-2"
			>
				<span class="text-lg">📦</span>
				<span class="text-pastel-charcoal font-semibold">&lt;250kb</span>
				<span class="text-pastel-charcoal/60 hidden sm:inline">bundle (~110kb JS)</span>
			</div>
			<div
				class="neo-card px-4 py-2 bg-pastel-blue-light text-sm md:text-base font-mono flex items-center gap-2"
			>
				<span class="text-lg">🎯</span>
				<span class="text-pastel-charcoal font-semibold">50ms</span>
				<span class="text-pastel-charcoal/60 hidden sm:inline">cursor sync</span>
			</div>
		</div>
	</div>
</section>

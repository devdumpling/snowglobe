<script lang="ts">
	import { getAvatar } from '$lib/data/avatars';

	const devAvatar = getAvatar('dev');

	const steps = [
		{
			number: 1,
			title: 'Slack Photo',
			emoji: '📷',
			description: 'Grab profile images from Slack'
		},
		{
			number: 2,
			title: 'Remove BG',
			emoji: '✂️',
			description: 'Remove backgrounds and noise'
		},
		{
			number: 3,
			title: 'AI Generation',
			emoji: '🤖',
			description: '"cute chibi portrait, soft pastel colors, thick black outline..."'
		},
		{
			number: 4,
			title: 'Pixel Art',
			emoji: '🎮',
			description: 'Convert to 128px pixel maps with custom palette'
		},
		{
			number: 5,
			title: 'Optimize',
			emoji: '⚡',
			description: 'ffmpeg + sharp for final optimization'
		}
	];
</script>

<section class="py-12 md:py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Section header -->
		<div class="text-center mb-10 md:mb-12">
			<h2 class="font-pixel text-lg md:text-xl text-pastel-charcoal mb-3">Avatar Pipeline</h2>
			<p class="font-serif text-pastel-charcoal/70">From Slack photos to pixel art</p>
		</div>

		<!-- Pipeline visualization -->
		<div class="relative">
			<!-- Steps -->
			<div class="flex flex-col md:flex-row md:items-start gap-4 md:gap-2">
				{#each steps as step, index (step.number)}
					<div class="flex md:flex-col items-center gap-3 md:gap-2 flex-1">
						<!-- Step card -->
						<div
							class="neo-card bg-pastel-sage-light p-3 md:p-4 w-full md:min-h-[140px] flex flex-col"
						>
							<div class="flex items-center gap-2 mb-2">
								<span
									class="w-6 h-6 rounded-full bg-pastel-charcoal text-pastel-cream text-xs font-mono flex items-center justify-center"
								>
									{step.number}
								</span>
								<span class="text-xl">{step.emoji}</span>
							</div>
							<h4 class="font-pixel text-xs text-pastel-charcoal mb-1">{step.title}</h4>
							<p class="font-serif text-xs text-pastel-charcoal/70 leading-relaxed">
								{step.description}
							</p>
						</div>

						<!-- Arrow (not on last item) -->
						{#if index < steps.length - 1}
							<div class="text-pastel-charcoal/40 text-xl md:hidden">→</div>
							<div class="hidden md:block text-pastel-charcoal/40 text-xl self-center mt-2">↓</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Result showcase -->
			<div class="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
				<div class="neo-card bg-pastel-gold-light p-4 text-center">
					<p class="font-mono text-xs text-pastel-charcoal/60 mb-2">Result</p>
					<img
						src={devAvatar.pixelated}
						alt="Dev's pixel avatar"
						class="w-24 h-24 mx-auto"
						style="image-rendering: pixelated;"
					/>
				</div>

				<div class="neo-card bg-pastel-rose-light p-4">
					<h4 class="font-pixel text-sm text-pastel-charcoal mb-2">Cost Breakdown</h4>
					<div class="space-y-2 font-mono text-sm text-pastel-charcoal/80">
						<p>
							<span class="text-pastel-charcoal/60">AI generation:</span> ~$20 total
						</p>
						<p class="text-xs text-pastel-charcoal/60">
							100+ images generated, ~32 used
						</p>
						<p class="text-xs text-pastel-charcoal/60 italic">
							(half spent finding the right prompt)
						</p>
					</div>
				</div>
			</div>

			<!-- Prompt callout -->
			<div class="mt-6 neo-card bg-pastel-snow p-4">
				<p class="font-mono text-xs text-pastel-charcoal/60 mb-2">The magic prompt:</p>
				<p class="font-serif text-sm text-pastel-charcoal/80 italic leading-relaxed">
					"cute chibi portrait, soft pastel colors, thick black outline, simple flat shading,
					maplestory style, friendly expression, white background, head and shoulders only,
					illustration, clean linework"
				</p>
			</div>
		</div>
	</div>
</section>

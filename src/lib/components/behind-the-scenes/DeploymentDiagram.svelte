<script lang="ts">
	const infrastructure = [
		{
			name: 'Gleam Backend',
			emoji: '✨',
			specs: ['1x machine', '1gb memory', 'iad region', 'pool size: 10'],
			color: 'bg-pastel-sage-light',
			note: 'Single machine handles all WebSocket connections'
		},
		{
			name: 'SvelteKit Frontend',
			emoji: '🎨',
			specs: ['Edge workers', 'Global CDN', 'Cloudflare Workers', 'Auto-scaling'],
			color: 'bg-pastel-rose-light',
			note: 'Runs on Cloudflare edge network worldwide'
		},
		{
			name: 'PostgreSQL',
			emoji: '🗄️',
			specs: ['Serverless', 'Neon', 'us-east-1', 'Auto-suspend'],
			color: 'bg-pastel-blue-light',
			note: 'Scales to zero when idle, wakes on demand'
		}
	];
</script>

<section class="py-12 md:py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Section header -->
		<div class="text-center mb-10 md:mb-12">
			<h2 class="font-pixel text-lg md:text-xl text-pastel-charcoal mb-3">Deployment</h2>
			<p class="font-serif text-pastel-charcoal/70">Running on Fly.io + Cloudflare + Neon</p>
		</div>

		<!-- Infrastructure cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
			{#each infrastructure as item (item.name)}
				<div class="neo-card {item.color} p-5 flex flex-col">
					<div class="flex items-center gap-2 mb-3">
						<span class="text-2xl">{item.emoji}</span>
						<h3 class="font-pixel text-sm text-pastel-charcoal">{item.name}</h3>
					</div>

					<ul class="space-y-1 mb-3 flex-1">
						{#each item.specs as spec}
							<li class="font-mono text-xs text-pastel-charcoal/80 flex items-center gap-1">
								<span class="text-pastel-charcoal/40">•</span>
								{spec}
							</li>
						{/each}
					</ul>

					<p class="font-serif text-xs text-pastel-charcoal/60 italic">{item.note}</p>
				</div>
			{/each}
		</div>

		<!-- Key learnings -->
		<div class="neo-card bg-pastel-gold-light p-6">
			<h3 class="font-pixel text-sm text-pastel-charcoal mb-4">Key Learnings</h3>
			<div class="space-y-3">
				<div class="flex gap-3">
					<span class="text-lg">🔧</span>
					<div>
						<p class="font-serif text-sm text-pastel-charcoal/80 font-medium">
							Edge compatibility takes work
						</p>
						<p class="font-serif text-xs text-pastel-charcoal/60">
							Cloudflare Workers don't support Node native modules or TCP sockets, so we use
							bcryptjs and Neon's HTTP driver.
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<span class="text-lg">⚡</span>
					<div>
						<p class="font-serif text-sm text-pastel-charcoal/80 font-medium">
							The BEAM is incredibly efficient
						</p>
						<p class="font-serif text-xs text-pastel-charcoal/60">
							A single 1gb machine handles thousands of concurrent WebSocket connections without
							breaking a sweat.
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<span class="text-lg">💰</span>
					<div>
						<p class="font-serif text-sm text-pastel-charcoal/80 font-medium">
							Demo runs on free tiers
						</p>
						<p class="font-serif text-xs text-pastel-charcoal/60">
							Cloudflare Workers, Neon, and Fly.io all have generous free tiers that cover this
							demo.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

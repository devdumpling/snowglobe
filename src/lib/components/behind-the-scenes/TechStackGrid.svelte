<script lang="ts">
	import TechCard from './TechCard.svelte';

	const techStack = [
		{
			title: 'SvelteKit',
			emoji: '🎨',
			bgColor: 'bg-pastel-rose-light',
			description:
				'The entire app delivered in under 300kb with excellent Core Web Vitals. Svelte 5 runes make state management elegant. Server-side rendering for fast initial loads.',
			highlights: [
				{ label: 'bundle', value: '<300kb' },
				{ label: 'version', value: 'v5' },
				{ label: 'SSR', value: '✓' }
			]
		},
		{
			title: 'Gleam / BEAM',
			emoji: '✨',
			bgColor: 'bg-pastel-sage-light',
			description:
				'Statically typed language that compiles to Erlang. The BEAM VM handles thousands of concurrent WebSocket connections with minimal overhead. Each connection is ~300 bytes.',
			highlights: [
				{ label: 'tick rate', value: '50ms' },
				{ label: 'typed', value: '✓' },
				{ label: 'actors', value: 'OTP' }
			]
		},
		{
			title: 'PostgreSQL',
			emoji: '🗄️',
			bgColor: 'bg-pastel-blue-light',
			description:
				'Drizzle ORM for type-safe queries. CTEs for efficient insert-and-return operations. UPSERT pattern for atomic cookie like counts.',
			highlights: [
				{ label: 'ORM', value: 'Drizzle' },
				{ label: 'managed', value: 'Fly.io' },
				{ label: 'CTEs', value: '✓' }
			]
		},
		{
			title: 'Real-time',
			emoji: '⚡',
			bgColor: 'bg-pastel-gold-light',
			description:
				'WebSocket with exponential backoff reconnection. Spring physics for smooth cursor animations. Delta broadcasting—only changed cursors are sent.',
			highlights: [
				{ label: 'sync', value: '50ms' },
				{ label: 'physics', value: 'Spring' },
				{ label: 'delta', value: '✓' }
			]
		}
	];
</script>

<section class="py-12 md:py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Section header -->
		<div class="text-center mb-10 md:mb-12">
			<h2 class="font-pixel text-lg md:text-xl text-pastel-charcoal mb-3">Tech Stack</h2>
			<p class="font-serif text-pastel-charcoal/70">The tools that made it possible</p>
		</div>

		<!-- Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
			{#each techStack as tech (tech.title)}
				<TechCard {...tech} />
			{/each}
		</div>
	</div>
</section>

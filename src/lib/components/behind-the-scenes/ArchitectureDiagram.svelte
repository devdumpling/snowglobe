<script lang="ts">
	// Static architecture diagram - no hover state needed
</script>

<section class="py-12 md:py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Section header -->
		<div class="text-center mb-10 md:mb-12">
			<h2 class="font-pixel text-lg md:text-xl text-pastel-charcoal mb-3">Architecture</h2>
			<p class="font-serif text-pastel-charcoal/70">How the pieces fit together</p>
		</div>

		<!-- ASCII-style diagram -->
		<div class="neo-card bg-pastel-snow p-4 md:p-8 overflow-x-auto">
			<pre class="font-mono text-xs md:text-sm text-pastel-charcoal leading-relaxed select-none">
┌─────────────────────────────────────────────────────────────┐
│  <span class="text-holiday-green font-bold">BROWSER</span>  <span class="text-pastel-charcoal/60"
					>- SvelteKit SSR + hydration for interactivity</span
				>   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   Cursors   │     │  Guestbook  │     │  Timeline   │   │
│  │   (live)    │     │   (live)    │     │   (SSR)     │   │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘   │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          │ <span class="text-holiday-green font-semibold">WebSocket</span>          │ <span
					class="text-holiday-green font-semibold">WebSocket</span
				>          │ <span class="text-pastel-blue-dark font-semibold">HTTP</span>
          │ <span class="text-pastel-charcoal/50">(50ms ticks)</span>       │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│  <span class="text-holiday-green font-bold">GLEAM</span>  <span class="text-pastel-charcoal/60"
					>- BEAM VM handles thousands of concurrent connections</span
				>│
│  ┌─────────────┐     ┌─────────────┐                        │
│  │  Presence   │     │  Guestbook  │  <span class="text-pastel-charcoal/50"
					>~300 bytes/connection</span
				> │
│  │   Actor     │     │   Writes    │                        │
│  └──────┬──────┘     └──────┬──────┘                        │
└─────────┼────────────────────┼──────────────────────────────┘
          │                    │
┌─────────────────────────────────────────────────────────────┐
│  <span class="text-pastel-blue-dark font-bold">SVELTEKIT</span>  <span
					class="text-pastel-charcoal/60">- Auth (Lucia), SSR, database reads</span
				>           │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │    Auth     │     │    SSR      │     │    Reads    │   │
│  │   (Lucia)   │     │  (Timeline) │     │ (Guestbook) │   │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘   │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  <span class="text-pastel-gold-dark font-bold">POSTGRES</span>  <span
					class="text-pastel-charcoal/60">- Managed on Fly.io, Drizzle ORM</span
				>               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │    Users    │     │  Sessions   │     │  Guestbook  │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
└─────────────────────────────────────────────────────────────┘
</pre>
		</div>

		<!-- Tech references -->
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<a
				href="https://svelte.dev/"
				target="_blank"
				rel="noopener noreferrer"
				class="neo-card px-3 py-1.5 bg-pastel-rose-light text-sm font-mono hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_var(--pastel-charcoal)] transition-all"
			>
				svelte.dev ↗
			</a>
			<a
				href="https://gleam.run/"
				target="_blank"
				rel="noopener noreferrer"
				class="neo-card px-3 py-1.5 bg-pastel-sage-light text-sm font-mono hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_var(--pastel-charcoal)] transition-all"
			>
				gleam.run ↗
			</a>
			<a
				href="https://fly.io/"
				target="_blank"
				rel="noopener noreferrer"
				class="neo-card px-3 py-1.5 bg-pastel-blue-light text-sm font-mono hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_var(--pastel-charcoal)] transition-all"
			>
				fly.io ↗
			</a>
		</div>
	</div>
</section>

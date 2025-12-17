<script lang="ts">
	import { getAvatar } from '$lib/data/avatars';

	const devAvatar = getAvatar('guest_1');
</script>

<footer class="py-12 md:py-16 px-4 border-t-2 border-pastel-charcoal/10">
	<div class="max-w-4xl mx-auto">
		<!-- Closing message -->
		<div class="text-center mb-8">
			<div class="inline-block mb-4">
				<img
					src={devAvatar.pixelated}
					alt="Dev"
					class="w-16 h-16 mx-auto"
					style="image-rendering: pixelated;"
				/>
			</div>
			<p class="font-serif text-lg text-pastel-charcoal/80 italic max-w-xl mx-auto leading-relaxed">
				"In the past my team has done PowerPoint presentations for the year in recap. This year has
				been such a special year for our team that I felt we deserved something special."
			</p>
			<p class="font-mono text-sm text-pastel-charcoal/50 mt-2">— Dev</p>
		</div>

		<!-- Links -->
		<div class="flex flex-wrap justify-center gap-4 mb-8">
			<a
				href="/app"
				class="neo-btn bg-holiday-green text-pastel-cream px-6 py-2 font-pixel text-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_var(--pastel-charcoal)] transition-all inline-flex items-center gap-2"
			>
				<span>🎄</span>
				<span>Back to App</span>
			</a>
		</div>

		<!-- Repo note -->
		<div class="neo-card bg-pastel-snow p-4 text-center">
			<p class="font-serif text-sm text-pastel-charcoal/70 leading-relaxed">
				<strong>Note:</strong> This demo version has minor tweaks from the forkable
				<code class="bg-pastel-charcoal/10 px-1 rounded">main</code> branch to deploy on Cloudflare
				Workers and Neon. See the
				<a
					href="https://github.com/devdumpling/snowglobe"
					target="_blank"
					rel="noopener noreferrer"
					class="text-holiday-green underline hover:no-underline">README</a
				> for details.
			</p>
		</div>

		<!-- Credits -->
		<div class="mt-8 text-center">
			<p class="font-mono text-xs text-pastel-charcoal/40">
				Built with SvelteKit + Gleam + PostgreSQL
			</p>
			<p class="font-mono text-xs text-pastel-charcoal/40 mt-1">
				Deployed on Fly.io + Cloudflare Workers + Neon
			</p>
		</div>
	</div>
</footer>

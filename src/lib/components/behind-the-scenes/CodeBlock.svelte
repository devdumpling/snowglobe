<script lang="ts">
	interface Props {
		code: string;
		language: string;
		highlightedHtml?: string;
	}

	let { code, language, highlightedHtml }: Props = $props();

	let copied = $state(false);
	let copyError = $state(false);

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard API may fail in insecure contexts or if permission denied
			copyError = true;
			setTimeout(() => (copyError = false), 2000);
		}
	}

	// Language display names
	const languageNames: Record<string, string> = {
		gleam: 'Gleam',
		svelte: 'Svelte',
		typescript: 'TypeScript',
		css: 'CSS',
		javascript: 'JavaScript'
	};
</script>

<div class="relative group">
	<!-- Language badge -->
	<div
		class="absolute top-2 left-2 px-2 py-0.5 bg-pastel-charcoal text-pastel-cream text-xs font-mono rounded"
	>
		{languageNames[language] || language}
	</div>

	<!-- Copy button -->
	<button
		onclick={copyCode}
		class="absolute top-2 right-2 px-2 py-1 bg-pastel-cream/80 hover:bg-pastel-cream border border-pastel-charcoal/30 rounded text-xs font-mono transition-colors opacity-0 group-hover:opacity-100"
	>
		{copied ? 'Copied!' : copyError ? 'Failed' : 'Copy'}
	</button>

	<!-- Code block -->
	<div
		class="bg-[#121212] p-4 pt-10 overflow-x-auto rounded-lg border-2 border-pastel-charcoal shadow-[4px_4px_0_0_var(--pastel-charcoal)]"
	>
		{#if highlightedHtml}
			{@html highlightedHtml}
		{:else}
			<pre
				class="font-mono text-xs md:text-sm text-pastel-cream leading-relaxed"><code>{code}</code></pre>
		{/if}
	</div>
</div>

<style>
	/* Shiki styling overrides - force dark background */
	:global(.shiki),
	:global(.shiki pre) {
		background-color: transparent !important;
		overflow-x: auto;
		margin: 0;
		padding: 0;
	}
	:global(.shiki code) {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.6;
		display: block;
	}
	/* Ensure token colors stay vibrant */
	:global(.shiki span) {
		font-style: normal !important;
	}
	@media (min-width: 768px) {
		:global(.shiki code) {
			font-size: 0.875rem;
		}
	}
</style>

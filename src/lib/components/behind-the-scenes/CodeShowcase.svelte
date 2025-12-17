<script lang="ts">
	import { codeSnippets } from './code-snippets';
	import CodeBlock from './CodeBlock.svelte';

	let activeSnippet = $state(codeSnippets[0].id);
	let currentSnippet = $derived(codeSnippets.find((s) => s.id === activeSnippet)!);
</script>

<section class="py-12 md:py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Section header -->
		<div class="text-center mb-10 md:mb-12">
			<h2 class="font-pixel text-lg md:text-xl text-pastel-charcoal mb-3">Code Highlights</h2>
			<p class="font-serif text-pastel-charcoal/70">Key patterns that make it work</p>
		</div>

		<!-- Tab buttons -->
		<div class="flex flex-wrap gap-2 mb-6 justify-center">
			{#each codeSnippets as snippet (snippet.id)}
				<button
					onclick={() => (activeSnippet = snippet.id)}
					class="px-3 py-1.5 text-xs md:text-sm font-mono border-2 border-pastel-charcoal rounded transition-all {activeSnippet ===
					snippet.id
						? 'bg-pastel-charcoal text-pastel-cream shadow-none translate-x-[1px] translate-y-[1px]'
						: 'bg-pastel-cream text-pastel-charcoal shadow-[2px_2px_0_var(--pastel-charcoal)] hover:shadow-[3px_3px_0_var(--pastel-charcoal)] hover:translate-x-[-1px] hover:translate-y-[-1px]'}"
				>
					{snippet.title}
				</button>
			{/each}
		</div>

		<!-- Active snippet content -->
		<div class="space-y-4">
			<!-- Description card -->
			<div class="neo-card bg-pastel-gold-light p-4">
				<h3 class="font-pixel text-sm text-pastel-charcoal mb-2">{currentSnippet.title}</h3>
				<p class="font-serif text-sm text-pastel-charcoal/80 mb-2">
					{currentSnippet.description}
				</p>
				<p class="font-serif text-xs text-pastel-charcoal/60 italic">
					<strong>Why:</strong>
					{currentSnippet.why}
				</p>
			</div>

			<!-- Code block -->
			<CodeBlock code={currentSnippet.code} language={currentSnippet.language} />
		</div>
	</div>
</section>

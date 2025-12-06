<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	interface Props {
		show?: boolean;
		title?: string;
		subtitle?: string;
	}

	let { show = false, title = 'Secret Found!', subtitle = '' }: Props = $props();
</script>

{#if show}
	<div
		class="fixed top-20 left-1/2 -translate-x-1/2 z-9998"
		in:fly={{ y: -50, duration: 400 }}
		out:fade={{ duration: 300 }}
	>
		<div class="neo-card bg-holiday-gold px-6 py-4 text-center">
			<p class="font-pixel text-sm text-pastel-charcoal">
				{title}
			</p>
			{#if subtitle}
				<p class="font-serif text-xs text-pastel-charcoal/70 mt-1">
					{subtitle}
				</p>
			{/if}
		</div>
	</div>
{/if}

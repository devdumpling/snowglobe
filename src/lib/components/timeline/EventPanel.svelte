<script lang="ts">
	import type { TimelineEvent } from '$lib/data/timeline-events';
	import { monthBlurbs } from '$lib/data/month-blurbs';

	interface Props {
		event?: TimelineEvent;
		month: number;
	}

	let { event, month }: Props = $props();

	const blurb = $derived(event?.blurb || monthBlurbs[month] || '');
</script>

<!-- Event Panel - Flat "The Story" text for larger screens -->
{#if blurb}
	<div class="hidden xl:block w-[360px] 2xl:w-[420px]">
		<h4 class="font-pixel text-xs text-pastel-charcoal/50 mb-4 uppercase tracking-wider">
			The Story
		</h4>
		<p
			class="font-serif text-pastel-charcoal/70 text-base 2xl:text-lg leading-relaxed italic whitespace-pre-line"
		>
			{blurb}
		</p>
	</div>
{/if}

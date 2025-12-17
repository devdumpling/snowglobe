<script lang="ts">
	import type { TeamMember } from '$lib/data/avatars';
	import * as Dialog from '$lib/components/ui/dialog';

	interface Props {
		member: TeamMember;
	}

	let { member }: Props = $props();

	let isOpen = $state(false);
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		<button
			class="team-card group flex flex-col items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-pastel-snow focus:outline-none focus:ring-2 focus:ring-holiday-gold"
			class:alumni={member.isAlumni}
		>
			<div class="avatar-container relative">
				<img
					src={member.pixelated}
					alt={member.name}
					loading="lazy"
					decoding="async"
					class="w-20 h-20 object-cover border-[3px] border-pastel-charcoal rounded-sm transition-all duration-200 group-hover:scale-105"
					style="box-shadow: 3px 3px 0 var(--pastel-charcoal); image-rendering: pixelated;"
				/>
				{#if member.isAlumni}
					<span
						class="absolute -top-2 -right-2 text-[10px] bg-pastel-charcoal text-pastel-cream px-1.5 py-0.5 rounded font-mono"
					>
						alum
					</span>
				{/if}
			</div>
			<div class="text-center">
				<span class="font-pixel text-[9px] text-pastel-charcoal block leading-tight">
					{member.name}
				</span>
				{#if member.title}
					<span class="font-serif text-[10px] text-pastel-charcoal/50 block mt-0.5">
						{member.title}
					</span>
				{/if}
			</div>
		</button>
	</Dialog.Trigger>

	<Dialog.Content class="neo-card max-w-sm p-6 bg-pastel-cream">
		<div class="flex flex-col items-center gap-4 text-center">
			<img
				src={member.pixelated}
				alt={member.name}
				class="w-40 h-40 object-cover border-[3px] border-pastel-charcoal rounded-sm"
				style="box-shadow: 4px 4px 0 var(--pastel-charcoal); image-rendering: pixelated;"
			/>
			<div>
				<h3 class="font-pixel text-lg text-pastel-charcoal">{member.name}</h3>
				{#if member.title}
					<p class="font-serif text-pastel-charcoal/70 mt-1">{member.title}</p>
				{/if}
				{#if member.isAlumni}
					<span
						class="inline-block mt-2 text-xs bg-pastel-charcoal text-pastel-cream px-2 py-1 rounded font-mono"
					>
						Alumni
					</span>
				{/if}
			</div>
			{#if member.funFact}
				<p class="font-serif text-sm text-pastel-charcoal/60 italic">
					"{member.funFact}"
				</p>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	.team-card.alumni .avatar-container img {
		filter: grayscale(0.5);
		opacity: 0.7;
	}

	.team-card.alumni:hover .avatar-container img {
		filter: grayscale(0);
		opacity: 1;
	}
</style>

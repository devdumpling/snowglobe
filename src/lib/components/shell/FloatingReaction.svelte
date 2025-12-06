<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import type { FloatingReaction } from '$lib/realtime/types';

	interface Props {
		reaction: FloatingReaction;
	}

	let { reaction }: Props = $props();
</script>

<div
	class="fixed pointer-events-none text-3xl z-9000"
	style="left: {reaction.x}%; bottom: 80px;"
	in:fly={{ y: 50, duration: 300 }}
	out:fade={{ duration: 500 }}
>
	<span class="animate-float-up">{reaction.emoji}</span>
</div>

<style>
	.animate-float-up {
		display: inline-block;
		animation: float-up 3s ease-out forwards;
	}

	@keyframes float-up {
		0% {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
		70% {
			opacity: 1;
		}
		100% {
			transform: translateY(-200px) scale(1.2);
			opacity: 0;
		}
	}
</style>

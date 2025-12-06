<script lang="ts">
	import { floatingReactions } from '$lib/realtime/reactions';
	import FloatingReaction from './FloatingReaction.svelte';

	const REACTION_LIFETIME_MS = 3000;

	// Filter out expired reactions to prevent replaying stale animations on navigation
	let activeReactions = $derived(
		$floatingReactions.filter((r) => Date.now() - r.createdAt < REACTION_LIFETIME_MS)
	);
</script>

{#each activeReactions as reaction (reaction.id)}
	<FloatingReaction {reaction} />
{/each}

<script lang="ts">
	import { cursorPositions, onlineUsers } from '$lib/realtime/stores';
	import Cursor from './Cursor.svelte';

	interface Props {
		myUserId: string;
		scrollLeft?: number;
	}

	let { myUserId, scrollLeft = 0 }: Props = $props();

	// Pre-compute user Map for O(1) lookup instead of O(n) find per cursor
	let userMap = $derived(new Map($onlineUsers.map((u) => [u.userId, u])));

	// Filter out own cursor and get others with efficient lookup
	let otherCursors = $derived.by(() => {
		const result = [];
		for (const [userId, pos] of Object.entries($cursorPositions)) {
			if (userId === myUserId) continue;
			const user = userMap.get(userId);
			if (user) {
				result.push({
					userId,
					x: pos.x - scrollLeft,
					y: pos.y,
					user
				});
			}
		}
		return result;
	});
</script>

<div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
	{#each otherCursors as cursor (cursor.userId)}
		<Cursor
			x={cursor.x}
			y={cursor.y}
			avatarId={cursor.user?.avatarId ?? 'dev'}
			displayName={cursor.user?.displayName ?? 'Unknown'}
		/>
	{/each}
</div>

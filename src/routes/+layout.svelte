<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { onDestroy } from 'svelte';
	import { connect, disconnect } from '$lib/realtime/client';
	import { getThemeColors } from '$lib/config';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Get theme colors from config (static at build time)
	const themeColors = getThemeColors();

	// Manage WebSocket connection at the root level for authenticated users
	// Using $effect to react when user becomes available (e.g., after login)
	$effect(() => {
		if (data.user) {
			connect(
				data.user.id,
				data.user.displayName || data.user.username,
				data.user.avatarId || 'guest'
			);
		}
	});

	onDestroy(() => {
		disconnect();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="contents"
	style:--theme-primary={themeColors.primary}
	style:--theme-secondary={themeColors.secondary}
	style:--theme-accent={themeColors.accent}
>
	<Tooltip.Provider>
		{@render children()}
	</Tooltip.Provider>
</div>

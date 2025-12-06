<script lang="ts">
	import { resolve } from '$app/paths';
	import { onlineUsers, connectionStatus } from '$lib/realtime/stores';
	import { getPixelatedAvatar } from '$lib/data/avatars';
	import type { AppUser } from '$lib/types';

	interface Props {
		user: AppUser;
	}

	let { user }: Props = $props();

	// Use reactive store for online users
	let displayUsers = $derived(
		$onlineUsers.length > 0
			? $onlineUsers.map((u) => ({
					id: u.userId,
					avatarId: u.avatarId,
					displayName: u.displayName
				}))
			: []
	);
</script>

<header class="fixed top-0 left-0 right-0 z-40 h-16 bg-transparent">
	<div class="h-full max-w-[2000px] mx-auto px-4 pt-1 flex items-center justify-between">
		<!-- Logo / Title -->
		<a
			href={resolve('/')}
			class="flex items-center gap-2 text-pastel-charcoal hover:opacity-80 transition-opacity"
		>
			<span class="text-holiday-gold text-lg">✦</span>
			<span class="font-pixel text-[10px] tracking-wide">
				<span class="text-holiday-green">2025</span> Year in Review
			</span>
		</a>

		<!-- Online Users -->
		<div class="flex items-center gap-2">
			<span class="text-xs font-family-mono text-pastel-charcoal/60 flex items-center gap-1.5">
				<span
					class="w-2 h-2 rounded-full {$connectionStatus === 'connected'
						? 'bg-holiday-green'
						: $connectionStatus === 'connecting'
							? 'bg-holiday-gold animate-pulse'
							: 'bg-pastel-charcoal/30'}"
					title={$connectionStatus}
				></span>
				online:
			</span>
			<div class="flex -space-x-2">
				{#if displayUsers.length > 0}
					{#each displayUsers.slice(0, 5) as onlineUser (onlineUser.id)}
						<img
							src={getPixelatedAvatar(onlineUser.avatarId)}
							alt={onlineUser.displayName}
							title={onlineUser.displayName}
							class="w-12 h-12 rounded-full border-2 border-dashed border-pastel-charcoal/20 bg-pastel-cream object-cover"
						/>
					{/each}
					{#if displayUsers.length > 5}
						<div
							class="w-12 h-12 rounded-full bg-pastel-cream border-2 border-dashed border-pastel-charcoal/10 flex items-center justify-center text-xs font-medium"
						>
							+{displayUsers.length - 5}
						</div>
					{/if}
				{:else}
					<!-- Current user only when no realtime -->
					<img
						src={getPixelatedAvatar(user.avatarId)}
						alt={user.displayName || user.username}
						title={user.displayName || user.username}
						class="w-12 h-12 rounded-full border-2 border-dashed border-pastel-charcoal/20 bg-pastel-cream object-cover"
					/>
				{/if}
			</div>
		</div>
	</div>
</header>

<!-- Spacer to prevent content from going under fixed header -->
<div class="h-16"></div>

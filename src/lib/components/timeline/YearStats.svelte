<script lang="ts">
	import { onlineUsers, connectionStatus } from '$lib/realtime/stores';
	import { getPixelatedAvatar } from '$lib/data/avatars';
	import { yearStats, site } from '$lib/config';
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

<!-- Combined Header: Year Stats + Online Users -->
<header
	class="fixed top-0 left-0 right-0 z-40 bg-pastel-cream/95 backdrop-blur-sm border-b-2 border-pastel-charcoal/10"
>
	<div class="h-14 max-w-[2000px] mx-auto px-4 flex items-center justify-between gap-4">
		<!-- Stats (scrollable on mobile) -->
		<div class="flex-1 overflow-x-auto scrollbar-hide">
			<div class="flex items-center gap-3 md:gap-5 lg:gap-6 min-w-max py-2">
				<span
					class="font-pixel text-[10px] md:text-xs text-pastel-charcoal/60 uppercase tracking-wider whitespace-nowrap"
				>
					{site.year} by the numbers
				</span>
				<div class="h-4 w-px bg-pastel-charcoal/20 hidden sm:block"></div>
				{#each yearStats as stat, i (stat.label)}
					<div class="flex items-center gap-1.5">
						<span class="text-sm md:text-base" aria-hidden="true">{stat.emoji}</span>
						<span class="font-mono text-sm md:text-base font-bold text-pastel-charcoal"
							>{stat.value}</span
						>
						<span class="text-[10px] md:text-xs text-pastel-charcoal/50 hidden sm:inline"
							>{stat.label}</span
						>
					</div>
					{#if i < yearStats.length - 1}
						<span class="text-pastel-charcoal/20 hidden md:inline">·</span>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Online Users (fixed on right) -->
		<div class="flex items-center gap-2 shrink-0">
			<span class="text-[10px] font-mono text-pastel-charcoal/50 flex items-center gap-1 sm:flex">
				<span
					class="w-1.5 h-1.5 rounded-full {$connectionStatus === 'connected'
						? 'bg-holiday-green'
						: $connectionStatus === 'connecting'
							? 'bg-holiday-gold animate-pulse'
							: 'bg-pastel-charcoal/30'}"
					title={$connectionStatus}
				></span>
				online
			</span>
			<div class="flex -space-x-1.5">
				{#if displayUsers.length > 0}
					{#each displayUsers.slice(0, 4) as onlineUser (onlineUser.id)}
						<img
							src={getPixelatedAvatar(onlineUser.avatarId)}
							alt={onlineUser.displayName}
							title={onlineUser.displayName}
							class="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-pastel-cream bg-pastel-cream object-cover"
						/>
					{/each}
					{#if displayUsers.length > 4}
						<div
							class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-pastel-gold/30 border-2 border-pastel-cream flex items-center justify-center text-[10px] font-medium text-pastel-charcoal"
						>
							+{displayUsers.length - 4}
						</div>
					{/if}
				{:else}
					<!-- Current user only when no realtime -->
					<img
						src={getPixelatedAvatar(user.avatarId)}
						alt={user.displayName || user.username}
						title={user.displayName || user.username}
						class="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-pastel-cream bg-pastel-cream object-cover"
					/>
				{/if}
			</div>
		</div>
	</div>
</header>

<!-- Spacer to prevent content from going under fixed header -->
<div class="h-14"></div>

<script lang="ts">
	import { getAvatar } from '$lib/data/avatars';

	interface Props {
		user: {
			displayName: string;
			avatarId: string;
		};
	}

	let { user }: Props = $props();
	let avatar = $derived(getAvatar(user.avatarId));
</script>

<div class="text-center space-y-6">
	<!-- Avatar -->
	<div class="relative inline-block">
		<div
			class="w-24 h-24 rounded-full neo-card p-1 mx-auto"
			style="box-shadow: var(--neo-shadow-lg);"
		>
			<img
				src={avatar.pixelated}
				alt={user.displayName}
				class="w-full h-full rounded-full object-cover bg-holiday-snow"
			/>
		</div>
		<!-- Decorative sparkle -->
		<span class="absolute -top-2 -right-2 text-2xl animate-pulse" role="img" aria-label="sparkle">
			✨
		</span>
	</div>

	<!-- Greeting -->
	<div class="space-y-2">
		<h1 class="font-pixel text-xl sm:text-2xl text-holiday-charcoal">
			Hey, <span style="color: {avatar.accentColor};">{user.displayName}</span>!
		</h1>
		<p class="text-holiday-charcoal/70 text-lg">
			Welcome to our <span class="text-holiday-red font-semibold">2025</span> Year in Review
		</p>
	</div>

	<!-- Tagline -->
	<p class="text-sm text-holiday-charcoal/50 max-w-md mx-auto">
		Take a stroll through our memories, leave a note in the guestbook, and celebrate another amazing
		year together.
	</p>
</div>

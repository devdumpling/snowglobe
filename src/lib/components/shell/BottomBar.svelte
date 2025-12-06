<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { Kbd } from '$lib/components/ui/kbd';
	import { settings } from '$lib/stores/settings';
	import { playClick } from '$lib/audio/sounds';
	import { sendReaction } from '$lib/realtime/client';
	import { REACTION_EMOJIS } from '$lib/realtime/types';
	import type { ReactionEmoji } from '$lib/realtime/types';

	interface Props {
		onGuestbookToggle: () => void;
		guestbookOpen?: boolean;
		helpOpen?: boolean;
	}

	let { onGuestbookToggle, guestbookOpen = false, helpOpen = $bindable(false) }: Props = $props();

	let reactionPickerOpen = $state(false);

	function handleSoundToggle() {
		settings.toggleSound();
		// Play a click sound if we just enabled sounds
		if (!$settings.soundEnabled) {
			// Sound was just disabled, don't play
		} else {
			playClick();
		}
	}

	function handleReaction(emoji: ReactionEmoji) {
		sendReaction(emoji);
		reactionPickerOpen = false;
	}
</script>

<footer class="fixed bottom-0 left-0 right-0 z-40 h-20 bg-transparent">
	<div class="h-full max-w-[2000px] mx-auto px-4 flex items-center justify-between">
		<!-- Left buttons -->
		<div class="flex items-center gap-2">
			<!-- Guestbook Toggle -->
			<button
				onclick={onGuestbookToggle}
				class="neo-btn px-3 py-1.5 bg-pastel-gold hover:bg-pastel-gold-light flex items-center gap-2"
				aria-label={guestbookOpen ? 'Close guestbook' : 'Open guestbook'}
			>
				<span class="text-lg" aria-hidden="true">📖</span>
			</button>

			<!-- Reaction Picker -->
			<Popover.Root bind:open={reactionPickerOpen}>
				<Popover.Trigger
					class="neo-btn px-3 py-1.5 bg-pastel-rose hover:bg-pastel-rose-light flex items-center gap-2"
					aria-label="Send a reaction"
				>
					<span class="text-lg" aria-hidden="true">🎉</span>
				</Popover.Trigger>
				<Popover.Content
					side="top"
					align="start"
					class="p-2 bg-pastel-cream border-2 border-pastel-charcoal shadow-lg"
				>
					<div class="flex gap-1">
						{#each REACTION_EMOJIS as emoji (emoji)}
							<button
								onclick={() => handleReaction(emoji)}
								class="w-10 h-10 text-2xl hover:bg-pastel-snow rounded transition-colors flex items-center justify-center"
								aria-label={`React with ${emoji}`}
							>
								{emoji}
							</button>
						{/each}
					</div>
				</Popover.Content>
			</Popover.Root>

			<!-- Sound Toggle -->
			<button
				onclick={handleSoundToggle}
				class="neo-btn px-3 py-1.5 bg-pastel-blue hover:bg-pastel-blue-light flex items-center gap-2"
				aria-label={$settings.soundEnabled ? 'Mute sounds' : 'Enable sounds'}
			>
				<span class="text-lg" aria-hidden="true">{$settings.soundEnabled ? '🔊' : '🔇'}</span>
			</button>
		</div>

		<!-- Right buttons -->
		<div class="flex items-center gap-2">
			<!-- Behind the Scenes link -->
			<a
				href="/behind-the-scenes"
				class="neo-btn px-3 py-1.5 bg-pastel-gold hover:bg-pastel-gold-light flex items-center gap-2"
				aria-label="How it was built"
				title="How it was built"
			>
				<span class="text-lg" aria-hidden="true">🛠️</span>
			</a>

			<!-- Help Button with Popover -->
			<Popover.Root bind:open={helpOpen}>
				<Popover.Trigger
					class="neo-btn px-4 py-1.5 bg-pastel-sage hover:bg-pastel-sage-light flex items-center justify-center"
					aria-label="Help"
				>
					<span class="text-lg font-bold">?</span>
				</Popover.Trigger>
			<Popover.Content
				side="top"
				align="end"
				class="w-72 p-4 bg-pastel-cream border-2 border-dashed border-pastel-charcoal shadow-lg"
			>
				<div class="space-y-3">
					<h3 class="font-pixel text-xs text-pastel-charcoal">Controls</h3>

					<div class="space-y-2 text-sm text-pastel-charcoal">
						<div class="flex items-center justify-between">
							<span>Navigate timeline</span>
							<div class="flex gap-1">
								<Kbd>←</Kbd><Kbd>→</Kbd>
							</div>
						</div>

						<div class="flex items-center justify-between">
							<span>Scroll navigation</span>
							<span class="text-xs text-pastel-charcoal/60">Mouse wheel</span>
						</div>

						<div class="flex items-center justify-between">
							<span>Jump to month</span>
							<div class="flex gap-1">
								<Kbd>1</Kbd>-<Kbd>9</Kbd>, <Kbd>0</Kbd>
							</div>
						</div>

						<div class="flex items-center justify-between">
							<span>Toggle guestbook</span>
							<Kbd>G</Kbd>
						</div>

						<div class="flex items-center justify-between">
							<span>Toggle help</span>
							<Kbd>H</Kbd>
						</div>
					</div>

					<div class="pt-2 border-t border-pastel-charcoal/20">
						<p class="text-xs text-pastel-charcoal/60">Click the string lights to jump to any month</p>
					</div>
				</div>
			</Popover.Content>
		</Popover.Root>
		</div>
	</div>
</footer>

<!-- Spacer to prevent content from going under fixed footer -->
<div class="h-16"></div>

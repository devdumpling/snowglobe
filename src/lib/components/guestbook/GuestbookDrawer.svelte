<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { sendGuestbook } from '$lib/realtime/client';
	import { newGuestbookEntries, wsError } from '$lib/realtime/stores';
	import { getPixelatedAvatar } from '$lib/data/avatars';
	import { playPop } from '$lib/audio/sounds';
	import type { GuestbookEntry } from '$lib/types';

	interface Props {
		open: boolean;
		entries: GuestbookEntry[];
	}

	let { open = $bindable(), entries }: Props = $props();

	let message = $state('');
	const MAX_MESSAGE_LENGTH = 500;

	// Show guestbook-specific errors
	let guestbookError = $derived($wsError?.code === 'guestbook_failed' ? $wsError : null);

	// Combine initial entries with new realtime entries, deduplicating by ID
	// New entries prepended (most recent first), initial entries already sorted from server
	let allEntries = $derived.by(() => {
		const seen = new Set<string | number>();
		const result: GuestbookEntry[] = [];

		// New entries first (most recent)
		for (const entry of $newGuestbookEntries) {
			if (!seen.has(entry.id)) {
				seen.add(entry.id);
				result.push(entry);
			}
		}

		// Then server entries (skip if already seen)
		for (const entry of entries) {
			if (!seen.has(entry.id)) {
				seen.add(entry.id);
				result.push(entry);
			}
		}

		return result;
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		const trimmed = message.trim().slice(0, MAX_MESSAGE_LENGTH);
		if (trimmed) {
			sendGuestbook(trimmed);
			playPop();
			message = '';
		}
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Portal>
		<Drawer.Overlay class="bg-pastel-charcoal/50" />
		<Drawer.Content class="bg-pastel-cream border-t-[3px] border-pastel-charcoal h-[85vh]">
			<!-- Header -->
			<div class="px-6 pb-6 border-b-2 border-pastel-charcoal/20 flex items-center justify-between">
				<div>
					<h2 class="font-pixel text-sm text-pastel-charcoal">Guestbook</h2>
					<p class="text-xs text-pastel-charcoal/60 mt-1">Leave a note for the team</p>
				</div>
				<span class="text-2xl">📖</span>
			</div>

			<!-- Entries List -->
			<div class="flex-1 px-6 py-4 overflow-y-auto" style="height: calc(85vh - 160px);">
				{#if allEntries && allEntries.length > 0}
					<div class="space-y-4">
						{#each allEntries as entry (entry.id)}
							<div class="neo-card p-4 bg-pastel-snow flex gap-4 items-start">
								<div class="flex-1 min-w-0">
									<p class="text-sm text-pastel-charcoal font-serif leading-relaxed">
										{entry.message}
									</p>
									<p class="text-xs text-pastel-charcoal/50 mt-3 font-mono">
										— {entry.displayName || 'Anonymous'}
									</p>
								</div>
								{#if entry.avatarId}
									<img
										src={getPixelatedAvatar(entry.avatarId)}
										alt={entry.displayName || 'User'}
										loading="lazy"
										decoding="async"
										class="w-16 h-16 shrink-0"
									/>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center h-full text-center">
						<span class="text-4xl mb-4">✨</span>
						<p class="text-pastel-charcoal/50 font-serif italic">
							No entries yet. Be the first to sign!
						</p>
					</div>
				{/if}
			</div>

			<!-- Form Footer -->
			<div class="px-6 py-4 border-t-2 border-pastel-charcoal/20 bg-pastel-snow/50">
				{#if guestbookError}
					<div
						class="mb-3 p-3 bg-holiday-red/10 border-2 border-holiday-red rounded-lg"
						in:fly={{ y: -10, duration: 200 }}
						out:fade={{ duration: 150 }}
					>
						<p class="text-sm text-holiday-red font-serif">{guestbookError.message}</p>
					</div>
				{/if}
				<form class="space-y-3" onsubmit={handleSubmit}>
					<textarea
						bind:value={message}
						placeholder="Write something nice..."
						rows="2"
						maxlength={MAX_MESSAGE_LENGTH}
						class="w-full bg-pastel-snow border-2 border-pastel-charcoal rounded-lg p-3 font-serif resize-none text-pastel-charcoal placeholder:text-pastel-charcoal/40 focus:outline-none focus:ring-2 focus:ring-holiday-gold"
					></textarea>
					<span class="text-xs text-pastel-charcoal/50">{message.length}/{MAX_MESSAGE_LENGTH}</span>
					<Button
						type="submit"
						disabled={!message.trim()}
						class="neo-btn bg-holiday-green hover:bg-holiday-green-light text-pastel-snow px-4 py-2"
					>
						✏️ Sign
					</Button>
				</form>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

<script lang="ts">
	import { onMount } from 'svelte';
	import { onlineUsers, connectionStatus } from '$lib/realtime/stores';

	// Animated counter state
	let bundleSize = $state(0);
	let cursorSync = $state(0);
	let mounted = $state(false);

	// Final values
	const BUNDLE_TARGET = 250;
	const CURSOR_TARGET = 50;

	onMount(() => {
		mounted = true;

		// Animate bundle size
		const bundleInterval = setInterval(() => {
			if (bundleSize < BUNDLE_TARGET) {
				bundleSize = Math.min(bundleSize + 8, BUNDLE_TARGET);
			} else {
				clearInterval(bundleInterval);
			}
		}, 20);

		// Animate cursor sync
		const cursorInterval = setInterval(() => {
			if (cursorSync < CURSOR_TARGET) {
				cursorSync = Math.min(cursorSync + 2, CURSOR_TARGET);
			} else {
				clearInterval(cursorInterval);
			}
		}, 30);

		return () => {
			clearInterval(bundleInterval);
			clearInterval(cursorInterval);
		};
	});
</script>

<section class="py-12 md:py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Section header -->
		<div class="text-center mb-10 md:mb-12">
			<h2 class="font-pixel text-lg md:text-xl text-pastel-charcoal mb-3">Performance</h2>
			<p class="font-serif text-pastel-charcoal/70">Numbers that matter</p>
		</div>

		<!-- Stats grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
			<!-- Bundle size -->
			<div class="neo-card bg-pastel-rose-light p-6 text-center">
				<div class="text-4xl md:text-5xl font-mono font-bold text-pastel-charcoal mb-2">
					{#if mounted}
						<span class="tabular-nums">&lt;{bundleSize}</span><span class="text-2xl">kb</span>
					{:else}
						<span class="text-pastel-charcoal/30">---</span>
					{/if}
				</div>
				<p class="font-pixel text-xs text-pastel-charcoal/70 mb-2">Bundle Size</p>
				<p class="font-serif text-xs text-pastel-charcoal/60">
					Complete app with complex interactions
				</p>
			</div>

			<!-- Cursor sync -->
			<div class="neo-card bg-pastel-sage-light p-6 text-center">
				<div class="text-4xl md:text-5xl font-mono font-bold text-pastel-charcoal mb-2">
					{#if mounted}
						<span class="tabular-nums">{cursorSync}</span><span class="text-2xl">ms</span>
					{:else}
						<span class="text-pastel-charcoal/30">---</span>
					{/if}
				</div>
				<p class="font-pixel text-xs text-pastel-charcoal/70 mb-2">Cursor Sync</p>
				<p class="font-serif text-xs text-pastel-charcoal/60">Delta broadcasting interval</p>
			</div>

			<!-- Online users (LIVE) -->
			<div
				class="neo-card bg-pastel-blue-light p-6 text-center ring-2 ring-holiday-green ring-offset-2 ring-offset-pastel-cream"
			>
				<div class="text-4xl md:text-5xl font-mono font-bold text-pastel-charcoal mb-2">
					<span class="tabular-nums">{$onlineUsers.length}</span>
				</div>
				<div class="flex items-center justify-center gap-2 mb-2">
					<span class="relative flex h-2 w-2">
						<span
							class="animate-ping absolute inline-flex h-full w-full rounded-full {$connectionStatus ===
							'connected'
								? 'bg-holiday-green'
								: 'bg-holiday-gold'} opacity-75"
						></span>
						<span
							class="relative inline-flex rounded-full h-2 w-2 {$connectionStatus === 'connected'
								? 'bg-holiday-green'
								: $connectionStatus === 'connecting'
									? 'bg-holiday-gold'
									: 'bg-pastel-charcoal/30'}"
						></span>
					</span>
					<p class="font-pixel text-xs text-pastel-charcoal/70">Online Now</p>
				</div>
				<p class="font-serif text-xs text-pastel-charcoal/60">Live WebSocket connection</p>
			</div>
		</div>

		<!-- OKLCH explanation -->
		<div class="mt-8 neo-card bg-pastel-snow p-6">
			<h3 class="font-pixel text-sm text-pastel-charcoal mb-4">OKLCH Color Space</h3>
			<p class="font-serif text-sm text-pastel-charcoal/80 leading-relaxed mb-4">
				Unlike HSL, OKLCH ensures <strong>perceptually uniform</strong> colors. The pastel colors
				are designed to look equally "light" to human eyes regardless of hue. The holiday accent
				colors (red, green, gold) are <em>intentionally</em> deeper and richer to stand out for festive
				emphasis.
			</p>

			<!-- Color palette preview -->
			<div class="flex flex-wrap gap-3">
				<div>
					<p class="font-mono text-xs text-pastel-charcoal/50 mb-2">Pastels (uniform lightness)</p>
					<div class="flex gap-2">
						<div class="flex items-center gap-1">
							<div class="w-6 h-6 rounded border-2 border-pastel-charcoal bg-pastel-rose"></div>
							<span class="font-mono text-xs text-pastel-charcoal/60">rose</span>
						</div>
						<div class="flex items-center gap-1">
							<div class="w-6 h-6 rounded border-2 border-pastel-charcoal bg-pastel-sage"></div>
							<span class="font-mono text-xs text-pastel-charcoal/60">sage</span>
						</div>
						<div class="flex items-center gap-1">
							<div class="w-6 h-6 rounded border-2 border-pastel-charcoal bg-pastel-blue"></div>
							<span class="font-mono text-xs text-pastel-charcoal/60">blue</span>
						</div>
						<div class="flex items-center gap-1">
							<div class="w-6 h-6 rounded border-2 border-pastel-charcoal bg-pastel-gold"></div>
							<span class="font-mono text-xs text-pastel-charcoal/60">gold</span>
						</div>
					</div>
				</div>
				<div>
					<p class="font-mono text-xs text-pastel-charcoal/50 mb-2">Holiday accents (deeper)</p>
					<div class="flex gap-2">
						<div class="flex items-center gap-1">
							<div class="w-6 h-6 rounded border-2 border-pastel-charcoal bg-holiday-red"></div>
							<span class="font-mono text-xs text-pastel-charcoal/60">red</span>
						</div>
						<div class="flex items-center gap-1">
							<div class="w-6 h-6 rounded border-2 border-pastel-charcoal bg-holiday-green"></div>
							<span class="font-mono text-xs text-pastel-charcoal/60">green</span>
						</div>
						<div class="flex items-center gap-1">
							<div class="w-6 h-6 rounded border-2 border-pastel-charcoal bg-holiday-gold"></div>
							<span class="font-mono text-xs text-pastel-charcoal/60">gold</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

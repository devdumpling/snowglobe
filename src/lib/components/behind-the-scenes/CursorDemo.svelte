<script lang="ts">
	import { Spring } from 'svelte/motion';
	import { getAvatar } from '$lib/data/avatars';

	const devAvatar = getAvatar('dev');

	// Demo cursor position (follows mouse within bounds)
	let containerRef: HTMLDivElement | null = $state(null);
	let mouseX = $state(150);
	let mouseY = $state(100);

	// Spring-animated position (demonstrates the physics)
	const springX = Spring.of(() => mouseX, { stiffness: 0.12, damping: 0.7 });
	const springY = Spring.of(() => mouseY, { stiffness: 0.12, damping: 0.7 });

	function handleMouseMove(e: MouseEvent) {
		if (!containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		mouseX = Math.max(32, Math.min(rect.width - 32, e.clientX - rect.left));
		mouseY = Math.max(32, Math.min(rect.height - 32, e.clientY - rect.top));
	}
</script>

<section class="py-12 md:py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Section header -->
		<div class="text-center mb-10 md:mb-12">
			<h2 class="font-pixel text-lg md:text-xl text-pastel-charcoal mb-3">Interactive Demo</h2>
			<p class="font-serif text-pastel-charcoal/70">Move your mouse to see Spring physics in action</p>
		</div>

		<!-- Demo container -->
		<div
			bind:this={containerRef}
			onmousemove={handleMouseMove}
			class="neo-card bg-pastel-snow p-4 h-64 md:h-80 relative overflow-hidden cursor-none"
			role="application"
			aria-label="Cursor physics demo area"
		>
			<!-- Grid pattern background -->
			<div
				class="absolute inset-0 opacity-10"
				style="background-image: linear-gradient(var(--pastel-charcoal) 1px, transparent 1px), linear-gradient(90deg, var(--pastel-charcoal) 1px, transparent 1px); background-size: 20px 20px;"
			></div>

			<!-- Target position indicator (where mouse actually is) -->
			<div
				class="absolute w-4 h-4 border-2 border-dashed border-pastel-charcoal/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
				style="left: {mouseX}px; top: {mouseY}px;"
			></div>

			<!-- Spring-animated cursor -->
			<div
				class="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
				style="left: {springX.current}px; top: {springY.current}px;"
			>
				<img
					src={devAvatar.pixelated}
					alt="Demo cursor"
					class="w-16 h-16 drop-shadow-[2px_2px_0_var(--pastel-charcoal)]"
					style="image-rendering: pixelated;"
				/>
				<div
					class="absolute left-1/2 top-full -translate-x-1/2 mt-1 font-pixel text-[8px] whitespace-nowrap bg-pastel-cream px-1.5 py-0.5 border-2 border-pastel-charcoal rounded shadow-sm"
				>
					Dev
				</div>
			</div>

			<!-- Legend -->
			<div class="absolute bottom-2 left-2 right-2 flex justify-between items-end">
				<div class="flex items-center gap-2 text-xs">
					<div class="w-3 h-3 border-2 border-dashed border-pastel-charcoal/30 rounded-full"></div>
					<span class="font-mono text-pastel-charcoal/50">Target</span>
				</div>
				<div class="flex items-center gap-2 text-xs">
					<img
						src={devAvatar.pixelated}
						alt=""
						class="w-4 h-4"
						style="image-rendering: pixelated;"
					/>
					<span class="font-mono text-pastel-charcoal/50">Spring-animated</span>
				</div>
			</div>
		</div>

		<!-- Explanation -->
		<div class="mt-4 neo-card bg-pastel-gold-light p-4">
			<p class="font-serif text-sm text-pastel-charcoal/80 leading-relaxed">
				Notice the smooth, natural lag? That's <strong>Spring physics</strong> at work. The cursor
				"catches up" to your mouse with a satisfying bounce, using
				<code class="font-mono text-xs bg-pastel-cream/50 px-1 rounded">stiffness: 0.12</code>
				and
				<code class="font-mono text-xs bg-pastel-cream/50 px-1 rounded">damping: 0.7</code>. This
				makes multiplayer cursors feel fluid even with 50ms network updates.
			</p>
		</div>
	</div>
</section>

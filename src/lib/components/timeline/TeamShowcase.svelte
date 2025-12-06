<script lang="ts">
	import { teamMembers } from '$lib/data/avatars';

	// Separate current team from alumni
	const currentTeam = teamMembers.filter((m) => !m.isAlumni);
	const alumni = teamMembers.filter((m) => m.isAlumni);

	let currentIndex = $state(0);
	let isShuffling = $state(false);

	function nextCard() {
		if (isShuffling) return;
		isShuffling = true;
		currentIndex = (currentIndex + 1) % currentTeam.length;
		setTimeout(() => (isShuffling = false), 300);
	}

	function prevCard() {
		if (isShuffling) return;
		isShuffling = true;
		currentIndex = (currentIndex - 1 + currentTeam.length) % currentTeam.length;
		setTimeout(() => (isShuffling = false), 300);
	}

	// Track window width for responsive behavior
	let windowWidth = $state(0);
	let isMobile = $derived(windowWidth < 768);

	// Get visible cards (current + next few for stack effect)
	// Reduced offsets on mobile to prevent clipping
	function getStackPosition(index: number): {
		x: number;
		y: number;
		rotation: number;
		scale: number;
		zIndex: number;
		opacity: number;
	} {
		const diff = (index - currentIndex + currentTeam.length) % currentTeam.length;
		const offsetMultiplier = isMobile ? 0.5 : 1;

		if (diff === 0) {
			return { x: 0, y: 0, rotation: -2, scale: 1, zIndex: 30, opacity: 1 };
		} else if (diff === 1) {
			return { x: 100 * offsetMultiplier, y: 20 * offsetMultiplier, rotation: 4, scale: 0.95, zIndex: 20, opacity: 0.95 };
		} else if (diff === 2) {
			return { x: 110 * offsetMultiplier, y: 30 * offsetMultiplier, rotation: -3, scale: 0.9, zIndex: 10, opacity: 1 };
		} else if (diff === currentTeam.length - 1) {
			// Previous card (going back)
			return { x: -100 * offsetMultiplier, y: 20 * offsetMultiplier, rotation: -6, scale: 0.95, zIndex: 20, opacity: 0.95 };
		}
		return { x: 80 * offsetMultiplier, y: 40 * offsetMultiplier, rotation: 2, scale: 0.8, zIndex: 2, opacity: 0 };
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="team-showcase w-full h-full flex flex-col items-center justify-center py-8 px-4">
	<!-- Header -->
	<header class="text-center mb-8">
		<h2 class="font-pixel text-xl text-pastel-charcoal mb-2 inline-flex items-center gap-2">
			<span>The Team</span>
		</h2>
		<p class="font-serif text-pastel-charcoal/60">
			{currentIndex + 1} of {currentTeam.length}
		</p>
	</header>

	<!-- Polaroid Stack -->
	<div class="relative w-56 md:w-72 h-80 md:h-96 mb-8">
		{#each currentTeam as member, i (member.id)}
			{@const pos = getStackPosition(i)}
			{#if pos.opacity > 0}
				<button
					class="team-polaroid absolute top-0 left-0 w-full bg-white p-4 pb-16 border-[3px] border-pastel-charcoal cursor-pointer transition-all duration-300 ease-out"
					style="
						transform: translate({pos.x}px, {pos.y}px) rotate({pos.rotation}deg) scale({pos.scale});
						z-index: {pos.zIndex};
						opacity: {pos.opacity};
						box-shadow: 4px 4px 0 var(--pastel-charcoal), 6px 6px 0 rgba(0,0,0,0.1);
					"
					onclick={nextCard}
				>
					<img
						src={member.pixelated}
						alt={member.name}
						class="w-full aspect-square object-cover"
						style="image-rendering: pixelated;"
					/>
					<div class="absolute bottom-3 left-0 right-0 text-center px-4">
						<p class="font-pixel text-sm text-pastel-charcoal truncate">{member.name}</p>
						{#if member.title}
							<p class="font-serif text-xs text-pastel-charcoal/60 mt-1 truncate">{member.title}</p>
						{/if}
					</div>
				</button>
			{/if}
		{/each}
	</div>

	<!-- Navigation -->
	<div class="flex items-center gap-4 mb-8">
		<button
			onclick={prevCard}
			class="neo-btn px-4 py-2 bg-pastel-blue hover:bg-pastel-blue-light"
			aria-label="Previous team member"
		>
			←
		</button>
		<span class="font-mono text-sm text-pastel-charcoal/50">click card or arrows</span>
		<button
			onclick={nextCard}
			class="neo-btn px-4 py-2 bg-pastel-blue hover:bg-pastel-blue-light"
			aria-label="Next team member"
		>
			→
		</button>
	</div>

	<!-- Alumni -->
	{#if alumni.length > 0}
		<div class="text-center">
			<p class="font-pixel text-[10px] text-pastel-charcoal/40 mb-2">ALUMNI</p>
			<div class="flex gap-2 justify-center">
				{#each alumni as alum (alum.id)}
					<div class="relative group">
						<img
							src={alum.pixelated}
							alt={alum.name}
							class="w-12 h-12 border-2 border-pastel-charcoal/50 rounded-sm grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
							style="image-rendering: pixelated; box-shadow: 2px 2px 0 var(--pastel-charcoal);"
						/>
						<span
							class="absolute -bottom-6 left-1/2 -translate-x-1/2 font-pixel text-[8px] text-pastel-charcoal/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
						>
							{alum.name}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.team-showcase {
		position: relative;
		z-index: 10;
	}

	.team-polaroid {
		backface-visibility: hidden;
	}
</style>

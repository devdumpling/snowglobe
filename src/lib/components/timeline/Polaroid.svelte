<script lang="ts">
	import type { Photo } from '$lib/data/photo-clusters';

	interface Props {
		photo: Photo;
		rotation?: number;
	}

	let { photo, rotation = 0 }: Props = $props();
</script>

<div
	class="polaroid bg-white p-3 pb-12 border-[3px] border-pastel-charcoal"
	style="
		transform: rotate({rotation}deg);
		box-shadow:
			3px 3px 0 var(--pastel-charcoal),
			5px 5px 0 rgba(0,0,0,0.1);
	"
>
	<img
		src={photo.src}
		alt="Team photo: {photo.id}"
		loading="lazy"
		decoding="async"
		class="w-full h-auto aspect-square object-cover pointer-events-none"
	/>
</div>

<style>
	.polaroid {
		position: relative;
		width: 240px;
	}
</style>

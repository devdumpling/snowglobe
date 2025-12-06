<script lang="ts">
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import { site } from '$lib/config';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Login | {site.title} {site.year}</title>
</svelte:head>

<div
	class="min-h-screen bg-pastel-cream flex flex-col items-center justify-center p-4 relative overflow-hidden"
>
	<!-- Subtle festive gradient overlay -->
	<div
		class="absolute inset-0 bg-linear-to-br from-holiday-red/5 via-transparent to-holiday-green/5 pointer-events-none"
	></div>

	<!-- Decorative header -->
	<div class="text-center mb-8 relative z-10">
		<div class="text-4xl mb-4">
			<span class="text-holiday-gold">✦</span>
		</div>
		<h1 class="font-pixel text-xl sm:text-2xl text-pastel-charcoal mb-2">
			<span class="text-holiday-green">{site.year}</span>
			{site.title}
		</h1>
		<p class="text-pastel-charcoal/70 font-serif italic">{site.subtitle}</p>
	</div>

	<div class="relative z-10">
		<LoginForm {form} />
	</div>

	<!-- Decorative footer with holiday colors -->
	<p class="mt-8 text-sm text-pastel-charcoal/50 relative z-10">
		{site.footer}
	</p>
</div>

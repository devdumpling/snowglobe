<script lang="ts">
	import HeroSection from '$lib/components/behind-the-scenes/HeroSection.svelte';
	import StoryTimeline from '$lib/components/behind-the-scenes/StoryTimeline.svelte';
	import ArchitectureDiagram from '$lib/components/behind-the-scenes/ArchitectureDiagram.svelte';
	import TechStackGrid from '$lib/components/behind-the-scenes/TechStackGrid.svelte';
	import CodeShowcase from '$lib/components/behind-the-scenes/CodeShowcase.svelte';
	import AvatarPipeline from '$lib/components/behind-the-scenes/AvatarPipeline.svelte';
	import MetricsSection from '$lib/components/behind-the-scenes/MetricsSection.svelte';
	import DeploymentDiagram from '$lib/components/behind-the-scenes/DeploymentDiagram.svelte';
	import CursorDemo from '$lib/components/behind-the-scenes/CursorDemo.svelte';
	import PageFooter from '$lib/components/behind-the-scenes/PageFooter.svelte';
	import { site } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Behind the Scenes | {site.title} {site.year}</title>
	<meta
		name="description"
		content="A technical deep-dive into building a real-time Year in Review app with SvelteKit, Gleam, and PostgreSQL."
	/>
</svelte:head>

<div class="min-h-screen bg-pastel-cream">
	<!-- Subtle festive gradient overlay -->
	<div
		class="fixed inset-0 bg-linear-to-br from-holiday-red/5 via-transparent to-holiday-green/5 pointer-events-none"
	></div>

	<!-- Content -->
	<div class="relative">
		<HeroSection />

		<!-- Divider -->
		<div class="max-w-4xl mx-auto px-4">
			<div class="h-px bg-pastel-charcoal/10"></div>
		</div>

		<StoryTimeline />

		<!-- Divider -->
		<div class="max-w-4xl mx-auto px-4">
			<div class="h-px bg-pastel-charcoal/10"></div>
		</div>

		<ArchitectureDiagram />

		<!-- Divider -->
		<div class="max-w-4xl mx-auto px-4">
			<div class="h-px bg-pastel-charcoal/10"></div>
		</div>

		<TechStackGrid />

		<!-- Divider -->
		<div class="max-w-4xl mx-auto px-4">
			<div class="h-px bg-pastel-charcoal/10"></div>
		</div>

		<CodeShowcase highlightedSnippets={data.highlightedSnippets} />

		<!-- Divider -->
		<div class="max-w-4xl mx-auto px-4">
			<div class="h-px bg-pastel-charcoal/10"></div>
		</div>

		<AvatarPipeline />

		<!-- Divider -->
		<div class="max-w-4xl mx-auto px-4">
			<div class="h-px bg-pastel-charcoal/10"></div>
		</div>

		<MetricsSection />

		<!-- Divider -->
		<div class="max-w-4xl mx-auto px-4">
			<div class="h-px bg-pastel-charcoal/10"></div>
		</div>

		<DeploymentDiagram />

		<!-- Divider -->
		<div class="max-w-4xl mx-auto px-4">
			<div class="h-px bg-pastel-charcoal/10"></div>
		</div>

		<CursorDemo />

		<PageFooter />
	</div>
</div>

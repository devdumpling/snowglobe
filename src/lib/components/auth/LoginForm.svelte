<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	interface Props {
		form: { message?: string; username?: string } | null;
	}

	let { form }: Props = $props();
	let isSubmitting = $state(false);
</script>

<form
	method="POST"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ update }) => {
			await update();
			isSubmitting = false;
		};
	}}
	class="neo-card p-8 w-full max-w-md space-y-6"
>
	<div class="text-center space-y-2">
		<h1 class="font-pixel text-lg text-pastel-charcoal">Welcome!</h1>
		<p class="text-sm text-pastel-charcoal/60 font-serif">Sign in to see your year in review</p>
	</div>

	{#if form?.message}
		<div
			class="p-3 rounded-lg border-2 border-holiday-red bg-holiday-red/10 text-holiday-red-dark text-sm"
		>
			{form.message}
		</div>
	{/if}

	<div class="space-y-4">
		<div class="space-y-2">
			<label for="username" class="block text-sm font-medium"> Username </label>
			<Input
				id="username"
				name="username"
				type="text"
				autocomplete="username"
				value={form?.username ?? ''}
				required
				class="neo-btn !bg-pastel-snow focus:ring-2 focus:ring-holiday-gold"
			/>
		</div>

		<div class="space-y-2">
			<label for="password" class="block text-sm font-medium"> Password </label>
			<Input
				id="password"
				name="password"
				type="password"
				autocomplete="current-password"
				required
				class="neo-btn !bg-pastel-snow focus:ring-2 focus:ring-holiday-gold"
			/>
		</div>
	</div>

	<Button
		type="submit"
		disabled={isSubmitting}
		class="w-full neo-btn bg-holiday-green text-pastel-snow hover:bg-holiday-green-light py-3 font-medium disabled:opacity-60"
	>
		{#if isSubmitting}
			<span class="inline-flex items-center gap-2">
				<svg
					class="animate-spin h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Signing in...
			</span>
		{:else}
			Sign In
		{/if}
	</Button>

	<p class="text-center text-sm text-pastel-charcoal/60">
		Not on the team?
		<a href={resolve('/register')} class="text-holiday-green hover:underline font-medium"
			>Join as a guest!</a
		>
	</p>
</form>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	interface Props {
		form: { message?: string; username?: string; displayName?: string } | null;
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
		<h1 class="font-pixel text-lg text-pastel-charcoal">Join the Party!</h1>
		<p class="text-sm text-pastel-charcoal/60 font-serif">
			Create an account to see the year in review
		</p>
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
			<label for="partyCode" class="block text-sm font-medium"> Party Code </label>
			<Input
				id="partyCode"
				name="partyCode"
				type="text"
				placeholder="Enter the secret code"
				required
				class="neo-btn !bg-pastel-snow focus:ring-2 focus:ring-holiday-gold"
			/>
			<p class="text-xs text-pastel-charcoal/50">Ask a team member for the code</p>
		</div>

		<div class="space-y-2">
			<label for="displayName" class="block text-sm font-medium"> Your Name </label>
			<Input
				id="displayName"
				name="displayName"
				type="text"
				placeholder="How should we call you?"
				value={form?.displayName ?? ''}
				required
				class="neo-btn !bg-pastel-snow focus:ring-2 focus:ring-holiday-gold"
			/>
		</div>

		<div class="space-y-2">
			<label for="username" class="block text-sm font-medium"> Username </label>
			<Input
				id="username"
				name="username"
				type="text"
				autocomplete="username"
				placeholder="pick_a_username"
				value={form?.username ?? ''}
				required
				class="neo-btn !bg-pastel-snow focus:ring-2 focus:ring-holiday-gold"
			/>
			<p class="text-xs text-pastel-charcoal/50">Letters, numbers, and underscores only</p>
		</div>

		<div class="space-y-2">
			<label for="password" class="block text-sm font-medium"> Password </label>
			<Input
				id="password"
				name="password"
				type="password"
				autocomplete="new-password"
				placeholder="At least 6 characters"
				required
				class="neo-btn !bg-pastel-snow focus:ring-2 focus:ring-holiday-gold"
			/>
		</div>
	</div>

	<Button
		type="submit"
		disabled={isSubmitting}
		class="w-full neo-btn bg-holiday-green text-pastel-snow hover:bg-holiday-green-light py-3 font-medium"
	>
		{#if isSubmitting}
			Creating account...
		{:else}
			Join the Party
		{/if}
	</Button>

	<p class="text-center text-sm text-pastel-charcoal/60">
		Already have an account?
		<a href={resolve('/')} class="text-holiday-green hover:underline font-medium">Sign in</a>
	</p>
</form>

import { redirect } from '@sveltejs/kit';
import { createHighlighter } from 'shiki';
import type { PageServerLoad } from './$types';
import { codeSnippets } from '$lib/components/behind-the-scenes/code-snippets';

// Language mapping for Shiki
const languageMap: Record<string, string> = {
	gleam: 'rust', // Gleam syntax is similar to Rust
	svelte: 'svelte',
	typescript: 'typescript',
	css: 'css',
	javascript: 'javascript'
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/');
	}

	// Highlight code snippets with Shiki (using vitesse-dark for better contrast)
	const highlighter = await createHighlighter({
		themes: ['vitesse-dark'],
		langs: ['rust', 'svelte', 'typescript', 'css', 'javascript']
	});

	const highlightedSnippets: Record<string, string> = {};

	for (const snippet of codeSnippets) {
		const lang = languageMap[snippet.language] || 'text';
		try {
			highlightedSnippets[snippet.id] = highlighter.codeToHtml(snippet.code, {
				lang,
				theme: 'vitesse-dark'
			});
		} catch {
			// Fallback to plain text if highlighting fails
			highlightedSnippets[snippet.id] = `<pre><code>${snippet.code}</code></pre>`;
		}
	}

	highlighter.dispose();

	return {
		user: event.locals.user,
		highlightedSnippets
	};
};

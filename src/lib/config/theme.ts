/**
 * Theme system - generates CSS variables from config
 */
import { theme } from './loader';

/**
 * Generate CSS custom properties from theme config
 * These override the default holiday colors when customized
 */
export function generateThemeCSS(): string {
	const { colors } = theme;

	return `
:root {
  --theme-primary: ${colors.primary};
  --theme-secondary: ${colors.secondary};
  --theme-accent: ${colors.accent};
}
`.trim();
}

/**
 * Get theme colors for use in components
 */
export function getThemeColors() {
	return theme.colors;
}

/**
 * Check if theme has been customized from defaults
 */
export function isCustomTheme(): boolean {
	const defaults = {
		primary: 'oklch(0.55 0.22 25)',
		secondary: 'oklch(0.45 0.12 145)',
		accent: 'oklch(0.75 0.14 85)'
	};

	return (
		theme.colors.primary !== defaults.primary ||
		theme.colors.secondary !== defaults.secondary ||
		theme.colors.accent !== defaults.accent
	);
}

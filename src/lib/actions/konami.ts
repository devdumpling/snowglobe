/**
 * Konami code detection action
 * Sequence: up up down down left right left right b a
 */
const KONAMI_SEQUENCE = [
	'ArrowUp',
	'ArrowUp',
	'ArrowDown',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'ArrowLeft',
	'ArrowRight',
	'KeyB',
	'KeyA'
];

// Also detect "2025" typed anywhere
const YEAR_SEQUENCE = ['Digit2', 'Digit0', 'Digit2', 'Digit5'];

type EasterEggCallback = (type: 'konami' | '2025') => void;

export function createEasterEggDetector(callback: EasterEggCallback) {
	let konamiIndex = 0;
	let yearIndex = 0;
	let lastKeyTime = 0;
	const TIMEOUT_MS = 2000; // Reset sequence if no key pressed for 2s

	function handleKeydown(e: KeyboardEvent) {
		// Ignore if typing in an input/textarea
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

		const now = Date.now();
		if (now - lastKeyTime > TIMEOUT_MS) {
			konamiIndex = 0;
			yearIndex = 0;
		}
		lastKeyTime = now;

		// Check Konami code
		if (e.code === KONAMI_SEQUENCE[konamiIndex]) {
			konamiIndex++;
			if (konamiIndex === KONAMI_SEQUENCE.length) {
				konamiIndex = 0;
				callback('konami');
			}
		} else {
			konamiIndex = 0;
		}

		// Check 2025
		if (e.code === YEAR_SEQUENCE[yearIndex]) {
			yearIndex++;
			if (yearIndex === YEAR_SEQUENCE.length) {
				yearIndex = 0;
				callback('2025');
			}
		} else {
			yearIndex = 0;
		}
	}

	return {
		start() {
			window.addEventListener('keydown', handleKeydown);
		},
		stop() {
			window.removeEventListener('keydown', handleKeydown);
		}
	};
}

import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { settings } from '$lib/stores/settings';

export const SOUNDS = {
	cookie: '/sounds/cookie.wav',
	pop: '/sounds/pop.wav',
	click: '/sounds/click.wav'
} as const;

type SoundName = keyof typeof SOUNDS;

let audioContext: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();
let isPreloaded = false;

function getAudioContext(): AudioContext | null {
	if (!browser) return null;

	if (!audioContext) {
		audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
	}
	return audioContext;
}

export async function preloadSounds(): Promise<void> {
	if (!browser || isPreloaded) return;

	const ctx = getAudioContext();
	if (!ctx) return;

	// Resume context if suspended (browser autoplay policy)
	if (ctx.state === 'suspended') {
		await ctx.resume();
	}

	const loadPromises = Object.entries(SOUNDS).map(async ([name, url]) => {
		try {
			const response = await fetch(url);
			if (!response.ok) return;
			const arrayBuffer = await response.arrayBuffer();
			const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
			bufferCache.set(name, audioBuffer);
		} catch {
			// Silently fail - sounds are optional
		}
	});

	await Promise.all(loadPromises);
	isPreloaded = true;
}

export function playSound(name: SoundName): void {
	if (!browser) return;

	const { soundEnabled, soundVolume } = get(settings);
	if (!soundEnabled) return;

	const ctx = getAudioContext();
	if (!ctx) return;

	// Resume if suspended
	if (ctx.state === 'suspended') {
		ctx.resume();
	}

	const buffer = bufferCache.get(name);
	if (!buffer) {
		// Fallback: try to play directly if not preloaded
		playFallback(SOUNDS[name], soundVolume);
		return;
	}

	const source = ctx.createBufferSource();
	const gainNode = ctx.createGain();

	source.buffer = buffer;
	gainNode.gain.value = soundVolume;

	source.connect(gainNode);
	gainNode.connect(ctx.destination);

	source.start(0);
}

// Fallback using Audio element for browsers that block AudioContext
function playFallback(url: string, volume: number): void {
	try {
		const audio = new Audio(url);
		audio.volume = volume;
		audio.play().catch(() => {
			// Silently fail
		});
	} catch {
		// Silently fail
	}
}

// Play cookie sound specifically
export function playCookieSound(): void {
	playSound('cookie');
}

// Play submit/success pop
export function playPop(): void {
	playSound('pop');
}

// Play UI click
export function playClick(): void {
	playSound('click');
}

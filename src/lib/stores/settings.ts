import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'snowglobe-settings';

interface Settings {
	soundEnabled: boolean;
	soundVolume: number;
}

const defaults: Settings = {
	soundEnabled: true,
	soundVolume: 0.5
};

function safeLocalStorageGet(): Settings {
	if (!browser) return defaults;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : defaults;
	} catch {
		return defaults;
	}
}

function safeLocalStorageSet(value: Settings) {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	} catch {
		// Ignore storage errors (private browsing, quota exceeded, etc.)
	}
}

function createSettingsStore() {
	const initial = safeLocalStorageGet();

	const { subscribe, set, update } = writable<Settings>(initial);

	return {
		subscribe,
		set: (value: Settings) => {
			safeLocalStorageSet(value);
			set(value);
		},
		update: (fn: (value: Settings) => Settings) => {
			update((current) => {
				const newValue = fn(current);
				safeLocalStorageSet(newValue);
				return newValue;
			});
		},
		toggleSound: () => {
			update((s) => {
				const newValue = { ...s, soundEnabled: !s.soundEnabled };
				safeLocalStorageSet(newValue);
				return newValue;
			});
		}
	};
}

export const settings = createSettingsStore();

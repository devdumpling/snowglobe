import type { Action } from 'svelte/action';

export interface DraggableOptions {
	/** Called when drag starts */
	onDragStart?: () => void;
	/** Called when drag ends with final offset */
	onDragEnd?: (offset: { x: number; y: number }) => void;
	/** Called during drag with current offset (throttled via RAF) */
	onDrag?: (offset: { x: number; y: number }) => void;
	/** Initial offset position */
	initialOffset?: { x: number; y: number };
}

export interface DraggableAttributes {
	'on:dragstart'?: (e: CustomEvent<void>) => void;
	'on:dragend'?: (e: CustomEvent<{ x: number; y: number }>) => void;
}

/**
 * A performant draggable action using pointer events and requestAnimationFrame.
 * Reports offsets via callbacks - component is responsible for applying transforms.
 */
export const draggable: Action<HTMLElement, DraggableOptions | undefined, DraggableAttributes> = (
	node,
	options = {}
) => {
	// Disable dragging on touch devices to allow scrolling
	const isTouchDevice =
		typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

	if (isTouchDevice) {
		// Return no-op on touch devices
		return {};
	}

	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let offsetX = options?.initialOffset?.x ?? 0;
	let offsetY = options?.initialOffset?.y ?? 0;
	let startOffsetX = 0;
	let startOffsetY = 0;
	let rafId: number | null = null;

	function handlePointerDown(e: PointerEvent) {
		// Only handle primary button (left click / touch)
		if (e.button !== 0) return;

		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;
		startOffsetX = offsetX;
		startOffsetY = offsetY;

		// Capture pointer for reliable tracking
		node.setPointerCapture(e.pointerId);

		// Add will-change for GPU acceleration during drag
		node.style.willChange = 'transform';

		options?.onDragStart?.();
		node.dispatchEvent(new CustomEvent('dragstart'));

		e.preventDefault();
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;

		// Calculate new offset
		const newOffsetX = startOffsetX + (e.clientX - startX);
		const newOffsetY = startOffsetY + (e.clientY - startY);

		// Only update if position changed
		if (newOffsetX !== offsetX || newOffsetY !== offsetY) {
			offsetX = newOffsetX;
			offsetY = newOffsetY;

			// Use RAF to batch visual updates
			if (rafId === null) {
				rafId = requestAnimationFrame(() => {
					options?.onDrag?.({ x: offsetX, y: offsetY });
					rafId = null;
				});
			}
		}
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;

		isDragging = false;

		// Release pointer capture
		node.releasePointerCapture(e.pointerId);

		// Remove will-change after drag completes
		node.style.willChange = '';

		// Cancel any pending RAF
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}

		options?.onDragEnd?.({ x: offsetX, y: offsetY });
		node.dispatchEvent(new CustomEvent('dragend', { detail: { x: offsetX, y: offsetY } }));
	}

	function handlePointerCancel(e: PointerEvent) {
		// Treat cancel like pointer up
		handlePointerUp(e);
	}

	// Use pointer events for unified mouse/touch handling
	node.addEventListener('pointerdown', handlePointerDown);
	node.addEventListener('pointermove', handlePointerMove);
	node.addEventListener('pointerup', handlePointerUp);
	node.addEventListener('pointercancel', handlePointerCancel);

	// Prevent default drag behavior (image dragging, text selection)
	node.style.touchAction = 'none';
	node.style.userSelect = 'none';

	return {
		update(newOptions) {
			options = newOptions ?? {};
			// Update initial offset if provided and we're not currently dragging
			if (newOptions?.initialOffset && !isDragging) {
				offsetX = newOptions.initialOffset.x;
				offsetY = newOptions.initialOffset.y;
			}
		},
		destroy() {
			// Clean up event listeners
			node.removeEventListener('pointerdown', handlePointerDown);
			node.removeEventListener('pointermove', handlePointerMove);
			node.removeEventListener('pointerup', handlePointerUp);
			node.removeEventListener('pointercancel', handlePointerCancel);

			// Cancel any pending RAF
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}

			// Reset styles
			node.style.touchAction = '';
			node.style.userSelect = '';
			node.style.willChange = '';
		}
	};
};

<script lang="ts">
	import { onDestroy } from 'svelte';

	interface Props {
		active?: boolean;
		duration?: number;
		particleCount?: number;
	}

	let { active = false, duration = 3000, particleCount = 150 }: Props = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number | null = null;
	let particles: Particle[] = [];
	let startTime = 0;

	const COLORS = [
		'#E57373', // pastel-rose
		'#81C784', // pastel-sage
		'#64B5F6', // pastel-blue
		'#FFD54F', // pastel-gold
		'#BA68C8', // pastel-lavender
		'#FF8A65', // holiday-red-ish
		'#4DB6AC' // holiday-green-ish
	];

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		color: string;
		size: number;
		rotation: number;
		rotationSpeed: number;
		shape: 'rect' | 'circle';
	}

	function createParticles() {
		particles = [];
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 8 + Math.random() * 12;
			particles.push({
				x: centerX,
				y: centerY,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - 5, // Slight upward bias
				color: COLORS[Math.floor(Math.random() * COLORS.length)],
				size: 6 + Math.random() * 8,
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.3,
				shape: Math.random() > 0.5 ? 'rect' : 'circle'
			});
		}
	}

	function animate(timestamp: number) {
		if (!ctx || !canvas) return;

		const elapsed = timestamp - startTime;
		if (elapsed > duration) {
			particles = [];
			return;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const gravity = 0.3;
		const drag = 0.98;
		const progress = elapsed / duration;
		const fadeOut = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

		for (const p of particles) {
			// Physics
			p.vy += gravity;
			p.vx *= drag;
			p.vy *= drag;
			p.x += p.vx;
			p.y += p.vy;
			p.rotation += p.rotationSpeed;

			// Draw
			ctx.save();
			ctx.translate(p.x, p.y);
			ctx.rotate(p.rotation);
			ctx.globalAlpha = fadeOut;
			ctx.fillStyle = p.color;

			if (p.shape === 'rect') {
				ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
			} else {
				ctx.beginPath();
				ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.restore();
		}

		animationId = requestAnimationFrame(animate);
	}

	function start() {
		if (!canvas) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext('2d');

		createParticles();
		startTime = performance.now();
		animationId = requestAnimationFrame(animate);
	}

	function stop() {
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
		particles = [];
		if (ctx && canvas) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	$effect(() => {
		if (active) {
			start();
		} else {
			stop();
		}
	});

	onDestroy(() => {
		stop();
	});
</script>

{#if active}
	<canvas bind:this={canvas} class="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true"
	></canvas>
{/if}

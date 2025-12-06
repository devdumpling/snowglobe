export interface StoryBeat {
	id: string;
	title: string;
	date: string;
	emoji: string;
	description: string;
	details?: string;
	highlight?: 'dream' | 'tech' | 'design' | 'deploy';
}

export const storyBeats: StoryBeat[] = [
	{
		id: 'dream',
		title: 'The Dream',
		date: 'Monday, Dec 1',
		emoji: '💭',
		description:
			'I woke from a funny dream where I was celebrating with my team in a special holiday app. It was super cozy and I (laying next to my 1 year old in bed) was consumed thinking about how I could make it a reality.',
		details: '"I can just build it, hello?!" And so...',
		highlight: 'dream'
	},
	{
		id: 'scaffold',
		title: 'Furious Scaffolding',
		date: 'Days 1-2',
		emoji: '⚡',
		description:
			'Over the next two days, I furiously scaffolded an app. I knew I wanted it to be a realtime, multiplayer app where users move around with cute avatar cursors that others can see, along with a guestbook for leaving notes.',
		details:
			'The question was how to make it happen without having to talk to anyone on the team about standing up infra. I decided the easiest way was just to build it on my personal setup, deploying to fly.io.'
	},
	{
		id: 'sveltekit',
		title: 'SvelteKit Frontend',
		date: 'Day 1',
		emoji: '🎨',
		description:
			"For the frontend, I chose SvelteKit—a framework I adore working in. It's perfect for this kind of interactive, realtime app. Svelte 5 hits a sweet spot of high fidelity end-user performance while staying simple, at the cost of compiler magic (which isn't for everyone!)",
		details:
			'The result? An entire app delivered in under 250kb (only 100kb js) with excellent Core Web Vitals, despite complex user interactions. No bloat here.',
		highlight: 'tech'
	},
	{
		id: 'gleam',
		title: 'Gleam Backend',
		date: 'Day 1-2',
		emoji: '✨',
		description:
			"For the backend, I chose Gleam, a new language I've been learning that compiles to Erlang (and JS lol). It's a delightfully minimal, statically typed language built for the Erlang BEAM VM.",
		details:
			'The BEAM is legendary for handling massive concurrent connections (Discord, WhatsApp, Telegram). Perfect for realtime multiplayer with cursors updating every 50ms.',
		highlight: 'tech'
	},
	{
		id: 'claude',
		title: 'Pairing with Claude',
		date: 'Throughout',
		emoji: '🤖',
		description:
			'I paired with Claude to get much of the foundation up. Despite remaining skeptical about AI-assisted tools, this was a fun experience. Since this was going to be just a little holiday app, I was less concerned about perfect code and more concerned with timing.',
		details:
			"I knew I couldn't devote more than a couple days on this realistically. Claude helped me move fast, while not getting too in the way for the more involved bits."
	},
	{
		id: 'redesign',
		title: 'The Full Redesign',
		date: 'Day 3',
		emoji: '🎮',
		description:
			'Initially I had a very minimal design. It worked, but was lacking. Naturally, I did a full redesign where I shifted this minimal layout to what I described as "Maplestory meets neobrutalism." Thick borders, hard shadows, pixel fonts, and a pastel holiday color palette.',
		details:
			'The OKLCH color space ensures perceptually uniform colors across displays. The pixel font "Press Start 2P" brings that nostalgic vibe.',
		highlight: 'design'
	},
	{
		id: 'avatars',
		title: 'Avatar Pipeline',
		date: 'Day 3-4',
		emoji: '👾',
		description:
			'For avatars, I grabbed Slack profile images, removed backgrounds, then ran them through an AI image generator with a "cute chibi portrait" prompt. Then pixel art conversion, 128px maps, and ffmpeg/sharp optimization.',
		details:
			'The AI generation cost about $20, with half of that spent finding a prompt that gave consistent results. Pretty straightforward pipeline despite the steps.'
	},
	{
		id: 'features',
		title: 'Sprinkling in Features',
		date: 'Days 3-5',
		emoji: '🎁',
		description:
			'I sprinkled in features: floating emoji reactions, easter eggs (try the Konami code!), a stats banner, keyboard navigation, sound effects, and the team showcase section.',
		details:
			'Each little detail adds to the cozy, playful vibe. The cookie "like" buttons with live counts. The confetti explosions. The spring-physics cursors.'
	},
	{
		id: 'deployment',
		title: 'Deployment Wrestling',
		date: 'Day 4-5',
		emoji: '🚀',
		description:
			"The hardest part was honestly figuring out deployment. I'd never deployed a Gleam backend before, and had been wanting to give fly.io a shot. There was a lot of wrestling with networking config.",
		details:
			'Final setup: 1 Gleam machine (1gb, iad, pool size 10), 2 SvelteKit machines, 1 managed Postgres. The BEAM is so efficient that a single 1gb machine handles everything.',
		highlight: 'deploy'
	},
	{
		id: 'ship',
		title: 'Ship It!',
		date: 'Dec 5',
		emoji: '🎉',
		description:
			'All in all, a really interesting and fun project. In the past my team has done PowerPoint presentations for the year in recap, and this year has been such a special year for our team that I felt we deserved something special.',
		details: "I hope you've enjoyed playing around in it and reading about how it was built!"
	}
];

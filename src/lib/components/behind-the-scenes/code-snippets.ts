export interface CodeSnippet {
	id: string;
	title: string;
	language: string;
	description: string;
	why: string;
	code: string;
}

export const codeSnippets: CodeSnippet[] = [
	{
		id: 'gleam-types',
		title: 'Type-Safe Message Parsing',
		language: 'gleam',
		description: "Gleam's discriminated unions ensure only valid messages reach handlers.",
		why: "The compiler enforces exhaustive pattern matching—you can't forget a case.",
		code: `/// Parsed message types from clients
pub type ParsedMessage {
  IdentifyMsg(user_id: String, display_name: String, avatar_id: String)
  CursorMsg(x: Int, y: Int)
  GuestbookMsg(message: String)
  CookieLikeMsg(event_id: String)
  ReactionMsg(emoji: String)
  PingMsg
}

/// Parse based on "type" field
pub fn parse(text: String) -> Result(ParsedMessage, Nil) {
  case json.parse(text, type_decoder) {
    Ok("identify") -> parse_identify(text)
    Ok("cursor") -> parse_cursor(text)
    Ok("guestbook") -> parse_guestbook(text)
    Ok("ping") -> Ok(PingMsg)
    _ -> Error(Nil)
  }
}`
	},
	{
		id: 'delta-broadcast',
		title: '50ms Delta Broadcasting',
		language: 'gleam',
		description: 'Only cursors that actually moved are included in broadcasts.',
		why: 'Dramatically reduces bandwidth—instead of every update, we batch over 50ms windows.',
		code: `const tick_interval_ms = 50

/// Actor state tracks current + previous positions
pub type State {
  State(
    handlers: Dict(String, HandlerInfo),
    cursors: Dict(String, Cursor),
    prev_cursors: Dict(String, Cursor),  // For delta detection
    self: Subject(Message),
  )
}

/// Get cursors that changed since last tick
fn get_changed_cursors(
  current: Dict(String, Cursor),
  previous: Dict(String, Cursor),
) -> Dict(String, Cursor) {
  dict.fold(current, dict.new(), fn(acc, user_id, cursor) {
    case dict.get(previous, user_id) {
      // Only include if position actually changed
      Ok(prev) if prev.x == cursor.x && prev.y == cursor.y -> acc
      _ -> dict.insert(acc, user_id, cursor)
    }
  })
}`
	},
	{
		id: 'spring-physics',
		title: 'Spring Physics Cursors',
		language: 'svelte',
		description: "Svelte 5's Spring rune creates smooth, natural cursor movement.",
		why: 'Lower stiffness = slower response, higher damping = less oscillation. Tuned for 50ms updates.',
		code: `<script lang="ts">
  import { Spring } from 'svelte/motion';

  let { x, y, avatarId, displayName }: Props = $props();

  // Spring-animated coordinates for smooth cursor movement
  // Tuned for ~50-100ms update intervals to feel fluid
  const springX = Spring.of(() => x, { stiffness: 0.12, damping: 0.7 });
  const springY = Spring.of(() => y, { stiffness: 0.12, damping: 0.7 });
</script>

<div style="transform: translate({springX.current}px, {springY.current}px)">
  <img src={avatar.pixelated} alt={displayName} class="w-16 h-16" />
</div>`
	},
	{
		id: 'reconnect',
		title: 'Exponential Backoff Reconnection',
		language: 'typescript',
		description: 'WebSocket reconnection with increasing delays to avoid thundering herd.',
		why: 'Starts at 1s, maxes at 30s. Prevents server overload during outages.',
		code: `const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000];

let reconnectAttempt = 0;

function scheduleReconnect() {
  if (!userInfo) return;

  const delay = RECONNECT_DELAYS[
    Math.min(reconnectAttempt, RECONNECT_DELAYS.length - 1)
  ];

  reconnectTimeout = setTimeout(() => {
    reconnectAttempt++;
    if (userInfo) {
      connect(userInfo.userId, userInfo.displayName, userInfo.avatarId);
    }
  }, delay);
}`
	},
	{
		id: 'o1-lookup',
		title: 'O(1) User Lookups',
		language: 'svelte',
		description: 'Pre-compute a Map for constant-time user lookups instead of O(n) find.',
		why: 'With many users, this makes cursor rendering fast regardless of user count.',
		code: `<script lang="ts">
  import { onlineUsers, cursorPositions } from '$lib/realtime/stores';

  interface Props {
    myUserId: string;
  }

  let { myUserId }: Props = $props();

  // Pre-compute user Map for O(1) lookup instead of O(n) find per cursor
  let userMap = $derived(
    new Map($onlineUsers.map((u) => [u.userId, u]))
  );

  // Filter out self and compute cursor data efficiently
  let otherCursors = $derived.by(() => {
    return Object.entries($cursorPositions)
      .filter(([userId]) => userId !== myUserId)
      .map(([userId, pos]) => ({
        userId,
        ...pos,
        user: userMap.get(userId)  // O(1) lookup!
      }))
      .filter((c) => c.user);
  });
</script>`
	},
	{
		id: 'oklch',
		title: 'OKLCH Color System',
		language: 'css',
		description: 'Modern color space for perceptually uniform colors across displays.',
		why: 'Unlike HSL, OKLCH ensures pastels look equally "light" to human eyes.',
		code: `:root {
  /* === PASTEL COLOR PALETTE === */
  --pastel-rose: oklch(0.82 0.08 12);
  --pastel-sage: oklch(0.78 0.06 145);
  --pastel-blue: oklch(0.85 0.06 240);
  --pastel-gold: oklch(0.88 0.08 85);

  /* Holiday Accent Colors (deeper, richer) */
  --holiday-red: oklch(0.55 0.22 25);
  --holiday-green: oklch(0.45 0.12 145);
  --holiday-gold: oklch(0.75 0.14 85);

  /* Neobrutalism tokens */
  --neo-shadow-sm: 2px 2px 0 var(--neo-border-color);
  --neo-shadow-md: 4px 4px 0 var(--neo-border-color);
  --neo-shadow-lg: 6px 6px 0 var(--neo-border-color);
}`
	}
];

/// Presence service - tracks online users and cursor positions
///
/// Architecture: Each WS handler registers a Subject. When broadcasts are needed,
/// we send to each handler's Subject, and the handler sends the WS frame from its own process.
import gleam/dict.{type Dict}
import gleam/erlang/process.{type Subject}
import gleam/json
import gleam/list
import gleam/otp/actor

/// User info for presence broadcasts
pub type User {
  User(id: String, display_name: String, avatar_id: String)
}

/// Cursor position
pub type Cursor {
  Cursor(x: Int, y: Int)
}

/// Handler registration info - stores the handler's Subject, not the WS connection
pub type HandlerInfo {
  HandlerInfo(user: User, subject: Subject(HandlerMessage))
}

/// Messages sent TO handlers (they will forward to WebSocket)
pub type HandlerMessage {
  SendText(payload: String)
}

/// Actor messages
pub type Message {
  Register(conn_id: String, user: User, handler_subject: Subject(HandlerMessage))
  Unregister(conn_id: String)
  UpdateCursor(user_id: String, x: Int, y: Int)
  BroadcastGuestbook(payload: String)
  BroadcastCookieUpdate(payload: String)
  BroadcastReaction(emoji: String, user_id: String)
  Tick
}

/// Actor state
pub type State {
  State(
    handlers: Dict(String, HandlerInfo),
    cursors: Dict(String, Cursor),
    prev_cursors: Dict(String, Cursor),
    self: Subject(Message),
  )
}

const tick_interval_ms = 50

/// Start the presence service actor
pub fn start() -> Result(actor.Started(Subject(Message)), actor.StartError) {
  actor.new_with_initialiser(1000, fn(self) {
    schedule_tick(self)
    Ok(
      actor.initialised(State(
        handlers: dict.new(),
        cursors: dict.new(),
        prev_cursors: dict.new(),
        self: self,
      ))
      |> actor.returning(self),
    )
  })
  |> actor.on_message(handle)
  |> actor.start
}

/// Register a new handler
pub fn register(
  subject: Subject(Message),
  conn_id: String,
  user: User,
  handler_subject: Subject(HandlerMessage),
) -> Nil {
  process.send(subject, Register(conn_id, user, handler_subject))
}

/// Unregister a handler
pub fn unregister(subject: Subject(Message), conn_id: String) -> Nil {
  process.send(subject, Unregister(conn_id))
}

/// Update cursor position
pub fn update_cursor(
  subject: Subject(Message),
  user_id: String,
  x: Int,
  y: Int,
) -> Nil {
  process.send(subject, UpdateCursor(user_id, x, y))
}

/// Broadcast a new guestbook entry
pub fn broadcast_guestbook(subject: Subject(Message), payload: String) -> Nil {
  process.send(subject, BroadcastGuestbook(payload))
}

/// Broadcast a cookie like update
pub fn broadcast_cookie_update(subject: Subject(Message), payload: String) -> Nil {
  process.send(subject, BroadcastCookieUpdate(payload))
}

/// Broadcast a reaction
pub fn broadcast_reaction(subject: Subject(Message), emoji: String, user_id: String) -> Nil {
  process.send(subject, BroadcastReaction(emoji, user_id))
}

fn handle(state: State, msg: Message) -> actor.Next(State, Message) {
  case msg {
    Register(conn_id, user, handler_subject) -> {
      let info = HandlerInfo(user: user, subject: handler_subject)
      let new_handlers = dict.insert(state.handlers, conn_id, info)

      // Broadcast presence update to all
      broadcast_presence(new_handlers)

      actor.continue(State(..state, handlers: new_handlers))
    }

    Unregister(conn_id) -> {
      // Get user_id before removing
      let maybe_info = dict.get(state.handlers, conn_id)
      let new_handlers = dict.delete(state.handlers, conn_id)

      // Also remove cursor for this user
      let new_cursors = case maybe_info {
        Ok(info) -> dict.delete(state.cursors, info.user.id)
        Error(_) -> state.cursors
      }

      // Broadcast presence update
      broadcast_presence(new_handlers)

      actor.continue(State(..state, handlers: new_handlers, cursors: new_cursors))
    }

    UpdateCursor(user_id, x, y) -> {
      let new_cursors = dict.insert(state.cursors, user_id, Cursor(x, y))
      actor.continue(State(..state, cursors: new_cursors))
    }

    BroadcastGuestbook(payload) -> {
      broadcast_to_all(state.handlers, payload)
      actor.continue(state)
    }

    BroadcastCookieUpdate(payload) -> {
      broadcast_to_all(state.handlers, payload)
      actor.continue(state)
    }

    BroadcastReaction(emoji, user_id) -> {
      let payload =
        json.object([
          #("type", json.string("reaction")),
          #("emoji", json.string(emoji)),
          #("userId", json.string(user_id)),
        ])
        |> json.to_string
      broadcast_to_all(state.handlers, payload)
      actor.continue(state)
    }

    Tick -> {
      schedule_tick(state.self)

      // Compute delta: cursors that changed since last tick
      let changed_cursors = get_changed_cursors(state.cursors, state.prev_cursors)

      // Only broadcast if there are changes
      case dict.is_empty(changed_cursors) {
        True -> actor.continue(state)
        False -> {
          broadcast_cursors(state.handlers, changed_cursors)
          actor.continue(State(..state, prev_cursors: state.cursors))
        }
      }
    }
  }
}

fn schedule_tick(self: Subject(Message)) -> Nil {
  process.send_after(self, tick_interval_ms, Tick)
  Nil
}

/// Get cursors that changed since last tick (new positions or removed cursors)
fn get_changed_cursors(
  current: Dict(String, Cursor),
  previous: Dict(String, Cursor),
) -> Dict(String, Cursor) {
  dict.fold(current, dict.new(), fn(acc, user_id, cursor) {
    case dict.get(previous, user_id) {
      // Cursor existed before - only include if position changed
      Ok(prev) if prev.x == cursor.x && prev.y == cursor.y -> acc
      // New cursor or position changed
      _ -> dict.insert(acc, user_id, cursor)
    }
  })
}

fn broadcast_presence(handlers: Dict(String, HandlerInfo)) -> Nil {
  // Deduplicate users by user_id (same user may have multiple tabs)
  let unique_users =
    dict.values(handlers)
    |> list.fold(dict.new(), fn(acc, info) {
      dict.insert(acc, info.user.id, info.user)
    })

  let users =
    dict.values(unique_users)
    |> list.map(fn(user) {
      json.object([
        #("userId", json.string(user.id)),
        #("displayName", json.string(user.display_name)),
        #("avatarId", json.string(user.avatar_id)),
      ])
    })

  let payload =
    json.object([
      #("type", json.string("presence")),
      #("users", json.array(users, fn(u) { u })),
    ])
    |> json.to_string

  broadcast_to_all(handlers, payload)
}

fn broadcast_cursors(
  handlers: Dict(String, HandlerInfo),
  cursors: Dict(String, Cursor),
) -> Nil {
  let cursor_pairs =
    dict.to_list(cursors)
    |> list.map(fn(pair) {
      let #(user_id, cursor) = pair
      #(
        user_id,
        json.object([
          #("x", json.int(cursor.x)),
          #("y", json.int(cursor.y)),
        ]),
      )
    })

  let payload =
    json.object([
      #("type", json.string("cursors")),
      #("positions", json.object(cursor_pairs)),
    ])
    |> json.to_string

  broadcast_to_all(handlers, payload)
}

fn broadcast_to_all(handlers: Dict(String, HandlerInfo), payload: String) -> Nil {
  dict.values(handlers)
  |> list.each(fn(info) {
    process.send(info.subject, SendText(payload))
  })
}

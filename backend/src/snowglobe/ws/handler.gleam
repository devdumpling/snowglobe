/// WebSocket handler for Snowglobe
///
/// Each handler creates a Subject for receiving broadcast messages from the presence service.
/// The handler then sends WebSocket frames from its own process (required by Mist 5.x).
import birl
import gleam/bit_array
import gleam/crypto
import gleam/erlang/process.{type Subject}
import gleam/int
import gleam/io
import gleam/option.{type Option, None, Some}
import snowglobe/db/cookie_likes
import snowglobe/db/guestbook
import snowglobe/services/presence
import snowglobe/types.{type Services}
import snowglobe/ws/messages.{CookieLikeMsg, CursorMsg, GuestbookMsg, IdentifyMsg, PingMsg, ReactionMsg}
import mist.{type WebsocketConnection, type WebsocketMessage, Binary, Text}
import pog

/// Rate limiting configuration (generous limits for anti-abuse only)
const cursor_rate_limit = 100
// per second

const guestbook_rate_limit = 10
// per minute

const cookie_rate_limit = 30
// per second

const reaction_rate_limit = 5
// per second

/// Rate limit tracking
pub type RateLimits {
  RateLimits(
    cursor_count: Int,
    cursor_window_start: Int,
    guestbook_count: Int,
    guestbook_window_start: Int,
    cookie_count: Int,
    cookie_window_start: Int,
    reaction_count: Int,
    reaction_window_start: Int,
  )
}

/// WebSocket connection state
pub type State {
  State(
    db: pog.Connection,
    conn_id: String,
    user_id: Option(String),
    presence: Subject(presence.Message),
    handler_subject: Subject(presence.HandlerMessage),
    conn: WebsocketConnection,
    rate_limits: RateLimits,
  )
}


/// Custom message type - broadcasts from presence service
pub type WsMessage {
  Broadcast(presence.HandlerMessage)
}

/// Initialize a new WebSocket connection
pub fn init(
  services: Services,
  conn: WebsocketConnection,
) -> #(State, Option(process.Selector(WsMessage))) {
  let conn_id = uuid()

  // Create a subject for receiving broadcast messages
  let handler_subject = process.new_subject()

  // Create a selector that maps handler messages to WsMessage
  let selector =
    process.new_selector()
    |> process.select_map(handler_subject, fn(msg) { Broadcast(msg) })

  let now = now_seconds()
  let state =
    State(
      db: services.db,
      conn_id: conn_id,
      user_id: None,
      presence: services.presence,
      handler_subject: handler_subject,
      conn: conn,
      rate_limits: RateLimits(
        cursor_count: 0,
        cursor_window_start: now,
        guestbook_count: 0,
        guestbook_window_start: now,
        cookie_count: 0,
        cookie_window_start: now,
        reaction_count: 0,
        reaction_window_start: now,
      ),
    )

  #(state, Some(selector))
}

/// Get current time in seconds
fn now_seconds() -> Int {
  birl.to_unix(birl.now())
}

/// Check and update rate limit for cursor messages (per second)
fn check_cursor_rate(state: State) -> #(Bool, RateLimits) {
  let now = now_seconds()
  let limits = state.rate_limits
  case now - limits.cursor_window_start >= 1 {
    True -> #(True, RateLimits(..limits, cursor_count: 1, cursor_window_start: now))
    False -> case limits.cursor_count < cursor_rate_limit {
      True -> #(True, RateLimits(..limits, cursor_count: limits.cursor_count + 1))
      False -> #(False, limits)
    }
  }
}

/// Check and update rate limit for guestbook messages (per minute)
fn check_guestbook_rate(state: State) -> #(Bool, RateLimits) {
  let now = now_seconds()
  let limits = state.rate_limits
  case now - limits.guestbook_window_start >= 60 {
    True -> #(True, RateLimits(..limits, guestbook_count: 1, guestbook_window_start: now))
    False -> case limits.guestbook_count < guestbook_rate_limit {
      True -> #(True, RateLimits(..limits, guestbook_count: limits.guestbook_count + 1))
      False -> #(False, limits)
    }
  }
}

/// Check and update rate limit for cookie clicks (per second)
fn check_cookie_rate(state: State) -> #(Bool, RateLimits) {
  let now = now_seconds()
  let limits = state.rate_limits
  case now - limits.cookie_window_start >= 1 {
    True -> #(True, RateLimits(..limits, cookie_count: 1, cookie_window_start: now))
    False -> case limits.cookie_count < cookie_rate_limit {
      True -> #(True, RateLimits(..limits, cookie_count: limits.cookie_count + 1))
      False -> #(False, limits)
    }
  }
}

/// Check and update rate limit for reactions (per second)
fn check_reaction_rate(state: State) -> #(Bool, RateLimits) {
  let now = now_seconds()
  let limits = state.rate_limits
  case now - limits.reaction_window_start >= 1 {
    True -> #(True, RateLimits(..limits, reaction_count: 1, reaction_window_start: now))
    False -> case limits.reaction_count < reaction_rate_limit {
      True -> #(True, RateLimits(..limits, reaction_count: limits.reaction_count + 1))
      False -> #(False, limits)
    }
  }
}

/// Handle connection close
pub fn close(state: State) -> Nil {
  presence.unregister(state.presence, state.conn_id)
  Nil
}

/// Handle incoming WebSocket messages
pub fn handle(
  state: State,
  msg: WebsocketMessage(WsMessage),
  conn: WebsocketConnection,
) -> mist.Next(State, WsMessage) {
  case msg {
    // Handle broadcast messages from presence service
    mist.Custom(Broadcast(presence.SendText(payload))) -> {
      let _ = mist.send_text_frame(conn, payload)
      mist.continue(state)
    }

    Text(text) -> {
      case messages.parse(text) {
        Ok(IdentifyMsg(user_id, display_name, avatar_id)) -> {
          // Register with presence service, passing our handler subject
          let user = presence.User(
            id: user_id,
            display_name: display_name,
            avatar_id: avatar_id,
          )
          presence.register(
            state.presence,
            state.conn_id,
            user,
            state.handler_subject,
          )
          mist.continue(State(..state, user_id: Some(user_id)))
        }

        Ok(CursorMsg(x, y)) -> {
          let #(allowed, new_limits) = check_cursor_rate(state)
          case allowed, state.user_id {
            True, Some(uid) -> {
              presence.update_cursor(state.presence, uid, x, y)
              mist.continue(State(..state, rate_limits: new_limits))
            }
            _, _ -> mist.continue(State(..state, rate_limits: new_limits))
          }
        }

        Ok(GuestbookMsg(message)) -> {
          let #(allowed, new_limits) = check_guestbook_rate(state)
          case allowed, state.user_id {
            True, Some(uid) -> {
              case guestbook.insert(state.db, uid, message) {
                Ok(entry) -> {
                  let payload = guestbook.to_json(entry)
                  presence.broadcast_guestbook(state.presence, payload)
                }
                Error(_) -> {
                  let error_payload =
                    "{\"type\":\"error\",\"code\":\"guestbook_failed\",\"message\":\"Failed to save your message. Please try again.\"}"
                  let _ = mist.send_text_frame(conn, error_payload)
                  Nil
                }
              }
            }
            _, _ -> Nil
          }
          mist.continue(State(..state, rate_limits: new_limits))
        }

        Ok(CookieLikeMsg(event_id)) -> {
          let #(allowed, new_limits) = check_cookie_rate(state)
          case allowed {
            True -> {
              case cookie_likes.increment(state.db, event_id) {
                Ok(like) -> {
                  let payload = cookie_likes.to_json(like)
                  presence.broadcast_cookie_update(state.presence, payload)
                }
                Error(e) -> {
                  io.println("Failed to increment cookie likes: " <> debug_query_error(e))
                }
              }
            }
            False -> Nil
          }
          mist.continue(State(..state, rate_limits: new_limits))
        }

        Ok(ReactionMsg(emoji)) -> {
          let #(allowed, new_limits) = check_reaction_rate(state)
          case allowed, state.user_id {
            True, Some(uid) -> {
              presence.broadcast_reaction(state.presence, emoji, uid)
            }
            _, _ -> Nil
          }
          mist.continue(State(..state, rate_limits: new_limits))
        }

        Ok(PingMsg) -> {
          let _ = mist.send_text_frame(conn, "{\"type\":\"pong\"}")
          mist.continue(state)
        }

        Error(_) -> {
          mist.continue(state)
        }
      }
    }

    Binary(_) -> mist.continue(state)

    mist.Closed | mist.Shutdown -> mist.stop()
  }
}

/// Generate a unique connection ID
fn uuid() -> String {
  crypto.strong_random_bytes(16)
  |> bit_array.base16_encode
}

fn debug_query_error(err: pog.QueryError) -> String {
  case err {
    pog.ConstraintViolated(msg, constraint, detail) ->
      "ConstraintViolated: " <> msg <> " (" <> constraint <> ") " <> detail
    pog.PostgresqlError(code, name, msg) ->
      "PostgresqlError: [" <> code <> "] " <> name <> ": " <> msg
    pog.UnexpectedArgumentCount(expected, got) ->
      "UnexpectedArgumentCount: expected " <> int.to_string(expected) <> ", got " <> int.to_string(got)
    pog.UnexpectedArgumentType(expected, got) ->
      "UnexpectedArgumentType: expected " <> expected <> ", got " <> got
    pog.UnexpectedResultType(_) ->
      "UnexpectedResultType"
    pog.QueryTimeout ->
      "QueryTimeout"
    pog.ConnectionUnavailable ->
      "ConnectionUnavailable"
  }
}

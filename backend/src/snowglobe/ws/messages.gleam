/// WebSocket message parsing for Snowglobe
///
/// Messages are JSON with a "type" field that determines the message kind.
import gleam/dynamic/decode
import gleam/json
import gleam/string

// Validation constants
const max_message_length = 500

const min_message_length = 1

/// Parsed message types from clients
pub type ParsedMessage {
  IdentifyMsg(user_id: String, display_name: String, avatar_id: String)
  CursorMsg(x: Int, y: Int)
  GuestbookMsg(message: String)
  CookieLikeMsg(event_id: String)
  ReactionMsg(emoji: String)
  PingMsg
}

/// Parse a WebSocket text message into a typed message
pub fn parse(text: String) -> Result(ParsedMessage, Nil) {
  let type_decoder = {
    use msg_type <- decode.field("type", decode.string)
    decode.success(msg_type)
  }

  case json.parse(text, type_decoder) {
    Ok("identify") -> parse_identify(text)
    Ok("cursor") -> parse_cursor(text)
    Ok("guestbook") -> parse_guestbook(text)
    Ok("cookie_like") -> parse_cookie_like(text)
    Ok("reaction") -> parse_reaction(text)
    Ok("ping") -> Ok(PingMsg)
    _ -> Error(Nil)
  }
}

fn parse_identify(text: String) -> Result(ParsedMessage, Nil) {
  let decoder = {
    use user_id <- decode.field("userId", decode.string)
    use display_name <- decode.field("displayName", decode.string)
    use avatar_id <- decode.optional_field("avatarId", "guest", decode.string)
    decode.success(IdentifyMsg(user_id, display_name, avatar_id))
  }

  case json.parse(text, decoder) {
    Ok(msg) -> Ok(msg)
    Error(_) -> Error(Nil)
  }
}

fn parse_cursor(text: String) -> Result(ParsedMessage, Nil) {
  let decoder = {
    use x <- decode.field("x", decode.int)
    use y <- decode.field("y", decode.int)
    decode.success(CursorMsg(x, y))
  }

  case json.parse(text, decoder) {
    Ok(msg) -> Ok(msg)
    Error(_) -> Error(Nil)
  }
}

fn parse_guestbook(text: String) -> Result(ParsedMessage, Nil) {
  let decoder = {
    use message <- decode.field("message", decode.string)
    decode.success(message)
  }

  case json.parse(text, decoder) {
    Ok(message) -> {
      let trimmed = string.trim(message)
      let len = string.length(trimmed)
      case len >= min_message_length && len <= max_message_length {
        True -> Ok(GuestbookMsg(trimmed))
        False -> Error(Nil)
      }
    }
    Error(_) -> Error(Nil)
  }
}

fn parse_cookie_like(text: String) -> Result(ParsedMessage, Nil) {
  let decoder = {
    use event_id <- decode.field("eventId", decode.string)
    decode.success(event_id)
  }

  case json.parse(text, decoder) {
    Ok(event_id) -> {
      // Validate event_id is not empty and reasonably sized
      let trimmed = string.trim(event_id)
      let len = string.length(trimmed)
      case len >= 1 && len <= 100 {
        True -> Ok(CookieLikeMsg(trimmed))
        False -> Error(Nil)
      }
    }
    Error(_) -> Error(Nil)
  }
}

fn parse_reaction(text: String) -> Result(ParsedMessage, Nil) {
  let decoder = {
    use emoji <- decode.field("emoji", decode.string)
    decode.success(ReactionMsg(emoji))
  }

  case json.parse(text, decoder) {
    Ok(msg) -> Ok(msg)
    Error(_) -> Error(Nil)
  }
}

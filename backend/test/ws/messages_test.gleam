import gleeunit/should
import snowglobe/ws/messages.{
  CookieLikeMsg, CursorMsg, GuestbookMsg, IdentifyMsg, PingMsg, parse,
}

// Test valid identify message parsing
pub fn parse_identify_valid_test() {
  let json =
    "{\"type\":\"identify\",\"userId\":\"123\",\"displayName\":\"Alice\",\"avatarId\":\"guest_1\"}"

  case parse(json) {
    Ok(IdentifyMsg(user_id, display_name, avatar_id)) -> {
      should.equal(user_id, "123")
      should.equal(display_name, "Alice")
      should.equal(avatar_id, "guest_1")
    }
    _ -> should.fail()
  }
}

// Test identify message with optional avatarId defaulting to "guest"
pub fn parse_identify_default_avatar_test() {
  let json = "{\"type\":\"identify\",\"userId\":\"456\",\"displayName\":\"Bob\"}"

  case parse(json) {
    Ok(IdentifyMsg(user_id, display_name, avatar_id)) -> {
      should.equal(user_id, "456")
      should.equal(display_name, "Bob")
      should.equal(avatar_id, "guest")
    }
    _ -> should.fail()
  }
}

// Test valid cursor message parsing
pub fn parse_cursor_valid_test() {
  let json = "{\"type\":\"cursor\",\"x\":100,\"y\":200}"

  case parse(json) {
    Ok(CursorMsg(x, y)) -> {
      should.equal(x, 100)
      should.equal(y, 200)
    }
    _ -> should.fail()
  }
}

// Test cursor with zero coordinates
pub fn parse_cursor_zero_coords_test() {
  let json = "{\"type\":\"cursor\",\"x\":0,\"y\":0}"

  case parse(json) {
    Ok(CursorMsg(x, y)) -> {
      should.equal(x, 0)
      should.equal(y, 0)
    }
    _ -> should.fail()
  }
}

// Test cursor with negative coordinates
pub fn parse_cursor_negative_coords_test() {
  let json = "{\"type\":\"cursor\",\"x\":-50,\"y\":-100}"

  case parse(json) {
    Ok(CursorMsg(x, y)) -> {
      should.equal(x, -50)
      should.equal(y, -100)
    }
    _ -> should.fail()
  }
}

// Test valid guestbook message parsing
pub fn parse_guestbook_valid_test() {
  let json = "{\"type\":\"guestbook\",\"message\":\"Hello world!\"}"

  case parse(json) {
    Ok(GuestbookMsg(message)) -> {
      should.equal(message, "Hello world!")
    }
    _ -> should.fail()
  }
}

// Test guestbook with empty message returns error (validation)
pub fn parse_guestbook_empty_message_test() {
  let json = "{\"type\":\"guestbook\",\"message\":\"\"}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test guestbook with whitespace-only message returns error
pub fn parse_guestbook_whitespace_only_test() {
  let json = "{\"type\":\"guestbook\",\"message\":\"   \"}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test guestbook trims whitespace
pub fn parse_guestbook_trims_whitespace_test() {
  let json = "{\"type\":\"guestbook\",\"message\":\"  Hello  \"}"

  case parse(json) {
    Ok(GuestbookMsg(message)) -> {
      should.equal(message, "Hello")
    }
    _ -> should.fail()
  }
}

// Test cookie_like with empty eventId returns error
pub fn parse_cookie_like_empty_event_id_test() {
  let json = "{\"type\":\"cookie_like\",\"eventId\":\"\"}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test cookie_like trims whitespace
pub fn parse_cookie_like_trims_whitespace_test() {
  let json = "{\"type\":\"cookie_like\",\"eventId\":\"  event-123  \"}"

  case parse(json) {
    Ok(CookieLikeMsg(event_id)) -> {
      should.equal(event_id, "event-123")
    }
    _ -> should.fail()
  }
}

// Test valid cookie_like message parsing
pub fn parse_cookie_like_valid_test() {
  let json = "{\"type\":\"cookie_like\",\"eventId\":\"event-123\"}"

  case parse(json) {
    Ok(CookieLikeMsg(event_id)) -> {
      should.equal(event_id, "event-123")
    }
    _ -> should.fail()
  }
}

// Test ping message parsing
pub fn parse_ping_valid_test() {
  let json = "{\"type\":\"ping\"}"

  case parse(json) {
    Ok(PingMsg) -> Nil
    _ -> should.fail()
  }
}

// Test invalid JSON returns error
pub fn parse_invalid_json_test() {
  let json = "not valid json"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test unknown message type returns error
pub fn parse_unknown_type_test() {
  let json = "{\"type\":\"unknown\"}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test missing type field returns error
pub fn parse_missing_type_test() {
  let json = "{\"userId\":\"123\",\"displayName\":\"Alice\"}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test cursor missing x coordinate returns error
pub fn parse_cursor_missing_x_test() {
  let json = "{\"type\":\"cursor\",\"y\":200}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test cursor missing y coordinate returns error
pub fn parse_cursor_missing_y_test() {
  let json = "{\"type\":\"cursor\",\"x\":100}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test identify missing userId returns error
pub fn parse_identify_missing_user_id_test() {
  let json = "{\"type\":\"identify\",\"displayName\":\"Alice\"}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test identify missing displayName returns error
pub fn parse_identify_missing_display_name_test() {
  let json = "{\"type\":\"identify\",\"userId\":\"123\"}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test guestbook missing message returns error
pub fn parse_guestbook_missing_message_test() {
  let json = "{\"type\":\"guestbook\"}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test cookie_like missing eventId returns error
pub fn parse_cookie_like_missing_event_id_test() {
  let json = "{\"type\":\"cookie_like\"}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test empty JSON object returns error
pub fn parse_empty_object_test() {
  let json = "{}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test cursor with float coordinates returns error (should be int)
pub fn parse_cursor_float_coords_test() {
  let json = "{\"type\":\"cursor\",\"x\":100.5,\"y\":200.5}"

  case parse(json) {
    Error(Nil) -> Nil
    Ok(_) -> should.fail()
  }
}

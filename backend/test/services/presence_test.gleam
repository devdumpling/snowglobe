/// Tests for the presence service
import gleam/erlang/process
import gleam/otp/actor
import gleam/string
import gleeunit/should
import snowglobe/services/presence.{SendText, User}

/// Test that the presence service starts successfully
pub fn presence_starts_test() {
  case presence.start() {
    Ok(actor.Started(data: _subject, ..)) -> Nil
    Error(_) -> should.fail()
  }
}

/// Test user registration and receiving presence updates
pub fn presence_register_test() {
  case presence.start() {
    Ok(actor.Started(data: presence_subject, ..)) -> {
      // Create a Subject to receive handler messages
      let handler_subject = process.new_subject()
      let user = User("user-1", "Alice", "guest_1")

      // Register the user
      presence.register(presence_subject, "conn-1", user, handler_subject)

      // We should receive a presence update
      case process.receive(handler_subject, 100) {
        Ok(SendText(payload)) -> {
          // Check that the payload contains the presence type
          should.be_true(contains_string(payload, "\"type\":\"presence\""))
          should.be_true(contains_string(payload, "\"userId\":\"user-1\""))
          should.be_true(contains_string(payload, "\"displayName\":\"Alice\""))
        }
        Error(_) -> should.fail()
      }
    }
    Error(_) -> should.fail()
  }
}

/// Test that unregister sends an updated presence list
pub fn presence_unregister_test() {
  case presence.start() {
    Ok(actor.Started(data: presence_subject, ..)) -> {
      // Create handler subjects
      let handler1 = process.new_subject()
      let handler2 = process.new_subject()
      let user1 = User("user-1", "Alice", "guest_1")
      let user2 = User("user-2", "Bob", "guest_2")

      // Register two users
      presence.register(presence_subject, "conn-1", user1, handler1)

      // Clear the initial presence update
      let _ = process.receive(handler1, 100)

      presence.register(presence_subject, "conn-2", user2, handler2)

      // Clear the presence updates
      let _ = process.receive(handler1, 100)
      let _ = process.receive(handler2, 100)

      // Unregister user 1
      presence.unregister(presence_subject, "conn-1")

      // Handler 2 should receive a presence update (without user 1)
      case process.receive(handler2, 100) {
        Ok(SendText(payload)) -> {
          should.be_true(contains_string(payload, "\"type\":\"presence\""))
          // Should only have user-2 now
          should.be_true(contains_string(payload, "\"userId\":\"user-2\""))
        }
        Error(_) -> should.fail()
      }
    }
    Error(_) -> should.fail()
  }
}

/// Test cursor update broadcasting
pub fn presence_cursor_update_test() {
  case presence.start() {
    Ok(actor.Started(data: presence_subject, ..)) -> {
      let handler = process.new_subject()
      let user = User("user-1", "Alice", "guest_1")

      presence.register(presence_subject, "conn-1", user, handler)

      // Clear initial presence update
      let _ = process.receive(handler, 100)

      // Update cursor position
      presence.update_cursor(presence_subject, "user-1", 100, 200)

      // Wait for tick interval to broadcast cursors (50ms + some buffer)
      process.sleep(100)

      // Should receive cursor update
      case process.receive(handler, 100) {
        Ok(SendText(payload)) -> {
          should.be_true(contains_string(payload, "\"type\":\"cursors\""))
          should.be_true(contains_string(payload, "\"x\":100"))
          should.be_true(contains_string(payload, "\"y\":200"))
        }
        Error(_) -> should.fail()
      }
    }
    Error(_) -> should.fail()
  }
}

/// Test guestbook broadcast
pub fn presence_broadcast_guestbook_test() {
  case presence.start() {
    Ok(actor.Started(data: presence_subject, ..)) -> {
      let handler = process.new_subject()
      let user = User("user-1", "Alice", "guest_1")

      presence.register(presence_subject, "conn-1", user, handler)

      // Clear initial presence update
      let _ = process.receive(handler, 100)

      // Broadcast guestbook entry
      let payload = "{\"type\":\"guestbook\",\"entry\":{\"message\":\"Hello!\"}}"
      presence.broadcast_guestbook(presence_subject, payload)

      // Should receive the broadcast
      case process.receive(handler, 100) {
        Ok(SendText(received)) -> {
          should.equal(received, payload)
        }
        Error(_) -> should.fail()
      }
    }
    Error(_) -> should.fail()
  }
}

/// Test reaction broadcast
pub fn presence_broadcast_reaction_test() {
  case presence.start() {
    Ok(actor.Started(data: presence_subject, ..)) -> {
      let handler = process.new_subject()
      let user = User("user-1", "Alice", "guest_1")

      presence.register(presence_subject, "conn-1", user, handler)

      // Clear initial presence update
      let _ = process.receive(handler, 100)

      // Broadcast reaction
      presence.broadcast_reaction(presence_subject, "🎉", "user-1")

      // Should receive the broadcast
      case process.receive(handler, 100) {
        Ok(SendText(payload)) -> {
          should.be_true(contains_string(payload, "\"type\":\"reaction\""))
          should.be_true(contains_string(payload, "\"emoji\":\"🎉\""))
          should.be_true(contains_string(payload, "\"userId\":\"user-1\""))
        }
        Error(_) -> should.fail()
      }
    }
    Error(_) -> should.fail()
  }
}

// Helper to check if a string contains another string
fn contains_string(haystack: String, needle: String) -> Bool {
  string.contains(haystack, needle)
}

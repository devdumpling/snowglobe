/// Shared types used across multiple modules
import gleam/erlang/process.{type Subject}
import snowglobe/services/presence
import pog

/// Services bundle passed to handlers
pub type Services {
  Services(db: pog.Connection, presence: Subject(presence.Message))
}

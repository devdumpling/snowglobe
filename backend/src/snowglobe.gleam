/// Snowglobe WebSocket Backend
///
/// Handles:
/// - Presence (online users, cursor positions)
/// - Guestbook writes with broadcast
import gleam/erlang/process
import gleam/int
import gleam/io
import gleam/otp/actor
import gleam/result
import snowglobe/config
import snowglobe/db/pool
import snowglobe/router
import snowglobe/services/presence
import snowglobe/types
import mist

pub fn main() {
  io.println("Starting Snowglobe backend...")

  case start() {
    Ok(_) -> Nil
    Error(msg) -> {
      io.println("Startup failed: " <> msg)
      Nil
    }
  }
}

fn start() -> Result(Nil, String) {
  let cfg = config.load()

  // Initialize database pool
  use db <- result.try(
    pool.start(cfg.database_url, cfg.use_ssl)
    |> result.map_error(fn(err) {
      case err {
        pool.ConfigError(msg) -> "Invalid DATABASE_URL: " <> msg
        pool.StartError(_) -> "Database connection failed"
      }
    }),
  )
  io.println("Database pool initialized")

  // Start presence service
  use presence_subject <- result.try(start_presence())
  io.println("Presence service started")

  // Create services bundle
  let services = types.Services(db: db, presence: presence_subject)

  // Start HTTP server
  start_server(cfg, services)
}

fn start_presence() -> Result(process.Subject(presence.Message), String) {
  case presence.start() {
    Ok(actor.Started(data: subject, ..)) -> Ok(subject)
    Error(_) -> Error("Presence service failed to start")
  }
}

fn start_server(
  cfg: config.Config,
  services: types.Services,
) -> Result(Nil, String) {
  case
    router.handler(cfg, services)
    |> mist.new
    |> mist.bind("0.0.0.0")
    |> mist.port(cfg.port)
    |> mist.start
  {
    Ok(_) -> {
      io.println("Server started on port " <> int.to_string(cfg.port))
      process.sleep_forever()
      Ok(Nil)
    }
    Error(_) -> Error("HTTP server failed to start")
  }
}

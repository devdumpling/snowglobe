import gleam/erlang/process
import gleam/option.{type Option, None, Some}
import gleam/otp/actor
import gleam/result
import gleam/string
import gleam/uri
import pog

/// Parsed database connection configuration
pub type DbConfig {
  DbConfig(
    host: String,
    port: Int,
    database: String,
    user: String,
    password: Option(String),
  )
}

/// Errors that can occur when starting the pool
pub type PoolError {
  /// Invalid database URL format
  ConfigError(String)
  /// Failed to start the connection pool
  StartError(actor.StartError)
}

/// Parse a postgres:// URL into DbConfig
pub fn parse_url(database_url: String) -> Result(DbConfig, String) {
  use parsed <- result.try(
    uri.parse(database_url)
    |> result.replace_error("Invalid database URL format"),
  )

  use host <- result.try(
    parsed.host
    |> option.to_result("Missing host in database URL"),
  )

  let port = parsed.port |> option.unwrap(5432)

  let database = case parsed.path {
    "/" <> db -> db
    db -> db
  }
  use _ <- result.try(case database {
    "" -> Error("Missing database name in URL")
    _ -> Ok(Nil)
  })

  use #(user, password) <- result.try(parse_userinfo(parsed.userinfo))

  Ok(DbConfig(
    host: host,
    port: port,
    database: database,
    user: user,
    password: password,
  ))
}

fn parse_userinfo(
  userinfo: Option(String),
) -> Result(#(String, Option(String)), String) {
  case userinfo {
    None -> Error("Missing user credentials in database URL")
    Some(info) -> {
      case string.split(info, ":") {
        [user] -> Ok(#(user, None))
        [user, pass] -> Ok(#(user, Some(pass)))
        _ -> Error("Invalid userinfo format in database URL")
      }
    }
  }
}

/// Start the database connection pool
pub fn start(database_url: String, use_ssl: Bool) -> Result(pog.Connection, PoolError) {
  // Parse the URL - if it fails, wrap the String error in ConfigError
  use db_config <- result.try(
    parse_url(database_url)
    |> result.map_error(ConfigError)
  )

  let pool_name = process.new_name("snowglobe_db_pool")

  let base_config =
    pog.default_config(pool_name)
    |> pog.host(db_config.host)
    |> pog.port(db_config.port)
    |> pog.database(db_config.database)
    |> pog.user(db_config.user)
    |> pog.password(db_config.password)
    |> pog.pool_size(10)

  // Apply SSL if enabled
  let config = case use_ssl {
    True -> base_config |> pog.ssl(pog.SslUnverified)
    False -> base_config
  }

  // Apply IPv6 for Fly internal networking (flympg.net domains)
  let config = case string.contains(db_config.host, "flympg.net") {
    True -> config |> pog.ip_version(pog.Ipv6)
    False -> config
  }

  // Start the pool - wrap any start error in StartError
  pog.start(config)
  |> result.map(fn(started) { started.data })
  |> result.map_error(StartError)
}

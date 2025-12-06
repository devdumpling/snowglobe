import envoy
import gleam/int
import gleam/result

pub type Config {
  Config(port: Int, database_url: String, use_ssl: Bool)
}

pub fn load() -> Config {
  let port =
    envoy.get("PORT")
    |> result.try(int.parse)
    |> result.unwrap(4000)

  let database_url =
    envoy.get("DATABASE_URL")
    |> result.unwrap("postgres://root:mysecretpassword@localhost:5432/local")

  // Enable SSL with USE_SSL=true (for production)
  let use_ssl = case envoy.get("USE_SSL") {
    Ok("true") | Ok("1") -> True
    _ -> False
  }

  Config(port: port, database_url: database_url, use_ssl: use_ssl)
}

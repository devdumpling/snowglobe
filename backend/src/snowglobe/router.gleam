/// HTTP router for Snowglobe backend
///
/// Routes:
/// - GET /ws - WebSocket upgrade
/// - GET /health - Health check
import gleam/bytes_tree
import gleam/http/request.{type Request}
import gleam/http/response.{type Response}
import snowglobe/config.{type Config}
import snowglobe/types.{type Services}
import snowglobe/ws/handler as ws
import mist.{type Connection, type ResponseData}

/// Create the request handler
pub fn handler(
  _cfg: Config,
  services: Services,
) -> fn(Request(Connection)) -> Response(ResponseData) {
  fn(req: Request(Connection)) {
    case request.path_segments(req) {
      ["ws"] -> handle_websocket(req, services)
      ["health"] -> health()
      _ -> not_found()
    }
  }
}

fn handle_websocket(
  req: Request(Connection),
  services: Services,
) -> Response(ResponseData) {
  mist.websocket(
    request: req,
    handler: ws.handle,
    on_init: fn(conn) { ws.init(services, conn) },
    on_close: ws.close,
  )
}

fn health() -> Response(ResponseData) {
  response.new(200)
  |> response.set_body(mist.Bytes(bytes_tree.from_string("ok")))
}

fn not_found() -> Response(ResponseData) {
  response.new(404)
  |> response.set_body(mist.Bytes(bytes_tree.from_string("not found")))
}

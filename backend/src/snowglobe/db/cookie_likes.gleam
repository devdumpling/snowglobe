import gleam/dynamic/decode
import gleam/json
import pog

/// A cookie like count for an event
pub type CookieLike {
  CookieLike(event_id: String, count: Int)
}

/// Increment cookie count and return new total (upsert)
pub fn increment(
  db: pog.Connection,
  event_id: String,
) -> Result(CookieLike, pog.QueryError) {
  let row_decoder = {
    use eid <- decode.field(0, decode.string)
    use count <- decode.field(1, decode.int)
    decode.success(CookieLike(eid, count))
  }

  let query =
    "INSERT INTO cookie_like (event_id, count, updated_at)
     VALUES ($1::text, 1, NOW())
     ON CONFLICT (event_id)
     DO UPDATE SET
       count = cookie_like.count + 1,
       updated_at = NOW()
     RETURNING event_id, count"

  case
    pog.query(query)
    |> pog.parameter(pog.text(event_id))
    |> pog.returning(row_decoder)
    |> pog.execute(db)
  {
    Ok(pog.Returned(_, [like, ..])) -> Ok(like)
    Ok(pog.Returned(_, [])) ->
      Error(pog.UnexpectedArgumentCount(expected: 1, got: 0))
    Error(e) -> Error(e)
  }
}

/// Convert a cookie like to JSON for broadcast
pub fn to_json(like: CookieLike) -> String {
  json.object([
    #("type", json.string("cookie_update")),
    #("eventId", json.string(like.event_id)),
    #("count", json.int(like.count)),
  ])
  |> json.to_string
}

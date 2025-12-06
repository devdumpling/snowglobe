import gleam/dynamic/decode
import gleam/json
import pog

/// A guestbook entry
pub type GuestbookEntry {
  GuestbookEntry(
    id: Int,
    user_id: String,
    display_name: String,
    avatar_id: String,
    message: String,
    created_at: String,
  )
}

/// Insert a guestbook entry and return the created entry
pub fn insert(
  db: pog.Connection,
  user_id: String,
  message: String,
) -> Result(GuestbookEntry, pog.QueryError) {
  let row_decoder = {
    use id <- decode.field(0, decode.int)
    use uid <- decode.field(1, decode.string)
    use display_name <- decode.field(2, decode.string)
    use avatar_id <- decode.field(3, decode.string)
    use msg <- decode.field(4, decode.string)
    use created_at <- decode.field(5, decode.string)
    decode.success(GuestbookEntry(id, uid, display_name, avatar_id, msg, created_at))
  }

  // Use CTE to insert and join in a single query instead of 2 subqueries
  let query =
    "WITH inserted AS (
       INSERT INTO guestbook_entry (user_id, message)
       VALUES ($1::text, $2::text)
       RETURNING id, user_id, message, created_at
     )
     SELECT
       i.id,
       i.user_id,
       u.display_name,
       u.avatar_id,
       i.message,
       to_char(i.created_at, 'YYYY-MM-DD\"T\"HH24:MI:SS\"Z\"') as created_at
     FROM inserted i
     JOIN \"user\" u ON u.id = i.user_id"

  case
    pog.query(query)
    |> pog.parameter(pog.text(user_id))
    |> pog.parameter(pog.text(message))
    |> pog.returning(row_decoder)
    |> pog.execute(db)
  {
    Ok(pog.Returned(_, [entry, ..])) -> Ok(entry)
    Ok(pog.Returned(_, [])) ->
      Error(pog.UnexpectedArgumentCount(expected: 1, got: 0))
    Error(e) -> Error(e)
  }
}

/// Convert a guestbook entry to JSON for broadcast
pub fn to_json(entry: GuestbookEntry) -> String {
  json.object([
    #("type", json.string("guestbook_new")),
    #(
      "entry",
      json.object([
        #("id", json.int(entry.id)),
        #("userId", json.string(entry.user_id)),
        #("displayName", json.string(entry.display_name)),
        #("avatarId", json.string(entry.avatar_id)),
        #("message", json.string(entry.message)),
        #("createdAt", json.string(entry.created_at)),
      ]),
    ),
  ])
  |> json.to_string
}

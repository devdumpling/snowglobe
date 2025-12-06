# Snowglobe Backend

Gleam WebSocket server for the Snowglobe Year in Review template.

Handles:
- Real-time presence (online users, cursor positions)
- Guestbook writes with broadcast
- Cookie likes
- Emoji reactions

## Development

```sh
gleam run   # Run the project
gleam test  # Run the tests
```

## Architecture

The backend runs on the BEAM and uses:
- **Mist** - HTTP/WebSocket server
- **Pog** - PostgreSQL driver
- **OTP actors** - Presence state management

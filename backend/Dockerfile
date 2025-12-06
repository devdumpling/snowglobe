FROM ghcr.io/gleam-lang/gleam:v1.13.0-erlang-alpine AS builder

WORKDIR /app

# Copy source
COPY gleam.toml manifest.toml ./
COPY src ./src

# Build release
RUN gleam export erlang-shipment

# Production image
FROM ghcr.io/gleam-lang/gleam:v1.13.0-erlang-alpine AS runner

WORKDIR /app

# Copy the built release
COPY --from=builder /app/build/erlang-shipment ./

ENV PORT=4000

EXPOSE 4000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["run"]

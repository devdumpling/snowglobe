import gleam/option.{None, Some}
import gleeunit/should
import snowglobe/db/pool.{parse_url}

// Test standard postgres:// URL parsing
pub fn parse_url_standard_test() {
  let url = "postgres://user:password@localhost:5432/mydb"

  case parse_url(url) {
    Ok(config) -> {
      should.equal(config.host, "localhost")
      should.equal(config.port, 5432)
      should.equal(config.database, "mydb")
      should.equal(config.user, "user")
      should.equal(config.password, Some("password"))
    }
    Error(_) -> should.fail()
  }
}

// Test URL without password
pub fn parse_url_no_password_test() {
  let url = "postgres://user@localhost:5432/mydb"

  case parse_url(url) {
    Ok(config) -> {
      should.equal(config.host, "localhost")
      should.equal(config.port, 5432)
      should.equal(config.database, "mydb")
      should.equal(config.user, "user")
      should.equal(config.password, None)
    }
    Error(_) -> should.fail()
  }
}

// Test URL with non-standard port
pub fn parse_url_custom_port_test() {
  let url = "postgres://user:pass@localhost:5433/mydb"

  case parse_url(url) {
    Ok(config) -> {
      should.equal(config.port, 5433)
    }
    Error(_) -> should.fail()
  }
}

// Test URL with default port (omitted)
pub fn parse_url_default_port_test() {
  let url = "postgres://user:pass@localhost/mydb"

  case parse_url(url) {
    Ok(config) -> {
      should.equal(config.port, 5432)
    }
    Error(_) -> should.fail()
  }
}

// Test URL with different host
pub fn parse_url_remote_host_test() {
  let url = "postgres://user:pass@db.example.com:5432/production"

  case parse_url(url) {
    Ok(config) -> {
      should.equal(config.host, "db.example.com")
      should.equal(config.database, "production")
    }
    Error(_) -> should.fail()
  }
}

// Test missing host returns error
pub fn parse_url_missing_host_test() {
  let url = "postgres:///mydb"

  case parse_url(url) {
    Error(_) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test missing database returns error
pub fn parse_url_missing_database_test() {
  let url = "postgres://user:pass@localhost:5432/"

  case parse_url(url) {
    Error(_) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test missing user credentials returns error
pub fn parse_url_missing_credentials_test() {
  let url = "postgres://localhost:5432/mydb"

  case parse_url(url) {
    Error(_) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test invalid URL format returns error
pub fn parse_url_invalid_format_test() {
  let url = "not-a-valid-url"

  case parse_url(url) {
    Error(_) -> Nil
    Ok(_) -> should.fail()
  }
}

// Test URL with path database (no leading slash needed)
pub fn parse_url_database_path_test() {
  let url = "postgres://user:pass@localhost:5432/testdb"

  case parse_url(url) {
    Ok(config) -> {
      should.equal(config.database, "testdb")
    }
    Error(_) -> should.fail()
  }
}

// Test URL with complex password (special characters)
pub fn parse_url_complex_password_test() {
  // Note: In real URLs, special chars should be URL-encoded
  let url = "postgres://user:p%40ssword@localhost:5432/mydb"

  case parse_url(url) {
    Ok(config) -> {
      // Password will contain the encoded form
      should.equal(config.password, Some("p%40ssword"))
    }
    Error(_) -> should.fail()
  }
}

// Test empty URL returns error
pub fn parse_url_empty_test() {
  let url = ""

  case parse_url(url) {
    Error(_) -> Nil
    Ok(_) -> should.fail()
  }
}

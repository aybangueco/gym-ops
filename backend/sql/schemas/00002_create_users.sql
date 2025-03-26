-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email CITEXT UNIQUE NOT NULL,
    password bytea NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp,
    version BIGINT NOT NULL DEFAULT 1
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users;
-- +goose StatementEnd

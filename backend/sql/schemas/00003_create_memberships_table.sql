-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS memberships(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    membership_name TEXT NOT NULL,
    membership_length INT NOT NULL DEFAULT 0,
    created_by BIGINT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS memberships;
-- +goose StatementEnd

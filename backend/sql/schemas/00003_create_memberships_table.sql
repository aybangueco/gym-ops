-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS memberships(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    membership_name TEXT NOT NULL,
    membership_length INT NOT NULL,
    created_by BIGSERIAL NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS memberships;
-- +goose StatementEnd

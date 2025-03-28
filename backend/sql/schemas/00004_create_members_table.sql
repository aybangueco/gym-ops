-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS members (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    member_name TEXT NOT NULL,
    member_contact TEXT NOT NULL,
    membership BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    membership_start TIMESTAMP,
    membership_end TIMESTAMP,
    FOREIGN KEY (membership) REFERENCES memberships(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS members;
-- +goose StatementEnd

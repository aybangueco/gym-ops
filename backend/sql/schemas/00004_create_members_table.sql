-- +goose Up
-- +goose StatementBegin
CREATE TYPE status AS ENUM ('active', 'inactive');
CREATE TABLE IF NOT EXISTS members (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    member_name TEXT NOT NULL,
    member_contact TEXT NOT NULL,
    membership BIGINT,
    created_by BIGINT NOT NULL,
    membership_status status NOT NULL,
    membership_start TIMESTAMP DEFAULT NULL,
    membership_end TIMESTAMP DEFAULT NULL,
    version INT NOT NULL DEFAULT 1,
    FOREIGN KEY (membership) REFERENCES memberships(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE IF EXISTS status;
DROP TABLE IF EXISTS members;
-- +goose StatementEnd

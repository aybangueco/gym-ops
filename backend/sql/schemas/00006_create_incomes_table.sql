-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS incomes (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    member_id BIGINT NOT NULL,
    membership_id BIGINT NOT NULL,
    amount BIGINT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS incomes;
-- +goose StatementEnd

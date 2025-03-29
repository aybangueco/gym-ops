-- +goose Up
-- +goose StatementBegin
CREATE TYPE otp_type as ENUM('email_verification', 'password_reset');

CREATE TABLE IF NOT EXISTS otps (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    code BIGINT NOT NULL,
    type otp_type NOT NULL,
    expires_at TIMESTAMP DEFAULT (current_timestamp + '10 minutes'),
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_otp on otps(code);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX idex_otp;
DROP TABLE IF EXISTS otps;
DROP TYPE IF EXISTS otp_type;
-- +goose StatementEnd

-- name: GetOtpByCode :one
SELECT * FROM otps WHERE code = $1;

-- name: CreateOtp :one
INSERT INTO otps (
    code, type, user_id
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: DeleteOtp :exec
DELETE FROM otps WHERE code = $1;
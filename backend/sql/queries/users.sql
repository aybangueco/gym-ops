-- name: GetUserById :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1 LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (
    name, email, password
) VALUES (
    $1, $2, $3
)
RETURNING *;

-- name: UpdateUser :exec
UPDATE users
    set name = $3,
    email = $4,
    password = $5,
    activated = $6,
    version = version + 1
WHERE id = $1 AND version = $2;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;
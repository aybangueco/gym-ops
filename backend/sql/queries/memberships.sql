-- name: GetMemberships :many
SELECT * FROM memberships
WHERE created_by = $1;

-- name: GetMembershipByID :one
SELECT * FROM memberships
WHERE id = $1 AND created_by = $2;

-- name: CreateMembership :one
INSERT INTO memberships (
    membership_name, membership_length, created_by
) VALUES (
    $1, $2, $3
)
RETURNING *;

-- name: UpdateMembership :one
UPDATE memberships
    set membership_name = $4,
    membership_length = $5,
    version = version + 1
WHERE id = $1 AND created_by = $2 AND version = $3
RETURNING version;

-- name: DeleteMembership :exec
DELETE FROM memberships
WHERE id = $1 AND created_by = $2;
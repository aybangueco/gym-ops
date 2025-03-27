-- name: GetMembershipsByUserID :many
SELECT * FROM memberships
WHERE created_by = $1;

-- name: GetMembershipByID :one
SELECT * FROM memberships
WHERE id = $1;

-- name: CreateMembership :one
INSERT INTO memberships (
    membership_name, membership_length, created_by
) VALUES (
    $1, $2, $3
)
RETURNING *;

-- name: UpdateMembership :exec
UPDATE memberships
    set membership_name = $2,
    membership_length = $3,
    version = version + 1
WHERE id = $1 AND version = $4;

-- name: DeleteMembership :exec
DELETE FROM memberships
WHERE id = $1;
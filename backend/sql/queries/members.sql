-- name: GetMembers :many
SELECT * FROM members
WHERE created_by = $1;

-- name: GetMemberByID :one
SELECT * FROM members
WHERE id = $1 AND created_by = $2;

-- name: CreateMember :one
INSERT INTO members (
    member_name, member_contact, membership, created_by, membership_start, membership_end
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: UpdateMember :one
UPDATE members
    set member_name = $3,
    member_contact = $4,
    membership = $5,
    membership_start = $6,
    membership_end = $7
WHERE id = $1 AND created_by = $2
RETURNING membership_start, membership_end;

-- name: DeleteMember :exec
DELETE FROM members
WHERE id = $1 AND created_by = $2;
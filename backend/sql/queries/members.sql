-- name: GetMembers :many
SELECT * FROM members
WHERE created_by = $1
ORDER BY id
LIMIT $2 OFFSET $3;

-- name: GetExpiredMembers :many
SELECT * FROM members
WHERE created_by = $1 AND membership_end IS NOT NULL AND membership_end < NOW()
ORDER BY id
LIMIT $2 OFFSET $3;

-- name: CountMembers :one
SELECT COUNT(*) as total_members
FROM members
WHERE created_by = $1;

-- name: CountExpiredMembers :one
SELECT COUNT(*) as total_members
FROM members
WHERE created_by = $1 AND membership_end IS NOT NULL AND membership_end < NOW();

-- name: CountMembersOfMemberships :many
SELECT membership, COUNT(*) as total
FROM members
WHERE created_by = $1
GROUP BY membership;

-- name: GetMemberByID :one
SELECT * FROM members
WHERE id = $1 AND created_by = $2;

-- name: CreateMember :one
INSERT INTO members (
    member_name, member_contact, membership, created_by, membership_status, membership_start, membership_end
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
) RETURNING *;

-- name: UpdateMember :one
UPDATE members
    set member_name = $4,
    member_contact = $5,
    membership = $6,
    membership_status = $7,
    membership_start = $8,
    membership_end = $9,
    version = version + 1
WHERE id = $1 AND created_by = $2 AND version = $3
RETURNING membership_start, membership_end;

-- name: DeleteMember :execresult
DELETE FROM members
WHERE id = $1 AND created_by = $2;
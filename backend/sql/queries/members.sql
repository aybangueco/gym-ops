-- name: GetMemberByID :one
SELECT * FROM members
WHERE id = $1;

-- name: CreateMember :one
INSERT INTO members (
    member_name, member_contact, membership, created_by, membership_start, membership_end
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: UpdateMember :one
UPDATE members
    set member_name = $2,
    member_contact = $3,
    membership = $4,
    membership_start = $5,
    membership_end = $6
WHERE id = $1
RETURNING membership_start, membership_end;

-- name: DeleteMember :exec
DELETE FROM members
WHERE id = $1;
// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0

package database

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Membership struct {
	ID               int64  `json:"id"`
	MembershipName   string `json:"membership_name"`
	MembershipLength int32  `json:"membership_length"`
	CreatedBy        int64  `json:"created_by"`
}

type User struct {
	ID        int64            `json:"id"`
	Name      string           `json:"name"`
	Email     string           `json:"email"`
	Password  []byte           `json:"password"`
	CreatedAt pgtype.Timestamp `json:"created_at"`
	UpdatedAt pgtype.Timestamp `json:"updated_at"`
	Version   int64            `json:"version"`
}

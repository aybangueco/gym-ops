// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0

package database

import (
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

type OtpType string

const (
	OtpTypeEmailVerification OtpType = "email_verification"
	OtpTypePasswordReset     OtpType = "password_reset"
)

func (e *OtpType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = OtpType(s)
	case string:
		*e = OtpType(s)
	default:
		return fmt.Errorf("unsupported scan type for OtpType: %T", src)
	}
	return nil
}

type NullOtpType struct {
	OtpType OtpType `json:"otp_type"`
	Valid   bool    `json:"valid"` // Valid is true if OtpType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullOtpType) Scan(value interface{}) error {
	if value == nil {
		ns.OtpType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.OtpType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullOtpType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.OtpType), nil
}

type Member struct {
	ID              int64      `json:"id"`
	MemberName      string     `json:"member_name"`
	MemberContact   string     `json:"member_contact"`
	Membership      int64      `json:"membership"`
	CreatedBy       int64      `json:"created_by"`
	MembershipStart *time.Time `json:"membership_start"`
	MembershipEnd   *time.Time `json:"membership_end"`
}

type Membership struct {
	ID               int64  `json:"id"`
	MembershipName   string `json:"membership_name"`
	MembershipLength *int32 `json:"membership_length"`
	CreatedBy        int64  `json:"created_by"`
	Version          int32  `json:"version"`
}

type Otp struct {
	ID        int64       `json:"id"`
	Code      int64       `json:"code"`
	Type      OtpType     `json:"type"`
	ExpiresAt *time.Time  `json:"expires_at"`
	UserID    pgtype.Int8 `json:"user_id"`
}

type User struct {
	ID        int64      `json:"id"`
	Name      string     `json:"name"`
	Email     string     `json:"email"`
	Password  []byte     `json:"password"`
	Activated bool       `json:"activated"`
	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
	Version   int64      `json:"version"`
}

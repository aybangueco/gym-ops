// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: incomes.sql

package database

import (
	"context"
	"time"
)

const createIncome = `-- name: CreateIncome :one
INSERT INTO incomes(
  member_id, membership_id, amount, created_by
) VALUES (
  $1, $2, $3, $4
) RETURNING id, member_id, membership_id, amount, active, recorded_at, created_by
`

type CreateIncomeParams struct {
	MemberID     int64 `json:"member_id"`
	MembershipID int64 `json:"membership_id"`
	Amount       int64 `json:"amount"`
	CreatedBy    int64 `json:"created_by"`
}

func (q *Queries) CreateIncome(ctx context.Context, arg CreateIncomeParams) (Income, error) {
	row := q.db.QueryRow(ctx, createIncome,
		arg.MemberID,
		arg.MembershipID,
		arg.Amount,
		arg.CreatedBy,
	)
	var i Income
	err := row.Scan(
		&i.ID,
		&i.MemberID,
		&i.MembershipID,
		&i.Amount,
		&i.Active,
		&i.RecordedAt,
		&i.CreatedBy,
	)
	return i, err
}

const deleteIncome = `-- name: DeleteIncome :exec
DELETE FROM incomes WHERE member_id = $1 AND membership_id = $2 AND active = $3 AND created_by = $4
`

type DeleteIncomeParams struct {
	MemberID     int64 `json:"member_id"`
	MembershipID int64 `json:"membership_id"`
	Active       bool  `json:"active"`
	CreatedBy    int64 `json:"created_by"`
}

func (q *Queries) DeleteIncome(ctx context.Context, arg DeleteIncomeParams) error {
	_, err := q.db.Exec(ctx, deleteIncome,
		arg.MemberID,
		arg.MembershipID,
		arg.Active,
		arg.CreatedBy,
	)
	return err
}

const getMonthIncomes = `-- name: GetMonthIncomes :one
SELECT
  DATE_TRUNC('month', CURRENT_DATE)::timestamp AS month,
  COALESCE(SUM(amount), 0) AS total_income
FROM incomes
WHERE DATE_TRUNC('month', recorded_at) = DATE_TRUNC('month', CURRENT_DATE) AND created_by = $1
`

type GetMonthIncomesRow struct {
	Month       time.Time   `json:"month"`
	TotalIncome interface{} `json:"total_income"`
}

func (q *Queries) GetMonthIncomes(ctx context.Context, createdBy int64) (GetMonthIncomesRow, error) {
	row := q.db.QueryRow(ctx, getMonthIncomes, createdBy)
	var i GetMonthIncomesRow
	err := row.Scan(&i.Month, &i.TotalIncome)
	return i, err
}

const getMonthlyIncomes = `-- name: GetMonthlyIncomes :many
SELECT
  TO_CHAR(DATE_TRUNC('month', recorded_at), 'YYYY-MM') AS month,
  SUM(amount) AS total_income
FROM incomes
WHERE recorded_at >= (CURRENT_DATE - INTERVAL '12 months') AND created_by = $1
GROUP BY DATE_TRUNC('month', recorded_at)
ORDER BY DATE_TRUNC('month', recorded_at)
`

type GetMonthlyIncomesRow struct {
	Month       string `json:"month"`
	TotalIncome int64  `json:"total_income"`
}

func (q *Queries) GetMonthlyIncomes(ctx context.Context, createdBy int64) ([]GetMonthlyIncomesRow, error) {
	rows, err := q.db.Query(ctx, getMonthlyIncomes, createdBy)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMonthlyIncomesRow
	for rows.Next() {
		var i GetMonthlyIncomesRow
		if err := rows.Scan(&i.Month, &i.TotalIncome); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateIncome = `-- name: UpdateIncome :exec
UPDATE incomes
SET amount = $4, active = $5
WHERE membership_id = $1 AND active = $2 AND created_by = $3
`

type UpdateIncomeParams struct {
	MembershipID int64 `json:"membership_id"`
	Active       bool  `json:"active"`
	CreatedBy    int64 `json:"created_by"`
	Amount       int64 `json:"amount"`
	Active_2     bool  `json:"active_2"`
}

func (q *Queries) UpdateIncome(ctx context.Context, arg UpdateIncomeParams) error {
	_, err := q.db.Exec(ctx, updateIncome,
		arg.MembershipID,
		arg.Active,
		arg.CreatedBy,
		arg.Amount,
		arg.Active_2,
	)
	return err
}

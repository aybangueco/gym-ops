-- name: GetMonthIncomes :one
SELECT
  DATE_TRUNC('month', CURRENT_DATE)::timestamp AS month,
  COALESCE(SUM(amount), 0) AS total_income
FROM incomes
WHERE DATE_TRUNC('month', recorded_at) = DATE_TRUNC('month', CURRENT_DATE) AND created_by = $1;

-- name: GetMonthlyIncomes :many
SELECT
  TO_CHAR(DATE_TRUNC('month', recorded_at), 'YYYY-MM') AS month,
  SUM(amount) AS total_income
FROM incomes
WHERE recorded_at >= (CURRENT_DATE - INTERVAL '12 months') AND created_by = $1
GROUP BY DATE_TRUNC('month', recorded_at)
ORDER BY DATE_TRUNC('month', recorded_at);

-- name: CreateIncome :one
INSERT INTO incomes(
  member_id, membership_id, amount, created_by
) VALUES (
  $1, $2, $3, $4
) RETURNING *;

-- name: UpdateIncome :exec
UPDATE incomes
SET amount = $3
WHERE membership_id = $1 AND created_by = $2;

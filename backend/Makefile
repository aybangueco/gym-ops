include .env

# ==================================================================================== #
# SQL MIGRATIONS
# ==================================================================================== #

## migrations/up: apply all up database migrations
.PHONY: migrations/up
migrations/up:
	@cd sql/schemas && goose postgres postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE} up

## migrations/up-to version=$1: migrate up to a specific version number
.PHONY: migrations/up-to
migrations/up-to:
	@cd sql/schemas && goose postgres postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE} up-to ${version}

## migrations/up-by-one: migrate up by one version
.PHONY: migrations/up-by-one
migrations/up-by-one:
	@cd sql/schemas && goose postgres postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE} up-by-one

## migrations/down: apply all down database migrations
.PHONY: migrations/down
migrations/down:
	@cd sql/schemas && goose postgres postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE} down-to 0

## migrations/down-to version=$1: migrate down to a specific version number
.PHONY: migrations/down-to
migrations/down-to:
	@cd sql/schemas && goose postgres postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE} down-to ${version}

## migrations/down-by-one: migrate down by one version
.PHONY: migrations/down-by-one
migrations/down-by-one:
	@cd sql/schemas && goose postgres postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE} down

## migrations/status: show the status of the migrations
.PHONY: migrations/status
migrations/status:
	@cd sql/schemas && goose postgres postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE} status

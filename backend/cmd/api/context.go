package main

import (
	"context"
	"net/http"

	"github.com/w4keupvan/gym-ops/backend/internal/database"
)

type contextKey string

const (
	authenticatedUserKey = contextKey("authenticatedUser")
)

func (app *application) setContextAuthenticatedUser(r *http.Request, user *database.User) *http.Request {
	ctx := context.WithValue(r.Context(), authenticatedUserKey, user)
	return r.WithContext(ctx)
}

func (app *application) getContextAuthenticatedUser(r *http.Request) *database.User {
	ctx := r.Context().Value(authenticatedUserKey).(*database.User)
	return ctx
}

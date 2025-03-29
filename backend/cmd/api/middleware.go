package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
)

func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "close")

				app.serverErrorResponse(w, r, fmt.Errorf("%s", err))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

func (app *application) authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Authorization")

		authorizationHeader := r.Header.Get("Authorization")

		if authorizationHeader == "" {
			app.setContextAuthenticatedUser(r, nil)
			next.ServeHTTP(w, r)
			return
		}

		parts := strings.Split(authorizationHeader, " ")
		token := parts[1]

		if len(parts) < 2 || parts[0] != "Bearer" {
			app.invalidAuthenticationTokenResponse(w, r)
			return
		}

		parsedTokenClaims, err := app.parseUserToken(app.config, token)
		if err != nil {
			app.invalidAuthenticationTokenResponse(w, r)
			return
		}

		if parsedTokenClaims.Valid() != nil {
			app.invalidAuthenticationTokenResponse(w, r)
			return
		}

		ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
		defer cancel()

		user, err := app.db.GetUserById(ctx, parsedTokenClaims.ID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				app.setContextAuthenticatedUser(r, nil)
			} else {
				app.serverErrorResponse(w, r, err)
				return
			}
		}

		r = app.setContextAuthenticatedUser(r, &user)

		next.ServeHTTP(w, r)
	})
}

func (app *application) requireAuthenticated(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := app.getContextAuthenticatedUser(r)

		if user == nil {
			app.requiredAuthenticatedResponse(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (app *application) requireActivated(next http.HandlerFunc) http.HandlerFunc {
	fn := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := app.getContextAuthenticatedUser(r)

		if !user.Activated {
			app.requiredActivatedResponse(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})

	return app.requireAuthenticated(fn)
}

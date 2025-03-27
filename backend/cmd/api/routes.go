package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) healthCheck(w http.ResponseWriter, r *http.Request) {
	app.writeJSON(w, http.StatusOK, envelope{"status": "OK"}, nil)
}

func (app *application) routes() http.Handler {
	r := chi.NewRouter()
	r.Use(app.recoverPanic)
	r.Use(middleware.Logger)
	r.Use(app.authenticate)

	r.MethodNotAllowed(app.methodNotAllowedResponse)
	r.NotFound(app.notFoundResponse)

	r.Get("/api/healthcheck", app.healthCheck)

	r.Get("/api/auth/me", app.requireAuthenticated(app.currentAuthenticatedHanler))
	r.Post("/api/login", app.loginHandler)
	r.Post("/api/register", app.registerHandler)

	return r
}

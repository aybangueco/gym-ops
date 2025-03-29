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
	r.Use(middleware.StripSlashes)

	r.MethodNotAllowed(app.methodNotAllowedResponse)
	r.NotFound(app.notFoundResponse)

	r.Get("/api/healthcheck", app.healthCheck)

	r.Get("/api/auth/me", app.requireAuthenticated(app.currentAuthenticatedHandler))
	r.Post("/api/login", app.loginHandler)
	r.Post("/api/register", app.registerHandler)
	r.Post("/api/verify", app.requireAuthenticated(app.verifyEmailHandler))
	r.Post("/api/resend-verify", app.requireAuthenticated(app.resendEmailOtpHandler))

	r.Get("/api/memberships", app.requireActivated(app.getMembershipsHandler))
	r.Get("/api/memberships/{id}", app.requireActivated(app.getMembershipByID))
	r.Post("/api/memberships", app.requireActivated(app.createMembershipHandler))
	r.Put("/api/memberships/{id}", app.requireActivated(app.updateMembershipHandler))
	r.Delete("/api/memberships/{id}", app.requireActivated(app.deleteMembershipHandler))

	r.Get("/api/members", app.requireActivated(app.getMembersHandler))
	r.Get("/api/members/{id}", app.requireActivated(app.getMemberByID))
	r.Post("/api/members", app.requireActivated(app.createMemberHandler))
	r.Put("/api/members/{id}", app.requireActivated(app.updateMemberHandler))
	r.Delete("/api/members/{id}", app.requireActivated(app.deleteMemberHandler))

	return r
}

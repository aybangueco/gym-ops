package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (app *application) healthCheck(w http.ResponseWriter, r *http.Request) {
	err := app.writeJSON(w, http.StatusOK, envelope{"status": "OK"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) routes() http.Handler {
	r := chi.NewRouter()
	r.Use(app.recoverPanic)
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: app.config.allowedOrigins,
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
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

	r.Get("/api/memberships/member-count", app.requireActivated(app.getMembershipMemberCountsHandler))

	r.Get("/api/members", app.requireActivated(app.getMembersHandler))
	r.Get("/api/members/{id}", app.requireActivated(app.getMemberByID))
	r.Post("/api/members", app.requireActivated(app.createMemberHandler))
	r.Put("/api/members/{id}", app.requireActivated(app.updateMemberHandler))
	r.Delete("/api/members/{id}", app.requireActivated(app.deleteMemberHandler))

	r.Get("/api/members/total", app.requireActivated(app.getTotalMembersHandler))

	r.Get("/api/month-incomes", app.requireActivated(app.getMonthIncomesHandler))
	r.Get("/api/monthly-incomes", app.requireActivated(app.getMonthlyIncomesHandler))

	return r
}

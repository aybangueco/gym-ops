package main

import (
	"fmt"
	"net/http"

	"github.com/aybangueco/gym-ops/backend/internal/validator"
)

func (app *application) logError(r *http.Request, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
	)

	app.logger.Error(err.Error(), "method", method, "uri", uri)
}

func (app *application) errorResponse(w http.ResponseWriter, r *http.Request, status int, message any) {
	env := envelope{"error": message}

	err := app.writeJSON(w, status, env, nil)
	if err != nil {
		app.logError(r, err)
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func (app *application) serverErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logError(r, err)
	message := "the server encountered a problem and could not process your request"
	app.errorResponse(w, r, http.StatusInternalServerError, message)
}

func (app *application) methodNotAllowedResponse(w http.ResponseWriter, r *http.Request) {
	message := fmt.Sprintf("the method %s is not supported for this resource", r.Method)
	app.errorResponse(w, r, http.StatusMethodNotAllowed, message)
}

func (app *application) notFoundResponse(w http.ResponseWriter, r *http.Request) {
	message := "the requested resource could not be found"
	app.errorResponse(w, r, http.StatusNotFound, message)
}

func (app *application) badRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.errorResponse(w, r, http.StatusBadRequest, err.Error())
}

func (app *application) invalidAuthenticationTokenResponse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("WWW-Authenticate", "Bearer")

	message := "invalid authorization header or token"
	app.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (app *application) requiredAuthenticatedResponse(w http.ResponseWriter, r *http.Request) {
	message := "you need to be authenticated to access this resource"
	app.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (app *application) requiredActivatedResponse(w http.ResponseWriter, r *http.Request) {
	message := "you need to be activated in-order to access this resource"
	app.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (app *application) emailAlreadyActivatedResponse(w http.ResponseWriter, r *http.Request) {
	message := "user email is already activated"
	app.errorResponse(w, r, http.StatusBadRequest, message)
}

func (app *application) invalidAuthDetailsResponse(w http.ResponseWriter, r *http.Request) {
	message := "invalid email or password"
	app.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (app *application) failedValidationResponse(w http.ResponseWriter, r *http.Request, v validator.Validator) {
	err := app.writeJSON(w, http.StatusUnprocessableEntity, v, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) invalidParameterIDResponse(w http.ResponseWriter, r *http.Request) {
	message := "id must be an integer"
	app.errorResponse(w, r, http.StatusBadRequest, message)
}

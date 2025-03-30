package main

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/w4keupvan/gym-ops/backend/internal/database"
	"github.com/w4keupvan/gym-ops/backend/internal/validator"
)

func (app *application) verifyEmailHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Code      int64               `json:"code"`
		Validator validator.Validator `json:"-"`
	}

	err := app.decodeJSON(w, r, &input, true)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	authenticatedUser := app.getContextAuthenticatedUser(r)

	if authenticatedUser.Activated {
		app.emailAlreadyActivatedResponse(w, r)
		return
	}

	input.Validator.CheckField(input.Code != 0, "code", "code field is required")

	if input.Validator.HasErrors() {
		app.failedValidationResponse(w, r, input.Validator)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	otp, err := app.db.GetOtpByCode(ctx, input.Code)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			input.Validator.AddFieldError("code", "invalid otp code")
			app.failedValidationResponse(w, r, input.Validator)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	timeNow := time.Now()

	if otp.ExpiresAt.After(timeNow) {
		input.Validator.AddFieldError("code", "otp code is expired")
		app.failedValidationResponse(w, r, input.Validator)
		return
	}

	if otp.Code != input.Code {
		input.Validator.AddFieldError("code", "invalid otp code")
		app.failedValidationResponse(w, r, input.Validator)
		return
	}

	ctx, cancel = context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	user, err := app.db.GetUserById(ctx, authenticatedUser.ID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			app.notFoundResponse(w, r)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	user.Activated = true

	ctx, cancel = context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	err = app.db.UpdateUser(ctx, database.UpdateUserParams{
		ID:        user.ID,
		Version:   user.Version,
		Name:      user.Name,
		Email:     user.Email,
		Password:  user.Password,
		Activated: user.Activated,
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	ctx, cancel = context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	err = app.db.DeleteOtps(ctx, authenticatedUser.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "email activated successfully"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) resendEmailOtpHandler(w http.ResponseWriter, r *http.Request) {
	authenticatedUser := app.getContextAuthenticatedUser(r)

	if authenticatedUser.Activated {
		app.emailAlreadyActivatedResponse(w, r)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	err := app.db.DeleteOtps(ctx, authenticatedUser.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	code := app.generateOTP(6)

	ctx, cancel = context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	otp, err := app.db.CreateOtp(ctx, database.CreateOtpParams{
		Code:   code,
		Type:   database.OtpTypeEmailVerification,
		UserID: authenticatedUser.ID,
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.background(func() {
		data := map[string]any{
			"code": otp.Code,
			"name": authenticatedUser.Name,
		}

		err := app.mail.Send(authenticatedUser.Email, "welcome.tmpl", data)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	})

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "email otp resent successfully"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

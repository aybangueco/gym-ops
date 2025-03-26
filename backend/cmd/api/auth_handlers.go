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

func (app *application) registerHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name      string              `json:"name"`
		Email     string              `json:"email"`
		Password  string              `json:"password"`
		Validator validator.Validator `json:"-"`
	}

	err := app.decodeJSON(w, r, &input, true)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = app.db.GetUserByEmail(ctx, input.Email)
	nonExistingEmail := errors.Is(err, pgx.ErrNoRows)
	if err != nil && !nonExistingEmail {
		app.serverErrorResponse(w, r, err)
		return
	}

	input.Validator.CheckField(nonExistingEmail, "email", "email is already taken")

	input.Validator.CheckField(input.Name != "", "name", "name field is required")
	input.Validator.CheckField(input.Email != "", "email", "email field is required")
	input.Validator.CheckField(input.Password != "", "password", "password field is required")

	input.Validator.CheckField(len(input.Name) > 5, "name", "name must be greater than 5 characters")
	input.Validator.CheckField(validator.IsEmail(input.Email), "email", "invalid email format")
	input.Validator.CheckField(len(input.Password) > 8, "password", "password must be greater than 8 characters")

	if input.Validator.HasErrors() {
		app.failedValidationResponse(w, r, input.Validator)
		return
	}

	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	user, err := app.db.CreateUser(ctx, database.CreateUserParams{
		Name:     input.Name,
		Email:    input.Email,
		Password: []byte(input.Password),
	})

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	user.Password = []byte{}

	app.writeJSON(w, http.StatusCreated, user, nil)
}

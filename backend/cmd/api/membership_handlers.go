package main

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	"github.com/w4keupvan/gym-ops/backend/internal/database"
	"github.com/w4keupvan/gym-ops/backend/internal/validator"
)

func (app *application) getMembershipsHandler(w http.ResponseWriter, r *http.Request) {
	user := app.getContextAuthenticatedUser(r)

	params := r.URL.Query()

	limit := app.readParamInt(params, "limit", 10)
	page := app.readParamInt(params, "page", 1)
	offset := int32((page - 1) * limit)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	memberships, err := app.db.GetMemberships(ctx, database.GetMembershipsParams{
		CreatedBy: user.ID,
		Limit:     int32(limit),
		Offset:    offset,
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if memberships == nil {
		memberships = []database.Membership{}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"memberships": memberships}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getMembershipByID(w http.ResponseWriter, r *http.Request) {
	user := app.getContextAuthenticatedUser(r)

	membershipID := chi.URLParam(r, "id")

	i, err := app.convertStringToInt(membershipID)
	if err != nil {
		if errors.Is(err, strconv.ErrSyntax) {
			app.invalidParameterIDResponse(w, r)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	membership, err := app.db.GetMembershipByID(ctx, database.GetMembershipByIDParams{ID: i, CreatedBy: user.ID})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			app.notFoundResponse(w, r)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"membership": membership}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) createMembershipHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		MembershipName   string              `json:"membership_name"`
		MembershipLength int32               `json:"membership_length"`
		Validator        validator.Validator `json:"-"`
	}

	err := app.decodeJSON(w, r, &input, true)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	input.Validator.CheckField(input.MembershipName != "", "membership_name", "membership name field is required")
	input.Validator.CheckField(input.MembershipLength >= 0, "membership_length", "membership length field is required")

	if input.Validator.HasErrors() {
		app.failedValidationResponse(w, r, input.Validator)
		return
	}

	user := app.getContextAuthenticatedUser(r)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	membership, err := app.db.CreateMembership(ctx, database.CreateMembershipParams{
		MembershipName:   input.MembershipName,
		MembershipLength: &input.MembershipLength,
		CreatedBy:        user.ID,
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"membership": membership}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateMembershipHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		MembershipName   *string             `json:"membership_name"`
		MembershipLength *int32              `json:"membership_length"`
		Validator        validator.Validator `json:"-"`
	}

	membershipID := chi.URLParam(r, "id")

	i, err := app.convertStringToInt(membershipID)
	if err != nil {
		if errors.Is(err, strconv.ErrSyntax) {
			app.invalidParameterIDResponse(w, r)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	user := app.getContextAuthenticatedUser(r)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	membership, err := app.db.GetMembershipByID(ctx, database.GetMembershipByIDParams{ID: i, CreatedBy: user.ID})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			app.notFoundResponse(w, r)
			return
		}
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.decodeJSON(w, r, &input, true)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.MembershipName != nil {
		membership.MembershipName = *input.MembershipName
	}

	if input.MembershipLength != nil {
		membership.MembershipLength = input.MembershipLength
	}

	ctx, cancel = context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	v, err := app.db.UpdateMembership(ctx, database.UpdateMembershipParams{
		ID:               membership.ID,
		MembershipName:   membership.MembershipName,
		MembershipLength: membership.MembershipLength,
		Version:          membership.Version,
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	membership.Version = v

	err = app.writeJSON(w, http.StatusOK, envelope{"membership": membership}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteMembershipHandler(w http.ResponseWriter, r *http.Request) {
	membershipID := chi.URLParam(r, "id")

	i, err := app.convertStringToInt(membershipID)
	if err != nil {
		if errors.Is(err, strconv.ErrSyntax) {
			app.invalidParameterIDResponse(w, r)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	user := app.getContextAuthenticatedUser(r)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	result, err := app.db.DeleteMembership(ctx, database.DeleteMembershipParams{ID: i, CreatedBy: user.ID})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if result.RowsAffected() == 0 {
		app.notFoundResponse(w, r)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "membership deleted successfully"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

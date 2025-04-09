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

func (app *application) getMembersHandler(w http.ResponseWriter, r *http.Request) {
	user := app.getContextAuthenticatedUser(r)

	params := r.URL.Query()

	limit := app.readParamInt(params, "limit", 10)
	page := app.readParamInt(params, "page", 1)
	offset := (page - 1) * limit

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	members, err := app.db.GetMembers(ctx, database.GetMembersParams{
		CreatedBy: user.ID,
		Limit:     int32(limit),
		Offset:    int32(offset),
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if members == nil {
		members = []database.Member{}
	}

	count, err := app.db.CountMembers(r.Context())
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{
		"metadata": map[string]any{
			"count":       count,
			"page":        page,
			"per_page":    limit,
			"total_pages": count / int64(page),
		},
		"members": members,
	}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getMemberByID(w http.ResponseWriter, r *http.Request) {
	user := app.getContextAuthenticatedUser(r)

	memberID := chi.URLParam(r, "id")

	i, err := app.convertStringToInt(memberID)
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

	member, err := app.db.GetMemberByID(ctx, database.GetMemberByIDParams{ID: i, CreatedBy: user.ID})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			app.notFoundResponse(w, r)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"member": member}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) createMemberHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		MemberName    string              `json:"member_name"`
		MemberContact string              `json:"member_contact"`
		Membership    int64               `json:"membership"`
		Validator     validator.Validator `json:"-"`
	}

	err := app.decodeJSON(w, r, &input, true)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	input.Validator.CheckField(input.MemberName != "", "member_name", "member name field is required")
	input.Validator.CheckField(input.MemberContact != "", "member_contact", "member contact field is required")
	input.Validator.CheckField(input.Membership > 0, "membership", "membership field is required")

	if input.Validator.HasErrors() {
		app.failedValidationResponse(w, r, input.Validator)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	user := app.getContextAuthenticatedUser(r)

	membership, err := app.db.GetMembershipByID(ctx, database.GetMembershipByIDParams{ID: input.Membership, CreatedBy: user.ID})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			input.Validator.AddFieldError("membership", "existing membership not found")
			app.failedValidationResponse(w, r, input.Validator)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	ctx, cancel = context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	membershipStart := time.Now()
	membershipEnd := time.Now().Add(time.Duration(*membership.MembershipLength) * 24 * time.Hour)

	member, err := app.db.CreateMember(ctx, database.CreateMemberParams{
		MemberName:      input.MemberName,
		MemberContact:   input.MemberContact,
		Membership:      membership.ID,
		CreatedBy:       user.ID,
		MembershipStart: &membershipStart,
		MembershipEnd:   &membershipEnd,
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"member": member}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateMemberHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		MemberName    *string             `json:"member_name"`
		MemberContact *string             `json:"member_contact"`
		Membership    *int64              `json:"membership"`
		Validator     validator.Validator `json:"-"`
	}

	err := app.decodeJSON(w, r, &input, true)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Validator.HasErrors() {
		app.failedValidationResponse(w, r, input.Validator)
		return
	}

	memberID := chi.URLParam(r, "id")

	i, err := app.convertStringToInt(memberID)
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

	member, err := app.db.GetMemberByID(ctx, database.GetMemberByIDParams{ID: i, CreatedBy: user.ID})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			input.Validator.AddError("existing member not found")
			app.failedValidationResponse(w, r, input.Validator)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	ctx, cancel = context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	membership, err := app.db.GetMembershipByID(ctx, database.GetMembershipByIDParams{ID: *input.Membership, CreatedBy: user.ID})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			input.Validator.AddFieldError("membership", "existing membership not found")
			app.failedValidationResponse(w, r, input.Validator)
			return
		} else {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	if input.MemberName != nil {
		member.MemberName = *input.MemberName
	}

	if input.MemberContact != nil {
		member.MemberContact = *input.MemberContact
	}

	if input.Membership != nil {
		memberShipStart := time.Now()
		membershipEnd := time.Now().Add(time.Duration(*membership.MembershipLength) * 24 * time.Hour)

		member.Membership = *input.Membership
		member.MembershipStart = &memberShipStart
		member.MembershipEnd = &membershipEnd
	}

	ctx, cancel = context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	updatedMember, err := app.db.UpdateMember(ctx, database.UpdateMemberParams{
		ID:              i,
		MemberName:      member.MemberName,
		MemberContact:   member.MemberContact,
		Membership:      member.Membership,
		MembershipStart: member.MembershipStart,
		MembershipEnd:   member.MembershipEnd,
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"member": updatedMember}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteMemberHandler(w http.ResponseWriter, r *http.Request) {
	memberID := chi.URLParam(r, "id")

	i, err := app.convertStringToInt(memberID)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.getContextAuthenticatedUser(r)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	result, err := app.db.DeleteMember(ctx, database.DeleteMemberParams{ID: i, CreatedBy: user.ID})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if result.RowsAffected() == 0 {
		app.notFoundResponse(w, r)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "member deleted successfully"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

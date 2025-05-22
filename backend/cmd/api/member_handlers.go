package main

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/aybangueco/gym-ops/backend/internal/database"
	"github.com/aybangueco/gym-ops/backend/internal/validator"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
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

	count, err := app.db.CountMembers(r.Context(), user.ID)
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

func (app *application) getExpiredMembersHandler(w http.ResponseWriter, r *http.Request) {
	user := app.getContextAuthenticatedUser(r)

	params := r.URL.Query()

	limit := app.readParamInt(params, "limit", 10)
	page := app.readParamInt(params, "page", 1)
	offset := (page - 1) * limit

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	expiredMembers, err := app.db.GetExpiredMembers(ctx, database.GetExpiredMembersParams{
		CreatedBy: user.ID,
		Limit:     int32(limit),
		Offset:    int32(offset),
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if expiredMembers == nil {
		expiredMembers = []database.Member{}
	}

	count, err := app.db.CountExpiredMembers(r.Context(), user.ID)
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
		"members": expiredMembers,
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

func (app *application) getTotalMembersHandler(w http.ResponseWriter, r *http.Request) {
	user := app.getContextAuthenticatedUser(r)

	total, err := app.db.CountMembers(r.Context(), user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"total_members": total}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) createMemberHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		MemberName    string              `json:"member_name"`
		MemberContact string              `json:"member_contact"`
		Membership    *int64              `json:"membership"`
		Validator     validator.Validator `json:"-"`
	}

	err := app.decodeJSON(w, r, &input, true)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	input.Validator.CheckField(input.MemberName != "", "member_name", "member name field is required")
	input.Validator.CheckField(input.MemberContact != "", "member_contact", "member contact field is required")

	if input.Validator.HasErrors() {
		app.failedValidationResponse(w, r, input.Validator)
		return
	}

	user := app.getContextAuthenticatedUser(r)

	var membership *database.Membership

	if input.Membership != nil {
		m, err := app.db.GetMembershipByID(r.Context(), database.GetMembershipByIDParams{ID: *input.Membership, CreatedBy: user.ID})
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

		membership = &m
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var (
		membershipStatus string
		membershipStart  *time.Time
		membershipEnd    *time.Time
	)

	if input.Membership != nil {
		membershipStatus = "active"
		now := time.Now()
		end := time.Now().Add(time.Duration(*membership.MembershipLength) * 24 * time.Hour)

		membershipStart = &now
		membershipEnd = &end
	}

	if input.Membership == nil {
		membershipStatus = "inactive"
	}

	member, err := app.db.CreateMember(ctx, database.CreateMemberParams{
		MemberName:       input.MemberName,
		MemberContact:    input.MemberContact,
		Membership:       input.Membership,
		MembershipStatus: database.Status(membershipStatus),
		CreatedBy:        user.ID,
		MembershipStart:  membershipStart,
		MembershipEnd:    membershipEnd,
	})
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if input.Membership != nil {
		_, err = app.db.CreateIncome(r.Context(), database.CreateIncomeParams{
			MemberID:     member.ID,
			MembershipID: *input.Membership,
			Amount:       membership.Cost,
			CreatedBy:    user.ID,
		})
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
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

	id, err := app.convertStringToInt(memberID)
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

	member, err := app.db.GetMemberByID(ctx, database.GetMemberByIDParams{ID: id, CreatedBy: user.ID})
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

	var membership database.Membership

	if input.Membership != nil {
		membership, err = app.db.GetMembershipByID(ctx, database.GetMembershipByIDParams{ID: *input.Membership, CreatedBy: user.ID})
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
	}

	if input.MemberName != nil {
		member.MemberName = *input.MemberName
	}

	if input.MemberContact != nil {
		member.MemberContact = *input.MemberContact
	}

	if input.Membership != nil && input.Membership != member.Membership && member.Membership != nil {
		if err = app.db.DeleteIncome(r.Context(), database.DeleteIncomeParams{
			MemberID:     member.ID,
			MembershipID: *member.Membership,
			Active:       true,
			CreatedBy:    user.ID,
		}); err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	if input.Membership != nil && input.Membership != member.Membership {
		_, err = app.db.CreateIncome(r.Context(), database.CreateIncomeParams{
			MemberID:     member.ID,
			MembershipID: *input.Membership,
			Amount:       membership.Cost,
			CreatedBy:    user.ID,
		})
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		memberShipStart := time.Now()
		membershipEnd := time.Now().Add(time.Duration(*membership.MembershipLength) * 24 * time.Hour)

		member.Membership = input.Membership
		member.MembershipStatus = database.StatusActive
		member.MembershipStart = &memberShipStart
		member.MembershipEnd = &membershipEnd
	}

	if input.Membership == nil && member.MembershipStatus == database.StatusActive {
		if err = app.db.DeleteIncome(r.Context(), database.DeleteIncomeParams{
			MemberID:     member.ID,
			MembershipID: *member.Membership,
			Active:       true,
			CreatedBy:    user.ID,
		}); err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
	}

	if input.Membership == nil {
		member.Membership = input.Membership
		member.MembershipStatus = database.StatusInactive
		member.MembershipStart = nil
		member.MembershipEnd = nil
	}

	ctx, cancel = context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	updatedMember, err := app.db.UpdateMember(ctx, database.UpdateMemberParams{
		ID:               id,
		CreatedBy:        member.CreatedBy,
		Version:          member.Version,
		MemberName:       member.MemberName,
		MemberContact:    member.MemberContact,
		Membership:       member.Membership,
		MembershipStatus: member.MembershipStatus,
		MembershipStart:  member.MembershipStart,
		MembershipEnd:    member.MembershipEnd,
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

	id, err := app.convertStringToInt(memberID)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.getContextAuthenticatedUser(r)

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	result, err := app.db.DeleteMember(ctx, database.DeleteMemberParams{ID: id, CreatedBy: user.ID})
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

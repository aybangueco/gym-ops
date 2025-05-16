package main

import (
	"net/http"

	"github.com/w4keupvan/gym-ops/backend/internal/database"
)

func (app *application) getMonthIncomesHandler(w http.ResponseWriter, r *http.Request) {
	user := app.getContextAuthenticatedUser(r)

	monthIncomes, err := app.db.GetMonthIncomes(r.Context(), user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, monthIncomes, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) getMonthlyIncomesHandler(w http.ResponseWriter, r *http.Request) {
	user := app.getContextAuthenticatedUser(r)

	monthlyIncomes, err := app.db.GetMonthlyIncomes(r.Context(), user.ID)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if monthlyIncomes == nil {
		monthlyIncomes = []database.GetMonthlyIncomesRow{}
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"monthlyIncomes": monthlyIncomes}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

package main

import (
	"github.com/golang-jwt/jwt"
)

type userClaims struct {
	ID int64 `json:"id"`
	jwt.StandardClaims
}

func (app *application) generateUserToken(cfg config, claims userClaims) (string, error) {
	secretKey, err := app.decodeBase64(cfg.jwtTokenKey)
	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

func (app *application) parseUserToken(cfg config, token string) (*userClaims, error) {
	secretKey, err := app.decodeBase64(cfg.jwtTokenKey)
	if err != nil {
		return nil, err
	}

	parsedToken, err := jwt.ParseWithClaims(token, &userClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	return parsedToken.Claims.(*userClaims), nil
}

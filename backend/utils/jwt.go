package utils

import (
	"fmt"
	// "net/http"
	"time"

	"github.com/gin-gonic/gin"
	jwt "github.com/golang-jwt/jwt/v5"
)

var SECRET_KEY = []byte(GetConfig().SECRET_KEY)

func ValidateJWT(token_name string, c *gin.Context) (*jwt.Token, jwt.MapClaims, error) {
	tokenCookie, err := c.Cookie(token_name)
	if err != nil {
		return nil, nil, fmt.Errorf("please login first")
	}

	token, err := jwt.Parse(tokenCookie, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return SECRET_KEY, nil
	})

	if err != nil {
		return nil, nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, nil, fmt.Errorf("invalid token")
	}

	if float64(time.Now().Unix()) > claims["exp"].(float64) {
		return nil, nil, fmt.Errorf("token expired")
	}

	return token, claims, nil
}

func GenerateJWT(token_name string, c *gin.Context, Email string,id uint, hour int) (string, error) {
	expiration := time.Now().Add(time.Hour * time.Duration(hour)).Unix()
	// token to identify user
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"Email": Email,
		"exp":   expiration,
		"UserTypeID":    id,
	})
	fmt.Println(SECRET_KEY)
	token_string, err := token.SignedString(SECRET_KEY)
	if err != nil {
		return err.Error(), err
	}

	c.SetCookie(token_name, token_string, 3600*hour, "", GetConfig().ORIGIN, false, true)

	return token_string, nil
}

// func SetActiveJWT(c *gin.Context, token_name string, hour int) error {
// 	expiration := time.Now().Add(time.Hour * time.Duration(hour)).Unix()
// 	// token to identify active user
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
// 		"active_token": token_name,
// 		"exp":          expiration,
// 	})
// 	token_string, err := token.SignedString(SECRET_KEY)
// 	if err != nil {
// 		return err
// 	}
// 	c.SetCookie("token", token_string, 3600*hour, "", GetConfig().ORIGIN, true, true)
// 	return nil
// }

func SetActiveJWT(c *gin.Context, token_name string, hour int) error {
	expiration := time.Now().Add(time.Hour * time.Duration(hour)).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"active_token": token_name,
		"exp":          expiration,
	})
	token_string, err := token.SignedString(SECRET_KEY)
	if err != nil {
		return err
	}
	c.SetCookie("token", token_string, 3600*hour, "/", GetConfig().ORIGIN, true, true)
	return nil
}

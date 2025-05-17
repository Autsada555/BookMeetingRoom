package controllers

import (
	"net/http"

	"fmt"
	"github.com/Autsada555/BookMeetingRoom/entity"
	"github.com/Autsada555/BookMeetingRoom/utils"
	"github.com/gin-gonic/gin"
)

var role_data = map[string]struct {
	ID        uint
	Value     func() interface{}
	Table     string
	TokenName string
	Hour      int
}{
	"user": {
		ID:        100,
		Value:     func() interface{} { return &entity.User{} },
		Table:     "users",
		TokenName: "utk",
		Hour:      24 * 7,
	},

	"admin": {
		ID:        999,
		Value:     func() interface{} { return &entity.User{} },
		Table:     "users",
		TokenName: "etk",
		Hour:      24,
	},
}

type LoginPayload struct {
	Email      string `binding:"required"`
	Password   string `binding:"required"`
	UserTypeID uint
}

func Logout(c *gin.Context) {
	// var value entity.User
	// data := role_data[value.UserType.Name]
	id := c.Param("id")
	c.SetCookie(id, "", -1, "/", utils.GetConfig().ORIGIN, false, true)
	// c.SetCookie("token", "", -1, "/", utils.GetConfig().ORIGIN, false, true)
	c.SetCookie("token", "", -1, "/", utils.GetConfig().ORIGIN, false, true)
	c.JSON(http.StatusOK, gin.H{"data": "you have been logged out"})
}

func Login(c *gin.Context) {
	var temp struct {
		Password string
	}
	var payload LoginPayload
	var errBindJSON = c.ShouldBindJSON(&payload)
	if errBindJSON != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	base_query := entity.DB().Table("users").Where("email = ? ", payload.Email)

	if err := entity.DB().Table("users").Where("email = ? ", payload.Email).Select("password").First(&temp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := utils.VerifyPassword(payload.Password, temp.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password not match"})
		return
	}

	var value entity.User
	if err := base_query.InnerJoins("UserType").InnerJoins("Gender").Omit("password").First(&value).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	data := role_data[value.UserType.Name]
	payload.UserTypeID = value.UserTypeID
	fmt.Println("data", data)
	fmt.Println("payload", payload)

	generateJWT, errJWT := utils.GenerateJWT(data.TokenName, c, payload.Email, data.ID, data.Hour)
	if errJWT != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "token could not be created"})
		return
	}

	if err := utils.SetActiveJWT(c, data.TokenName, data.Hour); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "token could not be created"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": generateJWT, "usertypeid": value.UserTypeID, "userid": value.ID, "usertype": data.TokenName})
}

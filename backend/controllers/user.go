package controllers

import (
	"net/http"
	// "time"

	// "strconv"

	"github.com/Autsada555/BookMeetingRoom/entity"
	// "github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm/clause"
)

func CreateUser(c *gin.Context) {
	var customer entity.User

	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// if _, err := govalidator.ValidateStruct(customer); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	if err := entity.DB().Create(&customer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "customer successfully"})
}

func UpdateUser(c *gin.Context) {
	var input struct {
		FirstName  string
		LastName   string
		GenderID   uint
		UserTypeID uint
		// ไม่ต้องมี Email
	}
	id := c.Param("id")

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ShouldBindJSON"})
		return
	}

	if err := entity.DB().Model(&entity.User{}).Where("id = ?", id).Updates(input).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "updated your customer successfully"})
}

func DeleteUser(c *gin.Context) {
	// create variable for store data as type of TourRegistration
	var user entity.User

	// get id from url
	id := c.Param("id")

	// delete data in database and check error
	// Clauses(clause.Returning{}) is used to return the deleted data ควรส่งคืนข้อมูลที่ลบไปแล้ว
	if rows := entity.DB().Clauses(clause.Returning{}).Delete(&user, id).RowsAffected; rows == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "record not found"})
		return
	}

	// response deleted data ส่งคืนการตอบสนอง JSON พร้อมรหัสสถานะ 200 OK
	c.JSON(http.StatusOK, gin.H{"data": "Delete Customer Successfully"})
}

func GetUserByID(c *gin.Context) {
	// Create variable to store data as type of User
	var user entity.User
	customerID := c.Param("id") // Get the customer ID from the URL parameter

	// Get data from the database and check for errors
	if err := entity.DB().Model(&entity.User{}).
		Preload("Gender").Preload("UserType"). // Preload Gender to load the related gender data
		Omit("Password").                      // Preload UserType to load the related user type data
		Where("id = ?", customerID).           // Explicitly use users.id to avoid ambiguity
		First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Respond with customer data
	c.JSON(http.StatusOK, gin.H{"data": user})
}

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

func UpdateCustomer(c *gin.Context) {
	var customer entity.User
	id := c.Param("id")

	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ShouldBindJSON"})
		return
	}

	if err := entity.DB().Table("users").Where("id = ?", id).Save(&customer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "updated your customer successfully"})
}

func DeleteUser(c *gin.Context) {
	// create variable for store data as type of TourRegistration
	var customer entity.User

	// get id from url
	id := c.Param("id")

	// delete data in database and check error
	// Clauses(clause.Returning{}) is used to return the deleted data ควรส่งคืนข้อมูลที่ลบไปแล้ว
	if rows := entity.DB().Clauses(clause.Returning{}).Delete(&customer, id).RowsAffected; rows == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "record not found"})
		return
	}

	// response deleted data ส่งคืนการตอบสนอง JSON พร้อมรหัสสถานะ 200 OK
	c.JSON(http.StatusOK, gin.H{"data": "Delete Customer Successfully"})
}

func GetUserByID(c *gin.Context) {
	// Create variable to store data as type of User
	var customer entity.User
	customerID := c.Param("id")  // Get the customer ID from the URL parameter

	// Get data from the database and check for errors
	if err := entity.DB().Model(&entity.User{}).
		Preload("Gender").    // Preload Gender to load the related gender data
		Omit("CheckpaymentID","UserName", "Password","UserType").  // Preload UserType to load the related user type data
		Where("id = ?", customerID). // Explicitly use users.id to avoid ambiguity
		First(&customer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Respond with customer data
	c.JSON(http.StatusOK, gin.H{"data": customer})
}

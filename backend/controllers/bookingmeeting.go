package controllers

import (
	"net/http"
	"time"

	"github.com/Autsada555/BookMeetingRoom/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm/clause"
)

func CreateBooking(c *gin.Context) {
 var input struct {
  Name      string    `json:"name"`
  Room      string    `json:"room"`
  StartTime time.Time `json:"start"`
  EndTime   time.Time `json:"end"`
 }

 if err := c.ShouldBindJSON(&input); err != nil {
  c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
  return
 }

 booking := entity.Booking{
  Name:      input.Name,
  Room:      input.Room,
  StartTime: input.StartTime,
  EndTime:   input.EndTime,
 }

 if err := entity.DB().Create(&booking).Error; err != nil {
  c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create booking"})
  return
 }

 c.JSON(http.StatusOK, booking)
}

func ListBookings(c *gin.Context) {
 var bookings []entity.Booking
 if err := entity.DB().Find(&bookings).Error; err != nil {
  c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list bookings"})
  return
 }
 c.JSON(http.StatusOK, bookings)
}

func UpdateBookings(c *gin.Context) {
	var bookings []entity.Booking
	id := c.Param("id")

	if err := c.ShouldBindJSON(&bookings); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ShouldBindJSON"})
		return
	}

	if err := entity.DB().Table("bookings").Where("id = ?", id).Save(&bookings).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "updated your bookings successfully"})
}

func DeleteBookings(c *gin.Context) {
	// create variable for store data as type of TourRegistration
	var bookings []entity.Booking

	// get id from url
	id := c.Param("id")

	// delete data in database and check error
	// Clauses(clause.Returning{}) is used to return the deleted data ควรส่งคืนข้อมูลที่ลบไปแล้ว
	if rows := entity.DB().Clauses(clause.Returning{}).Delete(&bookings, id).RowsAffected; rows == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "record not found"})
		return
	}

	// response deleted data ส่งคืนการตอบสนอง JSON พร้อมรหัสสถานะ 200 OK
	c.JSON(http.StatusOK, gin.H{"data": "Delete Customer Successfully"})
}
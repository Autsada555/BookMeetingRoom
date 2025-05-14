package controllers

import (
 "net/http"
 "time"

 "github.com/Autsada555/BookMeetingRoom/entity"
 "github.com/gin-gonic/gin"
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
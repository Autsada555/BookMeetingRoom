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
func SaveDailyCheck(c *gin.Context) {
    var payload entity.DailyCheck

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := entity.DB().Create(&payload).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "บันทึกเรียบร้อย"})
}

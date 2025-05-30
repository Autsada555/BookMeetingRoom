package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	// "time"

	// "strconv"

	"github.com/Autsada555/BookMeetingRoom/entity"
	// "github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"
	// "gorm.io/gorm/clause"
)

type CheckData struct {
	Date      string             `json:"date"`
	CheckedBy string             `json:"checkedBy"`
	UserID    uint               `json:"userID"`
	Checks    []entity.CheckItem `json:"checks"`
	Images    []string           `json:"images"`
}

func CreateDailyCheckSystems(c *gin.Context) {
	var input CheckData
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	checksJSON, _ := json.Marshal(input.Checks)
	imagesJSON, _ := json.Marshal(input.Images)

	dailyCheck := entity.DailyCheckSystems{
		Date:      input.Date,
		CheckedBy: input.CheckedBy,
		Checks:    datatypes.JSON(checksJSON),
		Images:    datatypes.JSON(imagesJSON),
		UserID:    input.UserID,
	}

	if err := entity.DB().Create(&dailyCheck).Error; err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "บันทึกสำเร็จ"})
}

func ListCheckSystems(c *gin.Context) {
	var checksystems []entity.DailyCheckSystems
	if err := entity.DB().Find(&checksystems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list checksystems"})
		return
	}
	c.JSON(http.StatusOK, checksystems)
}

func UpdateCheckSystems(c *gin.Context) {
	var input struct {
		Date      string             `json:"date"`
		CheckedBy string             `json:"checkedBy"`
		UserID    uint               `json:"userID"`
		Checks    []entity.CheckItem `json:"checks"`
		Images    []string           `json:"images"`
	}
	id := c.Param("id")

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ShouldBindJSON"})
		return
	}

	checksJSON, _ := json.Marshal(input.Checks)
	imagesJSON, _ := json.Marshal(input.Images)

	updateData := map[string]interface{}{
		"date":       input.Date,
		"checked_by": input.CheckedBy,
		"user_id":    input.UserID,
		"checks":     datatypes.JSON(checksJSON),
		"images":     datatypes.JSON(imagesJSON),
	}

	if err := entity.DB().Model(&entity.DailyCheckSystems{}).Where("id = ?", id).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "updated your checksystems successfully"})
}

func DeleteCheckSystems(c *gin.Context) {
	id := c.Param("id")
	var checksystems entity.DailyCheckSystems

	// แปลง id เป็น uint
	var idUint uint
	if _, err := fmt.Sscan(id, &idUint); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	// ลบและเช็ค error
	result := entity.DB().Delete(&checksystems, idUint)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "record not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Delete CheckSystems Successfully"})
}

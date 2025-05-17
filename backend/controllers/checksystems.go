package controllers

import (
	"encoding/json"
	"net/http"

	// "time"

	// "strconv"

	"github.com/Autsada555/BookMeetingRoom/entity"
	// "github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"
	"gorm.io/gorm/clause"
)

type CheckData struct {
	Date      string             `json:"date"`
	CheckedBy string             `json:"checkedBy"`
	UserID    uint               `json:"userID"`
	Checks    []entity.CheckItem `json:"checks"` // เปลี่ยนจาก map[string] เป็น slice
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
	var checksystems entity.DailyCheckSystems
	id := c.Param("id")

	if err := c.ShouldBindJSON(&checksystems); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ShouldBindJSON"})
		return
	}

	if err := entity.DB().Table("checksystems").Where("id = ?", id).Save(&checksystems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "updated your checksystems successfully"})
}

func DeleteCheckSystems(c *gin.Context) {
	// create variable for store data as type of TourRegistration
	var checksystems entity.DailyCheckSystems

	// get id from url
	id := c.Param("id")

	// delete data in database and check error
	// Clauses(clause.Returning{}) is used to return the deleted data ควรส่งคืนข้อมูลที่ลบไปแล้ว
	if rows := entity.DB().Clauses(clause.Returning{}).Delete(&checksystems, id).RowsAffected; rows == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "record not found"})
		return
	}

	// response deleted data ส่งคืนการตอบสนอง JSON พร้อมรหัสสถานะ 200 OK
	c.JSON(http.StatusOK, gin.H{"data": "Delete CheckSystems Successfully"})
}

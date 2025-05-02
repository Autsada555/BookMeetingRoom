package entity

import (
	// "time"

	// "github.com/Autsada555/PJ480-React/backend/utils"
	// "time"

	"gorm.io/gorm"
)

func SetupData(db *gorm.DB) {

	// gender data
	genders := []Gender{
		{
			BaseModel: BaseModel{ID: 1},
			Name:      "ชาย",
		},
		{
			BaseModel: BaseModel{ID: 2},
			Name:      "หญิง",
		},
		{
			BaseModel: BaseModel{ID: 3},
			Name:      "ไม่เปิดเผย",
		},
	}

	db.Create(&genders)

}
package entity

import (
	"encoding/json"
	"log"
	"time"

	// "github.com/Autsada555/PJ480-React/backend/utils"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func SetupData(db *gorm.DB) {
	// Gender data
	genders := []Gender{
		{BaseModel: BaseModel{ID: 1}, Name: "ชาย"},
		{BaseModel: BaseModel{ID: 2}, Name: "หญิง"},
		{BaseModel: BaseModel{ID: 3}, Name: "ไม่เปิดเผย"},
	}
	db.Create(&genders)

	// UserType data
	usertypes := []UserType{
		{BaseModel: BaseModel{ID: 100}, Name: "user"},
		{BaseModel: BaseModel{ID: 999}, Name: "admin"},
	}
	db.Create(&usertypes)

	// Users
	users := []User{
		{
			BaseModel:  BaseModel{ID: 1},
			FirstName:  "Somchai",
			LastName:   "Somchai",
			Email:      "somchai@somchai.com",
			Password:   "somchai1234",
			UserTypeID: 999,
			GenderID:   1,
		},
		{
			BaseModel:  BaseModel{ID: 2},
			FirstName:  "Peter",
			LastName:   "Peter",
			Email:      "peter@peter.com",
			Password:   "peter1234",
			UserTypeID: 100,
			GenderID:   2,
		},
	}
	db.Create(&users)

	// Bookings
	bookings := []Booking{
		{
			Name:      "ประชุมทีม",
			Room:      "Room A",
			StartTime: time.Date(2025, 5, 15, 9, 0, 0, 0, time.Local),
			EndTime:   time.Date(2025, 5, 15, 10, 30, 0, 0, time.Local),
			UserID:    1,
		},
		{
			Name:      "สัมมนาแผนกไอที",
			Room:      "Room B",
			StartTime: time.Date(2025, 5, 16, 13, 0, 0, 0, time.Local),
			EndTime:   time.Date(2025, 5, 16, 16, 0, 0, 0, time.Local),
			UserID:    2,
		},
	}
	db.Create(&bookings)

	checkData := map[string][]CheckItem{
		"Server Room": {
			{Name: "Lighting", Remark: ""},
			{Name: "UPS Switch", Remark: "ไม่ได้เปิด"},
			{Name: "UPS Battery", Remark: ""},
		},
		"Internet": {
			{Name: "Main Internet TOT", Remark: "ล่ม"},
			{Name: "Main Internet CAT", Remark: ""},
		},
		"Network": {
			{Name: "Firewall Fortinet", Remark: ""},
			{Name: "Load Balance TP-Link", Remark: "รีบูตจำเป็น"},
		},
		"Server": {
			{Name: "VMware Server", Remark: ""},
			{Name: "AD Server", Remark: ""},
			{Name: "File Server", Remark: "Disk เต็ม"},
		},
		"Other": {
			{Name: "Air Conditioner", Remark: ""},
		},
	}

	checksJSON, err := json.Marshal(checkData)
	if err != nil {
		log.Fatalf("failed to marshal checks: %v", err)
	}

	imagesJSON, err := json.Marshal([]string{"server_room.jpg", "firewall.png"})
	if err != nil {
		log.Fatalf("failed to marshal images: %v", err)
	}

	dailyChecks := []DailyCheckSystems{
		{
			Date:      "2025-05-15",
			CheckedBy: "Somchai",
			UserID:    1,
			Checks:    datatypes.JSON(checksJSON),
			Images:    datatypes.JSON(imagesJSON),
		},
	}
	db.Create(&dailyChecks)
}

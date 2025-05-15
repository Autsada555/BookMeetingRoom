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

		// UserType
		usertypes := []UserType{
			{
				BaseModel: BaseModel{ID: 100},
				Name:      "user",
			},
			{
				BaseModel: BaseModel{ID: 999},
				Name:      "admin",
			},
		}
		db.Create(&usertypes)


		users := []User{
			{
				BaseModel:        BaseModel{ID: 1},
				FirstName:        "Somchai",
				LastName:         "Somchai",
				Email:            "somchai@somchai.com",
				Password:         "somchai1234",
				UserTypeID:       999,
				GenderID:         1,
			},
			{
				BaseModel:        BaseModel{ID: 2},
				FirstName:        "Peter",
				LastName:         "Peter",
				Email:            "peter@peter.com",
				Password:         "peter1234",
				UserTypeID:       100,
				GenderID:         2,
			},
		}
		db.Create(&users)

		// check := CheckSystems{
		// 	ServerRoom: []CheckItem{
		// 		{Name: "Lighting", Checked: true, Remark: "OK"},
		// 		{Name: "Air Condition", Checked: false, Remark: "เสียงดัง"},
		// 		{Name: "UPS Switch", Checked: true, Remark: ""},
		// 		{Name: "UPS Network", Checked: true, Remark: "ปกติ"},
		// 		{Name: "UPS PABX", Checked: true, Remark: ""},
		// 		{Name: "Switch HUB", Checked: true, Remark: ""},
		// 		{Name: "Fan Switch HUB", Checked: true, Remark: "ปกติ"},
		// 		{Name: "Microtik", Checked: false, Remark: "ไฟไม่เข้า"},
		// 		{Name: "Interface", Checked: true, Remark: ""},
		// 		{Name: "Firewall for Server", Checked: true, Remark: "ใช้งานได้"},
		// 	},
		// 	BuildingABC: []CheckItem{
		// 		{Name: "DVR-01", Checked: true, Remark: "เรียบร้อย"},
		// 		{Name: "DVR-02", Checked: true, Remark: ""},
		// 		{Name: "DVR-03", Checked: false, Remark: "ระบบล่ม"},
		// 		{Name: "Camera Install 35", Checked: true, Remark: ""},
		// 		{Name: "Camera Working", Checked: true, Remark: ""},
		// 		{Name: "Camera Offline", Checked: false, Remark: "2 ตัวไม่ทำงาน"},
		// 	},
		// 	BuildingDEF: []CheckItem{
		// 		{Name: "DVR-03", Checked: true, Remark: ""},
		// 		{Name: "DVR-04", Checked: true, Remark: "มีเสียงรบกวน"},
		// 		{Name: "Camera Install 20", Checked: true, Remark: ""},
		// 		{Name: "Camera Working", Checked: false, Remark: "3 ตัวเสีย"},
		// 		{Name: "Camera Offline", Checked: true, Remark: "เช็คแล้ว"},
		// 	},
		// 	Carpark: []CheckItem{
		// 		{Name: "DVR-05", Checked: true, Remark: ""},
		// 		{Name: "Camera Install 10", Checked: true, Remark: ""},
		// 		{Name: "Camera Working", Checked: true, Remark: ""},
		// 		{Name: "Camera Offline", Checked: false, Remark: "1 ตัวเสีย"},
		// 	},
		// 	Internet: []CheckItem{
		// 		{Name: "Main Internet TOT", Checked: true, Remark: "เสถียร"},
		// 		{Name: "Main Internet NT(CAT)", Checked: true, Remark: ""},
		// 		{Name: "Speed Test Wifi-Public", Checked: true, Remark: "100Mbps"},
		// 		{Name: "Wifi Test Room 1", Checked: true, Remark: "OK"},
		// 		{Name: "Wifi Test Room 2", Checked: true, Remark: ""},
		// 		{Name: "Wifi Test Room 3", Checked: false, Remark: "ไม่มีสัญญาณ"},
		// 		{Name: "Office Connection", Checked: true, Remark: ""},
		// 		{Name: "Access Point", Checked: true, Remark: ""},
		// 		{Name: "Website Hotel", Checked: true, Remark: "โหลดได้"},
		// 		{Name: "EV Charger", Checked: true, Remark: ""},
		// 		{Name: "AP Install", Checked: true, Remark: ""},
		// 		{Name: "AP Online", Checked: true, Remark: ""},
		// 		{Name: "AP Offline", Checked: false, Remark: "1 จุดดับ"},
		// 	},
		// 	Telephone: []CheckItem{
		// 		{Name: "Incoming Call Test", Checked: true, Remark: ""},
		// 		{Name: "House Phone Signal Test", Checked: false, Remark: "ชั้น 2 ไม่มีเสียง"},
		// 		{Name: "Status PABX", Checked: true, Remark: "ใช้งานได้"},
		// 	},
		// 	Programs: []CheckItem{
		// 		{Name: "Program HR", Checked: true, Remark: ""},
		// 		{Name: "Program AC", Checked: true, Remark: ""},
		// 		{Name: "Program FO", Checked: true, Remark: ""},
		// 		{Name: "Share Drive", Checked: true, Remark: ""},
		// 		{Name: "Drive Hotel", Checked: true, Remark: ""},
		// 		{Name: "Firewall", Checked: true, Remark: "กำหนดสิทธิ์แล้ว"},
		// 	},
		// 	CCTVImage: []CheckItem{
		// 		// {Name: "Program HR", Checked: true, Remark: ""},
		// 		// {Name: "Program AC", Checked: true, Remark: ""},
		// 		// {Name: "Program FO", Checked: true, Remark: ""},
		// 		// {Name: "Share Drive", Checked: true, Remark: ""},
		// 		// {Name: "Drive Hotel", Checked: true, Remark: ""},
		// 		// {Name: "Firewall", Checked: true, Remark: "กำหนดสิทธิ์แล้ว"},
		// 	},
		// }
		// db.Create(&check)
		
}
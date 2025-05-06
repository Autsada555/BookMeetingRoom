package entity

import (
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	ID uint `gorm:"primarykey"`
	
	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Gender struct { //
	BaseModel
	Name string `gorm:"unique"`
}


type CheckSystems struct {
	BaseModel
	ServerRoom   []string `gorm:"serializer:json"`
	BuildingABC   []string `gorm:"serializer:json"`
	BuildingDEF   []string `gorm:"serializer:json"`
	Carpark   []string `gorm:"serializer:json"`
	Internet   []string `gorm:"serializer:json"`
	Telephone   []string `gorm:"serializer:json"`
	Programs   []string `gorm:"serializer:json"`
	CCTVImage   []string  `gorm:"type:longtext","serializer:json"`

}

type User struct { //
	BaseModel

	FirstName        string `gorm:"default:ชื่อ"`
	LastName         string `gorm:"default:นามสกุล"`
	Email            string `valid:"required~กรุณากรอกอีเมลล์,email~มีผู้ใช้อีเมลล์นี้แล้ว" gorm:"unique"`
	Password         string `valid:"required~กรุณากรอกรหัส,minstringlength(5)~รหัสอย่างน้อย 5 ตัวอักษร"`
	
	GenderID uint
	Gender   *Gender `gorm:"foreignKey:GenderID"`
	
	UserTypeID uint
	UserType   *UserType `gorm:"foreignKey:UserTypeID"`
}

type UserType struct { //
	BaseModel
	Name string `gorm:"unique"`
}
// type MenuType struct { //
// 	BaseModel
// 	Name string `gorm:"unique"`
// }

// // type DiseaseType struct { //
// // 	BaseModel
// // 	Name string `gorm:"unique"`
// // }

// type StatusOrderType struct { //
// 	BaseModel
// 	Name string `gorm:"unique"`
// }

// type StatusPaymentType struct { //
// 	BaseModel
// 	Name string `gorm:"unique"`
// }

// type StatusDeliveryType struct { //
// 	BaseModel
// 	Name string `gorm:"unique"`
// }


// type Order struct { //
// 	BaseModel
// 	Quantity     int `valid:"required~Quantity is required"`
// 	TotalAmount  int `valid:"required~TotalAmount is required"`
// 	DateDelivery time.Time `valid:"required~DateDelivery is required"`
// 	Eslip        string `valid:"required~Eslip is required" gorm:"type:longtext"`
// 	Delivery     string `valid:"required~Delivery is required"`

// 	Menu []Menu `gorm:"many2many:order_menu"`

// 	UserID uint
// 	User   *User `gorm:"foreignKey:UserID"`

// 	StatusOrderTypeID uint
// 	StatusOrderType   *StatusOrderType `gorm:"foreignKey:StatusOrderTypeID"`

// 	StatusPaymentTypeID uint
// 	StatusPaymentType   *StatusPaymentType `gorm:"foreignKey:StatusPaymentTypeID"`

// 	StatusDeliveryTypeID uint
// 	StatusDeliveryType   *StatusDeliveryType `gorm:"foreignKey:StatusDeliveryTypeID"`
// }

// type Disease struct {
// 	BaseModel
// 	Name  string `binding:"required"`
// 	Menus []Menu `gorm:"many2many:menu_diseases;"` // ความสัมพันธ์ Many-to-Many
// }

// type MenuDisease struct {
// 	MenuID    uint `gorm:"primaryKey"`
// 	DiseaseID uint `gorm:"primaryKey"`
// }
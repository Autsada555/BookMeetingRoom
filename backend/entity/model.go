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

// type UserType struct { //
// 	BaseModel
// 	Name string `gorm:"unique"`
// }

// type User struct { //
// 	BaseModel

// 	FirstName        string `gorm:"default:ชื่อ"`
// 	LastName         string `gorm:"default:นามสกุล"`
// 	Email            string `valid:"required~Email is required,email~Invalid email address" gorm:"unique"`
// 	Password         string `valid:"required~Password is required,minstringlength(8)~Password must be at least 8 characters"`
// 	Phone            string `valid:"required~Phone number is required,stringlength(10|10)~Phone must be at 10 characters"`
// 	UserName         string `valid:"required~UserName is required,minstringlength(5)~UserName must be at 5 characters" gorm:"unique"`
// 	Address          string `gorm:"default:ที่อยู่"`
// 	CreditCardNumber string `valid:"required~CreditCardNumber number is required,stringlength(10|10)~Phone must be at 16 characters" gorm:"unique"`

// 	GenderID uint
// 	Gender   *Gender `gorm:"foreignKey:GenderID"`

// 	UserTypeID uint
// 	UserType   *UserType `gorm:"foreignKey:UserTypeID"`
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

// type Menu struct {
// 	BaseModel
// 	Name        string
// 	Cost        float32
// 	Description string
// 	Component   []string `gorm:"serializer:json"`
// 	MenuImage   string   `gorm:"type:longtext"`

// 	Diseases []Disease `gorm:"many2many:menu_diseases;"` // ความสัมพันธ์ Many-to-Many

// 	MenuTypeID uint
// 	MenuType   *MenuType `gorm:"foreignKey:MenuTypeID"`
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
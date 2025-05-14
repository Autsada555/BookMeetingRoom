package entity

import (
	"time"
	"gorm.io/datatypes"
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


type CheckItem struct {
	Name    string `json:"name"`
	Checked bool   `json:"checked"`
	Remark  string `json:"remark"`
}
type DailyCheck struct {
	ID        uint           `gorm:"primaryKey"`
	Date      string         `json:"date"`
	CheckedBy string         `json:"checked_by"`
	Checks    datatypes.JSON `gorm:"type:json" json:"checks"`
	CreatedAt time.Time
}

type CheckSystems struct {
	gorm.Model
	ServerRoom   []CheckItem `gorm:"type:json" json:"server_room"`
	BuildingABC  []CheckItem `gorm:"type:json" json:"building_abc"`
	BuildingDEF  []CheckItem `gorm:"type:json" json:"building_def"`
	Carpark      []CheckItem `gorm:"type:json" json:"carpark"`
	Internet     []CheckItem `gorm:"type:json" json:"internet"`
	Telephone    []CheckItem `gorm:"type:json" json:"telephone"`
	Programs     []CheckItem `gorm:"type:json" json:"programs"`
	CCTVImage    []CheckItem `gorm:"type:json" json:"cctv_image"`
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

type Booking struct {
 ID        uint      `gorm:"primaryKey"`
 Name      string    // ชื่อผู้จอง
 Room      string    // ชื่อห้อง (Room A, B, C, ...)
 StartTime time.Time // เวลาเริ่ม
 EndTime   time.Time // เวลาสิ้นสุด
 CreatedAt time.Time
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
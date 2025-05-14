package entity

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase(dbName string) {
	database, err := gorm.Open(sqlite.Open(dbName+".db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	autoMigrate(database)
	db = database
}

func SetupTestDatabase() {
	database, err := gorm.Open(sqlite.Open("TestDB.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic("failed to connect database")
	}
	autoMigrate(database)
	db = database
}

// Migrate the schema
func autoMigrate(database *gorm.DB) {
	database.AutoMigrate(
		&Gender{}, //
		&CheckSystems{},
		&User{}, //
		&UserType{}, //
		&CheckItem{}, //
		&DailyCheck{}, //
		// &Menu{},
		// &StatusOrderType{}, //	
		// &StatusPaymentType{}, //
		// &StatusDeliveryType{},		

	)
}
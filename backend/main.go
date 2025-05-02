package main

import (
	// `github.com/gin-gonic/gin`
	`github.com/Autsada555/BookMeetingRoom/routers`
	"github.com/Autsada555/BookMeetingRoom/entity"
)

func main() {
	entity.SetupDatabase("RvdDB")
	entity.SetupData(entity.DB())
	route := routers.SetupRouter()

	// init Routes
	routers.InitRouter(route)

	// Run the server
	route.Run()
}
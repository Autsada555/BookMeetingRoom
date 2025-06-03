package main

import (
	// `github.com/gin-gonic/gin`
	"os"

	"github.com/Autsada555/BookMeetingRoom/entity"
	"github.com/Autsada555/BookMeetingRoom/routers"
)

func main() {
	entity.SetupDatabase("RvdDB")
	entity.SetupData(entity.DB())
	route := routers.SetupRouter()

	// init Routes
	routers.InitRouter(route)

	// Run the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	route.Run("0.0.0.0:" + port)
}

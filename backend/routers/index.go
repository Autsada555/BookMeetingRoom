package routers

import (
	"github.com/Autsada555/BookMeetingRoom/controllers"
	"github.com/Autsada555/BookMeetingRoom/middlewares"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	return gin.Default()
}

func InitRouter(route *gin.Engine) {

	route.Use(middlewares.CORS())

	route.POST("/login", controllers.Login)
	route.POST("/user/create", controllers.CreateUser)

	authRouter := route.Group("/")
	initRequiredAuthRouter(authRouter)

}

func initRequiredAuthRouter(route *gin.RouterGroup) {
	route.Use(middlewares.Authentication())
	// requireAdmin := middlewares.RequireAdmin()
	// requireCash := middlewares.RequireCash()
	// requireDelivery := middlewares.RequireDelivery()
	// route.GET("/customer", controllers.GetAllCustomer)

	//User
	route.POST("/logout/:id", controllers.Logout)
	route.PATCH("/user/edit/:id", controllers.UpdateUser)
	route.GET("/user/:id", controllers.GetUserByID)
	route.DELETE("/user/delete/:id", controllers.DeleteUser)
	// route.GET("/customer/", requireAdmin, controllers.GetCustomer)
	// route.GET("/customer/usertype", requireAdmin, controllers.GetAllUserType)

	//BookingMeeting
	route.POST("/book/create", controllers.CreateBooking)
	route.GET("/book/list",controllers.ListBookings)
	// route.GET("/menu/:id", controllers.GetMenuByDiseaseID)
	// route.GET("/menus", requireAdmin, controllers.GetMenu)
	// route.POST("/menu/create", requireAdmin, controllers.CreateMenu)
	// route.PATCH("/menu/update/:id", requireAdmin, controllers.UpdateMenu)
	// route.DELETE("/menu/delete/:id", requireAdmin, controllers.DeleteMenu)

	//CCTV
	route.POST("/checksystems/create", controllers.SaveCheckSystems)
	route.GET("/checksystems/list", controllers.ListCheckSystems)

	// //order
	// route.GET("/order/:id", controllers.GetOrderByID)
	// route.POST("/order/create", controllers.CreateOrder)
	// route.PATCH("/order/cancel/:id", controllers.CancelOrder)
	// route.PATCH("/order/deliveryorder/:id", controllers.DeliveryOrder)
	// route.GET("/order",  controllers.GetAllOrder)
	// route.PATCH("/order/statuspayment/:id/:status_payment_type_id",controllers.CheckPayment)
	// route.PATCH("/order/:id/:status_order_type_id",  controllers.ReceiveOrder)
	// route.PATCH("/order/deliveryorder/:id/:status_delivery_type_id",  controllers.CheckDeliveryOrder)

	// route.GET("/disease", requireAdmin, controllers.GetDiseases)

	// //status
	// route.GET("/statuspayment", controllers.ListStatusPaymentTypes)
	// route.GET("/statusorder", controllers.ListStatusOrderTypes)
	// route.GET("/statusdelivery", controllers.ListStatusDeliveryTypes)

}

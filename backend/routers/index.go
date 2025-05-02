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

	// route.POST("/login", controllers.Login)
	// route.POST("/customer/create", controllers.CreateCustomer)
	// route.GET("/customer/gender", controllers.GetAllGender)

	authRouter := route.Group("/")
	initRequiredAuthRouter(authRouter)

}

func initRequiredAuthRouter(route *gin.RouterGroup) {
	route.Use(middlewares.Authentication())
	requireAdmin := middlewares.RequireAdmin()
	// requireCash := middlewares.RequireCash()
	// requireDelivery := middlewares.RequireDelivery()
	// route.GET("/customer", controllers.GetAllCustomer)

	// route.POST("/logout/:id", controllers.Logout)
	// route.PATCH("/customer/edit/:id", controllers.UpdateCustomer)
	// route.GET("/customer/:id", controllers.GetCustomerByID)

	// route.DELETE("/customer/delete/:id", requireAdmin, controllers.DeleteCustomer)
	// route.GET("/customer/", requireAdmin, controllers.GetCustomer)
	// route.GET("/customer/usertype", requireAdmin, controllers.GetAllUserType)

	// //menu
	// route.GET("/menu/:id", controllers.GetMenuByDiseaseID)
	// route.GET("/menus" , requireAdmin, controllers.GetMenu)
	// route.POST("/menu/create", requireAdmin, controllers.CreateMenu)
	// route.PATCH("/menu/update/:id", requireAdmin, controllers.UpdateMenu)
	// route.DELETE("/menu/delete/:id", requireAdmin, controllers.DeleteMenu)

	// //menu type
	// route.GET("/menutypes", controllers.Menutypes)

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
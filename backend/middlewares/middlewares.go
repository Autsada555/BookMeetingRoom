package middlewares

import (
	"net/http"
	"slices"

	"fmt"
	"github.com/Autsada555/BookMeetingRoom/entity"
	"github.com/Autsada555/BookMeetingRoom/utils"
	"github.com/gin-gonic/gin"
)

// role base access control for middleware

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		allowedOrigins := []string{
			// "http://localhost:5173",
			// "http://192.168.182.113:5173",
			"https://bookmeetingroom.onrender.com",
		}
		for _, o := range allowedOrigins {
			if o == origin {
				c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
				break
			}
		}
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT ,PATCH ,DELETE")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func Authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		if _, payload, err := utils.ValidateJWT("token", c); err == nil {
			token_name, _ := payload["active_token"].(string)
			if _, data, err := utils.ValidateJWT(token_name, c); err == nil {
				fmt.Println(data["UserTypeID"])
				c.Set("Email", data["Email"].(string))
				c.Set("active_token", token_name)
				c.Set("authenticated", true)
				c.Set("UserTypeID", data["UserTypeID"])
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized0"})
	}
}

// Authorization / Role based access control
func Authorization(role_ids ...uint) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !c.GetBool("authenticated") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized1"})
			return
		}

		if len(role_ids) == 0 {
			c.Next()
			return
		}

		role := map[string]uint{
			"etk": 999,
			"utk": 100,
		}
		active_token := c.GetString("active_token")
		Email := c.GetString("Email")

		if active_token != "etk" {
			roleValue, exists := role[active_token]
			if exists && slices.Contains(role_ids, roleValue) {
				c.Next()
				return
			}
		} else {
			var emp struct {
				UserTypeID uint
			}
			if err := entity.DB().Table("users").Where("email = ?", Email).First(&emp).Error; err == nil {
				if slices.Contains(role_ids, emp.UserTypeID) {
					c.Next()
					return
				}
			}
		}
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
	}
}

// func RequireAdmin() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		fmt.Println("RequireAdmin")
// 		userTypeID, exists := c.Get("UserTypeID")
// 		if !exists {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized2"})
// 			return
// 		}
// 		fmt.Println("UserTypeID",userTypeID)
// 		fmt.Printf("typeof userTypeID: %T\n", userTypeID)
// 		if userTypeID.(float64) != 999 {
// 			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
// 			return
// 		}
// 		c.Next()
// 		return
// 	}
// }

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("RequireAdmin")
		userTypeID, exists := c.Get("UserTypeID")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized2"})
			return
		}
		fmt.Println("UserTypeID", userTypeID)
		fmt.Printf("typeof userTypeID: %T\n", userTypeID)

		if userTypeID.(float64) != 999 {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
			return
		}

		c.Next() // return ไม่จำเป็นหลังจากนี้
	}
}

// func RequireCash() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		fmt.Println("RequireAdmin")
// 		userTypeID, exists := c.Get("UserTypeID")
// 		if !exists {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized2"})
// 			return
// 		}
// 		fmt.Println("UserTypeID",userTypeID)
// 		fmt.Printf("typeof userTypeID: %T\n", userTypeID)
// 		if (userTypeID.(float64) != 201) || (userTypeID.(float64) != 200) {
// 			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
// 			return
// 		}
// 		c.Next()
// 		return
// 	}
// }
// func RequireDelivery() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		fmt.Println("RequireAdmin")
// 		userTypeID, exists := c.Get("UserTypeID")
// 		if !exists {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized2"})
// 			return
// 		}
// 		fmt.Println("UserTypeID",userTypeID)
// 		fmt.Printf("typeof userTypeID: %T\n", userTypeID)
// 		if (userTypeID.(float64) != 202) || (userTypeID.(float64) != 200) {
// 			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
// 			return
// 		}
// 		c.Next()
// 		return
// 	}
// }

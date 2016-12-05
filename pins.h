#include "driverlib/gpio.h"

#ifndef __PINS_H
#define __PINS_H

// Camera Interface
#define GPIO_Pin_All               ((uint8_t)0xFF)  /*!< All pins selected */

#define RRST    	GPIO_PIN_0 			// PORT A

#define WEN     	GPIO_PIN_7 			// PORT M

#define VSYNC   	GPIO_PIN_4 			// PORT P	Input
#define RCLK    	GPIO_PIN_5 			// PORT P

#define RED_LED   	GPIO_PIN_0			// PORT N
#define GREEN_LED 	GPIO_PIN_1			// PORT N

#define GPIO_DATA	GPIO_Pin_All		// PORT K Input Camera

#define VSYNC_PORT 		GPIO_PORTP_BASE
#define WEN_PORT		GPIO_PORTM_BASE
#define RRST_PORT		GPIO_PORTA_BASE
#define RCLK_PORT 		GPIO_PORTP_BASE
#define DATA_PORT 		GPIO_PORTK_BASE

// Leds
#define LEDS_PORT		GPIO_PORTN_BASE

// I2C Interface
#define PERIPH_I2C		SYSCTL_PERIPH_I2C2
#define I2C_UNIT		I2C2_BASE
#define GPIO_I2CSCL		GPIO_PN5_I2C2SCL
#define GPIO_I2CSDA		GPIO_PN4_I2C2SDA

#define	PORT_I2C 		GPIO_PORTN_BASE
#define SCK     		GPIO_PIN_5 			// PORT N	I2C
#define SDA     		GPIO_PIN_4 			// PORT N	Input	I2C2
// UART Interface
#define PERIPH_UART		SYSCTL_PERIPH_UART6
#define UART_UNIT		UART6_BASE
#define	GPIO_UARTRX		GPIO_PP0_U6RX
#define GPIO_UARTTX		GPIO_PP1_U6TX

#define	PORT_UART 		GPIO_PORTP_BASE
#define RXD     		GPIO_PIN_0			// PORT P 	Input	UART6
#define TXD     		GPIO_PIN_1 			// PORT P	UART

#define UART_INT		INT_UART6



#endif

/* vim: set sw=4 et: */

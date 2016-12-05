#include <stdint.h>
#include <stdbool.h>
#include <stdarg.h>

#include "driverlib/sysctl.h"
#include "driverlib/i2c.h"
#include "inc/hw_types.h"
#include "inc/hw_memmap.h"
#include "inc/hw_ints.h"
#include "driverlib/rom.h"

#include "ov7670.h"

#include "pins.h"
#include "utils.h"
#include "tprintf.h"


void ov7670_set(uint8_t addr, uint8_t val)
{
	ROM_I2CMasterSlaveAddrSet(I2C_UNIT, OV7670_ADDR>>1, false);
	ROM_I2CMasterDataPut(I2C_UNIT, addr);
	ROM_I2CMasterControl(I2C_UNIT, I2C_MASTER_CMD_BURST_SEND_START);
	ROM_SysCtlDelay(1000);
	while(ROM_I2CMasterBusy(I2C_UNIT));

	ROM_SysCtlDelay(1500);

	ROM_I2CMasterDataPut(I2C_UNIT, val);
	ROM_I2CMasterControl(I2C_UNIT, I2C_MASTER_CMD_BURST_SEND_FINISH);
	ROM_SysCtlDelay(1000);
	while(ROM_I2CMasterBusy(I2C_UNIT));
}

uint8_t ov7670_get(uint8_t addr)
{
    uint8_t retval;

    ROM_I2CMasterSlaveAddrSet(I2C_UNIT, OV7670_ADDR>>1, false);
    ROM_I2CMasterDataPut(I2C_UNIT, addr);
    ROM_I2CMasterControl(I2C_UNIT, I2C_MASTER_CMD_SINGLE_SEND);
    ROM_SysCtlDelay(1000);
    while(ROM_I2CMasterBusy(I2C_UNIT));

    ROM_SysCtlDelay(1500);

    ROM_I2CMasterSlaveAddrSet(I2C_UNIT, (OV7670_ADDR + 1)>>1, true);
    ROM_I2CMasterControl(I2C_UNIT, I2C_MASTER_CMD_SINGLE_RECEIVE);
    ROM_SysCtlDelay(1000);
    while(ROM_I2CMasterBusy(I2C_UNIT));

    ROM_SysCtlDelay(1500);
    retval = (uint8_t)ROM_I2CMasterDataGet(I2C_UNIT);

    return retval;
}

uint8_t ov7670_init(void)
{
	uint8_t a;
	a = ov7670_get(REG_PID);
	tprintf("  ID Received 0x%x \r\n",a);
    if (a != 0x76) {
        return 0;
    }

    ov7670_set(REG_COM7, 0x80); /* reset to default values */
    ov7670_set(REG_CLKRC, 0x80);


    ov7670_set(REG_COM11, 0x0A);
    ov7670_set(REG_TSLB, 0x04);
    ov7670_set(REG_TSLB, 0x04);
    ov7670_set(REG_COM7, 0x04); /* output format: rgb */


    ov7670_set(REG_RGB444, 0x00); /* disable RGB444 */
    ov7670_set(REG_COM15, 0xD0); /* set RGB565 */



    /* not even sure what all these do, gonna check the oscilloscope and go
     * from there... */
    ov7670_set(REG_HSTART, 0x16);
    ov7670_set(REG_HSTOP, 0x04);
    ov7670_set(REG_HREF, 0x24);
    ov7670_set(REG_VSTART, 0x02);
    ov7670_set(REG_VSTOP, 0x7a);
    ov7670_set(REG_VREF, 0x0a);
    ov7670_set(REG_COM10, 0x02);

	a = ov7670_get(REG_COM10);
	tprintf("  COM10 Received 0x%x \r\n",a);
    if (a != 0x02) {
        return 0;
    }

    ov7670_set(REG_COM3, 0x04);
    ov7670_set(REG_MVFP, 0x3f);

    /* 160x120, i think */
    //ov7670_set(REG_COM14, 0x1a); // divide by 4
    //ov7670_set(0x72, 0x22); // downsample by 4
    //ov7670_set(0x73, 0xf2); // divide by 4

    /* 320x240: */
    ov7670_set(REG_COM14, 0x19);
    ov7670_set(0x72, 0x11);
    ov7670_set(0x73, 0xf1);

    // test pattern
    //ov7670_set(0x70, 0xf0);
    //ov7670_set(0x71, 0xf0);

    // COLOR SETTING
    ov7670_set(0x4f, 0x80);
    ov7670_set(0x50, 0x80);
    ov7670_set(0x51, 0x00);
    ov7670_set(0x52, 0x22);
    ov7670_set(0x53, 0x5e);
    ov7670_set(0x54, 0x80);
    ov7670_set(0x56, 0x40);
    ov7670_set(0x58, 0x9e);
    ov7670_set(0x59, 0x88);
    ov7670_set(0x5a, 0x88);
    ov7670_set(0x5b, 0x44);
    ov7670_set(0x5c, 0x67);
    ov7670_set(0x5d, 0x49);
    ov7670_set(0x5e, 0x0e);
    ov7670_set(0x69, 0x00);
    ov7670_set(0x6a, 0x40);
    ov7670_set(0x6b, 0x0a);
    ov7670_set(0x6c, 0x0a);
    ov7670_set(0x6d, 0x55);
    ov7670_set(0x6e, 0x11);
    ov7670_set(0x6f, 0x9f);

    ov7670_set(0xb0, 0x84);

    return 1;
}

void ov7670_capture(void)
{
    /* Capture frame */
	while (ROM_GPIOPinRead(VSYNC_PORT, VSYNC));		// wait for an old frame to end
	while (!ROM_GPIOPinRead(VSYNC_PORT, VSYNC));	// wait for an old frame to start
	ROM_GPIOPinWrite(WEN_PORT, WEN, WEN);			// enable writing to fifo
	wait(delay_120ns);
	while (ROM_GPIOPinRead(VSYNC_PORT, VSYNC));	// wait for the current frame to end
	ROM_GPIOPinWrite(WEN_PORT, WEN, 0x00);		// disable writing to fifo
	wait(delay_25ns);
	ROM_GPIOPinWrite(RRST_PORT, RRST, RRST);
	//while ((P1IN & VSYNC));     // wait for an old frame to end
    //while (!(P1IN & VSYNC));    // wait for a new frame to start
    //P1OUT |= WEN;               // enable writing to fifo
    //while ((P1IN & VSYNC));     // wait for the current frame to end
    //P1OUT &= ~WEN;              // disable writing to fifo
    //wait();
    //P1OUT |= RRST;
}
/* Reset the al422 read pointer */
/* Reset the al422 read pointer */
void ov7670_rrst(void)
{
	/* Since RRST (P1.3) has a debouncing cap, let's go really slowly
	     * here... */
	ROM_GPIOPinWrite(RRST_PORT, RRST, 0x00);
	wait(delay_120ns);
	ROM_GPIOPinWrite(RCLK_PORT, RCLK, RCLK);
	//wait(delay_25ns);
	ROM_GPIOPinWrite(RRST_PORT, RRST, RRST);
	ROM_GPIOPinWrite(RCLK_PORT, RCLK, 0x00);
    /* Since RRST (P1.3) has a debouncing cap, let's go really slowly
     * here... */
    //P1OUT &= ~RRST;
    //__delay_cycles(500);
    //P1OUT |= RCLK;
    //__delay_cycles(100);
    //P1OUT |= RRST;
    //P1OUT &= ~RCLK;
}

/* Read one byte from the al422 */
uint8_t ov7670_read(void)
{
    uint8_t val = 0x00;

	ROM_GPIOPinWrite(RCLK_PORT, RCLK, RCLK);
	//wait(delay_25ns);
	val = ROM_GPIOPinRead(DATA_PORT, GPIO_DATA);

	ROM_GPIOPinWrite(RCLK_PORT, RCLK, 0x00);
	//wait(delay_25ns);
   // wait(delay_25ns);
    //P1OUT |= RCLK;
    //val = P2IN;
    ////__delay_cycles(10);
    //P1OUT &= ~RCLK;
    //__delay_cycles(10);

    return val;
}

/* get image buffer from AL422B */
void ov7670_image(char *camera_bild)
{
	char tmp_char;
	uint16_t j;

	for (j = 0; j < CAM_WIDTH; j++) {
		tmp_char = (char) ov7670_read();
		camera_bild[j] = tmp_char;
	}
/*
 	tmp_char = ov7670_read();
	camera_bild[0] = tmp_char;
	tprintf("%x",tmp_char);

	tmp_char = ov7670_read();
	camera_bild[1] = tmp_char;
	tprintf("%x",tmp_char);

	tmp_char = ov7670_read();
	camera_bild[2] = tmp_char;
	tprintf("%x",tmp_char);

	tmp_char = ov7670_read();
	camera_bild[3] = tmp_char;
	tprintf("%x",tmp_char);
*/
}
void ov7670_image_uart(void)
{
	uint8_t tmp_char;
	uint16_t j,i;
	//uint8_t camera_bild[240][640];

	for (i = 0; i < 240; i++) {
		for (j = 0; j < 640; j++) {
			tmp_char = ov7670_read();
			//camera_bild[i][j] = tmp_char;
			tprintf("%x",tmp_char);
		}
	}
	//return camera_bild;
}
/* vim: set sw=4 et: */

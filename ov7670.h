#ifndef __OV7670_H
#define __OV7670_H

#include <inttypes.h>
#include "ov7670reg.h"

#define OV7670_ADDR     0x42
#define DEBUG			0

void ov7670_set(uint8_t addr, uint8_t val);
uint8_t ov7670_get(uint8_t addr);
uint8_t ov7670_init(void);
void ov7670_capture(void);

void ov7670_image(char *camera_bild);
void ov7670_image_uart(void);

void ov7670_rrst(void);
uint8_t ov7670_read(void);

#define CAM_HEIGHT 	240
#define CAM_WIDTH 	38400 // one line = 640 = 320*2 (16bits)

#endif

/* vim: set sw=4 et: */

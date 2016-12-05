#ifndef __UTILS_H
#define __UTILS_H

#include <inttypes.h>


// at 120MHz -> Ts = 1/120MHz = 8.3ns ||| Delay = 3 * Cycle * Ts;
#define delay_25ns 		1
#define delay_120ns		5

void UARTSend(const uint8_t *pui8Buffer, uint32_t ui32Count);
void wait(uint16_t delay);

#endif

/* vim: set sw=4 et: */

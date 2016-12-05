#include <stdint.h>
#include <stdbool.h>
#include "inc/hw_memmap.h"
#include "driverlib/uart.h"
#include "driverlib/sysctl.h"
#include "driverlib/rom.h"
#include "utils.h"

//*****************************************************************************
// Send a string to the UART.
//*****************************************************************************
void
UARTSend(const uint8_t *pui8Buffer, uint32_t ui32Count)
{
    // Loop while there are more characters to send.
    while(ui32Count--)
    {
        // Write the next character to the UART.
        UARTCharPutNonBlocking(UART1_BASE, *pui8Buffer++);
    }
}


void wait(uint16_t delay)
{
	ROM_SysCtlDelay(delay);
}
/* vim: set sw=4 et: */

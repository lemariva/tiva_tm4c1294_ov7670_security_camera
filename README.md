"Security camera" using TM4C1294XL and ov7670 
====================================

This code allows to get camera video streaming from the ov7670 over a webserver. 

Wiring
------------
#### `ov7670 (***)` <-> `Tiva C EK-TM4C1294XL`
| ov7670         	| EK-TM4C1294XL |
| ----------------- |:-------------:|
| VCC (PIN1)	 	| +3v3			|
| GND (PIN2)     	| GND			|
| VSYNC	(PIN5)   	| PP4			|
| RRST (PIN9)    	| PA0 (*)	    |
| RCLK (PIN11    	| PP5		    |
| SCL_SCCB (PIN3)	| PN5 (**)	    |
| SDA_SCCB (PIN4)	| PN4 (**)	    |
| WEN (PIN7)      	| PM7		    |
| D0-D7 (PIN13-20) 	| PK0-PK7	    |

+ (*)    Check JP4 -> Select CAN
+ (**)   I2C pins need pull-up resistors (e.g. 10kOhm connected to +3.3V)
+ (***)  Buy on ebay: https://goo.gl/RX4Yy0

Usage
-----
![alt tag](https://raw.githubusercontent.com/lemariva/tiva_tm4c1294_ov7670_security_camera/master/doc/ov7670_camera_capture.gif)

To access the camera video stream, use a browser and enter the webserver address (e.g. `http://<< camera-ip >>`).
Using the buttons `Start Camera` or `Capture Image` the video streaming starts. The `Toggle LED` button toggle a LED on the board. This can be used to switch on some infrarred leds.

The website is contained on the file `io_fsdata.h`, the folder `fs` is converted into this file using `makefsfile`. The file `website.bat` can be used for that purpose:

```
c:\ti\TivaWare_C_Series-2.1.3.156\tools\bin\makefsfile -i fs -o io_fsdata.h -r -h -q 
```

<em>Note: change the TivaWare path!</em>

Requirements 
------------
### CCS6 
1. install: TivaWare C Series ver.: 2.1.3.156 | http://www.ti.com/tool/sw-tm4c

<em>Note: other versions also work -> edit variable '${SW_ROOT}'</em>

More info & Help
----------------
* Blog article: http://lemariva.com/blog/2016/12/connecting-the-tm4c1294xl-to-a-ov7670
* EK-TM4C1294XL: http://www.ti.com/tool/ek-tm4c1294xl
* ov7670: http://www.voti.nl/docs/OV7670.pdf
* AL422B: http://www.averlogic.com/AL422B.asp
* Camera pinout: https://goo.gl/975hZJ
* Camera schematic: https://goo.gl/nBZcSB

Changelog
---------
* 1.0 - First release.

Credit
------
Based on : https://github.com/desaster/ov7670fifotest
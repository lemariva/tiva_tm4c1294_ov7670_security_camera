//*****************************************************************************
//	Copyright [2016] [Mauro Hernan Riva (http://lemariva.com)]
//	
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//	
//		http://www.apache.org/licenses/LICENSE-2.0
//	
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//***********************************************************************


var TIME_CAPTURE = 500;
var TIME_PLOT = 500;

window.onload = function()
{
	//setTimeout("capture_image()",TIME_CAPTURE);
	setTimeout("plot_image()",TIME_PLOT);
}

function loadAbout()
{
    loadPage("about.htm");
    return false;
}

function loadOverview()
{
    loadPage("overview.htm");
    return false;
}

function loadBlock()
{
    loadPage("block.htm");
    return false;
}

function loadIOHttp()
{
    loadPage("io_http.htm");
    ledstateGet();
    speedGet();
    return false;
}

function SetFormDefaults()
{
    document.iocontrol.LEDOn.checked = ls;
    document.iocontrol.speed_percent.value = sp;
}

function toggle_led()
{
    var req = false;

    function ToggleComplete()
    {
        if(req.readyState == 4)
        {
            if(req.status == 200)
            {
                document.getElementById("ledstate").innerHTML = "<div>" + req.responseText + "</div>";
            }
        }
    }

    if(window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
    }
    else if(window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(req)
    {
        req.open("GET", "/cgi-bin/toggle_led?id" + Math.random(), true);
        req.onreadystatechange = ToggleComplete;
        req.send(null);
    }
}

function ledstateGet()
{
    var led = false;
    function ledComplete()
    {
        if(led.readyState == 4)
        {
            if(led.status == 200)
            {
                document.getElementById("ledstate").innerHTML = "<div>" +
                                                  led.responseText + "</div>";
            }
        }
    }

    if(window.XMLHttpRequest)
    {
        led = new XMLHttpRequest();
    }
        else if(window.ActiveXObject)
    {
        led = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(led)
    {
        led.open("GET", "/ledstate?id=" + Math.random(), true);
        led.onreadystatechange = ledComplete;
        led.send(null);
    }
}

function speedSet()
{
    var req = false;
    var speed_txt = document.getElementById("speed_percent");
    function speedComplete()
    {
        if(req.readyState == 4)
        {
            if(req.status == 200)
            {		
                document.getElementById("current_speed").innerHTML = "<div>" + req.responseText + "</div>";
            }
        }
    }
    if(window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
    }
    else if(window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(req)
    {
        req.open("GET", "/cgi-bin/set_speed?percent=" + speed_txt.value +
                        "&id" + Math.random(), true);
        req.onreadystatechange = speedComplete;
        req.send(null);
    }
}

function speedGet()
{
    var req = false;
    function speedReturned()
    {
        if(req.readyState == 4)
        {
            if(req.status == 200)
            {
				var img = document.getElementById("output");
				var c = img.getContext("2d");
				c.putImageData(req.responseText,0,0);               
            }
        }
    }

    if(window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
    }
        else if(window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(req)
    {
        req.open("GET", "/get_speed?id=" + Math.random(), true);
        req.onreadystatechange = speedReturned;
        req.send(null);
    }
}

// CAMERA functions
var IMG_HEIGHT = 4;
var imageBuffer = new Array(IMG_HEIGHT);


function plot_image()
{
	//alert('plotImage');
	var stringBuffer = "";
	setTimeout("plot_image()",TIME_PLOT);	
	for (var img_line = 0; img_line < IMG_HEIGHT; img_line++)
	{
		stringBuffer += imageBuffer[img_line];
	}
	doDraw(stringBuffer);
}

function request_image_line(req_line)
{
    var req = false;
    function SendComplete(imageLine)
    {
        if(req.readyState == 4)
        {
            if(req.status == 200)
            {	
				//alert(imageLine);
				imageBuffer[imageLine] = req.responseText;	
				//document.getElementById("capture_state").innerHTML = "<div>" + req.responseText + "</div>";
            }
        }
    }

    if(window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
    }
    else if(window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(req)
    {
        req.open("GET", "/cgi-bin/request_image_line?line="+ req_line +"&id=" + Math.random() , false);
		if (req.overrideMimeType) req.overrideMimeType('text/plain; charset=x-user-defined');
		req.setRequestHeader("If-Modified-Since", "Fri, 01 Jan 1960 00:00:00 GMT");		
        req.onreadystatechange = function () {
            SendComplete(req_line);
        };
        req.send(null);
    }
}

function capture_bild()
{
    var req = false;
    function CaptureComplete()
    {
        if(req.readyState == 4)
        {
            if(req.status == 200)
            {
				document.getElementById("capture_state").innerHTML = "<div>" + req.responseText + "</div>";
            }
        }
    }

    if(window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
    }
    else if(window.ActiveXObject)
    {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(req)
    {
        req.open("GET", "/cgi-bin/capture_image?id=" + Math.random() , false);
		if (req.overrideMimeType) req.overrideMimeType('text/plain; charset=x-user-defined');
		req.setRequestHeader("If-Modified-Since", "Fri, 01 Jan 1960 00:00:00 GMT");			
        req.onreadystatechange = CaptureComplete;
        req.send(null);
    }
}

function capture_image()
{
	capture_bild();
	for (var img_line = 0; img_line < IMG_HEIGHT; img_line++)
	{
		request_image_line(img_line);
	}
	drawNeeded = true;
	setTimeout("capture_image()",TIME_CAPTURE);
}

function loadPage(page)
{
    if(window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("GET", page, true);
    xmlhttp.setRequestHeader("Content-type",
                             "application/x-www-form-urlencoded");
    xmlhttp.send();

    xmlhttp.onreadystatechange = function ()
    {
        if((xmlhttp.readyState == 4) && (xmlhttp.status == 200))
        {
            document.getElementById("content").innerHTML = xmlhttp.responseText;
        }
    }
}

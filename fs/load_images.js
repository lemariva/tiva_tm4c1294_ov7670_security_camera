var Formats = new Array();
var PixelFormats = new Array();
var PixelPlanes = new Array();
 
var offset = 0;
var fliph = 0;
var flipv = 0;
var invertcol = 0;

var xres = 320;
var yres = 240;

var rawData = [];
var pixels = [];
var zoom = 1;

var drawNeeded = true;

function Format(name, toRgba, getPixels, bpsp1, bpsp2, bpsp3, bpsp4, align, subsh, subsv, le, ignoreAlpha, alphaFirst)
{
	this.name=name;
	this.toRgba=toRgba;
	this.bpsp1=bpsp1;
	this.bpsp2=bpsp2;
	this.bpsp3=bpsp3;
	this.bpsp4=bpsp4;
	this.align=align;
	this.getPixels=getPixels;
	this.subsh=subsh;
	this.subsv=subsv;
	this.le =le;
	this.ignoreAlpha = ignoreAlpha;
	this.alphaFirst = alphaFirst;
}

function PixelPlane(name, getPixels)
{
	this.name=name;
	this.getPixels=getPixels;
}

function PixelFormat(name, toRgba)
{
	this.name=name;
	this.toRgba=toRgba;
}

//function Format(name, toRgba, getPixels, bpsp1, bpsp2, bpsp3, bpsp4, align, subsh, subsv, le, ignoreAlpha, alphaFirst)
Formats.push(new Format("RGB565", "RGBA", "Packed", 5,6,5,0,1,1,1,true,true,false));
PixelPlanes.push(new PixelPlane("Packed", getPackedEx));
PixelFormats.push(new PixelFormat("RGBA", rgba2rgba));

var format = new Format();

// getPixels
function getPixels(dataIn, xres, yres, format) {	
	return format.getPixels(dataIn, xres, yres, format, format.toRgba);
}

// RGB
function rgba2rgba(r, g, b, a) {
	//alert('rgba2rgba');
	if(format.alphaFirst) {
		var tmp = a;
		a = r;
		r = g;
		g = b;
		b = tmp;
	}
	if(format.ignoreAlpha)
		a = 0xff;
	if(r<0) r = 0;
	if(g<0) g = 0;
	if(b<0) b = 0;	
	return (a << 24 | r | g << 8 | b << 16);
}

function getBit(dataIn, pos, le) {
	posByte = pos >> 3;
	if(le)
		posByte = posByte ^ 1;
	posBit = 0x80 >> (pos%8);
	return (dataIn[posByte] & posBit) != 0;
}

function getBits(dataIn, start, count, le) {
	var ret = 0;
	for(var i=0; i<count; i++) {
		ret <<=1;
		var bit = getBit(dataIn,start+i, le);
		if(bit) ret |= 1;
	}
	return ret;
}

function Align(x, align) {
	if(x % align)
		x += align - (x % align);
	return x;
}

function to8bit(x, bpp) {
	if(!bpp) return -1;
	if(bpp > 8)
		x = x >> (bpp - 8); // FIXME dithering
	if(bpp < 8) {
		x = x << (8 - bpp); // FIXME calculate scale
		x |= (x & 0xff) >> bpp;
	}
	return x;
}

function getPackedEx(dataIn, xres, yres, format, torgba) {	
	var ret = [];
	var bpp = format.bpsp1 + format.bpsp2 + format.bpsp3 + format.bpsp4;
	
	for(var i=0; i<(xres*yres*bpp); i+=bpp) {
		var a = getBits(dataIn, i, format.bpsp1, format.le);
		var b = getBits(dataIn, i + format.bpsp1, format.bpsp2, format.le);
		var c = getBits(dataIn, i + format.bpsp1 + format.bpsp2, format.bpsp3, format.le);
		var d = getBits(dataIn, i + format.bpsp1 + format.bpsp2 + format.bpsp3, format.bpsp4, format.le);		
		a = to8bit(a, format.bpsp1);
		b = to8bit(b, format.bpsp2);
		c = to8bit(c, format.bpsp3);
		d = to8bit(d, format.bpsp4);
		//alert('getPackedEx');
		ret.push(torgba(a,b,c,d));		
	}
	return ret;
}

function doDraw(inputImage) {
	var rawData = [];
	var string = inputImage;				
	var reader = new BinaryReader(string);				
	//alert(string);
	for (var i = 0; i < string.length; i++) 
	{	
		var tmp_char = reader.readUInt8();
		rawData.push(tmp_char);
		//alert(tmp_char);
	}
	//alert(reader);
	if(drawNeeded) {
		//drawNeeded = false;			
		var img = document.getElementById("output");
		var c = img.getContext("2d");
		
		// (name, toRgba, getPixels, bpsp1, bpsp2, bpsp3, bpsp4, align, subsh, subsv, le, ignoreAlpha, alphaFirst)
		//("RGB565", "RGBA", "Packed", 5,6,5,0,1,1,1,true,true,false);
		format.name 		= "RGB565";
		format.getPixels 	= PixelPlanes[0].getPixels;
		format.toRgba    	= PixelFormats[0].toRgba;
		format.bpsp1	 	= 5;
		format.bpsp2	 	= 6;
		format.bpsp3	 	= 5;
		format.bpsp4	 	= 0;
		format.align	 	= 1;
		format.subsh	 	= 1;
		format.subsv 		= 1;
		format.le	 		= false;
		format.ignoreAlpha	= true ;
		format.alphaFirst   = false;
				
		//var format = new Format();
		
		var imageData = c.createImageData(xres*zoom, yres*zoom);		
		var pixels = getPixels(rawData.slice(offset),xres,yres,format);					
			
		if(fliph) {
			for(var y=0; y<yres; y++) {
				var start = y*xres+0;
				var stop = (y+1)*xres-1;
				while(start < stop) {
					var tmp = pixels[start];
					pixels[start] = pixels[stop];
					pixels[stop] = tmp;
					stop--;
					start++;
				}
			}
		}
		if(flipv) {
			for(var x=0; x<xres; x++) {
				var start = x;
				var stop = xres*yres+x-xres;
				while(start < stop) {
					var tmp = pixels[start];
					pixels[start] = pixels[stop];
					pixels[stop] = tmp;
					stop -= xres;
					start += xres;
				}
			}
		}
		if(invertcol) {
			var p = xres * yres;
			while (p--) {
				pixels[p] = ~pixels[p] | 0xff000000;
			}
		}
				
		if(zoom < 2) {
		
			var p = xres * yres;
			var pix = p*4, pix1 = pix + 1, pix2 = pix + 2, pix3 = pix + 3;

			while (p--) {
				imageData.data[pix3-=4] = (pixels[p] >> 24) & 0xff;
				imageData.data[pix2-=4] = (pixels[p] >> 16) & 0xff;
				imageData.data[pix1-=4] = (pixels[p] >> 8) & 0xff;
				imageData.data[pix -=4] = (pixels[p]) & 0xff;
			}
		} else {
			for(var x=0; x<xres; x++)
				for(var y=0; y<yres; y++) {
					var pixel = pixels[x+xres*y];
					for(var k=0; k<zoom; k++)
						for(var j=0; j<zoom; j++) {
							var pos = (((x*zoom)+j)+((y*zoom)+k)*xres*zoom)*4;
							imageData.data[pos+3] = (pixel >> 24) & 0xff;
							imageData.data[pos+2] = (pixel >> 16) & 0xff;
							imageData.data[pos+1] = (pixel >> 8) & 0xff;
							imageData.data[pos+0] = (pixel) & 0xff;
						}
				}
		}
		c.putImageData(imageData, 0, 0);		
	}	
}

function start_camera()
{
	setTimeout("capture_image()",15000);
	setTimeout("plot_image()",1000);
}
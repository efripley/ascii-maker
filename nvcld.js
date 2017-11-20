//New Vec Digital Command Line Display
//Version 1.0
//Last Updated 10/29/2016
//
//Creates an 80 x 25 ascii display using canvas and a bitmap font.
//Provides functions for you to manage the display.
//

function NVCLD(container, font){
  this.genFontColor = function(color){
    console.log('generating font', color);
    var red = 0;
    var green = 0;
    var blue = 0;
    var alpha = 255;

    if(color == this.DARKGRAY){
      red = 80;
      green = 80;
      blue = 80;
    }
    else if(color == this.LIGHTGRAY){
      red = 207;
      green = 207;
      blue = 207;
    }
    else if(color == this.WHITE){
      red = 255;
      green = 255;
      blue = 255;
    }
    else if(color == this.RED){
      red = 255;
      green = 0;
      blue = 0;
    }
    else if(color == this.GREEN){
      red = 0;
      green = 255;
      blue = 0;
    }
    else if(color == this.BLUE){
      red = 0;
      green = 0;
      blue = 255;
    }
    else if(color == this.YELLOW){
      red = 255;
      green = 255;
      blue = 0;
    }
    else if(color == this.CYAN){
      red = 0;
      green = 255;
      blue = 255;
    }
    else if(color == this.MAGENTA){
      red = 255;
      green = 0;
      blue = 255;
    }
    else if(color == this.DARKRED){
      red = 127;
      green = 0;
      blue = 0;
    }
    else if(color == this.DARKGREEN){
      red = 0;
      green = 127;
      blue = 0;
    }
    else if(color == this.DARKBLUE){
      red = 0;
      green = 0;
      blue = 127;
    }
    else if(color == this.DARKYELLOW){
      red = 127;
      green = 127;
      blue = 0;
    }
    else if(color == this.DARKCYAN){
      red = 0;
      green = 127;
      blue =127;
    }
    else if(color == this.DARKMAGENTA){
      red = 127;
      green = 0;
      blue =127;
    }

    var imageCanvas = document.createElement('canvas');
    var imageContext = imageCanvas.getContext('2d');

    imageCanvas.width = fonts[0].width;
    imageCanvas.height = fonts[0].height;
    imageContext.drawImage(fonts[0], 0, 0 );
    var image = imageContext.getImageData(0, 0, fonts[0].width, fonts[0].height);

    for (var a = 0; a < image.data.length; a += 4){
      if(image.data[a + 3] == 255){
        image.data[a] = red;
        image.data[a + 1] = green;
        image.data[a + 2] = blue;
      }
    }

    imageContext.putImageData(image, 0, 0);

    var returnImage = new Image();
    returnImage.src = imageCanvas.toDataURL();

    //document.body.appendChild(returnImage);
    return returnImage;
  }

	this.initBuffers = function(){
	  console.log('initializing buffers');
		for(var ay = 0; ay < asciiHeight; ay++){
			for(var ax = 0; ax < asciiWidth; ax++){
				frontBuffer[ax][ay] = {char:32, color:this.WHITE, back:this.BLACK};
				backBuffer[ax][ay] = {char:32, color:this.WHITE, back:this.BLACK};
			}
		}
	}

	this.initDisplay = function(){
	  console.log('initializing display');
		for(var ay = 0; ay < asciiHeight; ay++){
			for(var ax = 0; ax < asciiWidth; ax++){
				var x = ax * charWidth;
				var y = ay * charHeight;
				var width = charWidth;
				var height = charHeight;
				var sourceX = parseInt(backBuffer[ax][ay].char % 32) * width;
				var sourceY = parseInt(backBuffer[ax][ay].char / 32) * height;

				context.drawImage(fonts[backBuffer[ax][ay].color], sourceX, sourceY, width, height, x, y, width, height);
			}
		}
	}

	this.clear = function(x, y, width, height){
		for(var ay = y; ay < y + height; ay++){
			for(var ax = x; ax < x + width; ax++){
				backBuffer[ax][ay].char = 0;
				backBuffer[ax][ay].color = this.WHITE;
				backBuffer[ax][ay].back = this.BLACK;
			}
		}
	}

	this.putc = function(char, x, y, color, back){
		if(char !== parseInt(char, 10))
			char = char.charCodeAt(0);

		backBuffer[x][y].char = char;
		backBuffer[x][y].color = color;
		backBuffer[x][y].back = back;
	}

	this.puts = function(string, x, y, color, back){
		var length = string.length;
		if(x + string.length >= asciiWidth)
			length = asciiWidth - x;

		for(a = 0; a < length; a++){
			this.putc(string.charAt(a), x + a, y, color, back);
		}
	}

	this.setColor = function(color){
		if(color == this.BLACK)
			context.fillStyle = "#000";
		else if(color == this.DARKGRAY)
			context.fillStyle = "#555";
		else if(color == this.GRAY)
			context.fillStyle = "#CCC";
		else if(color == this.WHITE)
			context.fillStyle = "#fff";
		else if(color == this.RED)
			context.fillStyle = "#f00";
		else if(color == this.GREEN)
			context.fillStyle = "#0f0";
		else if(color == this.BLUE)
			context.fillStyle = "#00f";
		else if(color == this.YELLOW)
			context.fillStyle = "#ff0";
		else if(color == this.CYAN)
			context.fillStyle = "#0ff";
		else if(color == this.MAGENTA)
			context.fillStyle = "#f0f";
		else if(color == this.DARKRED)
			context.fillStyle = "#800";
		else if(color == this.DARKGREEN)
			context.fillStyle = "#080";
		else if(color == this.DARKBLUE)
			context.fillStyle = "#008";
		else if(color == this.DARKYELLOW)
			context.fillStyle = "#880";
		else if(color == this.DARKCYAN)
			context.fillStyle = "#088";
		else if(color == this.DARKMAGENTA)
			context.fillStyle = "#808";
	}

	this.bufferUpdated = function(x, y){
		return backBuffer[x][y].char != frontBuffer[x][y].char ||
		       backBuffer[x][y].color != frontBuffer[x][y].color ||
		       backBuffer[x][y].back != frontBuffer[x][y].back;
	}

	this.copyBuffer = function(x, y){
		frontBuffer[x][y].char = backBuffer[x][y].char;
		frontBuffer[x][y].color = backBuffer[x][y].color;
		frontBuffer[x][y].back = backBuffer[x][y].back;
	}

	this.flip = function(){
		for(var ay = 0; ay < asciiHeight; ay++){
			for(var ax = 0; ax < asciiWidth; ax++){
				if(this.bufferUpdated(ax, ay)){
					this.copyBuffer(ax, ay);

					var x = ax * charWidth;
					var y = ay * charHeight;
					var width = charWidth;
					var height = charHeight;
					var sourceX = parseInt(backBuffer[ax][ay].char % 32) * width;
					var sourceY = parseInt(backBuffer[ax][ay].char / 32) * height;

          this.setColor(backBuffer[ax][ay].back);
					context.fillRect(x, y, width, height);

					context.drawImage(fonts[backBuffer[ax][ay].color], sourceX, sourceY, width, height, x, y, width, height);
				}
			}
		}

		this.clear(0, 0, asciiWidth, asciiHeight);
	}

  this.initFonts = function(){
	  fonts[0] = new Image();
	  console.log('init fonts', Date.now());
	  fonts[0].onload = function(){
	    console.log('generating all fonts', Date.now());
      fonts.push(display.genFontColor(display.DARKGRAY));
      fonts.push(display.genFontColor(display.LIGHTGRAY));
      fonts.push(display.genFontColor(display.WHITE));
      fonts.push(display.genFontColor(display.RED));
      fonts.push(display.genFontColor(display.GREEN));
      fonts.push(display.genFontColor(display.BLUE));
      fonts.push(display.genFontColor(display.YELLOW));
      fonts.push(display.genFontColor(display.CYAN));
      fonts.push(display.genFontColor(display.MAGENTA));
      fonts.push(display.genFontColor(display.DARKRED));
      fonts.push(display.genFontColor(display.DARKGREEN));
      fonts.push(display.genFontColor(display.DARKBLUE));
      fonts.push(display.genFontColor(display.DARKYELLOW));
      fonts.push(display.genFontColor(display.DARKCYAN));
      fonts.push(display.genFontColor(display.DARKMAGENTA));
      for(var a = 1; a < fonts.length; a++)
        document.getElementsByClassName('media-cmp')[0].appendChild(fonts[a]);
      display.initBuffers();
     	display.initDisplay();
      display.ready = true;;
    }
    fonts[0].src = font;
    document.getElementsByClassName('media-cmp')[0].appendChild(fonts[0]);
  }

  var readyDisplay = function(){
    this.ready = true;
  }

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var charHeight = 16;
	var charWidth = 8;
	var asciiWidth = 80;
	var asciiHeight = 25;
	canvas.height = charHeight * asciiHeight;
	canvas.width = charWidth * asciiWidth;

	document.getElementById(container).appendChild(canvas);

  this.ready = false;
	this.BLACK = 0;
	this.DARKGRAY = 1;
	this.LIGHTGRAY = 2;
	this.WHITE = 3;
	this.RED = 4;
	this.GREEN = 5;
	this.BLUE = 6;
	this.YELLOW = 7;
	this.CYAN = 8;
	this.MAGENTA = 9;
	this.DARKRED = 10;
	this.DARKGREEN = 11;
	this.DARKBLUE = 12;
	this.DARKYELLOW = 13;
	this.DARKCYAN = 14;
	this.DARKMAGENTA = 15;

  var fonts = [];



	backBuffer = new nvArray2D(asciiWidth, asciiHeight, null);
	frontBuffer = new nvArray2D(asciiWidth, asciiHeight, null);
}

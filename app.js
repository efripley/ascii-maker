function App(){
	var build = false;
	var logicFPS = 32;
	var logicFrame = 0;
	var logicTime = new Date().getTime();
	
	world.init();
	player.registerInput();
	player.initInventory();
	
	this.getLogicFrame = function(){
		return logicFrame;
	}

	this.update = function(){
		if(new Date().getTime() - logicTime > 1000 / logicFPS){
			logicTime = new Date().getTime();
			logicFrame++;
		}
			
		if(logicFrame % 4 == 0){
			world.applyGravityToObject(player);
			world.applyGravity();
		}
	}

	this.run = function(){
		input.eval();
		this.update();

		world.draw(player.x, player.y);
		player.draw();
		display.puts(" FPS: " + frameRate.update() + " ", 0, 0, display.WHITE, display.BLACK);
		display.puts(" LOC: " + player.x, 0, 1, display.WHITE, display.BLACK);

		display.flip();

		window.setTimeout(function(){app.run();}, 10);
	}
}

frameRate = new function(){
  this.time = new Date().getTime();
  this.frames = 0;
  this.fps = 0;

  this.update = function(){
    if(new Date().getTime() - this.time >= 1000){
      this.fps = this.frames;
      this.frames = 0;
      this.time = new Date().getTime();
    }
    else
      this.frames++;

    return this.fps;
  }
}

var display = new NVCLD("display1", "font");
var input = new NVIn();
var tiles = new Tiles();
var world = new World();
var player = new Player();
var app = new App();
app.run();

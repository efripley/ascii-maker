function Player(){
	this.x = nvRand(world.getSize());
	this.y = 24;
	
	var buildOffsetX = 0;
	var buildOffsetY = 0;
		
	var health = 10;

	var inventory = new Array(5);
	var inventoryIndex = 0;
	
	var dirx = 0;
	var diry = 0;
	
	var MOVE = 0;
	var JUMP = 1;
	var BUILD = 2;
	var mode = MOVE;

	var buildKeyStrokes = 0;
		
	var moveFrame = 0;
	var speed = 10;
	
	this.registerInput = function(){
		input.registerEvent("Up", 38, input.SINGLE, actUp);
		input.registerEvent("Left", 37, input.MULTI, actLeft);
		input.registerEvent("Down", 40, input.SINGLE, actDown);
		input.registerEvent("Right", 39, input.MULTI, actRight);
		input.registerEvent("Build", 70, input.SINGLE, toggleBuild);
		input.registerEvent("Option", 68, input.SINGLE, cycleInventory);
	}
	
	this.initInventory = function(){
		inventory[0] = {item:tiles.stone, amount:25};
		inventory[1] = {item:tiles.stoneSupport, amount:25};
		inventory[2] = {item:tiles.woodLadder, amount:25};
		inventory[3] = {item:tiles.dirt, amount:25};
		inventory[4] = {item:tiles.treeLeaves, amount:25};
	}

	var actUp = function(){
		if(mode == BUILD){
			buildOffsetY++;
			if(buildOffsetY > 1)
				buildOffsetY = 1;
			buildKeyStrokes++;
			if(buildKeyStrokes == 2)
				act();
		}
		else{
			if(world.climbableAt(this.x, this.y))
				climbUp();
			else
				toggleJump();
		}
	}.bind(this);

	var actLeft = function(){
		if(mode == BUILD){
			buildOffsetX--;
			if(buildOffsetX < -1)
				buildOffsetX = -1;
			buildKeyStrokes++;
			if(buildKeyStrokes == 2)
				act();
		}
		else{
			dirx = -1;
			diry = 0;
			
			act();
		}
	}
	
	var actDown = function(){
		if(mode == BUILD){
			buildOffsetY--;
			if(buildOffsetY < -1)
				buildOffsetY = -1;
			buildKeyStrokes++;
			if(buildKeyStrokes == 2)
				act();
		}
		else if(world.climbableAt(this.x, this.y - 1)){
			climbDown();
		}
	}.bind(this)
	
	var actRight = function(){
		if(mode == BUILD){
			buildOffsetX++;
			if(buildOffsetX > 1)
				buildOffsetX = 1;
			buildKeyStrokes++;
			if(buildKeyStrokes == 2)
				act();
		}
		else{
			dirx = 1;
			diry = 0;
		
			act();
		}
	}
	
	var toggleJump = function(){
		if(mode != JUMP)
			mode = JUMP;
		else
			mode = MOVE;
	}

	var toggleBuild = function(){
		if(mode != BUILD)
			enterBuildMode();
		else if(mode == BUILD)
			exitBuildMode();
	}
	
	var enterBuildMode = function(){
		mode = BUILD;
		input.editEventMode("Left", input.SINGLE);
		input.editEventMode("Right", input.SINGLE);
	}
	
	var exitBuildMode = function(){
		mode = MOVE;
		input.editEventMode("Left", input.MULTI);
		input.editEventMode("Right", input.MULTI);
	}
	
	var cycleInventory = function(){
		inventoryIndex++;
		if(inventoryIndex >= 5)
			inventoryIndex = 0;
	}
	
	var act = function(){
		if(app.getLogicFrame() - moveFrame > 32 / speed){
			moveFrame = app.getLogicFrame();
			
			if(mode == MOVE || mode == JUMP){
				move();
			}
			else if(mode == BUILD){
				build();
				exitBuildMode();
			}
				
			mode = MOVE;
		}
	}

	var move = function(){
		if(mode == JUMP){
			this.y++;
			if(world.collisionAt(this.x, this.y))
				this.y--;
		}
			
		this.x += dirx;
			
		if(world.collisionAt(this.x, this.y))
			this.x -= dirx;
	}.bind(this);
	
	var climbUp = function(){
		this.y++;
		if(world.collisionAt(this.x, this.y))
			this.y--;
	}.bind(this);
	
	var climbDown = function(){
		this.y--;
	}.bind(this);
	
	var build = function(){
		if(world.removableAt(this.x + buildOffsetX, this.y + buildOffsetY))
			world.removeBlock(this.x + buildOffsetX, this.y + buildOffsetY);
		else if(inventoryIndex >= 0 && inventory[inventoryIndex].amount > 0){
			world.addBlock(this.x + buildOffsetX, this.y + buildOffsetY, inventory[inventoryIndex].item);
			//inventory[inventoryIndex].amount--;
			
			if(inventory[inventoryIndex].amount == 0)
				inventory[inventoryIndex].item = null;
		}
		buildOffsetX = 0;
		buildOffsetY = 0;
		buildKeyStrokes = 0;
	}.bind(this);

	this.isGravityBound = function(){
		return !world.climbableAt(this.x, this.y) && !world.climbableAt(this.x, this.y - 1);
	}

	this.draw = function(){
		display.putc('@', 30, 24 - this.y, display.GREEN, display.BLACK);
		if(mode == BUILD)
			display.putc('+', 30 + buildOffsetX, 24 - this.y - buildOffsetY, display.DARKGRAY, display.BLACK);
		drawInfo();
	}
	
	var drawInfo = function(){
		for(var a = 0; a < 25; a++)
			display.putc(' ', 61, a, display.BLACK, display.WHITE);
		
		display.puts("Player", 63, 0, display.WHITE, display.BLACK);
		
		if(mode == JUMP)
			display.putc('J', 79, 0, display.GREEN, display.BLACK);
		else if(mode == BUILD)
			display.putc('B', 79, 0, display.RED, display.BLACK);
		
		display.puts("HP:" + health, 63, 2, display.WHITE, display.BLACK);
		
		for(var a = 0; a < 5; a++){
			var name = "Empty";
			if(inventory[a].item != null){
				name = inventory[a].item.name;	
			}
			
			if(a == inventoryIndex){
				display.puts(String(inventory[a].amount), 63, 4 + a, display.BLUE, display.BLACK);
				display.puts("|" + name, 65, 4 + a, display.BLUE, display.BLACK);
			}
			else{
				display.puts(String(inventory[a].amount), 63, 4 + a, display.WHITE, display.BLACK);
				display.puts("|" + name, 65, 4 + a, display.WHITE, display.BLACK);
			}
		}				
	}
}

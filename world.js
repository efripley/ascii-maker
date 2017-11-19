function World(){
	var size = 1024;	var map = new nvArray2D(size, 25, null);
	var floatingBlocks = [];

	this.init = function(){
  		var heightMap = initHeightMap();
		buildMap(heightMap);
		genTrees(heightMap);
  	}

  	var initHeightMap = function(){
		var heightMap = new Array();
		for(var a = 0; a < size; a++)
			heightMap[a] = -1;

		leftBeach1 = 0;
		leftBeach2 = 64;
		leftBeach3 = 128;
		mountain1 = 512;
		mountain2 = 512 + 32;
		mountain3 = 512 + 256;
		rightBeach1 = 1023 - 64;
		rightBeach2 = 1023 - 32;
		rightBeach3 = 1023;

		heightMap[leftBeach1] = 1;
		heightMap[leftBeach2] = 4;
		heightMap[leftBeach3] = 6;
		heightMap[mountain1] = 10;
		heightMap[mountain2] = 23;
		heightMap[mountain3] = 14;
		heightMap[rightBeach1] = 7;
		heightMap[rightBeach2] = 4;
		heightMap[rightBeach3] = 1;

		genHeightMap(leftBeach1, leftBeach2, heightMap);
		genHeightMap(leftBeach2, leftBeach3, heightMap);
		genHeightMap(leftBeach3, mountain1, heightMap);
		genHeightMap(mountain1, mountain2, heightMap);
		genHeightMap(mountain2, mountain3, heightMap);
		genHeightMap(mountain3, rightBeach1, heightMap);
		genHeightMap(rightBeach1, rightBeach2, heightMap);
		genHeightMap(rightBeach2, rightBeach3, heightMap);

		return heightMap;
	}

	var genHeightMap = function(argLeft, argRight, heightMap){
		var left = argLeft;
		var middle = Math.floor((argLeft + argRight) / 2);
		var right = argRight;
		var smoothness = 10;
		var distance = (argRight - argLeft) / smoothness;
		if(distance > 12)
			distance = 12;
		var modifier = 0;
		if(nvRand(2) == 0)
			modifier += nvRand(2) + 1;
		else
			modifier -= nvRand(2) + 1;

		if(heightMap[middle] == -1){
			heightMap[middle] = Math.round((heightMap[left] + heightMap[right]) / 2) + nvRand(distance) * modifier;
			if(heightMap[middle] < 1)
				heightMap[middle] = 1;
			else if(heightMap[middle] > 24)
				heightMap[middle] = 24;
		}

		if(middle - left > 1)
			genHeightMap(left, middle, heightMap);
		if(right - middle > 1)
			genHeightMap(middle, right, heightMap);
	}

  var buildMap = function(heightMap){
		console.log(heightMap.length);
		for(var ax = 0; ax < heightMap.length; ax++){
    	for(var ay = 0; ay < 25; ay++){
    		if(ay < heightMap[ax] - 2)
    			map[ax][ay] = tiles.stone;
    		else if(ay == heightMap[ax] - 1){
    			if(heightMap[ax] < 15)
    				map[ax][ay] = tiles.grass;
    			else
    				map[ax][ay] = tiles.snow;
    		}
    		else if(ay == heightMap[ax] - 2)
    			map[ax][ay] = tiles.dirt;
    		else if(ay <= 4)
    			map[ax][ay] = tiles.water;
				else
					map[ax][ay] = tiles.air;
    	}
    }
  }

	var genTrees = function(heightMap){
		for(var a = 0; a < 100; a++){
			var x = nvRand(size);
			var y = heightMap[x];
			
			if(y >= 15){
				if(map[x][y] == tiles.air)
					buildPineTree(x, y - 1);
			}
			else if(y >= 4){
				if(map[x][y] == tiles.air)
				buildMapleTree(x, y);
			}
		}
	}
	
	var buildAppleTree = function(){
	}
	
	var buildMapleTree = function(x, y){
		var height = nvRand(2) + 5;
			
		for(var b = 0; b < height; b++){
			if(y + b < 25)
				map[x][y + b] = tiles.treeTrunk;
		}
			
		if(y + height - 2 < 25){
			for(var b = -2; b <= 2; b++){
				if(x + b < size && x + b >= 0 && b != 0)
					map[x + b][y + height - 2] = tiles.treeLeaves;
			}
		}

		if(y + height - 1 < 25){
			for(var b = -3; b <= 3; b++){
				if(x + b < size && x + b >= 0 && b != 0)
					map[x + b][y + height - 1] = tiles.treeLeaves;
			}
		}

		if(y + height < 25){
			for(var b = -2; b <= 2; b++){
				if(x + b < size && x + b >= 0)
					map[x + b][y + height] = tiles.treeLeaves;
			}
		}
	}
	
	var buildPineTree = function(x, y){
		var height = 1;
		
		for(var b = 0; b < height; b++){
			if(y + b < 25)
				map[x][y + b] = tiles.treeTrunk;
		}

		if(y + height < 25){
			for(var b = -2; b <= 2; b++){
				if(x + b < size && x + b >= 0)
					map[x + b][y + height] = tiles.pineNeedles;
			}
		}

		if(y + height + 1 < 25){
			for(var b = -2; b <= 2; b++){
				if(x + b < size && x + b >= 0)
					map[x + b][y + height + 1] = tiles.pineNeedles;
			}
		}

		if(y + height + 2 < 25){
			for(var b = -1; b <= 1; b++){
				if(x + b < size && x + b >= 0)
					map[x + b][y + height + 2] = tiles.pineNeedles;
			}
		}

		if(y + height + 3 < 25){
			for(var b = -1; b <= 1; b++){
				if(x + b < size && x + b >= 0)
					map[x + b][y + height + 3] = tiles.pineNeedles;
			}
		}
		
		if(y + height + 4 < 25){
			map[x][y + height + 4] = tiles.pineNeedles;
		}

		if(y + height + 5 < 25){
			map[x][y + height + 5] = tiles.pineNeedles;
		}

		
	}
	
	this.applyGravityToObject = function(object){
		if(object.isGravityBound()){
			object.y--;
			if(this.collisionAt(object.x, object.y))
				object.y++;
		}
	}
	
	this.applyGravity = function(){
		for(var a = 0; a < floatingBlocks.length; a++){
			var x = floatingBlocks[a].x;
			var y = floatingBlocks[a].y;
			var block = new Tile();
			block =  map[x][y];
			map[x][y] = tiles.air;
			
			y--;
			if(this.supportAt(x, y)){
				y++;
				floatingBlocks.splice(a, 1);
			}
			else
			  floatingBlocks[a].y = y;

			map[x][y] = block;
		}
	}

	this.collisionAt = function(x, y){
		if(x < 0 || x >= size || y < 0 || y >= 25)
			return true;
		else
			return map[x][y].collidable;
	}

	this.removableAt = function(x, y){
		if(x < 0 || x >= size || y < 0 || y >= 25)
			return false;
		else
			return map[x][y].removable;
	}
	
	this.climbableAt = function(x, y){
		if(x < 0 || x >= size || y < 0 || y >= 25)
		  return false;
		else
		  return map[x][y].climbable;
	}
	
	this.supportAt = function(x, y){
		if(x < 0 || x >= size || y < 0 || y >= 25)
		  return false;
		else
		  return map[x][y].supports;
	}
		        

	this.addBlock = function(x, y, block){
		map[x][y] = block;

		var support = (map[x][y - 1].supports
					||(map[x - 1][y].sticks && block.sticks)
					||(map[x + 1][y].sticks && block.sticks)
					||(map[x][y + 1].sticks && block.sticks));

		if(!support)
			floatingBlocks.push({x:x, y:y});
	}

	this.removeBlock = function(x, y){
		console.log("\nREMOVED BLOCK");
		var block = map[x][y];
	    map[x][y] = tiles.air;

		y++;

		var left = -1;
		while(map[x + left][y].sticks && !map[x + left][y - 1].supports)
		  	left--;

		console.log("\tfound", left, "blocks left");

		var right = 1;
		while(map[x + right][y].sticks && !map[x + right][y - 1].supports)
		  	right++;

		console.log("\tfound", right, "blocks right");

		if(right - left + 1 > 12 || (map[x + right][y] == tiles.air && map[x + left][y] == tiles.air)){
		  	for(var a = left + 1; a < right; a++){
		    	var height = 0;
		    	while(map[x + a][y + height] != tiles.air){
		      		floatingBlocks.push({x:x + a, y:y + height});
		      		height++;
		      	}
		  	}
		}

		return block;
	}

	this.drawableAt = function(x, y){
		return (x >= 0 && x < size && map[x][y] != tiles.air);
	}

	this.getSize = function(){
		return size;
	}

	this.draw = function(x, y){
		var drawX = 0;
		var drawY = 0;

    	var left = x - 30;
    	var right = x + 30;

		for(var ay = 24; ay >= 0; ay--){
			for(var ax = left; ax <= right; ax++){
				if(this.drawableAt(ax, ay)){
					map[ax][ay].draw(drawX, drawY);
				}
        drawX++;
			}
			drawX = 0;
			drawY++;
		}

	}
}

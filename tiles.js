function Tiles(){
	
	//id, name, collidable, harvestable, climbable, supports, sticks, char, color
	this.air = new Tile(0, "Air", false, false, false, false, false, 0, display.BLACK);
	this.grass = new Tile(1, "Lush Grass", true, true, false, true, false, 176, display.GREEN);
	this.dirt = new Tile(2, "Moist Dirt", true, true, false, true, false, 176, display.DARKRED);
	this.stone = new Tile(3, "Stone", true, true, false, true, true, 176, display.LIGHTGRAY);
	this.water = new Tile(4, "Fresh Water", false, false, false, false, false, 247, display.BLUE);
	this.treeTrunk = new Tile(5, "Tree Trunk", false, true, true, true, false, 186, display.DARKRED);
	this.treeLeaves = new Tile(6, "Tree Leaves", false, true, false, false, true, '*', display.GREEN);
	this.pineNeedles = new Tile(7, "Pine Needles", false, true, false, false, true, '*', display.DARKGREEN);
	this.snow = new Tile(8, "Snow", false, true, false, false, false, 177, display.WHITE);
	this.woodSupport = new Tile(9, "Wood Support", false, true, false, true, false, 'I', display.DARKRED);
	this.stoneSupport = new Tile(10, "Stone Support", false, true, false,  true, false, 'I', display.LIGHTGRAY);
	this.woodLadder = new Tile(11, "Wood Ladder", false, true, true, true, false, 18, display.DARKRED);
}

function Tile(argId, argName, argCollidable, argRemovable, argClimbable, argSupports, argSticks, argSymbol, argColor){
  this.id = argId;
  this.name = argName;
  this.collidable = argCollidable;
  this.removable = argRemovable;
	this.climbable = argClimbable;
  this.symbol = argSymbol;
  this.color = argColor;
  this.supports = argSupports;
  this.sticks = argSticks;

  this.draw = function(x, y){
    display.putc(this.symbol, x, y, this.color, display.BLACK);
  }
}

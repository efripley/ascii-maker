function NVIn(){
  document.body.addEventListener('keydown', function(key){getKeyDown(key);});
  document.body.addEventListener('keyup', function(key){getKeyUp(key);});

  var keys = [];
	this.SINGLE = 0;
	this.MULTI = 1;
	
	this.registerEvent = function(argName, argKeyCode, argCallBackMode, argCallBack){
		keys.push({name:argName, code:argKeyCode, pressed:false, callBackMode:argCallBackMode, calledBack:false, callBack:argCallBack}); 
  }

 	var getKeyDown = function(key){
    for(var a = 0; a < keys.length; a++){
    	if(key.which == keys[a].code)
    		keys[a].pressed = true;
    }
  }

  var getKeyUp = function(key){
    for(var a = 0; a < keys.length; a++){
    	if(key.which == keys[a].code)
    		reset(keys[a]);
    }
  }
  
  var reset = function(argKey){
  	argKey.pressed = false;
  	argKey.calledBack = false;
  } 
  
  this.eval = function(){
  	for(var a = 0; a < keys.length; a++){
  		if(keys[a].pressed){
  			if(keys[a].callBackMode == this.SINGLE && !keys[a].calledBack){
  				keys[a].callBack();
  				keys[a].calledBack = true;
  			}
  			else if(keys[a].callBackMode == this.MULTI){
  				keys[a].callBack();
  				keys[a].calledBack = true;
  			}
  		}
  	}
  }
  
  this.editEventMode = function(argName, argCallBackMode){
  	for(a = 0; a < keys.length; a++){
  		if(keys[a].name == argName)
  			keys[a].callBackMode = argCallBackMode;
  	}
  }
}

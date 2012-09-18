var global, app, Users; 

exports.handleRoute = function(req,res){

	app.log.info('Login request with body '+JSON.stringify(req.body));
	
	if(req.body){
	
		var userID = req.body.userID;
		
		if(userID){
		
			Users.lookupUserAndCreate(userID, null, res); 
					
		}else{
			global.logError(res, 101, "Missing userID property"); 
		}	
	
	}else{
		global.logError(res, 101, "No data posted"); 
	}
	
}; 

exports.init = function(_global, _app, _Users){
	global = _global;
	app = _app; 
	Users = _Users;
}
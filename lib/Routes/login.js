var global, app, Users; 

var errorJSON = {
	error:{
		code:0,
		message:""
	}
};

exports.handleLogin = function(req,res){

	app.log.info('Login request with body '+JSON.stringify(req.body));
	
	if(req.body){
	
		var userID = req.body.userID;
		
		if(userID){
		
			Users.lookupUserAndCreate(userID); 
		
			res.json(200, req.body);
			
		}else{
			//Missing userID
			
			var missingIDJSON = errorJSON;
			
			missingIDJSON.error.code = 100;
			missingIDJSON.error.message = "Missing userID property"; 
				
			res.json(200, missingIDJSON);
		}	
	
	}else{
		//No data posted 
		
		var missingBodyJSON = errorJSON;
			
		missingBodyJSON.error.code = 100;
		missingBodyJSON.error.message = "No data posted"; 
			
		res.json(200, missingBodyJSON);
		
	}
	
}; 

exports.init = function(_global, _app, _Users){
	global = _global;
	app = _app; 
	Users = _Users;
}
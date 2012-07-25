var global, app, Users; 

var errorJSON = {
	error:{
		code:0,
		message:""
	}
};

exports.handleAddFriend = function(userID,req,res){

	app.log.info('Add Friend request for user '+userID+' with body '+JSON.stringify(req.body));
	
	if(req.body && userID){
	
		var friendID = req.body.friendID;
		
		if(friendID){
		
			Users.find({where: {userID: userID}}).success(function(user){	
				if(user){
					user.addFriendRecord(friendID);
					res.json(200, req.body);	
				}else{
					var noUserJSON = errorJSON;
					noUserJSON.error.code = 100;
					noUserJSON.error.message = "No user found for id "+userID; 
					res.json(200, noUserJSON);	
				}	
			});
										
		}else{
			//Missing friendID
			
			var missingIDJSON = errorJSON;
			
			missingIDJSON.error.code = 100;
			missingIDJSON.error.message = "Missing friendID property"; 
				
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

exports.init = function(_global,_app, _Users){
	global = _global; 
	app = _app; 
	Users = _Users;
}
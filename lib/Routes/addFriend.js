var global, app, Users; 

exports.handleRoute = function(userID,req,res){

	app.log.info('Add Friend request for user '+userID+' with body '+JSON.stringify(req.body));
	
	if(req.body && userID){
	
		var friendID = req.body.friendID;
		
		if(friendID){
		
			Users.find({where: {userID: userID}}).success(function(user){	
				if(user){
					user.addFriendRecord(friendID,null,res);
				}else{
					global.logError(res, 103, "No user found for id "+userID); 
				}	
			});
										
		}else{
			//Missing friendID
			global.logError(res, 101, "Missing friendID property"); 
		}	
	
	}else{
		//No data posted 
		global.logError(res, 101, "No data posted"); 
		
	}
	
}; 

exports.init = function(_global,_app, _Users){
	global = _global; 
	app = _app; 
	Users = _Users;
}
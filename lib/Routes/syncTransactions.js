var global, app, Users; 

exports.handleRoute = function(userID, req,res){

	app.log.info('Sync request for user '+userID+' with body '+JSON.stringify(req.body));
	
	if(req.body && userID){
	
		var lastTransaction = req.body.lastTransaction;
		
		if(lastTransaction){
			
				var transactionDate = new Date(parseInt(lastTransaction));	
				
				if(global.isValidDate(transactionDate)){
					
					Users.find({where: {userID: userID}}).success(function(user){	
						if(user){
							user.getTransactionsAfterDate(transactionDate, res);
						}else{
							global.logError(res, 103, "No user found for id "+userID); 
						}	
					});
						
				}else{
					global.logError(res,102, "Invalid last transaction date"); 
				}
				
		}else{
			global.logError(res, 101, "Missing last transaction property"); 
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
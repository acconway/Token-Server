/*
var transactionSchema = {
		senderID:Sequelize.INTEGER,
		recipientID: Sequelize.INTEGER,
		tokenValue: Sequelize.INTEGER,
		actionName: Sequelize.TEXT,
		comment: Sequelize.TEXT, 
		Time: Sequelize.DATE
	}; 
*/

var global, app, Users, Transactions; 


var validateBody = function(body){

	if(body.senderID && body.recipientID && body.tokenValue && body.actionName /*&& Time*/){
		return true
	}else{
		return false; 
	}

};

var lookupUserForSenderID = function(senderID){

	Users.find({where: {userID: senderID}}).success(function(user){	
		if(user){
		
		}else{
			app.logError(res, 100, "No user found for sender id "+senderID); 
		}	
	});
	
};

exports.handleAddTransaction = function(req,res){

	app.log.info('Add Transaction request with body '+JSON.stringify(req.body));
	
	if(req.body && validateBody(req.body)){
		
		Transactions.createRecord(req.body, res); 
		
	}else{
		//No or incomplete data posted 
		app.logError(res, 100, req.body?"Incomplete data posted":"No data posted"); 
	}
	
}; 

exports.init = function(_global,_app, _Users, _Transactions){
	global = _global; 
	app = _app; 
	Users = _Users;
	Transactions = _Transactions; 
};
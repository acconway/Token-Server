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

//Functions
var bodyIsComplete, addTransactionToSender;


bodyIsComplete = function(body){

	if(body.recipientID && body.tokenValue && body.actionName&& body.time){
		return true
	}else{
		return false; 
	}

};

addTransactionToSender = function(transaction, res){

	var senderID = transaction.senderID;

	Users.find({where: {userID: senderID}}).success(function(user){	
		if(user){
			user.checkBalance(transaction,res);
		}else{
			global.logError(res, 103, "No user found for senderID "+senderID); 
		}
	});
	
};

exports.handleRoute = function(userID, req,res){

	app.log.info('Add Transaction request for user '+ userID + ' with body '+JSON.stringify(req.body));
	
	if(req.body && userID && bodyIsComplete(req.body)){
	
		req.body.senderID = userID; 
		
		Transactions.createRecord(req.body, res, addTransactionToSender); 
		
	}else{
		global.logError(res, 101, req.body?"Incomplete data posted":"No data posted"); 
	}
	
}; 

exports.init = function(_global,_app, _Users, _Transactions){
	global = _global; 
	app = _app; 
	Users = _Users;
	Transactions = _Transactions; 
};
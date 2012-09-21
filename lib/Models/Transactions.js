/*
Sequelize Quick Reference 

Sequelize.STRING  ===> VARCHAR(255)
Sequelize.TEXT    ===> TEXT
Sequelize.INTEGER ===> INTEGER
Sequelize.DATE    ===> DATETIME
Sequelize.BOOLEAN ===> TINYINT(1)
Sequelize.FLOAT   ===> FLOAT
*/ 

var app, global, database, Sequelize, sequelize; 

var Transactions;

/*
HELPER METHODS
*/

var validateTransaction;

/*
after transaction created, validate and save transaction
*/

validateTransaction = function(transaction,res,callback){
			
	var validationResult = transaction.validate(); 		
			
	if(validationResult){
			
		global.logError(res, 102, "Invalid data posted"); 
		app.log.info(validationResult);	

	}else{
	  transaction.save().success(function(){
			app.log.info('Successfully created transaction');	
			callback(transaction,res); 
		}).error(function(error){
			global.logError(res, 301,'Failed to create transaction, error: '+error);
		});
	}
	
};

/*
CLASS METHODS
*/ 
var  createRecord;

createRecord = function(body,res,callback){

	app.log.info('Creating transaction with sender '+body.senderID+' and recipient '+body.recipientID+" and time "+body.time);
	
	var transaction = Transactions.build({
		senderID:body.senderID,
		recipientID:body.recipientID,
		tokenValue:body.tokenValue,
		actionName:body.actionName,
		time:new Date(parseInt(body.time))
	}); 
	
	validateTransaction(transaction, res, callback); 	
};	


var classMethods = {
	createRecord:createRecord,
};

/*
INSTANCE METHODS
*/

var prepareAsResponse;

prepareAsResponse = function(){

	var transaction = this; 
	
	var preparedTransaction = {
		senderID: transaction.senderID,
		recipientID:transaction.recipientID,
		tokenValue:transaction.tokenValue,
		actionName:transaction.actionName, 
		comment: transaction.comment,
		time: transaction.time.getTime() 
	};
	
	return preparedTransaction;

};

var instanceMethods = {
	prepareAsResponse: prepareAsResponse
};

/*
INITIALIZATION FUNCTIONS
*/

var createDatabase = function(){

	var transactionSchema = {
		senderID:{
			type:Sequelize.INTEGER,
			validate:{
			isNumeric:true
			}
		},
		recipientID:{
			type:Sequelize.INTEGER,
			validate:{
			isNumeric:true
			}
		},
		tokenValue: {
			type:Sequelize.INTEGER,
			validate:{
			isNumeric:true
			}
		},
		actionName: Sequelize.TEXT,
		comment: Sequelize.TEXT, 
		time: {
			type:Sequelize.DATE,
			defaultValue: Sequelize.NOW, 
			validate:{
				isDate:true
			}
		}
	}; 
	
	Transactions = sequelize.define('Transactions',transactionSchema,{classMethods:classMethods,instanceMethods:instanceMethods});	
	
	database.setTransactions(Transactions);
	
};

exports.initialize = function(_global,_app,_database,_Sequelize,_sequelize){
	
	global = _global; 
	app = _app;
	database = _database;
	Sequelize = _Sequelize; 
	sequelize = _sequelize; 
	
	createDatabase(); 	

}; 
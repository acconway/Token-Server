/*
Sequelize Quick Reference 

Sequelize.STRING  ===> VARCHAR(255)
Sequelize.TEXT    ===> TEXT
Sequelize.INTEGER ===> INTEGER
Sequelize.DATE    ===> DATETIME
Sequelize.BOOLEAN ===> TINYINT(1)
Sequelize.FLOAT   ===> FLOAT
*/ 

var app, Global, Sequelize, sequelize; 

var Transactions;

/*
CLASS METHODS
*/ 
var  createRecord;



/*
after transaction created, validate and save transaction
*/

var validateTransaction = function(transaction,res){
			
	var validationResult = transaction.validate(); 		
			
	if(validationResult){
	
		logError(res, 100, "Invalid data posted"); 
		
	}else{
	  transaction.save().success(function(){
			app.log.info('Successfully created transaction');	
		}).error(function(error){
			app.log.info('Failed to create transaction');
		});
	}
	
};

createRecord = function(body,callback, res){

	app.log.info('Creating transaction with sender '+body.senderID+' and recipient '+body.recipientID);
	
	var transaction = Transactions.build({
		senderID:body.senderID,
		recipientID:body.recipientID,
		tokenValue:body.tokenValue,
		actionName:body.actionName
	}); 
	
	validateTransaction(transaction, res); 	
};	

var classMethods = {
	createRecord:createRecord
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
		Time: {
			type:Sequelize.DATE,
			validate:{
			//isDate:true
			}
		}
	}; 
	
	Transactions = sequelize.define('Transactions',transactionSchema,{classMethods:classMethods});	
	
	Transactions.sync().success(function(){
		console.log('Creating Transactions database success');
		Global.setTransactions(Transactions);
	}).error(function(error){
		console.log('Creating Transactions database error: '+error);
	}); 
	
};

exports.initialize = function(_app,_Global,_Sequelize,_sequelize){

	app = _app;
	Global = _Global; 
	Sequelize = _Sequelize; 
	sequelize = _sequelize; 
	
	createDatabase(); 	

}; 
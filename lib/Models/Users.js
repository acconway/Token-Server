/*
Sequelize Quick Reference 

Sequelize.STRING  ===> VARCHAR(255)
Sequelize.TEXT    ===> TEXT
Sequelize.INTEGER ===> INTEGER
Sequelize.DATE    ===> DATETIME
Sequelize.BOOLEAN ===> TINYINT(1)
Sequelize.FLOAT   ===> FLOAT
*/

var _ = require("./../../extLib/underscore"); 

var app, Global, Sequelize, sequelize; 

var Users; 

/*
CLASS METHODS
*/ 
var  createRecord, lookupUser; 

createRecord = function(userID,addFriendCallback){

	app.log.info('Creating record for user '+userID);
	
	var user = Users.build({
		userID:userID
	}); 
	
	user.save().success(function(){
		app.log.info('Successfully created record for user '+userID);
		if(addFriendCallback){
			addFriendCallback(user); 
		}			
	}).error(function(error){
		app.log.info('Failed to create record for user '+userID);
	});
	
};	

lookupUserAndCreate = function(userID,addFriendCallback){

	Users.find({where:{userID:userID}}).success(function(user){
		if(user){	
			app.log.info("Record Found: "+JSON.stringify(user.values));	
			if(addFriendCallback){
				addFriendCallback(user); 
			}
		}else{
			app.log.info("No record found for user "+userID); 	
			createRecord(userID,callback);			
		}
	}); 
};

var classMethods = {
	createRecord:createRecord,
	lookupUserAndCreate: lookupUserAndCreate
};

/*
INSTANCE METHODS
*/ 

var lookupFriend, addFriendRecord, addTransaction; 


lookupFriend = function(friendID){

	var user = this; 

	var addFriendAssociation = function(friend){
		user.addFriend(friend).success(function(){
			app.log.info("Added friend "+friend.userID+" to user "+user.userID); 			
		});  
	};
	
	Users.lookupUserAndCreate(friendID,addFriendAssociation); 

};

addFriendRecord = function(friendID){

	var user = this; 
	
	this.getFriends().success(function(friends){
		
		var hasFriend = _.find(friends,function(friend){
			return friend.userID == friendID; 
		}); 
		
		if(hasFriend){
			app.log.info("User "+user.userID+" already has friend "+friendID); 
		}else{
			app.log.info("User "+user.userID+" does not have friend "+friendID);
			user.lookupFriend(friendID);  
		}
			
	}); 

};

var instanceMethods = {
	lookupFriend: lookupFriend,
	addFriendRecord: addFriendRecord,
	addTranscation: addTransaction
}; 

/*
INITIALIZATION FUNCTIONS
*/

var createDatabase = function(){

	var userSchema = {
		userID:Sequelize.INTEGER,
		registrationPlatform:Sequelize.TEXT,
		lastTransactionTime: Sequelize.DATE 
	}; 
	
	Users = sequelize.define('Users',userSchema,{
			classMethods:classMethods,
			instanceMethods: instanceMethods
	});	
	
	Users.sync().success(function(){
		console.log('Creating Users database success');
		Global.setUsers(Users);
	}).error(function(error){
		console.log('Creating Users database error: '+error);
	}); 
	
};

exports.initialize = function(_app,_Global,_Sequelize,_sequelize){

	app = _app;
	Global = _Global; 
	Sequelize = _Sequelize; 
	sequelize = _sequelize; 
	
	createDatabase(); 

}; 
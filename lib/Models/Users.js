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

var app, global, database, Sequelize, sequelize;

var Users;

/*
 CLASS METHODS
 */
var createRecord, lookupUser;

createRecord = function(userID, addFriendCallback, res) {

	app.log.info('Creating record for user ' + userID);

	var user = Users.build({
		userID : userID
	});

	var validationResult = user.validate();

	if (validationResult) {

		global.logError(res, 102, "Invalid data posted");
		app.log.info(validationResult);

	} else {

		user.save().success(function() {
			app.log.info('Successfully created record for user ' + userID);
			if (addFriendCallback) {
				addFriendCallback(user);
			} else {
				global.logSuccess(res, "Login Successful");
			}

		}).error(function(error) {
			global.logError(res, 301, 'Failed to create record for user ' + userID + ':' + error);
		});

	}

};

lookupUserAndCreate = function(userID, addFriendCallback, res) {

	Users.find({
		where : {
			userID : userID
		}
	}).success(function(user) {
		if (user) {
			app.log.info("Record Found: " + JSON.stringify(user.values));
			if (addFriendCallback) {
				addFriendCallback(user);
			} else {
				global.logSuccess(res, "Login Successful");
			}
		} else {
			app.log.info("No record found for user " + userID);
			createRecord(userID, addFriendCallback, res);
		}
	});
};

var classMethods = {
	createRecord : createRecord,
	lookupUserAndCreate : lookupUserAndCreate
};

/*
 INSTANCE METHODS
 */

var lookupFriend, addFriendRecord, addTransactionToUser, getTransactionsAfterDate, getDataObjectToSend, checkBalance;

lookupFriend = function(friendID, transaction, res) {

	var user = this;

	var addFriendAssociation = function(friend) {
		user.addFriend(friend).success(function() {
			app.log.info("Added friend " + friend.userID + " to user " + user.userID);
			if (transaction) {
				friend.addTransactionToUser(transaction, res);
			} else {
				global.logSuccess(res, "Added friend " + friend.userID + " to user " + user.userID);
			}
		}).error(function(error) {
			global.logError(res, 302, "Failed to add friend " + friend.userID + " to user " + user.userID + " " + error);
		});
	};

	Users.lookupUserAndCreate(friendID, addFriendAssociation);

};

addFriendRecord = function(friendID, transaction, res) {

	var user = this;

	this.getFriends().success(function(friends) {

		var friend = _.find(friends, function(friend) {
			return friend.userID == friendID;
		});

		if (friend) {
			app.log.info("User " + user.userID + " already has friend " + friendID);
			if (transaction) {
				friend.addTransactionToUser(transaction, res);
			}
		} else {
			app.log.info("User " + user.userID + " does not have friend " + friendID);
			user.lookupFriend(friendID, transaction, res);
		}

	});

};

checkBalance = function(transaction, res) {

	var user = this;

	var isSender = this.userID == transaction.senderID;
	var friendID = isSender ? transaction.recipientID : transaction.senderID;

	var myBalance = 5;

	user.getTransactions().success(function(transactions) {

		user.addTransactionToUser(transaction, res, true);

		/*_.each(transactions, function(transaction) {
		 if(transaction.senderID == friendID){
		 myBalance += transaction.tokenValue;
		 }else if(transaction.recipientID == friendID){
		 myBalance -= transaction.tokenValue;
		 }
		 });

		 var legalTransaction = transaction.tokenValue<=myBalance;

		 app.log.info("Balance with user " + friendID + " is " + myBalance+" Adding transaction for "+transaction.tokenValue+" is legal "+legalTransaction);

		 if(!legalTransaction){
		 transaction.destroy();
		 global.logError(res, 101, "Illegal transaction");
		 }else{		user.addTransactionToUser(transaction,res,true);
		 }
		 */

	}).error(function(error) {
		global.logError(res, 301, "Error looking up transactions for user " + user.userID);
	});

};

addTransactionToUser = function(transaction, res, isFirstUser) {

	var user = this;

	var isSender = this.userID == transaction.senderID;
	var userType = isSender ? "sender" : "recipient";

	user.addTransaction(transaction).success(function() {
		app.log.info("Added transaction to " + userType + ": " + user.userID);

		user.updateAttributes({
			lastTransactionTime : transaction.time
		}).success(function() {

			app.log.info("Updated last transaction time for " + userType + ": " + user.userID);

			if (isFirstUser) {
				user.addFriendRecord(transaction.recipientID, transaction, res);
			} else {
				global.logSuccess(res, "Successfully added transaction to sender: " + transaction.senderID + " and recipient: " + transaction.recipientID);
			}

		}).error(function(error) {

			global.logError(res, 302, "Failed to update last transaction time for " + userType + ": " + user.userID + " error: " + error);

		});

	}).error(function(error) {
		global.logError(res, 302, "Failed adding transaction to " + userType + ": " + user.userID + " " + error);
	});

};

getTransactionsAfterDate = function(date, res) {

	var user = this;

	var dataToReturn = {
		newTransactions : []
	};

	var lastRemoteTransaction = date.getTime();
	var lastLocalTransaction = user.lastTransactionTime.getTime();

	dataToReturn.lastTransactionTime = lastLocalTransaction;

	if (lastRemoteTransaction == lastLocalTransaction) {
		global.logSuccess(res, "User is up to to date with transactions", dataToReturn);
	} else if (lastRemoteTransaction < lastLocalTransaction) {
		user.getTransactions().success(function(transactions) {

			_.each(transactions, function(transaction) {
				if (date.getTime() < transaction.time.getTime()) {
					dataToReturn.newTransactions.push(transaction.prepareAsResponse());
				}
			});

			global.logSuccess(res, "Server has New Transactions", dataToReturn);

		}).error(function(error) {
			global.logError(res, 301, "Error looking up transactions for user " + user.userID);
		});
	} else {
		global.logSuccess(res, "User has Outstanding Transactions", dataToReturn);
	}

};

var instanceMethods = {
	lookupFriend : lookupFriend,
	addFriendRecord : addFriendRecord,
	addTransactionToUser : addTransactionToUser,
	getTransactionsAfterDate : getTransactionsAfterDate,
	checkBalance : checkBalance,
	getDataObjectToSend : getDataObjectToSend
};

/*
 INITIALIZATION FUNCTIONS
 */

var createDatabase = function() {

	var userSchema = {
		userID : {
			type : Sequelize.TEXT
		},
		name : Sequelize.TEXT,
		registrationPlatform : Sequelize.TEXT,
		lastTransactionTime : Sequelize.DATE
	};

	Users = sequelize.define('Users', userSchema, {
		classMethods : classMethods,
		instanceMethods : instanceMethods
	});

	database.setUsers(Users);

};

exports.initialize = function(_global, _app, _database, _Sequelize, _sequelize) {

	global = _global;
	app = _app;
	database = _database;
	Sequelize = _Sequelize;
	sequelize = _sequelize;

	createDatabase();

};
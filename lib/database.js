//Global vars 

var app,Global; 

//Sequelize references 

var Sequelize = require('sequelize');

var sequelize; 

//Modules

var UsersModule = require("./Models/Users"); 
var TransactionsModule = require("./Models/Transactions"); 

//Databases

var Users, Transactions; 

var setupModelAssociations = function(){

	Users.hasMany(Transactions); 
	Transactions.hasOne(Users, {as:'Sender'});
	Transactions.hasOne(Users, {as:'Recipient'});

	Users.hasMany(Users,{as:'Friends'})

};

var start = function(){

	setupModelAssociations();
	Global.setUsersAndTransactions(Users,Transactions);
		
};

exports.setUsers = function(_Users){

	Users = _Users;
	
	if(Transactions){
		start();
	}

};

exports.setTransactions = function(_Transactions){

	Transactions = _Transactions; 
	
	if(Users){
		start();
	}

}; 

exports.init = function(_app,_Global){

	app = _app; 
	Global = _Global; 
	sequelize = new Sequelize('Token','root','sashi1103'); 
	
	UsersModule.initialize(app,this,Sequelize,sequelize); 
	TransactionsModule.initialize(app,this,Sequelize,sequelize); 
	
};
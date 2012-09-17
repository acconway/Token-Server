//Global vars 

var app,global; 

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
	Transactions.hasMany(Users);

	Users.hasMany(Users,{as:'Friends'})
	
	sequelize.sync(); 

};

var start = function(){

	setupModelAssociations();
	global.setUsersAndTransactions(Users,Transactions);
		
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

exports.init = function(_global,_app){

	global = _global; 
	app = _app; 
	
    sequelize = new Sequelize('Token','root','sashi1103',
    {host:"mysql://bcd332a2530fda:6ce4fa95@us-cdbr-east-02.cleardb.com/heroku_4e905998d45c31b?reconnect=true"});
	
	sequelize.drop().error(function(error){
		app.log.info(error); 
	});
	
	UsersModule.initialize(global,app, this, Sequelize,sequelize); 
	TransactionsModule.initialize(global,app, this, Sequelize,sequelize); 
	
};
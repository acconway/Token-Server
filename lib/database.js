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
	
   //local
  /*	sequelize = new Sequelize('token','alexanderconway',null,{
 	port: 5432,
 		dialect: 'postgres' 
  	});*/
 	
 	//heroku
 	sequelize = new Sequelize('dc3b01mvnnjm6j','sexpedtxpjczkf','URhJu1qgPfI4EYQunAMSkh1GQx',{
 	    host:'ec2-107-22-170-37.compute-1.amazonaws.com',
 	    protocol: "postgres",
        port: 5432,
        dialect: 'postgres' 
    });
    
	//Drop Databases for testing 
	//sequelize.drop().error(function(error){
	//	console.log(error); 
	//});
	
	UsersModule.initialize(global,app, this, Sequelize,sequelize); 
	TransactionsModule.initialize(global,app, this, Sequelize,sequelize); 
	
};
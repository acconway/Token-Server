//Flatiron/node modules
var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app; 
        
//App modules    
var login = require('./lib/Routes/login'),
	addFriend = require('./lib/Routes/addFriend'),
	addTransaction = require('./lib/Routes/addTransaction'), 
	database = require('./lib/database'); 
	
//Models

var Users, Transactions; 
	
//Global Functions	
exports.logError = function(res, code, message){
	app.log.info(message);	
	var errorJSON = {
		error:{
			code:code,
			message:message
		}
	};
	res.json(200, errorJSON);	
};

//Config

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http);

//routing

app.router.post('/Login', function () {
	login.handleLogin(this.req, this.res);
});

app.router.post('/addTransaction',function(){
	addTransaction.handleAddTransaction(this.req,this.res);
}); 

app.router.post('/User/:userID/addFriend', function(userID){
	addFriend.handleAddFriend(userID,this.req,this.res);
}); 

//After models are initialized, setup routing pathways 

exports.setUsersAndTransactions = function(_Users,_Transactions){

	Users = _Users;
	Transactions = _Transactions; 
		
	login.init(this,app,Users); 
	addFriend.init(this,app,Users); 
	addTransaction.init(this,app,Users,Transactions); 
	
}

//Get going

database.init(app,this); 

app.start(8080, function (err) {
	  if (err) {
		// This would be a server initialization error. If we have one of these,
		// the server is probably not going to work.
		throw err;
	  }
	
	  // Log the listening address/port of the app.
	  var addr = app.server.address();
	  app.log.info('Listening on http://' + addr.address + ':' + addr.port);
});
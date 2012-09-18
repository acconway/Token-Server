//Flatiron/node modules
var flatiron = require('flatiron'), path = require('path'), app = flatiron.app;

//App modules
var login = require('./lib/Routes/login'), addFriend = require('./lib/Routes/addFriend'), addTransaction = require('./lib/Routes/addTransaction'), syncTransactions = require('./lib/Routes/syncTransactions'), database = require('./lib/database');

//Models

var Users, Transactions;

//Global Functions

exports.logError = function(res, code, message) {
	app.log.info(message);
	var errorJSON = {
		error : {
			code : code,
			message : message
		}
	};
	res.json(200, errorJSON);
};

exports.logSuccess = function(res, message, data) {
	app.log.info(message);
	var successJSON = {
		message : message,
		data : data
	};
	res.json(200, successJSON);
};

exports.isValidDate = function(d) {
	app.log.info("Recieved date " + d.getTime());
	if (Object.prototype.toString.call(d) !== "[object Date]")
		return false;
	return !isNaN(d.getTime());
};


app.use(flatiron.plugins.http);

//Routing

app.router.post('/login', function() {
	login.handleRoute(this.req, this.res);
});

app.router.post('/user/:userID:/addTransaction', function(userID) {
	addTransaction.handleRoute(userID, this.req, this.res);
});

app.router.post('/user/:userID/syncTransactions', function(userID) {
	syncTransactions.handleRoute(userID, this.req, this.res);
});

app.router.post('/user/:userID/addFriend', function(userID) {
	addFriend.handleRoute(userID, this.req, this.res);
});

//After models are initialized, setup routing pathways

exports.setUsersAndTransactions = function(_Users, _Transactions) {

	Users = _Users;
	Transactions = _Transactions;

	login.init(this, app, Users);
	addFriend.init(this, app, Users);
	addTransaction.init(this, app, Users, Transactions);
	syncTransactions.init(this, app, Users);

};

//Get going

database.init(this, app);

var port = process.env.PORT || 5000;

app.start(port, function(err) {
	if (err) {
		// This would be a server initialization error. If we have one of these,
		// the server is probably not going to work.
		throw err;
	}

	// Log the listening address/port of the app.
	var addr = app.server.address();
	app.log.info('Listening on http://' + addr.address + ':' + addr.port);
});

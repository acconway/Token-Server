var global, app, Users;

var _ = require("./../../extLib/underscore"); 

exports.handleRoute = function(userID, req, res) {

	app.log.info('Get Friends request for user ' + userID);

	if (userID) {

		Users.find({
			where : {
				userID : userID
			}
		}).success(function(user) {

			user.getFriends().success(function(friends) {

				var dataToReturn = [];

				_.each(friends, function(friend) {
					dataToReturn.push({
						name : friend.name,
						userID : friend.userID
					});
				});

				global.logSuccess(res, "Friends", dataToReturn);
			});

		});

	}
};

exports.init = function(_global, _app, _Users) {
	global = _global;
	app = _app;
	Users = _Users;
}
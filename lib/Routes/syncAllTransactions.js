var global, app, Transactions;

var _ = require("./../../extLib/underscore");

exports.handleRoute = function(req, res) {

	app.log.info('Sync request with body ' + JSON.stringify(req.body));

	if (req.body) {

		var lastTransaction = req.body.lastTransaction;

		if (lastTransaction) {

			var dataToReturn = {
				newTransactions : []
			};

			var transactionDate = new Date(parseInt(lastTransaction));

			if (global.isValidDate(transactionDate)) {

				Transactions.all().success(function(transactions) {
					_.each(transactions, function(transaction) {
						app.log.info(transaction.time.getTime()); 
						if (transactionDate.getTime() < transaction.time.getTime()) {
							dataToReturn.newTransactions.push(transaction.prepareAsResponse());
						}
					});
					global.logSuccess(res, "Server has New Transactions", dataToReturn);
				});


			} else {
				global.logError(res, 102, "Invalid last transaction date");
			}

		} else {
			global.logError(res, 101, "Missing last transaction property");
		}

	} else {
		global.logError(res, 101, "No data posted");
	}

};

exports.init = function(_global, _app, _Transactions) {
	global = _global;
	app = _app;
	Transactions = _Transactions;
}
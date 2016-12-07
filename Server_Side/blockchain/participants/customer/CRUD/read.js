/*eslint-env node */

var tracing = require(__dirname+'/../../../../tools/traces/trace.js');
var reload = require('require-reload')(require),
	participants = reload(__dirname+'/../../participants_info.js');

var read = function(req, res)
{
	participants = reload(__dirname+'/../../participants_info.js');
	tracing.create('ENTER', 'GET blockchain/participants/customer', {});
	
	if(!participants.participants_info.hasOwnProperty('customers'))
	{
		res.status(404)
		var error = {}
		error.message = 'Unable to retrieve scrap customer';
		error.error = true;
		tracing.create('ERROR', 'GET blockchain/participants/customer', error);
		res.send(error)
	} 
	else
	{
		tracing.create('EXIT', 'GET blockchain/participants/customer', {"result":participants.participants_info.customers});
		res.send({"result":participants.participants_info.customers})
	}
}
exports.read = read;
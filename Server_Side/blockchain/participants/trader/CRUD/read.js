/*eslint-env node */

var tracing = require(__dirname+'/../../../../tools/traces/trace.js');
var reload = require('require-reload')(require),
    participants = reload(__dirname+'/../../participants_info.js');

var read = function(req, res)
{
	participants = reload(__dirname+'/../../participants_info.js');
	tracing.create('ENTER', 'GET blockchain/participants/trader', {});
	
	if(!participants.participants_info.hasOwnProperty('traders'))
	{
		res.status(404)
		var error = {}
		error.message = 'Unable to retrieve traders';
		error.error = true;
		tracing.create('ERROR', 'GET blockchain/participants/trader', error);
		res.send(error)
	} 
	else
	{
		tracing.create('EXIT', 'GET blockchain/participants/trader', {"result":participants.participants_info.traders});
		res.send({"result":participants.participants_info.traders})
	}
}
exports.read = read;
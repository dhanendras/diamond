/*eslint-env node*/

var tracing = require(__dirname+'/../../../../tools/traces/trace.js');
var reload = require('require-reload')(require),
	participants = reload(__dirname+'/../../participants_info.js');

var read = function(req, res)
{
	participants = reload(__dirname+'/../../participants_info.js');
	
	tracing.create('ENTER', 'GET blockchain/participants/distributor', {});

	if(!participants.participants_info.hasOwnProperty('distributors'))
	{
		res.status(404)
		var error = {}
		error.message = 'Unable to retrieve distributors';
		error.error = true;
		tracing.create('ERROR', 'GET blockchain/participants/distributor', error);
		res.send(error)
	} 
	else
	{
		tracing.create('EXIT', 'GET blockchain/participants/distributor', {"result":participants.participants_info.distributors});
		res.send({"result":participants.participants_info.distributors})
	}

}
exports.read = read;
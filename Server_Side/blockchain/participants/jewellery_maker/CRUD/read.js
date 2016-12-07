/*eslint-env node */

var tracing = require(__dirname+'/../../../../tools/traces/trace.js');
var reload = require('require-reload')(require),
	participants = reload(__dirname+'/../../participants_info.js');

var read = function(req, res)
{
	participants = reload(__dirname+'/../../participants_info.js');
	tracing.create('ENTER', 'GET blockchain/participants/jewellery_maker', {});
	
	if(!participants.participants_info.hasOwnProperty('jewellery_makers'))
	{
		res.status(404)
		var error = {}
		error.message = 'Unable to retrieve jewellery_makers';
		error.error = true;
		tracing.create('ERROR', 'GET blockchain/participants/jewellery_maker', error);
		res.send(error)
	} 
	else
	{
		tracing.create('EXIT', 'GET blockchain/participants/jewellery_maker', {"result":participants.participants_info.jewellery_makers});
		res.send({"result":participants.participants_info.jewellery_makers})
	}
}
exports.read = read;
/*eslint-env node */
var request = require('request');
var reload = require('require-reload')(require),
    configFile = reload(__dirname+'/../../../../../../configurations/configuration.js');
var tracing = require(__dirname+'/../../../../../../tools/traces/trace.js');
var map_ID = require(__dirname+'/../../../../../../tools/map_ID/map_ID.js');

var user_id;

var read = function (req,res)
{	
	var assetID = req.params.assetID;
	
	tracing.create('ENTER', 'GET blockchain/assets1/assets/asset/'+assetID+'/colour', {});
	configFile = reload(__dirname+'/../../../../../../configurations/configuration.js');
	
	if(typeof req.cookies.user != "undefined")
	{
		req.session.user = req.cookies.user;
		req.session.identity = map_ID.user_to_id(req.cookies.user);
	}
	
	user_id = req.session.identity;

	var querySpec =					{
										"jsonrpc": "2.0",
										"method": "query",
										"params": {
										    "type": 1,
											"chaincodeID": {
												"name": configFile.config.asset_name
											},
											"ctorMsg": {
											  "function": "get_asset_details",
											  "args": [
											  		assetID
											  ]
											},
											"secureContext": user_id
										},
										"id": 123
									};
									


	var options = 	{
					url: configFile.config.api_ip+':'+configFile.config.api_port_external+'/chaincode',
					method: "POST", 
					body: querySpec,
					json: true
				}
	
	request(options, function(error, response, body)
	{
		
		if (!error && !body.hasOwnProperty("error") && response.statusCode == 200)
		{
			var result = {}
			var asset = JSON.parse(body.result.message);
			result.message = asset.colour;
			tracing.create('EXIT', 'GET blockchain/assets1/assets/asset/'+assetID+'/colour ', result);
			res.send(result)
		}
		else 
		{
			res.status(400)
			var error = {}
			error.message = 'Unable to read colour'
			error.assetID = assetID;
			error.error = true;
			tracing.create('ERROR', 'GET blockchain/assets1/assets/asset/'+assetID+'/colour', error)
			res.send(error)
		}
	});
}

exports.read = read;

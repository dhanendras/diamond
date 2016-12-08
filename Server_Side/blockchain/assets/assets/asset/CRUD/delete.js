var request = require('request');
var reload = require('require-reload')(require),
    configFile = reload(__dirname+'/../../../../../configurations/configuration.js');
var tracing = require(__dirname+'/../../../../../tools/traces/trace.js');
var map_ID = require(__dirname+'/../../../../../tools/map_ID/map_ID.js');

var user_id;

var update = function(req, res)
{

	if(typeof req.cookies.user != "undefined")
	{
		req.session.user = req.cookies.user;
		req.session.identity = map_ID.user_to_id(req.cookies.user);
	}		

	user_id = req.session.identity

	var assetID = req.params.assetID;

	tracing.create('ENTER', 'DELETE blockchain/assets1/assets/asset/'+assetID+'/scrap', {});
	configFile = reload(__dirname+'/../../../../../configurations/configuration.js');	
	
	res.write('{"message":"Formatting request"}&&');
	
	var invokeSpec = {
						  "jsonrpc": "2.0",
						  "method": "invoke",
						  "params": {
						    "type": 1,
						    "chaincodeID": {
						      "name": configFile.config.asset_name
						    },
						    "ctorMsg": {
						      "function": "scrap_asset",
						      "args": [
						        assetID
						      ]
						    },
						    "secureContext": user_id
						  },
						  "id": 123
						}
	
	var options = 	{
						url: configFile.config.api_ip+':'+configFile.config.api_port_external+'/chaincode',
						method: "POST", 
						body: invokeSpec,
						json: true
					}
	
	tracing.create('INFO', 'DELETE blockchain/assets1/assets/asset/'+assetID+'/scrap', 'Updating scrap value');
	res.write('{"message":"Updating scrap value"}&&');
	request(options, function(error, response, body)
	{
		if (!error && !body.hasOwnProperty("error") && response.statusCode == 200)
		{
			var j = request.jar();
			var str = "user="+req.session.user
			var cookie = request.cookie(str);
			var url = configFile.config.app_url + '/blockchain/assets1/assets/'+assetID+'/scrap';
			j.setCookie(cookie, url);
			var options = {
				url: url,
				method: 'GET',
				jar: j
			}
			
			tracing.create('INFO', 'DELETE blockchain/assets1/assets/asset/'+assetID+'/scrap', 'Achieving consensus');
			res.write('{"message":"Achieving consensus"}&&');
			
			var counter = 0;
			var interval = setInterval(function(){
				if(counter < 5){
					request(options, function (error, response, body) {
						if (!error && response.statusCode == 200) {
							if(JSON.parse(body).message)
							{
								var result = {};
								result.message = 'Scrap updated'
								tracing.create('EXIT', 'DELETE blockchain/assets1/assets/asset/'+v5cID+'/scrap', result);
								res.end(JSON.stringify(result))
								clearInterval(interval);
							}
						}
					})
					counter++;
				}
				else 
				{
					res.status(400)
					tracing.create('ERROR', 'DELETE blockchain/assets1/assets/asset/'+assetID+'/scrap', 'Unable to update scrap. assetID: '+ assetID)
					var error = {};
					error.error = true;
					error.message = 'Unable to confirm scrap update. Request timed out.';
					error.assetID = assetID;
					tracing.create('ERROR', 'DELETE blockchain/assets1/assets/asset/'+assetID+'/scrap', error);
					res.end(JSON.stringify(error))
					clearInterval(interval);
				}
			}, 1500)
		}
		else 
		{
			res.status(400)
			tracing.create('ERROR', 'DELETE blockchain/assets1/assets/asset/'+assetID+'/scrap', 'Unable to update scrap. assetID: '+ assetID)
			var error = {};
			error.error = true;
			error.message = 'Unable to update scrap.';
			error.assetID = assetID;
			tracing.create('ERROR', 'DELETE blockchain/assets1/assets/asset/'+assetID+'/scrap', error);
			res.end(JSON.stringify(error))
		}
	})
}
exports.delete = update;

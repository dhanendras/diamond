/*eslint-env node*/

var request = require('request');
var reload = require('require-reload')(require),
    configFile = reload(__dirname+'/../../../../configurations/configuration.js');
var tracing = require(__dirname+'/../../../../tools/traces/trace.js');
var map_ID = require(__dirname+'/../../../../tools/map_ID/map_ID.js');

var user_id;
var counter = 0;

function create (req, res)
{
	tracing.create('ENTER', 'POST blockchain/assets/vechicles', req.body);
	createAssetID(req, res)
}

exports.create = create;

function createAssetID(req, res)
{
	
	configFile = reload(__dirname+'/../../../../configurations/configuration.js');
	
	res.write(JSON.stringify({"message":"Generating AssetID"})+'&&')
	
	var numbers = "1234567890";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var assetID = "";
	for(var i = 0; i < 7; i++)
	{
		assetID += numbers.charAt(Math.floor(Math.random() * numbers.length));
	}
	assetID = characters.charAt(Math.floor(Math.random() * characters.length)) + assetID;
	assetID = characters.charAt(Math.floor(Math.random() * characters.length)) + assetID;
	
	tracing.create('INFO', 'POST blockchain/assets/vechicles', "Generated AssetID: "+assetID);
	
	checkIfAlreadyExists(req, res, assetID)

	if(typeof req.cookies.user != "undefined")
	{
		req.session.user = req.cookies.user;
		req.session.identity = map_ID.user_to_id(req.cookies.user);
	}
	
	user_id = req.session.identity;
}

function checkIfAlreadyExists(req, res, assetID)
{
	res.write(JSON.stringify({"message":"Checking AssetID is unique"})+'&&');
	tracing.create('INFO', 'POST blockchain/assets/assets', "Checking V5cID is unique");

	var querySpec =				{
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
	
		console.log("ASSET CHAINCODE QUERY RESPONSE", body)
	
		if (body && body.hasOwnProperty("error") && body.error.data.indexOf("Error retrieving assetID") > -1)
		{
			tracing.create('INFO', 'POST blockchain/assets/assets', "AssetID is unique");
			createAsset(req, res, asssetID)
		}
		else if (response && response.statusCode == 200)
		{
			if(counter < 10){
				counter++
				setTimeout(function(){createAssetID(req, res);},3000);
			}
			else{
				counter = 0;
				var error = {}
				error.message = 'Timeout while checking assetID is unique';
				error.error = true;
				error.assetID = assetID;
				tracing.create('ERROR', 'POST blockchain/assets/assets', error);
				res.end(JSON.stringify(error))
			}
			
		}
		else
		{
			
			counter = 0;
			res.status(400)
			var error = {}
			error.message = 'Unable to confirm assetID is unique';
			error.error = true;
			error.assetID = assetID;
			res.end(JSON.stringify(error))
			tracing.create('ERROR', 'POST blockchain/assets/assets', error);
		}
	})
}

function createAsset(req, res, assetID)
{
	configFile = reload(__dirname+'/../../../../configurations/configuration.js');
	tracing.create('INFO', 'POST blockchain/assets/assets', "Creating Diamond with v5cID: "+v5cID);
	res.write(JSON.stringify({"message":"Creating asset with assetID: "+ assetID})+'&&');
									
	var invokeSpec = {
						  "jsonrpc": "2.0",
						  "method": "invoke",
						  "params": {
						    "type": 1,
						    "chaincodeID": {
						      "name": configFile.config.asset_name
						    },
						    "ctorMsg": {
						      "function": "asset_Diamond",
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
					
	request(options, function(error, response, body){
		if (!error && response && response.statusCode == 200) {
			var result = {};
			result.message = "Achieving consensus"
			tracing.create('INFO', 'POST blockchain/assets/assets', "Achieving consensus");
			res.write(JSON.stringify(result) + "&&")
			confirmCreated(req, res, assetID);
		}
		else
		{			
			res.status(400)
			var error = {}
			error.message = 'Unable to create asset';
			error.error = true;
			error.assetID = assetID;
			tracing.create('ERROR', 'POST blockchain/assets/assets', error);
			res.end(JSON.stringify(error))
		}
	})
}

function confirmCreated(req, res, assetID)
{
	configFile = reload(__dirname+'/../../../../configurations/configuration.js');

	var querySpec =				{
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
	counter = 0;
	var interval = setInterval(function(){
		if(counter < 15){				
			request(options, function(error, response, body){				
				if (body && !body.hasOwnProperty("error") && response.statusCode == 200){
					var result = {}
					result.message = "Creation confirmed";
					result.v5cID = v5cID;
					clearInterval(interval);
					tracing.create('EXIT', 'POST blockchain/assets/assets', result);
					res.end(JSON.stringify(result))
				}
			})
			counter++
		}
		else
		{
			res.status(400)
			var error = {}
			error.error = true;
			error.message = 'Unable to confirm asset create. Request timed out.';
			error.assetID = assetID;
			res.end(JSON.stringify(error))
			clearInterval(interval);
			tracing.create('ERROR', 'POST blockchain/assets/assets', error)
		}
	},4000)
}

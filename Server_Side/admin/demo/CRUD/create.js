/*eslint-env node */

var request = require('request');
var reload = require('require-reload')(require),
    configFile = reload(__dirname+'/../../../configurations/configuration.js'),
	participants = reload(__dirname+"/../../../blockchain/participants/participants_info.js");
var tracing = require(__dirname+'/../../../tools/traces/trace.js');	
var spawn = require('child_process').spawn;
var fs = require('fs')
var map_ID = require(__dirname+"/../../../tools/map_ID/map_ID.js");


var initial_assets = require(__dirname+"/../../../blockchain/assets1/assets/initial_assets.js");
var send_error = false;
var counter = 0;
var users = [];
var diamonds = [];
var diamonds_info;

var create = function(req,res)
{
	//req.body.scenario valid values = simple, full
	res.end(JSON.stringify({"message": "performing scenario creation now"}));
	fs.writeFileSync(__dirname+'/../../../logs/demo_status.log', '{"logs": []}');
	
	tracing.create('ENTER', 'POST admin/demo', req.body);
	configFile = reload(__dirname+'/../../../configurations/configuration.js');
	
	var scenario = req.body.scenario;
	
	if(scenario == "simple")
	{
		diamonds_info = initial_assets.simple_scenario;
	}
	else if(scenario == "full")
	{
		diamonds_info = initial_assets.full_scenario;	
	}
	else
	{
		var error = {}
		error.message = 'Scenario type not recognised';
		error.error = true;
		update_demo_status(error);
	}
	
	if(diamonds_info.hasOwnProperty('diamonds'))
	{
		diamonds = diamonds_info.diamonds;
		counter = 0
		create_diamonds(req, res);
	}
	else
	{
		var error = {}
		error.message = 'Initial assets not found';
		error.error = true;
		update_demo_status(error);
	}
}

exports.create = create;

var assetIDs = []

function create_diamonds(req, res)
{
	update_demo_status({"message":"Creating assets"})
	
	configFile = reload(__dirname+'/../../../configurations/configuration.js');
	
	assetIDs = []
	send_error = false;
	var prevCount = -1;
	var check_create = setInterval(function(){
		if(assetIDs.length == diamonds.length && !send_error)
		{
			update_demo_status({"message":"Transferring assets to Distributor"})
			clearInterval(check_create)
			counter = 0;
			transfer_created_diamonds(req, res)
		}
		else if(send_error)
		{
			clearInterval(check_create)
			counter = 0;
			update_demo_status({"message":"Unable to write asset", "error": true})
		}
		else if(assetIDs.length > prevCount)
		{
			if(prevCount != -1)
			{
				update_demo_status({"message":"Created assets "+assetIDs[assetIDs.length -1], "counter": true})
			}
			prevCount = assetIDs.length;
			create_diamond()
		}
	}, 500)
}
function create_diamond()
{
	
	var j = request.jar();
	var str = "user=DVLA"
	var cookie = request.cookie(str);
	var url = configFile.config.app_url + '/blockchain/assets1/assets';
	j.setCookie(cookie, url);
	var options = {
		url: url,
		body: "",
		method: 'POST',
		jar: j
	}

	request(options, function(error, response, body)
	{
		
		if (!error && response.statusCode == 200 && body.indexOf('error') == -1) 
		{
			var array = body.split("&&");
			for(var i = 0; i < array.length; i++)
			{
				var data = JSON.parse(array[i]).message
				if(data.indexOf('Creating asset with assetID:') != -1)
				{
					assetIDs.push(data.substring(data.indexOf(':')+2, data.length).trim())
				}
			}
		}
		else
		{
			send_error = true;
		}
	});	

}
function transfer_created_diamonds(req, res)
{
	
	send_error = false;
	var prevCount = -1;
	var check_int = setInterval(function(){
		if(counter == diamonds.length && !send_error)
		{
			update_demo_status({"message":"Updating assets' details"})
			clearInterval(check_int)
			counter = 0;
			ind_update_counter = 0;
			update_diamonds(req, res);
		}
		else if(send_error)
		{
			clearInterval(check_int)
			counter = 0;
			update_demo_status({"message":"Unable to transfer asstets", "error": true})
		}
		else if(counter > prevCount)
		{
			if(prevCount != -1)
			{
				update_demo_status({"message":"Transfered asset "+assetIDs[counter]+"(DVLA -> "+diamonds[counter].Owners[1]+")", "counter": true})
			}
			prevCount = counter;
			transfer_diamond("DVLA", map_ID.user_to_id(diamonds[counter].Owners[1]), assetIDs[counter], 'Miner_to_Distributor', "counter")
		}
	}, 500)
}
function transfer_diamond(sender, receiver, id, function_name, toUpdate)
{
	var data = {};
	data.function_name= function_name;
	data.value= receiver;

	var j = request.jar();
	var str = "user="+sender
	var cookie = request.cookie(str);
	var url = configFile.config.app_url + '/blockchain/assets1/assets/'+id+'/owner';
	j.setCookie(cookie, url);
	var options = {
		url: url,
		json: data,
		method: 'PUT',
		jar: j
	}

	request(options, function(error, response, body)
	{
		if(toUpdate == "counter")
		{
			counter++
		}
		else
		{
			ind_transfer_counter++;
		}
		if (!error && response.statusCode == 200 && body.indexOf('error') == -1) 
		{

		}
		else
		{
			send_error = true;
		}
	})
}
function update_diamonds(req, res)
{
	send_error = false;
	var prevCount = -1;
	var check_update = setInterval(function(){
		if(counter == diamonds.length && !send_error)
		{
			update_demo_status({"message":"Transferring asstes to private owners"})
			clearInterval(check_update)
			counter = 0;
			ind_transfer_counter = 2;
			
			transfer_updated_diamonds(req, res)
		}
		else if(send_error)
		{
			clearInterval(check_update)
			counter = 0;
			update_demo_status({"message":"Unable to update assets", "error": true})
		}
		else if(counter > prevCount)
		{
			if(prevCount != -1)
			{
				update_demo_status({"message":"Updated all fields for asset "+assetIDs[counter], "counter": true})
			}
			prevCount = counter;
			update_all_diamond_parts(assetIDs[counter])
		}
	}, 500)
}

var ind_update_counter = 0;

function update_all_diamond_parts(id)
{
	var diamond_owner = diamonds[counter].Owners[1]
	var update_fields = [{"value":diamonds[counter].date,"field":"date", "title": "date"},{"value":diamonds[counter].diamondat,"field":"diamondat", "title": "diamondat"},{"value":diamonds[counter].cut,"field":"cut", "title": "cut"},{"value":diamonds[counter].Colour,"field":"colour", "title": "Colour"},{"value":diamonds[counter].clarity,"field":"clarity", "title": "clarity"},{"value":diamonds[counter].symmetry,"field":"symmetry", "title": "symmetry"},{"value":diamonds[counter].polish,"field":"polish", "title": "polish"},{"value":diamonds[counter].timestamp,"field":"timestamp", "title": "timestamp"}]
	var prevCount = -1;
	var check_ind_update = setInterval(function(){
		if(ind_update_counter == 5)
		{
			ind_update_counter = 0;
			clearInterval(check_ind_update)
			counter++;
		}
		else if(send_error)
		{
			clearInterval(check_ind_update)
		}
		else if(ind_update_counter>prevCount)
		{
			prevCount = ind_update_counter;
			update_diamond(diamond_owner, update_fields[ind_update_counter].value, id, update_fields[ind_update_counter].field)
		}
	},500)
}

function update_diamond(Distributor, value, id, field)
{
	
	var data = {};
	data.value= value
	data.oldValue = "undefined";

	var j = request.jar();
	var str = "user="+Distributor;
	var cookie = request.cookie(str);
	var url = configFile.config.app_url + '/blockchain/assets1/assets/'+id+'/'+field;
	j.setCookie(cookie, url);
	var options = {
		url: url,
		json: data,
		method: 'PUT',
		jar: j
	}

	request(options, function(error, response, body)
	{
		ind_update_counter++
		
		if (!error && response.statusCode == 200 && body.indexOf('error') == -1) 
		{

		}
		else
		{
			send_error = true;
		}
	})
}

function transfer_updated_diamonds(req, res)
{	
	send_error = false;
	var prevCount = -1;
	var check_trans = setInterval(function(){
		if(counter == diamonds.length && !send_error)
		{
			clearInterval(check_trans)
			counter = 0;
			update_demo_status({"message":"Demo setup"})
		}
		else if(send_error)
		{
			clearInterval(check_trans)
			counter = 0;
			update_demo_status({"message":"Unable to transfer assets", "error": true})
		}
		else if(counter > prevCount)
		{
			if(prevCount != -1)
			{
				update_demo_status({"message":"Transfered all owners for asset "+assetIDs[counter], "counter": true})
			}
			prevCount = counter;
			transfer_all_owners(assetIDs[counter])
		}
	}, 500)
}

var ind_transfer_counter = 2;

function transfer_all_owners(id)
{
	var prevCount = -1;
	var check_ind_transfer = setInterval(function(){
		if(ind_transfer_counter == diamonds[counter].Owners.length)
		{
			ind_transfer_counter = 2;
			clearInterval(check_ind_transfer)
			counter++;
		}
		else if(send_error)
		{
			clearInterval(check_ind_transfer)
		}
		else if(ind_transfer_counter>prevCount)
		{
			var types = ["Distributor_to_Dealer", "Dealer_to_Buyer", "Buyer_to_trader", "trader_to_cutter","cutter_to_jewellery_maker","jewellery_maker_to_customer"]
			prevCount = ind_transfer_counter;
			transfer_diamond(diamonds[counter].Owners[ind_transfer_counter-1], map_ID.user_to_id(diamonds[counter].Owners[ind_transfer_counter]), id, types[ind_transfer_counter-2], "ind_transfer_counter")
		}
	},500)
}


function update_demo_status(content)
{
	var demo_status_file = fs.readFileSync(__dirname+'/../../../logs/demo_status.log');
	var demo_status = JSON.parse(demo_status_file)
	demo_status.logs.push(content)
	fs.writeFileSync(__dirname+'/../../../logs/demo_status.log', JSON.stringify(demo_status))
	if(!content.hasOwnProperty('error'))
	{
		if(content.message == "Demo setup")
		{
			tracing.create('EXIT', 'POST admin/demo', content);
		}
		else
		{
			tracing.create('INFO', 'POST admin/demo', content.message);
		}
	}
	else
	{
		tracing.create('ERROR', 'POST admin/demo', content);
	}
}


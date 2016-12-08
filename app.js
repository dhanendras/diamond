'use strict';
/* global process */
/* global __dirname */
/*eslint-env node*/

/*******************************************************************************
 * Copyright (c) 2015 IBM Corp.
 *
 * All rights reserved.
 *
 *******************************************************************************/
/////////////////////////////////////////
///////////// Setup Node.js /////////////
/////////////////////////////////////////
var express 		= require('express');
var session 		= require('express-session');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var http 			= require('http');
var app 			= express();
var url 			= require('url');
var cors 			= require('cors');
var fs 				= require('fs');
var path 			= require('path')
var hfc				= require('hfc');


var reload = require('require-reload')(require),
 configFile = require(__dirname+'/Server_Side/configurations/configuration.js');

//Our own modules
let blocks             = require(__dirname+'/Server_Side/blockchain/blocks/blocks.js');
let block             = require(__dirname+'/Server_Side/blockchain/blocks/block/block.js');
let participants     = require(__dirname+'/Server_Side/blockchain/participants/participants.js');
let identity          = require(__dirname+'/Server_Side/admin/identity/identity.js');
let assets         = require(__dirname+'/Server_Side/blockchain/assets/assets/assets.js');
let Diamond          = require(__dirname+'/Server_Side/blockchain/assets/assets/asset/asset.js');
let demo              = require(__dirname+'/Server_Side/admin/demo/demo.js');
let chaincode          = require(__dirname+'/Server_Side/blockchain/chaincode/chaincode.js');
let transactions     = require(__dirname+'/Server_Side/blockchain/transactions/transactions.js');
let startup            = require(__dirname+'/Server_Side/configurations/startup/startup.js');
//let http = require('http');

//const SecurityContext = require(__dirname+'/Server_Side/tools/security/securitycontext');

// Object of users' names linked to their security context
//let usersToSecurityContext = {};

//let port = process.env.VCAP_APP_PORT || configFile.config.appPort;

// For logging
var TAG = "app.js:";

var port;

//Check if running on Bluemix or if using a local Network JSON file
check_if_config_requires_overwriting(function(updatedPort){
	
	//Define port number for app server to use
	port = updatedPort;
	
})

////////  Pathing and Module Setup  ////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'Somethignsomething1234!test', resave: true, saveUninitialized: true}));

// Enable CORS preflight across the board.
app.options('*', cors());
app.use(cors());
app.use(express.static(__dirname + '/Client_Side'));

//===============================================================================================
//    Routing
//===============================================================================================

//-----------------------------------------------------------------------------------------------
//    Admin - Identity
//-----------------------------------------------------------------------------------------------

app.post('/admin/identity', function(req, res) 	//Sets the session user to have the account address for the page they are currently on
{
	identity.create(req, res);
});

//-----------------------------------------------------------------------------------------------
//	Admin - Demo
//-----------------------------------------------------------------------------------------------

app.post('/admin/demo', function(req, res)
{
	demo.create(req, res);
});

app.get('/admin/demo', function(req, res)
{
	demo.read(req, res);
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - chaincode
//-----------------------------------------------------------------------------------------------
app.post('/blockchain/chaincode/assets', function(req, res){
	chaincode.assets.create(req, res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Blocks
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/blocks', function(req, res){
	blocks.read(req, res);
});

app.get('/blockchain/blocks/:blockNum(\\d+)', function(req, res){
	block.read(req, res);
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - assets
//-----------------------------------------------------------------------------------------------
app.post('/blockchain/assets/assets' , function(req,res)
{
	assets.create(req,res)
});

app.get('/blockchain/assets/assets' , function(req,res)
{
	assets.read(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - assets - asset
//-----------------------------------------------------------------------------------------------

app.get('/blockchain/assets/assets/:assetID' , function(req,res)
{
	asset.read(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - assets - asset - Owner
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/assets/:assetID/owner' , function(req,res)
{
	asset.owner.read(req,res)
});

app.put('/blockchain/assets/assets/:assetID/owner' , function(req,res)
{
	asset.owner.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - assets - asset - VIN
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/assets/:assetID/VIN' , function(req,res)
{
	asset.VIN.read(req,res)
});

app.put('/blockchain/assets/assets/:assetID/VIN' , function(req,res)
{
	asset.VIN.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - assets - asset - Colour
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/assets/:assetID/colour' , function(req,res)
{
	asset.colour.read(req,res)
});

app.put('/blockchain/assets/assets/:assetID/colour' , function(req,res)
{
	asset.colour.update(req,res)
});


//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - assets - asset - Make
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/assets/:assetID/make' , function(req,res)
{
	asset.make.read(req,res)
});

app.put('/blockchain/assets/assets/:assetID/make' , function(req,res)
{
	asset.make.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - assets - asset - Model
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/assets/:assetID/model' , function(req,res)
{
	asset.model.read(req,res)
});

app.put('/blockchain/assets/assets/:assetID/model' , function(req,res)
{
	asset.model.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - assets - asset - Reg
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/assets/:assetID/reg' , function(req,res)
{
	asset.reg.read(req,res)
});

app.put('/blockchain/assets/assets/:assetID/reg' , function(req,res)
{
	asset.reg.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - assets - asset - Scrapped
//-----------------------------------------------------------------------------------------------
app.delete('/blockchain/assets/assets/:assetID' , function(req,res)
{
	asset.delete(req,res)
});

app.get('/blockchain/assets/assets/:assetID/scrap' , function(req,res)
{
	asset.scrapped.read(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Participants
//-----------------------------------------------------------------------------------------------
app.post('/blockchain/participants', function(req,res){
	participants.create(req, res);
});

app.get('/blockchain/participants', function(req,res){
	participants.read(req,res);
});

app.get('/blockchain/participants/miners', function(req, res){
	participants.miners.read(req,res);
});

app.get('/blockchain/participants/distributors', function(req, res){
	participants.distributors.read(req,res);
});

app.get('/blockchain/participants/dealerships', function(req, res){
	participants.dealerships.read(req,res);
});

app.get('/blockchain/participants/buyers', function(req, res){
	participants.buyers.read(req,res);
});

app.get('/blockchain/participants/traders', function(req, res){
	participants.traders.read(req,res);
});

app.get('/blockchain/participants/Cutters', function(req, res){
	participants.Cutters.read(req,res);
});


//-----------------------------------------------------------------------------------------------
//	Blockchain - Transactions
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/transactions', function(req, res){
	transactions.read(req, res);
});

///////////  Configure Webserver  ///////////
app.use(function (req, res, next) {
    var keys;
    console.log('------------------------------------------ incoming request ------------------------------------------');
    console.log('New ' + req.method + ' request for', req.url);
    req.bag = {};											//create my object for my stuff
    req.session.count = eval(req.session.count) + 1;
    req.bag.session = req.session;

    var url_parts = url.parse(req.url, true);
    req.parameters = url_parts.query;
    keys = Object.keys(req.parameters);
    if (req.parameters && keys.length > 0) console.log({parameters: req.parameters});		//print request parameters
    keys = Object.keys(req.body);
    if (req.body && keys.length > 0) console.log({body: req.body});						//print request body
    next();
});

////////////////////////////////////////////
////////////// Error Handling //////////////
////////////////////////////////////////////
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {		// = development error handler, print stack trace
    console.log("Error Handler -", req.url, err);
    var errorCode = err.status || 500;
    res.status(errorCode);
    req.bag.error = {msg: err.stack, status: errorCode};
    if (req.bag.error.status == 404) req.bag.error.msg = "Sorry, I cannot locate that file";
    //res.render('template/error', {bag: req.bag});
    res.send({"message":err})
});

// Track the application deployments
require("cf-deployment-tracker-client").track();

// ============================================================================================================================
// 														Launch Webserver
// ============================================================================================================================
var server = http.createServer(app).listen(port, function () {
	
	var result = startup.create()
	
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_ENV = 'production';
process.env['GRPC_SSL_CIPHER_SUITES'] = 'ECDHE-ECDSA-AES128-GCM-SHA256';


server.timeout = 2400000;
console.log('------------------------------------------ Server Up - ' + configFile.config.app_url + ' ------------------------------------------');

console.log("ENV VARIABLES", configFile.config.api_ip, configFile.config.api_port_external);

//--------------------------------------------------------------------------------------------------------------------
//	Functions that will overwrite default config values
//--------------------------------------------------------------------------------------------------------------------

function check_if_config_requires_overwriting(assignPort)
{

	var app_url = configFile.config.app_url
	var app_port = configFile.config.app_port
	var api_ip = configFile.config.api_ip
	var api_port_external = configFile.config.api_port_external
	var api_port_internal = configFile.config.api_port_internal
	var api_port_discovery = configFile.config.api_port_discovery
	var peers = configFile.config.peers
	var ca_ip = configFile.config.ca_ip
	var ca_port = configFile.config.ca_port
	var registrar_name = configFile.config.registrar_name
	var registrar_password = configFile.config.registrar_password
	
	if (configFile.config.networkFile != null) // If network file is defined then overwrite the api variables to use these
	{
		console.log("Attempting to use network JSON specified")
		try
		{
			var networkDetails = JSON.parse(fs.readFileSync(configFile.config.networkFile, 'utf8'))
			var ca = networkDetails.credentials.ca;
			var peers = networkDetails.credentials.peers;
			var peer_ip;
			var peers_array = [];
			
			//Get address of every peer on the network
			for(var i in peers){
				peer_ip = configFile.config.networkProtocol+'://'+peers[i].api_host  
				peers_array.push(peer_ip)
			}

			api_ip = peers_array[0];
			peers = peers_array;
			
			//Get details of the Certificate Authority
			for(var i in ca){
				ca_ip		= ca[i].discovery_host;
				ca_port		= ca[i].discovery_port;
			}

			api_port_external = networkDetails.credentials.peers[0].api_port;
			api_port_internal = networkDetails.credentials.peers[0].api_port;
			api_port_discovery = networkDetails.credentials.peers[0].discovery_port;
			
			//Username and password for the user we will assign as the registrar with the HFC module
			registrar_name = networkDetails.credentials.users[1].username;
			registrar_password = networkDetails.credentials.users[1].secret;

			console.log("Network JSON load successful")
		}
		catch(err)
		{
			console.error("Unable to read network JSON. Error:",err) // File either does not exist or JSON was invalid
			return
		}
	} 
	else if(process.env.VCAP_SERVICES){ //Check if the app is runnning on bluemix
		console.log("Attempting to use Bluemix VCAP Services")
		
		if(JSON.parse(process.env.VCAP_SERVICES)["ibm-blockchain-5-prod"][0]["credentials"]["peers"]){		

			try
			{
				var credentials = JSON.parse(process.env.VCAP_SERVICES)["ibm-blockchain-5-prod"][0]["credentials"];
			
				app_url 				= "http://" + JSON.parse(process.env.VCAP_APPLICATION)["application_uris"][0];
				app_port 				= process.env.VCAP_APP_PORT;
				api_port_external 		= credentials["peers"][0]["api_port"];
				api_port_internal		= credentials["peers"][0]["api_port"];
				api_port_discovery 		= credentials["peers"][0]["discovery_port"];
				
				registrar_name 			= credentials["users"][0]["username"];
				registrar_password 		= credentials["users"][0]["secret"];

				var ca = credentials["ca"];
				var peers = credentials["peers"];
				var peers_array = [];
				
				//Get address of every peer on the network
				for(var i in peers){
					peer_ip = "https://"+peers[i]["api_host"]
					peers_array.push(peer_ip)
				}
				
				api_ip = peers_array[0]
				peers = peers_array

				//Get details of the Certificate Authority
				for(var i in ca){
					ca_ip		= ca[i]["discovery_host"]
					ca_port		= ca[i]["discovery_port"]
				}
			}
			catch(err)
			{
				console.error("Unable to use VCAP Services. Error:",err) //The VCAP Services JSON does not match the expected format
				return
			}
		}
		else{
			console.error("Unable to access blockchain service environment variables. The blockchain service may not exist or be working.")
			return
		}
	}
	
	//Start rewriting the config file with new values
	var data = fs.readFileSync(__dirname+'/Server_Side/configurations/configuration.js', 'utf8')
	
	var str = 'config\.peers(\\t*\\ *)*=(\\t*\\ *)*\\[\''+configFile.config.peers[0]+'\'.*?\\](\\t*\\ *)*(;)?'

	var regex = new RegExp(str, "g")

	var peersArrayAsString='';

	for(var i in peers){
		peersArrayAsString += '\''+peers[i]+'\''
		
		if(i != peers.length-1){
			peersArrayAsString += ','
		}
	}

	console.log("String", peersArrayAsString)
	
	var result = data.replace(regex, "config.peers = ["+peersArrayAsString+"];");
	
	regex = new RegExp('config\.api_ip(\\t*\\ *)*=(\\t*\\ *)*(\"|\\\')'+configFile.config.api_ip+'(\"|\\\')(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.api_ip = '"+api_ip+"';");

	regex = new RegExp('config\.api_port_external(\\t*\\ *)*=(\\t*\\ *)*(\"|\\\')'+configFile.config.api_port_external+'(\"|\\\')(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.api_port_external = '"+api_port_external+"';");

	regex = new RegExp('config\.api_port_internal(\\t*\\ *)*=(\\t*\\ *)*(\"|\\\')'+configFile.config.api_port_internal+'(\"|\\\')(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.api_port_internal = '"+api_port_internal+"';");
	
	regex = new RegExp('config\.api_port_discovery(\\t*\\ *)*=(\\t*\\ *)*(\"|\\\')'+configFile.config.api_port_discovery+'(\"|\\\')(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.api_port_discovery = '"+api_port_discovery+"';");

	regex = new RegExp('config.app_url(\\t*\\ *)*=(\\t*\\ *)*(\"|\\\')'+addSlashes(configFile.config.app_url)+'(\"|\\\')(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.app_url = '"+app_url+"';");

	regex = new RegExp('config\.app_port(\\t*\\ *)*=(\\t*\\ *)*'+configFile.config.app_port+'(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.app_port = "+app_port+";");
	
	regex = new RegExp('config\.ca_ip(\t*\ *)*=(\t*\ *)*(\"|\\\')'+configFile.config.ca_ip+'(\"|\\\')(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.ca_ip = '"+ca_ip+"';");
	
	regex = new RegExp('config\.ca_port(\t*\ *)*=(\t*\ *)*(\"|\\\')'+configFile.config.ca_port+'(\"|\\\')(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.ca_port = '"+ca_port+"';");
	
	regex = new RegExp('config\.registrar_name(\t*\ *)*=(\t*\ *)*(\"|\\\')'+configFile.config.registrar_name+'(\"|\\\')(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.registrar_name = '"+registrar_name+"';");
	
	regex = new RegExp('config\.registrar_password(\t*\ *)*=(\t*\ *)*(\"|\\\')'+configFile.config.registrar_password+'(\"|\\\')(\\t*\\ *)*(;)?', "g")
	result = result.replace(regex, "config.registrar_password = '"+registrar_password+"';");

	try
	{
		//console.log("Updated config file",result)
		
		fs.writeFileSync(__dirname+'/Server_Side/configurations/configuration.js', result, 'utf8');
		console.log("Updated config file.")
	}
	catch(err)
	{
		console.error("Unable to write new variables to config file.")
			
	}
	
	configFile = reload(__dirname+'/Server_Side/configurations/configuration.js');
	
	assignPort(configFile.config.app_port)	
}

function addSlashes(str)
{ 
   //no need to do (str+'') anymore because 'this' can only be a string
   return str.split('/').join('\\/')
} 
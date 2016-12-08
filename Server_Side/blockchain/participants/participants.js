/*eslint-env node */
var create = require(__dirname+'/CRUD/create.js');
exports.create = create.create;

var read = require(__dirname+'/CRUD/read.js');
exports.read = read.read;

var minersFile = require(__dirname+'/miner/miner.js');
var miners = {};
miners.read = minersFile.read;
exports.miners = miners;

var distributorsFile = require(__dirname+'/distributor/distributor.js');
var distributors = {};
distributors.read = distributorsFile.read;
exports.distributors = distributors;


var dealershipsFile = require(__dirname+'/dealerships/dealerships.js');
var dealerships = {};
dealerships.read = dealershipsFile.read;
exports.dealerships = dealerships;

var buyersFile = require(__dirname+'/buyer/buyer.js');
var buyers = {};
buyers.read = buyersFile.read;
exports.buyers = buyers;

var tradersFile = require(__dirname+'/trader/trader.js');
var traders = {};
traders.read = tradersFile.read;
exports.traders = traders;

var cuttersFile = require(__dirname+'/cutter/cutter.js');
var cutters = {};
cutters.read = cuttersFile.read;
exports.cutters = cutters;

var jewellery_makersFile = require(__dirname+'/jewellery_maker/jewellery_maker.js');
var jewellery_makers = {};
jewellery_makers.read = jewellery_makersFile.read;
exports.jewellery_makers = jewellery_makers;

var customersFile = require(__dirname+'/customer/customer.js');
var customers = {};
customers.read = customersFile.read;
exports.customers = customers;



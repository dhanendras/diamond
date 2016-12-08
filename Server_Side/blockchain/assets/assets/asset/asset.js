
var remove = require(__dirname+'/CRUD/delete.js');
exports.delete = remove.delete;

var read = require(__dirname+'/CRUD/read.js');
exports.read = read.read;


var colourFile = require(__dirname+'/colour/colour.js');
var colour = {};
colour.update = colourFile.update;
colour.read = colourFile.read;
exports.colour = colour;

var diamondatFile = require(__dirname+'/diamondat/diamondat.js');
var diamondat  = {};
diamondat.update = diamondatFile.update;
diamondat.read = diamondatFile.read;
exports.diamondat = diamondat;

var cutFile = require(__dirname+'/cut/cut.js');
var cut  = {};
cut.update = cutFile.update;
cut.read = cutFile.read;
exports.cut = cut;

var clarityFile = require(__dirname+'/clarity/clarity.js');
var clarity = {};
clarity.update = clarityFile.update;
clarity.read = clarityFile.read;
exports.clarity =clarity ;

var locationFile = require(__dirname+'/location/location.js');
var location = {};
location.update = locationFile.update;
location.read =locationFile.read;
exports.location =location ; 

var symmetryFile = require(__dirname+'/symmetry/symmetry.js');
var symmetry = {};
symmetry.update = symmetryFile.update;
symmetry.read = symmetryFile.read;
exports.symmetry =symmetry ; 

var polishFile = require(__dirname+'/polish/polish.js');
var polish = {};
polish.update = polishFile.update;
polish.read = polishFile.read;
exports.polish =polish ; 

var jewellerytypeFile = require(__dirname+'/ jewellerytype/ jewellerytype.js');
var jewellerytype  = {};
 jewellerytype.update = jewellerytypeFile.update;
 jewellerytype.read =  jewellerytypeFile.read;
exports.jewellerytype = jewellerytype; 

var scrappedFile = require(__dirname+'/scrapped/scrapped.js');
var scrapped = {};
scrapped.read = scrappedFile.read;
exports.scrapped = scrapped;

var dateFile = require(__dirname+'/date/date.js');
var date = {};
date.update = dateFile.update;
date.read =dateFile.read;
exports.date = date;

var stampFile = require(__dirname+'/stamp/stamp.js');
var stamp  = {};
stamp.update =stampFile.update;
stamp.read =stampFile.read;
exports.stamp = stamp;

var ownerFile = require(__dirname+'/owner/owner.js');
var owner = {};
owner.update = ownerFile.update;
owner.read = ownerFile.read;
exports.owner = owner;

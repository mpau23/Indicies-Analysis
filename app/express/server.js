// server.js

// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var mongoose = require('mongoose');
//var fetcher = require('./services/ResultFetcher');
//var schedule = require('node-schedule');
var winston = require('winston');

// scheduled tasks =========================================

// configuration ===========================================

winston.remove(winston.transports.Console);
winston.add(winston.transports.File, {
    filename: __dirname + '/logs/server.log'
});

console.log("saving logs to: " + __dirname + '/logs/server.log');

winston.add(winston.transports.Console, {
    'timestamp': true
});

// config files
var db = {
    url: 'mongodb://localhost/indicies/'
};

// set our port
var port = process.env.PORT || 80;

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)

//mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// routes ==================================================
require('./routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user                     
winston.info('Magic happens on port ' + port);


// expose app           
exports = module.exports = app;

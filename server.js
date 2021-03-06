﻿// get the packages
var express     = require('express');
var app         = express();
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var config  = require('./config'); // get config file
var Weather = require('./app/models/weather'); // get mongoose model    

var sendMagicPacket = false;
var lastConnectionDate = Date.now();
// configuration 
var port = process.env.PORT || 8080;
var db = mongoose.connect(config.database, {
                          useMongoClient: true,
}); // connect to database

app.set('view engine', 'ejs');

// use morgan to log requests to the console
app.use(morgan('dev'));
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// main route
app.get('/', function(req, res) {
	var arduinoOnline = "Offline";
	if(Date.now() - lastConnectionDate < 5000)
		arduinoOnline = "Online";
    res.render('index', { arduinoOnline: arduinoOnline });
});

// add data from weather station to database
app.post('/add', function(req, res) {
  var date  = Date.now();
  var temp  = req.body.temp;
  var press = req.body.press;
  
  if ((temp == null) | (press == null)) {
	  res.send('success : false');
	  console.log('data not saved');
  }
  else {
      var newWeather = new Weather({ 
      date: date,  
      temperature: temp, 
      pressure: press  
      });

      newWeather.save(function(err) {
      if (err) throw err;

      console.log('new data saved successfully');
      res.send('success : true');
      });
  }	  
});

// show database
app.get('/weather', function(req, res) {
  Weather.find({}, function(err, weathers) {
    res.json(weathers);
  });
});
app.get('/weatherdelete', function(req, res) {
  Weather.remove({}, function(err) { 
    console.log('collection removed') 
  });
});

app.get('/wakeup', function (req, res) {
    res.redirect('/');
});

app.post('/wakeup', function (req, res) {
    sendMagicPacket = true;
    res.send('Sending request for waking PC...');
    console.log('set MagicPacket to true');
});

app.get('/shouldwakeup', function (req, res) {
	lastConnectionDate = Date.now();
    if (sendMagicPacket) {
        sendMagicPacket = false;
        console.log('set MagicPacket to false');
        res.send('1');
        console.log('wakePC');
    }
    else
    {
        res.send('0');
        console.log('DoNotWakePC');
    }
});

// start the server
app.listen(port);
console.log('Server running at http://localhost:' + port);
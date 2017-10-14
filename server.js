// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var config  = require('./config'); // get our config file
var Weather = require('./app/models/weather'); // get our mongoose model    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
var db = mongoose.connect(config.database, {
                          useMongoClient: true,
}); // connect to database

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! ');
});


// add data from weather station to database
app.get('/add', function(req, res) {

  // get parameters from HTTP /GET
  var date  = Date.now();
  var temp  = req.param('temp');
  var press = req.param('press');
  
  if ((temp == null) | (press == null)) {
	  res.send('success : false');
	  console.log('data not saved');
  }
  else {
	    // create new weather data
      var newWeather = new Weather({ 
      date: date,  
      temperature: temp, 
      pressure: press  
      });

      // save weather data
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

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Server running at http://localhost:' + port);

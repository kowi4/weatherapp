// get the packages
var express     = require('express');
var app         = express();
var morgan      = require('morgan');
var bodyParser = require('body-parser');
var path = require('path'); 

var sendMagicPacket = false;
var lastConnectionDate = Date.now();
// configuration 
var port = process.env.PORT || 8080;

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
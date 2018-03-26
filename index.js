var express = require('express');
var bodyParser = require('body-parser');

var userController = require('./controllers/userController');
var cityController = require('./controllers/cityController');
var restaurantController = require('./controllers/restaurantController');
var timeController = require('./controllers/timeController');
//var foodController = require('./controllers/foodController');

var app = express();

// set up a template engine
app.set('view engine', 'ejs');

// static files
// app.use(express.static('./public'));

// use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// fire controllers
userController(app);
cityController(app);
restaurantController(app);
timeController(app);
//foodController(app);

// listen for requests
app.listen(3000, function(){
    console.log('now listening for requests...');
});

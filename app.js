var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
//var users = require('./routes/users');
var app = express();
var router = express.Router(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);


router.get('/', function (req, res) {
  res.json({ message: 'hello! welcome to our api!' });
});
app.use('/api', router);
app.use('/', router);

router.use(function (req, res, next) {
  // do logging
  console.log('Something is happening. logging');
  next(); // make sure we go to the next routes and don't stop here
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var mongoose = require('mongoose');
//mongoose.connect('mongodb://jalle007:12345678@jello.modulusmongo.net:27017/xeS9obyn'); // connect to our database

mongoose.connect('mongodb://jalle007:12345678@ds147965.mlab.com:47965/cars123'); // connect to our database
var Car = require('./models/car');

router.route('/cars')
  // create a bear (accessed at POST http://localhost:8080/api/cars)
  .post(function(req, res) {
      var car = new Car(); // create a new instance of the Car model
      car.name = req.body.name; // set the car name (comes from the request)
      // save the car and check for errors
      car.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'car created!' });
      });
    })
    .get(function(req, res) {
      Cars.find(function(err, cars) {
        if (err)
          res.send(err);

        res.json(cars);
      });
    }) 

	router.route('/cars/:car_id')
    // get the car with that id (accessed at GET http://localhost:8080/api/car/:car_id)
    .get(function(req, res) {
        Cars.findById(req.params.car_id, function(err, car) {
            if (err)
                res.send(err);
            res.json(car);
        });
    })
	
	.put(function(req, res) {
        // use our bear model to find the bear we want
        Cars.findById(req.params.car_id, function(err, car) {
            if (err)
                res.send(err);
            car.name = req.body.name;  // update the car info

            // save the car
            car.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'car updated!' });
            });

        });
    })
	  .delete(function(req, res) {
        Cars.remove({
            _id: req.params.car_id
        }, function(err, car) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


module.exports = app;

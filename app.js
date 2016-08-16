var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var fs = require('fs');

var aws = require('aws-sdk');
aws.config.update({
  accessKeyId:   "AKIAJZPKIDFGOVKI5ZRA",
  secretAccessKey:   "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"

  //accessKeyId: process.env.accessKeyId, // "AKIAJZPKIDFGOVKI5ZRA",
  //secretAccessKey: process.env.secretAccessKey // "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"
});

var multerS3 = require('multer-s3');

var multer = require('multer');
//var upload = multer({ dest: __dirname + '../tmp/uploads/' });

//var routes = require('./routes/index');
//var users = require('./routes/users');
var app = express();
var exports = module.exports = {};

var router = express.Router();
var methodOverride = require('method-override');

app.set('foo', 'bar');

var fName = "car" + Date.now() + ".png";
var s3 = new aws.S3( );
var upload2 = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'jalle007',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
      cb(null, fName);
    }
  })
});


// override with POST having ?_method=DELETE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
//app.use('/api', router);

//app.use('/', routes);
//app.use('/users', users);


router.get('/', function (req, res) {
  res.redirect('/cars');
});


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

mongoose.connect('mongodb://heroku_5kqft6r4:i358iihreqt8stta42n8ok8ro4@ds061354.mlab.com:61354/heroku_5kqft6r4');
var Car = require('./models/car');
 
router.route('/cars')
  // create a bear (accessed at POST http://localhost:8080/api/cars)
  .post(function(req, res) {
      var car = new Car(); // create a new instance of the Car model
      car.make = req.body.make;
      car.model = req.body.model;
      car.year = req.body.year;

      // save the car and check for errors
      car.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'car created!' });
      });
  })

    .get(function(req, res) {
      Car.find(function (err, cars) {
        if (err)
          res.send(err);
        res.render('index', {cars: cars});
      //  res.json(cars);
      });
    }) 

	router.route('/cars/:car_id')
    // get the car with that id (accessed at GET http://localhost:8080/api/car/:car_id)
    .get(function(req, res) {
      Car.findById(req.params.car_id, function(err, car) {
            if (err)
                res.send(err);
            res.json(car);
        });
    })

    //update 
	  .put(function(req, res) {
    Car.findById(req.params.car_id, function(err, car) {
            if (err)
                res.send(err);
            car.make = req.body.make;  // update the car info

            // save the car
            car.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'car updated!' });
            });

        });
    })

	  .delete(function(req, res) {
      Car.remove({
            _id: req.params.car_id
        }, function(err, car) {
            if (err)
                res.send(err);

        res.redirect('/');
      });
    });


router.route('/upload2')
 .post(  upload2.array('image', 3),
  function (req, res, next) {
   

    //var params = { Bucket: 'jalle007', Key: fName, Expires: 60 };
    //var url = s3.getSignedUrl('getObject', params, function (err, url) {
    //  if (url) console.log("The URL is ", url);
    //});

    //save to tb asdasddsa
    var car = new Car();
    car.make = req.body.make;
    car.model = req.body.model;
    car.year = req.body.year;
    car.picture = "https://jalle007.s3.amazonaws.com/"+fName;
    car.save(function (err) {
      if (err)
        res.send(err);
      res.redirect('/');
    });

    //res.send('Successfully uploaded ' + req.files.length + ' files!');
  });

router.route('/add')
  .get(  function (req, res) {
    res.render('add' );
  });

//app.get('/add', function (req, res) {
//  res.render('add');
//});


module.exports = app;

exports.closeServer = function () {
  server.close();
};
/*jshint multistr: true ,node: true*/
"use strict";

var
  /* 3rd Party */
	HTTP            = require('http'),
	UTIL            = require('util'),
	PATH            = require('path'),
	EXPRESS         = require('express'),
	MORGAN          = require('morgan'),
	BODY_PARSER     = require('body-parser'),
    MONGOOSE        = require( 'mongoose' ),
    CONFIG 			= require('../config'),
  /* internal */
	ERROR           = require('./error.js'),
	M               = require('./middlware'),
	AuthHandler = require('./handlers/AuthHandler'),
	passport = require('passport'),
	User = require('./models/user'),
	BodyParser = require("body-parser")
	,ExpressLogger = require("express-logger")
	,UrlEncode = require("urlencode")
	,MethodOverride = require("method-override")
	,CookieParser = require("cookie-parser")
	,Errorhandler = require("errorhandler")
	,session = require('express-session'),
	 CONSTANTS = require('../constants');

	require('./passport')(passport,CONFIG,CONSTANTS);


// ***************************************************************************************************************
// ***************************************************************************************************************

function webServer(config) {

	var self = this;

	// Config
	self.config     = config;

	// env
	self.env        = process.env.NODE_ENV || 'development';

	// Express app
	self.app        = EXPRESS();
	self.app.set('client-url','http://localhost:5000');
	self.app.set('client-google-signin','/google?action=signin');

	self.app.disable('x-powered-by');
	self.app.use(ExpressLogger({path: "./logfile.txt"}));
	self.app.use(BodyParser());
	self.app.use(MethodOverride());
	// jwt
	self.app.use(session({
		secret:'allcarte secret'
	}));
	self.app.use(CookieParser());
	self.app.use(EXPRESS.static(PATH.join(__dirname, '../')));
	self.app.use(function(req, res, next){allowCrossDomain(req, res, next);});


	var allowCrossDomain = function(req, res, next) {
	    res.header('Access-Control-Allow-Origin', self.config.DEV_DOMAIN);
	    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	    if ('OPTIONS' == req.method) {
	    	res.send(200);
	    }
	    else {
	    	next();
	    }
	};

    self.app.use(passport.initialize());
    self.app.use(passport.session());

	// Create the database connection
	MONGOOSE.connect(process.env.MONGOLAB_URI || self.config.WEBSERVER.DBURI);
	// When successfully connected
	MONGOOSE.connection.on('connected', function () {
	  console.log('Mongoose default connection open to ' + self.config.WEBSERVER.DBURI);
	});

	// If the connection throws an error
	MONGOOSE.connection.on('error',function (err) {
	  console.log('Mongoose default connection error: ' + err);
	});

	// When the connection is disconnected
	MONGOOSE.connection.on('disconnected', function () {
	  console.log('Mongoose default connection disconnected');
	});

	// If the Node process ends, close the Mongoose connection
	process.on('SIGINT', function() {
	  MONGOOSE.connection.close(function () {
	    console.log('Mongoose default connection disconnected through app termination');
	    process.exit(0);
	  });
	});

} // main function


// CORS middleware
webServer.prototype._setCors = function(req, res, next){
	res.header('Access-Control-Allow-Origin',   '*');
	res.header('Access-Control-Allow-Methods',  'GET, POST, OPTIONS');
	res.header("Access-Control-Allow-Headers", 'Origin,Content-Type,Accept,Pragma,Accept-Encoding,Accept-Language,Referer,Connection');
	next();
};



// Set Routes
webServer.prototype._setRoutes = function(handlers){
	var self = this;

	// set cors
	self.app.use(self._setCors);
	//User Routes
	self.app.get('/api/users/google', passport.authenticate('google', {scope: ['email']}), handlers.auth.GoogleSignIn);
	self.app.get('/api/users/google/callback', passport.authenticate('google', {failureRedirect: '/#/login', session: false, scope: 'https://www.googleapis.com/auth/plus.login'}), handlers.auth.GoogleSignInCallback);
	self.app.get('/api/users/facebook', passport.authenticate('facebook', { failureRedirect: '/login',successRedirect : '/welcome', session: false, scope: ['email'] }), handlers.auth.FacebookSignIn);
	self.app.get('/api/users/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', session: false, scope: [] }), handlers.auth.FacebookSignInCallback);
	self.app.post('/api/users/login',passport.authenticate('local', {session: false}), handlers.auth.LocalSignIn);
	self.app.post('/api/users/login/social', handlers.auth.LocalSignInWithSocial);
	self.app.post('/api/users/', handlers.auth.RegisterLocal);


	// STATIC FILES
	self.app.use(EXPRESS.static(PATH.join(__dirname, '../'))); // defines folder for static assets

	if (self.app.get('env') === 'development') {
	  self.app.use(function(err, req, res, next) {
	    var e = new Error(500); e.status = err.status || 500;
		return ERROR(e, req, res);
	  });
	}

	// production error handler
	// no stacktraces leaked to user
	self.app.use(function(err, req, res, next) {
	  var e = new Error(500); e.status = err.status || 500;
		return ERROR(e, req, res);
	});

};


function is_authenticated (req, res, next) {
	if(Constants.IS_AUTHENTICATION_DISABLED_FOR_REST_API_TESTING) {
		var token = null;//req.body.token || req.query.token || req.headers['x-access-token'];
		if(req.body.token) {
			token = req.body.token;
		} else if(req.query.token) {
			token = req.query.token;
		} else if(req.params.token) {
			token = req.params.token;
		} else if(req.headers['x-access-token']) {
			token = req.headers['x-access-token'];
		}

		var user_id = null;

		if(req.body.user_id) {
			user_id = req.body.user_id;
		} else if(req.query.user_id) {
			user_id = req.query.user_id;
		} else if(req.params.user_id) {
			user_id = req.params.user_id;
		} else if(req.headers['x-user-id']) {
			user_id = req.headers['x-user-id'];
		}

		if(token && user_id) {
			User.FindByUserIdAndToken(user_id, token, function(err, user){
				if(err || !user) {
					res.redirect('/#/login');
				} else {
					next();
				}
			})
		} else {
			res.status(403)
				.send({'status': false, 'error': 'Auth Error'});
		}
	} else {
		next();
	}
}

webServer.prototype.start = function(){
	var self = this;


    var handlers = {
	auth: new AuthHandler()
    };

	// set routes first
	console.log("webServer.prototype.start :: Setting routes");
	self._setRoutes(handlers);

	console.log("webServer.prototype.start :: Creating HTTP Server");
	HTTP.createServer(self.app)
		.on('error', function(err) {
			console.log("webServer.prototype.start Error :"+ err);
			process.exit(1);
		})

		.listen(process.env.PORT || 5000 , function() {
			console.log("Listening on localhost on port " + self.app.get('port') + ' in ' + (process.env.NODE_ENV || 'development'));
	  });
}; //start


module.exports = webServer;

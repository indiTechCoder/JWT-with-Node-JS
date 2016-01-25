var mongoose = require('mongoose');
var	User = require('./models/user');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var   GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;


module.exports = function(passport,config,CONSTANTS) {

	var self = this;

	// Config
	self.config     = config;

	// env
	self.env        = process.env.NODE_ENV || 'development';

	passport.use(new LocalStrategy(User.authenticate()));


	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());

	passport.use(new TwitterStrategy({
		consumerKey		 : CONSTANTS.FACEBOOK_AUTH.FACEBOOK_CLIENT_ID,
		consumerSecret	: CONSTANTS.FACEBOOK_AUTH.FACEBOOK_SECRET_KEY,
		callbackURL		 : '/auth/twitter/callback'
	}, function(accessToken, refreshToken, profile, done) {

		User.findOne({provider_id: profile.id}, function(err, user) {
			if(err) throw(err);

			if(!err && user!= null) return done(null, user);


			var user = new User({
				provider_id	: profile.id,
				provider		 : profile.provider,
				name				 : profile.displayName,
				photo				: profile.photos[0].value
			});

			user.save(function(err) {
				if(err) throw err;
				done(null, user);
			});
		});
	}));


passport.use('google', new GoogleStrategy({
		clientID: CONSTANTS.GOOGLE_AUTH.GOOGLE_CLIENT_ID,
		clientSecret: CONSTANTS.GOOGLE_AUTH.GOOGLE_SECRET_KEY,
		callbackURL: CONSTANTS.DEV_DOMAIN + CONSTANTS.GOOGLE_AUTH.GOOGLE_CALLBACK_URL
  	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findUserByEmailId(profile.emails[0 ].value, function(err, usr){
				if(err)
					return done(err);
				if(usr) {
					return done(null, usr);
				} else {
					var UserToBeSaved = new User();
					UserToBeSaved.google_profile_id = profile.id;
					UserToBeSaved.access_token = accessToken;
					UserToBeSaved.token = User.Token({token: accessToken});
					UserToBeSaved.name = profile.name.givenName +' '+ profile.name.familyName;
					UserToBeSaved.email = profile.emails[0].value;
					UserToBeSaved.role = 'guest';
					UserToBeSaved.save(function(err){
						if(err)
							throw err;
						return done(null, UserToBeSaved);
					});
				}
			});
		});
	}
));

passport.use('facebook', new FacebookStrategy({
			clientID: CONSTANTS.FACEBOOK_AUTH.FACEBOOK_CLIENT_ID,
			clientSecret: CONSTANTS.FACEBOOK_AUTH.FACEBOOK_SECRET_KEY,
			callbackURL: CONSTANTS.DEV_DOMAIN + CONSTANTS.FACEBOOK_AUTH.FACEBOOK_CALLBACK_URL,
			profileFields: ['id', 'emails', 'name']
		},
		function(accessToken, refreshToken, profile, done) {
			process.nextTick(function () {
				User.findUserByEmailId(profile.emails[0].value, function(err, usr){
					if(err)
						return done(err);
					if(usr) {
						return done(null, usr);
					} else {
						var UserToBeSaved = new User();
						UserToBeSaved.facebook_profile_id = profile.id;
						UserToBeSaved.access_token = accessToken;
						UserToBeSaved.token = User.Token({token: accessToken});
						UserToBeSaved.name = profile.name.givenName +' '+ profile.name.familyName;
						UserToBeSaved.email = profile.emails[0].value;
						UserToBeSaved.role = 'guest';
						UserToBeSaved.save(function(err){
							if(err) {
								throw err;
							}
							return done(null, UserToBeSaved);
						});
					}
				});
			});
		}
));



	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'username': email}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'That email already taken'));
				} else {
					var newUser = new User();
					newUser.username = email;
                    user.setPassword(req.body.password);
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})

		});
	}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({ 'username': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(!user.validPassword(password)){
						return done(null, false, req.flash('loginMessage', 'invalid password'));
					}
					return done(null, user);

				});
			});
		}
	));


};

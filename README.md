
# Node.js with JSON web token and Social Login

Use this tutorial as a guide to learn Social Login and JWT based authentication process.
JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties

Topics
================
- Node JS Routes
- Social Login using Passport (Twitter/Facebook/Local)
- jwt-simple/Crypto to create JWT token server side
- Store Token in local storage client side
- Send token in HTTP auth header


Suggested prerequisites
====================
<a name="README">[<img src="https://s3-us-west-2.amazonaws.com/martinbucket/JS.png" width="50px" height="50px" />](https://github.com/MartinChavez/Learn-Javascript)</a>

Passport JS
====================
```Javascript
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

```

Create Auth Token
====================
```Javascript

UserSchema.statics.encode = function(data) {
	return JWT.encode(data, CONSTANT.TOKEN_SECRET, 'HS256');
};

UserSchema.statics.decode = function(data) {
	return JWT.decode(data, CONSTANT.TOKEN_SECRET);
};

```

Create Token
====================
```Javascript
UserSchema.statics.createToken = function(email, callback) {
	this.findOne({email: email}, function(err, usr) {
		if(err || !usr) {
			console.log('err');
		}
		//Create a token and add to user and save
		var token = this.model.encode({email: email});
		usr.token = new TokenModel({token:token});
		usr.save(function(err, usr) {
			if (err) {
				callback(err, null);
			} else {
				callback(false, usr);
			}
		});
	});
};
```

Run the tutorial (each file is numbered)
====================
```Terminal
git clone origin https://github.com/kumartarun/JWT-with-Node-JS.git
npm install
npm start
```

Contact
====================
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/MARTIN2.png" />](http://gennexttraining.herokuapp.com/)
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/github.png" />](https://github.com/tkssharma)
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/mail.png" />](mailto:tarun.softengg@gmail.com)
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/linkedin.png" />](https://www.linkedin.com/in/tkssharma)
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/twitter.png" />](https://twitter.com/tkssharma)

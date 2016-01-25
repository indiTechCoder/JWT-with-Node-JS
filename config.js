/*jshint multistr: true ,node: true*/
"use strict";


var config = {

	ENVIRONMENT 					: process.env.NODE_ENV || 'development',
		COMMON 							: {

			WEBSERVER 					: {
				PORT 					: 3000,
				DBURI                   : 'mongodb://localhost:27017/myproject'
			},

		},
		'development' 					: {


		},
		'production'					: {


		}
	/*
		Environment specific settings
		These will be loaded after common
		*/
	};

	var load = function(){
		var
		env 			= config.ENVIRONMENT,
		loadedConfig 	= config.COMMON;

		/* copy superficially , and not deep copy */
		Object.keys(config[env]).forEach(function(key) {
			loadedConfig[key] = config[env][key];
		});

		return loadedConfig;
	};


	module.exports = load();

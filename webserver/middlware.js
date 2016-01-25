/*jshint multistr: true ,node: true*/
"use strict";

var
	ERROR            = require('./error');
// validate the authentication header
exports.validateAuthHeader = function(config){
	return function (req, res, next) {
		if(req.headers["x-auth-id"] !== config.AUTH_ID){
			return ERROR({status:404},req,res);
		}
		return next();
	};
};

exports.MainPage = function(config){

	return function (req, res, next) {

		next();
	};
};
// check the UUID in the request header if present continue if not generate new and cont.
exports.checkUserUUID = function(config){

	return function (req, res, next) {

		next();
	};
};

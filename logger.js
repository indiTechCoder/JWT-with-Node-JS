/*jshint multistr: true ,node: true*/
"use strict";

var gettime = function() {
	var d = new Date();
	return  d.toDateString() + " " + d.toLocaleTimeString() + "." + String(d.getMilliseconds()) + " ";
};

var getEnv = function() {
	return process.env.NODE_ENV || 'development';
};

module.exports = {
	'debug' 	: 	function(e, Obj) {
		if(getEnv() == 'production') return ;
		var _ = (Obj) ? console.log('DEBUG:' + gettime() + e, Obj) : console.log('DEBUG:' + gettime() + e); 
	},
	'log' 		: 	function(e, Obj) { var _ = (Obj) ? console.log(gettime() + e, Obj) : console.log(gettime() + e); },
	'error' 	: 	function(e, Obj) { var _ = (Obj) ? console.error('ERROR:' + gettime() + e, Obj) : console.error('ERROR:' + gettime() + e); }
};
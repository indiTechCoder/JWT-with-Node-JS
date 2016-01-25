/**
 *
 */

angular.module('Codefun')
.config(config)
.factory('timeKeeper', timeKeeper )
.factory('errors', errors );

function timeKeeper() {
	var timeKeeper = {
			request: function (config) {
				config.requestTimestamp = new Date().getTime();
				return config;
			},
			response: function (response) {
				response.config.responseTimestamp = new Date().getTime();

				var time = response.config.responseTimestamp - response.config.requestTimestamp;


				return response;
			}
	};
	return timeKeeper;
}

config.$inject = ['$httpProvider'];
function config($httpProvider)
{
	$httpProvider.interceptors.push('timeKeeper');
}


function errors () {
	var errors = [];

	function addErrorMessage(msg) {
		errors.push(msg);
	};

	function getErrorMessages() {
		var response = errors;
		errors = [];
		return response;
	}

	return {
		addErrorMessage: addErrorMessage,
		getErrorMessages: getErrorMessages
	};
}

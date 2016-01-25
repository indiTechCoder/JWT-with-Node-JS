/**
 *
 */
angular.module('Codefun')
.config(config);

	config.$inject = ['LoggerProvider'];
	function config(LoggerProvider) {

		LoggerProvider.enabled(true);

	}

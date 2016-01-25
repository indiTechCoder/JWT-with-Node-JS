(function () {
	'use strict';

	angular
	.module('Codefun').factory('AuthResolver', function ($q, $rootScope, $state) {
		return {
			resolve: function () {
				var deferred = $q.defer();
				var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
					if (angular.isDefined(currentUser) && currentUser) {
						deferred.resolve(currentUser);
					}
					else
					{
						deferred.reject();
						$state.go('login');
					}
				});
				return deferred.promise;
			}
		};
	})

})();

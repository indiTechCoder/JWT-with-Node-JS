/**
 * global declaration of all angular modules Modules related to resource design
 * can be added to this root module & should be added in every file @ ngTranslate
 * @ LocalController to fetch Translate data
 */
(function() {



	angular.module("Codefun").controller("localController", localController)
	/* .factory("springRestLocalFetchservice",springRestLocalFetchservice) */
	.factory("asyncLoader", asyncLoader)
	.config(config);

	//@config
	config.$inject = [ '$translateProvider' ];
	function config($translateProvider) {
		$translateProvider.preferredLanguage('en');
		$translateProvider.useLoader('asyncLoader');

	}

	// @factory
	asyncLoader.$inject = [ '$q', '$timeout', '$http' , 'Logger','ContextRoot' ];
	function asyncLoader($q, $timeout, $http,Logger,ContextRoot) {

		return function(options) {
			var deferred = $q.defer(), translations;

			var logger = Logger.getInstance('IE.index');

			var resturl = ContextRoot+"rest/local/v1/"
			$http.get(
					resturl
					+ options.key,{cache:false}).success(function(translations) {
						deferred.resolve(translations);
						//alert(translations);
					}).error(function(translations) {
						deferred.reject(translations);
					});

			$timeout(function() {
				deferred.resolve(translations);
			}, 2000);

			return deferred.promise;
		};

	}


	//@controller
	localController.$inject = [ '$translate', '$scope','$rootScope','$state'];
	function localController($translate, $scope,$rootScope,$state) {
		$scope.defaultlanguage = true;
		$scope.state= $state;
		$scope.changeLanguage = function(langKey) {

			if($state.current.name == 'home')
			{
				if(langKey === 'en')
				{
					$rootScope.lang= "en";
					$scope.defaultlanguage = true;
					changeLanguageFeedbackPanel(langKey);
				}
				if(langKey === 'sp')
				{
					$rootScope.lang= "sp";
					$scope.defaultlanguage = false;
					changeLanguageFeedbackPanel(langKey);
				}
			}
			else
			{
				langKey = 'en';
				$rootScope.lang= "en";
			}

			$translate.use(langKey);
		};

	}

})();

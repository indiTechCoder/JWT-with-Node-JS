
var routerApp = angular.module("Codefun");

routerApp.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('home');

	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'partials/home.html'
	})
	.state('welcome', {
		url: '/welcome',
		abstract : true,
		templateUrl: 'partials/welcome.html'

	})
	.state('welcome.training', {
		url: '/training',
		templateUrl: 'partials/welcome_training.html',
		onEnter: [ '$state', 'AuthenticationService', function($state, AuthenticationService){
			if (! AuthenticationService.isLoggedIn()) {
				$state.go('login');
			};
		}]
	})
	.state(
		"login",
		{
			url : "/login",
			templateUrl : "partials/auth/login.html",
			onEnter: [ '$state', 'AuthenticationService', function($state, AuthenticationService){
				if (AuthenticationService.isLoggedIn()) {
					$state.go('welcome.training');
				};
			}]
		})
	.state("signout", {
		url : "/signout",
		templateUrl : "partials/home.html",
		onEnter: [ '$state', 'AuthenticationService', function($state, AuthenticationService){
			AuthenticationService.ClearCredentials();
			$state.go('login');
		}]
	})
	.state(
		"password",
		{
			url : "/password",
			templateUrl : "partials/auth/forgotpassword.html",
			onEnter: [ '$state', 'AuthenticationService', function($state, AuthenticationService){
				if (AuthenticationService.isLoggedIn()) {
					$state.go('home');
				};
			}]

		})

	.state(
		"register",
		{
			url : "/register",
			templateUrl : "partials/auth/register.html",
			onEnter: [ '$state', 'AuthenticationService', function($state, AuthenticationService){
				if (AuthenticationService.isLoggedIn()) {
					$state.go('welcome.training');
				};
			}]
		});

	$urlRouterProvider.when("/welcome","/welcome/training");

});


angular
.module('Codefun')
.run(
	[
	'$rootScope',
	'$location',
	'$stateParams',
	'$http',
	'$state',
	'$q',
	'AuthenticationService',
	'AUTH_EVENTS',
	function($rootScope, $location, $stateParams, $http,
		$state, $q,AuthenticationService,AUTH_EVENTS) {

		$rootScope
		.$on(
			'$stateChangeStart',
			function(event, toState, toParams,
				fromState, fromParams) {
				$(".page-loading")
				.removeClass("hidden");

			});

		$rootScope.$on('$stateChangeError', function(event,
			toState, toParams, fromState, fromParams) {

			$(".page-loading").addClass("hidden");

		});

		$rootScope
		.$on(
			'$stateChangeSuccess',
			function(event, toState, toParams,
				fromState, fromParams) {
				$rootScope.loading = false;
             // get user name on route change success
             $rootScope.isLoggedIn = AuthenticationService.isLoggedIn();
             $rootScope.currentUserName = AuthenticationService.getCurrentUser();
             console.log($rootScope.currentUserName)
             $(".page-loading").addClass("hidden");


         });

	} ])




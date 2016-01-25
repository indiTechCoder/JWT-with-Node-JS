angular.module('Codefun')
.controller('continueOrLogoutController',['$scope', '$location',function($scope){

	var initInjector = angular.injector(["ng"]);
	var $http = initInjector.get("$http");

	$scope.continueSession = function () {
        //console.log("continueSession is triggered!...calling rest service");
        $http.get("http://localhost:8090/ie-portal-webapp/continueSession");
        //console.log("Session extended on server side");
        };


    $scope.signOut = function () {
        //console.log("Session Timeout is triggered!...calling rest service");
        $http.get("http://localhost:8090/ie-portal-webapp/expireSession");
        //console.log("Session timed out on server side");


        $scope.go = function ( path , $location) {
        	  $location.path( path );
        	};

    };



}]);

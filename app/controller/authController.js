
(function () {
	'use strict';
	angular.module('Codefun').controller('authController', authController);

	authController.$inject = ['$location', 'AuthenticationService','$scope','$rootScope','AUTH_EVENTS','$state','UserService','$stateParams'];
	function authController($location, AuthenticationService,$scope,$rootScope,AUTH_EVENTS,$state,UserService,$stateParams) {
		$scope.data = {};
		$scope.loginerrormessage = ''
		var locationUrl = $location;
		var searchObject = locationUrl.search();
		if(searchObject["token"] && searchObject["user"]) {
			$(".page-loading").removeClass("hidden");
			$scope.data.email = searchObject["user"];
			$scope.data.token = searchObject["token"];
			AuthenticationService.LoginUsingToken($scope.data.email, $scope.data.token, function(response){
				if(response.success) {
					$(".page-loading").addClass("hidden");
					AuthenticationService.SetCredentials($scope.data.email, $scope.data.token, $scope.user.user_id);
					AuthenticationService.saveToken($scope.data.token);
					AuthenticationService.saveUserId(response.user.user_id);
					AuthenticationService.saveUserName($scope.data.email);
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					$state.go('welcome.training');
				} else {
					$(".page-loading").addClass("hidden");
					$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
					//FlashService.Error(response.message);
					$scope.loginerrormessage = "Failed to login in using other service providers";


				}
			});
		}

       $scope.user = {};
		$scope.register = function(form) {

			if(form.$invalid)
			{
				$scope.registersubmitted = true;
				return;
			}

			$(".page-loading")
			.removeClass("hidden");
			UserService.Create($scope.userData)
			.then(function (response) {
				if (response.success) {
					$(".page-loading")
					.addClass("hidden");
					$location.path('/login');
				} else {
					$(".page-loading")
					.addClass("hidden");

					if(response.message != null)
					{
						$scope.registererrormessage = response.message;
					}
					else
					{
						$scope.registererrormessage = 'unable to register User..'
					}

					$scope.dataLoading = false;
				}
			});
		};
		$scope.login = function(form) {
			if(form.$invalid)
			{
				$scope.loginsubmitted = true;
				return;
			}
			$(".page-loading").removeClass("hidden");
			AuthenticationService.Login($scope.userData.email, $scope.userData.password, function (response) {
				if (response.success) {

					$(".page-loading").addClass("hidden");
					AuthenticationService.SetCredentials(response.user.email, response.user.token, response.user.user_id);
					AuthenticationService.saveToken(response.user.token);
					AuthenticationService.saveUserId(response.user.user_id);
					AuthenticationService.saveUserName(response.user.username);
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					$state.go('welcome.training');
				} else {
					$(".page-loading").addClass("hidden");
					$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
					//FlashService.Error(response.message);
					$scope.loginerrormessage = "The Password/Email you entered is incorrect";
				}
			});
		};

		$scope.resetPassword = function(form) {
			if(form.$invalid)
			{
				$scope.resetsubmitted = true;
				return;
			}
			$(".page-loading").removeClass("hidden");

			AuthenticationService.ResetPassword($scope.userData.email, function(response){
				//console.log(response);
				$(".page-loading")
				.addClass("hidden");
				$scope.resetmessage = "Reset password will be sent to your registered email id please check your email";
			});
		};

		$scope.changePassword = function(form) {
			if(form.$invalid ||  $scope.userData.newpassword2 != $scope.userData.newpassword1 )
			{
				$scope.changepasswordsubmitted = true;
				return;
			}
			$(".page-loading").removeClass("hidden");
			UserService.UserchangePassword($scope.userData.newpassword1,$stateParams.email,$stateParams.token)
			.then(function(response) {
			$(".page-loading").addClass("hidden");
				if (response.success) {
					$state.go('login');
				}
				else
				{
					$scope.changepwdmessage = "issue while changing password";
				}
			});
		};

		$scope.signOut = function() {
			AuthenticationService.SignOut($scope.user.email, $scope.user.accessToken, function(response){
				$state.go('login');
			});
		};

	}
})();


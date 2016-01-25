(function () {
    'use strict';

    angular
        .module('Codefun')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetByUserNameAndPassword = GetByUserNameAndPassword;
        service.GetByFacebookLogin = GetByFacebookLogin;
        service.GetByGoogleLogin = GetByGoogleLogin;
        service.ResetPassword = ResetPassword;
        service.SignOut = SignOut;
        service.UserchangePassword = UserchangePassword;
		service.GetByUserNameAndToken = GetByUserNameAndToken;

        return service;

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }
        // validate user
        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function GetByUserNameAndPassword(username, password) {
            return $http.post('/api/users/login', {username: username, password: password}).then(handleSuccess, handleError('Error in authenticating user'));
        }

		function GetByUserNameAndToken(username, token) {
			return $http.post('/api/users/login/social', {username: username, token: token} ).then(handleSuccess, handleError("Error in authenticating user with google"));
		}

        //register user
        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function GetByFacebookLogin() {
            return $http.get('/api/users/facebook').then(handleSuccess, handleError('Error in Authentication User'));
        }

        function GetByGoogleLogin() {
            return $http.get('/api/users/google').then(handleSuccess, handleError('Error in Authenticating user using google'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function ResetPassword(username) {
            return $http.post('/api/users/reset', {email: username}).then(handleSuccess, handleError("Error in resetting passoword"));
        }
        function UserchangePassword(password, email, token) {
            return $http.post('/api/users/login/resetpassword', {password: password , email: email, access_token: token}).then(handleSuccess, handleError("Error in Signing out"));
        }
        function SignOut(username, accessToken) {
            return $http.post('/api/users/signout', {email: username, access_token: accessToken}).then(handleSuccess, handleError("Error in Signing out"));
        }


        // private functions

        function handleSuccess(res) {
           return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }
})();

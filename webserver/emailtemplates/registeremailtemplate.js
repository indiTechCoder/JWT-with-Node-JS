var RegisterEmailTemplate = function() {

};

RegisterEmailTemplate.prototype.HostEmailTemplate = function HostEmailTemplate() {
	return "<h1>Thanks for Hosting </h1>";
}

RegisterEmailTemplate.prototype.UserEmailTemplate = function UserEmailTemplate() {
	return "<h1>Thanks for User</h1>";
}

module.exports = new RegisterEmailTemplate();
var constant = require("../../constants");

var ResetPasswordEmailTemplate = function(){

};

/**
 * @return {string}
 */
ResetPasswordEmailTemplate.prototype.EmailTemplate = function(email, token) {
	return "<h5>"+ constant.DEV_DOMAIN+"/#/changepassword/"+email+"/"+token;
};


module.exports = new ResetPasswordEmailTemplate();

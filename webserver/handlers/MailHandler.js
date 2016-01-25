var NodeMailer = require('nodemailer')
	,CONFIG = require('../../config')
	,CONSTANT = require('../../constants')
	,RegisterEmailTemplate = require('../emailtemplates/registeremailtemplate')
	,ResetEmailTemplate = require('../emailtemplates/resetpasswordemailtemplate');

var Transporter = NodeMailer.createTransport({
	service: 'Gmail',
	auth: {
		user: CONSTANT.GMAIL_SMTP.GMAIL_SMTP_EMAIL_ID,
		pass: CONSTANT.GMAIL_SMTP.GMAIL_SMTP_PASSWORD
	}
});

var RegisterMailOptions = {
	from : 'AllKarte Registration Confirmation<allkarte@gmail.com>',
	subject : 'Registration Confirmation'
};

var ResetPasswordMailOptions = {
	from : 'AllKarte Reset Password Confirmation<allkarte@gmail.com>',
	subject : 'Reset Password Token'
};

var MailHandler = function() {

};

MailHandler.prototype.sendRegisterMail = function(emailAddress, isHost) {
	RegisterMailOptions['to'] = emailAddress;
	if(isHost) {
		RegisterMailOptions['html'] = RegisterEmailTemplate.HostEmailTemplate();
	} else {
		RegisterMailOptions['html'] = RegisterEmailTemplate.UserEmailTemplate();
	}

	//Sending Email After Registration
	Transporter.sendMail(RegisterMailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Registration success Email Sent: '+info.response);
	});
};

MailHandler.prototype.sendRegisterMail1 = function(user) {
		ResetPasswordMailOptions['to'] = user.email;
	ResetPasswordMailOptions['html'] = ResetEmailTemplate.EmailTemplate(user.email, user.reset_token);
	Transporter.sendMail(ResetPasswordMailOptions, function(error, info){
		if(error) {
			return console.log(error);
		}
		console.log('Email Sent'+info.response);
	});
};



module.exports = new MailHandler();

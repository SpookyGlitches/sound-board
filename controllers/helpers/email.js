const mailgun = require("mailgun-js")({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.DOMAIN_NAME,
});

//fck this im repeating myself too much here

function getVerificationEmailContent(display_name, token) {
	const domain =
		process.env.NODE_ENV == "development"
			? `localhost:${process.env.PORT}`
			: process.env.DOMAIN_NAME;
	return `<div>Hi ${display_name},<br>
				Verify your account through this 
				<a target='_blank' href='http://${domain}/account/verify?token=${token}'>link</a>.
			</div>`;
}

function sendVerificationEmail(email_address, display_name, token) {
	const data = {
		from: `SoundBoard <verification@${process.env.DOMAIN_NAME}>`,
		to: email_address,
		subject: "Verify your Email",
		html: getVerificationEmailContent(display_name, token),
	};
	return new Promise((resolve, reject) => {
		mailgun.messages().send(data, async (error, body) => {
			if (error) reject(error);
			else resolve(body);
		});
	});
}

function getResetPasswordEmailContent(display_name, token) {
	const domain =
		process.env.NODE_ENV == "development"
			? `localhost:${process.env.PORT}`
			: process.env.DOMAIN_NAME;
	return `<div>Hi ${display_name},<br>
				Reset your password through this 
				<a target='_blank' href='http://${domain}/account/reset-password/${token}'>link</a>.
			</div>`;
}

function sendResetPasswordEmail(email_address, display_name, token) {
	const data = {
		from: `SoundBoard <resetpassword@${process.env.DOMAIN_NAME}>`,
		to: email_address,
		subject: "Reset your Password",
		html: getResetPasswordEmailContent(display_name, token),
	};
	return new Promise((resolve, reject) => {
		mailgun.messages().send(data, async (error, body) => {
			if (error) reject(error);
			else resolve(body);
		});
	});
}

module.exports = {
	sendVerificationEmail,
	sendResetPasswordEmail,
};

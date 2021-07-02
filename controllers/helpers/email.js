const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js")({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.DOMAIN_NAME,
});

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

function sendVerificationEmail(email_address, display_name, user_id) {
	const token = jwt.sign(
		{ id: user_id, name: display_name },
		process.env.VERIFICATION_SECRET_KEY,
		{ expiresIn: "15m" }
	);
	const data = {
		from: ` <verification@${process.env.DOMAIN_NAME}>`,
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

module.exports = {
	sendVerificationEmail,
};

const mailgun = require("mailgun-js")({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.DOMAIN_NAME,
});

function sendEmail(user, action, route) {
	const { subject, body } = getEmailContent(user.display_name, action, route);
	const data = {
		from: `${process.env.APP_NAME} <noreply@${process.env.DOMAIN_NAME}>`,
		to: user.email_address,
		subject: subject,
		html: body,
	};
	return new Promise((resolve, reject) => {
		mailgun.messages().send(data, (error, body) => {
			console.log(error);
			console.log(body);
			if (error) reject(error);
			else resolve(body);
		});
	});
}

function getEmailContent(display_name, action, route) {
	let obj = { title: "", body: "" };
	obj.body = `<div>Hi, ${display_name}, <br>`;
	route =
		process.env.NODE_ENV == "development"
			? `http://localhost:${process.env.PORT}` + route
			: `https://${process.env.DOMAIN_NAME}`;
	switch (action) {
		case "VERIFY_EMAIL":
			obj.subject = "Verify your email";
			obj.body += `Verify your account through this <a target='_blank' href='${route}'>link</a>.`;
			break;
		case "RESET_PASSWORD":
			obj.subject = "Reset your password";
			obj.body += `Reset your password through <a target='_blank' href='${route}'>this link</a>`;
			break;
		case "UPDATE_PASSWORD":
			obj.subject = "Password was changed";
			obj.body += `Your password was changed. If you didn't do this, please <a target='_blank' href='${route}'>reset your password</a>.`;
			break;
	}
	obj.body += "</div>";
	return obj;
}

module.exports = sendEmail;

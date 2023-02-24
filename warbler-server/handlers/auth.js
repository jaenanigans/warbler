const db = require('../models');
const jwt = require('jsonwebtoken');

exports.signin = async () => {
	try {
		const user = await db.User.findOne({
			email: req.body.email,
		});
		const { id, username, profileImageUrl } = user;
		const isMatch = await user.comparePassword(req.body.password);
		if (isMatch) {
			let token = jwt.sign(
				{
					id,
					username,
					profileImageUrl,
				},
				process.env.SECRET_KEY
			);
			return res.status(200).json({
				id,
				username,
				profileImageUrl,
				token,
			});
		} else {
			return next({
				status: 400,
				message: 'Invalid Email/Password',
			});
		}
	} catch (e) {
		return next({
			status: 400,
			message: 'Invalid Email/Password',
		});
	}
};

exports.signup = async (req, res, next) => {
	try {
		let user = await db.User.create(req.body);
		const { id, username, profileImageUrl } = user;
		const token = jwt.sign(
			{
				id,
				username,
				profileImageUrl,
			},
			process.env.SECRET_KEY
		);
		return res.status(200).json({
			id,
			username,
			profileImageUrl,
			token,
		});
	} catch (err) {
		if (err.code === 11000) {
			err.message = 'Sorry, that username and/or email is take';
		}
		return next({
			status: 400,
			message: err.message,
		});
	}
};

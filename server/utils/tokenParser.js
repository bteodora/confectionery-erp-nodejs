const jwt = require('jsonwebtoken');

secret_key = 'mysecretkey'
expiration_time = '3h'

exports.verifyToken = (req, res, next) => {
	let token = '';

	try {
		const authHeader = req.header('Authorization');
		token = authHeader.split(' ')[1];
	}
	catch (err) {
		return res.status(401).send({ message: 'No Authorization header' });
	}

	if (!token) {
		return res.status(401).send({ message: 'No token in the Authorization header' });
	}

	try {
		const decoded = jwt.verify(token, secret_key);

		req.auth = {
			username: decoded.username,
			role: decoded.role
		}
	} catch (err) {
		return res.status(403).send({ message: 'Forbidden' });
	}

	next();
}

exports.generateToken = (user) => {
	const { username, role } = user;

	return jwt.sign({ username, role }, secret_key, { expiresIn: expiration_time });
}
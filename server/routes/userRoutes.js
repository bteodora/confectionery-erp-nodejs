const express = require('express');
const router = express.Router();
const userServices = require('../services/userService');
const {verifyToken, generateToken} = require('../utils/tokenService');

router.get('/', verifyToken, (req, res) => {
	const { username, role } = req.auth;

	if (role !== 'admin') {
		return res.status(403).send({ message: 'Unauthorized' });
	}

	const users = userServices.getAllUsers();
	res.status(200).send(users);
});

router.post('/register/customer', (req, res) => {
	const newUser = req.body;
	try {
		newUser.role = 'customer';
		newUser.points = 0;
		userServices.registerUser(newUser);
		res.status(200).send({ message: 'Customer successfully registered'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.post('/register/manager', (req, res) => {
	const newUser = req.body;
	try {
		newUser.role = 'manager';
		newUser.factoryId = null;
		userServices.registerUser(newUser);
		res.status(200).send({ message: 'Customer successfully registered'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});


router.post('/login', (req, res) => {
	const { username, password } = req.body;
	try {
		userServices.login(username, password);
		const role = userServices.getRole(username);
		const token = generateToken({ username, role: role});
		res.status(200).send({ token, role: role });
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.get('/profile', verifyToken, (req, res) => {
	res.status(200).send(req.auth);
});

module.exports = router;

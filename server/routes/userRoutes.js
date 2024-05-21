const express = require('express');
const router = express.Router();
const userServices = require('../services/userService');

router.get('/', (req, res) => {
	const users = userServices.getAllUsers();
	res.status(200).send(users);
});

router.post('/register', (req, res) => {
	const newUser = req.body;
	try {
		userServices.createUser(newUser);
		res.status(200).send({ message: 'User successfully registered'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;
	try {
		userServices.login(username, password);
		res.status(200).send({ message: 'Login successful'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

module.exports = router;

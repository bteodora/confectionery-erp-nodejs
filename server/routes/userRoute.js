const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const {verifyToken, generateToken} = require('../utils/tokenParser');
const User = require('../models/user');

router.get('/', verifyToken, (req, res) => {
	if (req.auth.role !== 'admin')
		return res.status(403).send({ message: 'Forbidden' });

	let role = req.query.role || null;

	const users = userService.getAllUsers(role);
	res.status(200).send(users);
});

router.get('/manager/available', verifyToken, (req, res) => {
	if (req.auth.role !== 'admin')
		return res.status(403).send({ message: 'Forbidden' });

	const managers = userService.getAvailableManagers();
	res.status(200).send(managers);
});

router.post('/register/customer', (req, res) => {
	try {
		const newUser = req.body;
		newUser.role = 'customer';
		newUser.points = 0;

		if(!User.checkUser(newUser))
			return res.status(400).send({ message: 'Invalid fields'});

		userService.registerUser(newUser);
		res.status(200).send({ message: 'Customer successfully registered'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.post('/register/manager', verifyToken, (req, res) => {
	if(req.auth.role !== 'admin') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	try {
		const newUser = req.body;
		newUser.role = 'manager';
		newUser.factoryId = null;

		if(!User.checkUser(newUser))
			return res.status(400).send({ message: 'Invalid fields'});

		userService.registerUser(newUser);
		res.status(200).send({ message: 'Manager successfully registered'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.post('/register/staff', verifyToken, (req, res) => {
	if(req.auth.role !== 'manager') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	try {
		const newUser = req.body;
		newUser.role = 'staff';
		newUser.factoryId = userService.getFactoryId(req.auth.username);
		console.log("registering new staff member to factory "+newUser.factoryId);

		if(!User.checkUser(newUser))
			return res.status(400).send({ message: 'Invalid fields'});

		userService.registerUser(newUser);
		res.status(200).send({ message: 'Staff member successfully registered'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.post('/login', (req, res) => {
	try {
		const { username, password } = req.body;

		if(!User.checkUsername(username) || !User.checkPassword(password))
			return res.status(400).send({ message: 'Invalid fields'});

		userService.login(username, password);
		const role = userService.getRole(username);
		const token = generateToken({ username, role: role});
		res.status(200).send({ token, role: role });
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.get('/verify', verifyToken, (req, res) => {
	res.status(200).send({ message: 'Token is valid', role: req.auth.role});
});

router.get('/profile', verifyToken, (req, res) => {
	const username = req.auth.username;

	try {
		const user = userService.getUser(username);

		res.status(200).send({
			name: user.name,
			surname: user.surname,
			gender: user.gender,
			birth_date: user.birth_date,
		});
	}
	catch(err) {
		res.status(400).send({ message: err.message});
	}
});

router.put('/profile', verifyToken, (req, res) => {
	const username = req.auth.username;
	const user = req.body;

	if(!User.checkName(user.name) || !User.checkSurname(user.surname) || !User.checkGender(user.gender) || !User.checkBirthDate(user.birth_date))
		return res.status(400).send({ message: 'Invalid fields'});

	userService.updateUser(username, user);
	res.status(200).send({ message: 'Profile updated successfully'});
});

router.get('/factoryid', verifyToken, (req, res) => {
    try {
        const factoryId = userService.getFactoryId(req.auth.username);
        // console.log('Factory ID:', factoryId); // Log factoryId for debugging
        return res.status(200).send({ factoryId });
    } catch (err) {
        console.error('Error:', err); // Log any errors for debugging
        res.status(400).send({ message: err.message });
    }
});


module.exports = router;

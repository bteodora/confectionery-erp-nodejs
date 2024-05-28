const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const {verifyToken, generateToken} = require('../utils/tokenParser');

router.get('/', verifyToken, (req, res) => {
	if (req.auth.role !== 'admin') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	let role = req.query.role || null;

	const users = userService.getAllUsers(role);
	return res.status(200).send(users);
});

router.get('/manager/available', verifyToken, (req, res) => {
	if (req.auth.role !== 'admin') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	const managers = userService.getAvailableManagers();
	return res.status(200).send(managers);
});

router.post('/register/customer', (req, res) => {

	const newUser = req.body;
	try {
		newUser.role = 'customer';
		newUser.points = 0;
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
		userService.registerUser(newUser);
		res.status(200).send({ message: 'Manager successfully registered'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;
	try {
		userService.login(username, password);
		const role = userService.getRole(username);
		const token = generateToken({ username, role: role});
		res.status(200).send({ token, role: role });
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.get('/profile', verifyToken, (req, res) => {
    res.status(200).send(req.auth);
});

router.get('/factoryid', verifyToken, (req, res) => {
    if (req.auth.role !== 'manager') {
        return res.status(403).send({ message: 'Forbidden' });
    }

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

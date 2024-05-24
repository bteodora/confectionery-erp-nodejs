const express = require('express');
const router = express.Router();
const factoryServices = require('../services/factoryService');
const {verifyToken} = require('../utils/tokenService');

router.get('/', (req, res) => {
	const factories = factoryServices.getAllFactories();
	return res.status(200).send(factories);
});

router.post('/register', verifyToken, (req, res) => {
	if(req.auth.role !== 'admin') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	const newFactory = req.body;
	try {
		factoryServices.registerFactory(newFactory);
		res.status(200).send({ message: 'Factory successfully registered'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

module.exports = router;
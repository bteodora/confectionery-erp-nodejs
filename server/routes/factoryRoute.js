const express = require('express');
const router = express.Router();
const factoryServices = require('../services/factoryService');
const {verifyToken} = require('../utils/tokenParser');
const upload = require('../utils/imgParser');
const path = require('path');
const Factory = require('../models/factory');

router.get('/', (req, res) => {
	const factories = factoryServices.getAllFactories();
	return res.status(200).send(factories);
});

router.get('/:factoryId', (req, res) => {
	try {
		const factoryId = Number(req.params.factoryId);

		if(isNaN(factoryId))
			return res.status(400).send({ message: 'Invalid factoryId'});

		const factory = factoryServices.getFactory(factoryId);
		res.status(200).send(factory);
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.post('/register', verifyToken, (req, res) => {
	if(req.auth.role !== 'admin') {
		return res.status(403).send({ message: 'Forbidden' });
	}

	try {
		const newFactory = req.body;

		if(!Factory.checkFactory(newFactory))
			return res.status(400).send({ message: 'Invalid fields'});

		let factoryId = factoryServices.registerFactory(newFactory);
		res.status(200).send({ message: 'Factory successfully registered', factoryId: factoryId });
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.post('/img/upload/:factoryId', verifyToken, (req, res, next) => {
	if(req.auth.role !== 'admin') {
		return res.status(403).send({ message: 'Forbidden' });
	}
	next();

	}, upload.single('img'), (req, res) => {

	try {
		const factoryId = Number(req.params.factoryId);
		if(isNaN(factoryId))
			return res.status(400).send({ message: 'Invalid factoryId'});

		const imgPath = req.file.path.replace('\\', '/');

		factoryServices.setFactoryImgPath(factoryId, imgPath);
		res.status(200).send({ message: 'Logo successfully uploaded'});
	} catch (err) {
		res.status(400).send({ message: err.message});
	}
});

router.get('/img/:factoryId', (req, res) => {
	try {
		const factoryId = Number(req.params.factoryId);

		if(isNaN(factoryId))
			return res.status(400).send({ message: 'Invalid factoryId'});


		const imgPath = factoryServices.getFactoryImgPath(factoryId);
		const fullImgPath = path.join(process.cwd().replace('\\', '/'), imgPath);
		return res.status(200).sendFile(fullImgPath);
	}
	catch (err) {
		res.status(400).send({ message: err.message});
	}
});

module.exports = router;
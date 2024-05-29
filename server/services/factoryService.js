const path = require('path');
const multer = require('multer');
const { readJSONFile, writeJSONFile } = require('../utils/jsonParser');
const factoriesFilePath = path.join(__dirname, '../data/json/factory.json');
const userService = require('./userService');

exports.getAllFactories = () => {
	const factories = readJSONFile(factoriesFilePath);
	return factories.filter(f => !f.isDeleted);
}

exports.registerFactory = (newFactory) => {
	const factories = readJSONFile(factoriesFilePath);
	let factoryId = 1;

	if(factories.length > 0) {
		factoryId = factories.sort((a, b) => a.id - b.id)[factories.length - 1].id + 1;
	}

	newFactory = { id: factoryId, ...newFactory, rating: 0.0, isDeleted: false};
	userService.setManagersFactoryId(newFactory.managerId, newFactory.id);

	factories.push(newFactory);
	writeJSONFile(factoriesFilePath, factories);

	return newFactory.id;
}

exports.setFactoryImgPath = (factoryId, imgPath) => {
	const factories = this.getAllFactories();
	const foundFactory = factories.find(f => f.id === factoryId);

	if (!foundFactory) {
		throw new Error('Factory not found');
	}

	foundFactory.imgPath = imgPath;
	writeJSONFile(factoriesFilePath, factories);
}

exports.getFactoryImgPath = (factoryId) => {
	const factories = this.getAllFactories();
	const foundFactory = factories.find(f => f.id === factoryId);

	if (!foundFactory) {
		throw new Error('Factory not found');
	}

	return foundFactory.imgPath;
}